/**
 * POST /api/operations/missed-appointment — Trigger missed-appointment recovery
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { getClientIp } from "@/lib/api/validation";
import { handleMissedAppointment } from "@/lib/operations/missed-appointment-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const schema = z
  .object({
    caseId: z.string().uuid().optional(),
    intakeId: z.string().uuid().optional(),
    beneficiaryPseudonym: z.string().trim().max(160).optional(),
    notes: z.string().trim().max(1000).optional(),
  })
  .refine((d) => d.caseId || d.intakeId, {
    message: "caseId or intakeId required",
  });

export async function POST(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-missed-appt",
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, schema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const result = await handleMissedAppointment(actor, parsed.data);
  if (!result) {
    return NextResponse.json(
      { success: false, error: "Recovery failed — case or intake not found" },
      { status: 404 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.missed_appointment_recovery",
    resourceType: "operation_task",
    resourceId: result.tasks[0]?.id,
    metadata: {
      caseId: parsed.data.caseId,
      intakeId: parsed.data.intakeId,
      taskCount: result.tasks.length,
      escalated: result.escalated,
    },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: result }, { status: 201 });
}
