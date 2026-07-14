/**
 * PATCH /api/operations/escalations/[id] — Update escalation status
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { getClientIp } from "@/lib/api/validation";
import { ESCALATION_STATUSES } from "@/lib/operations/constants";
import {
  acknowledgeEscalation,
  updateEscalationStatus,
} from "@/lib/operations/escalation-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const patchSchema = z.object({
  status: z.enum(ESCALATION_STATUSES),
  resolutionNotes: z.string().trim().max(2000).optional(),
  assignedSupervisor: z.string().trim().max(80).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-escalations-patch",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, patchSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const { id } = await context.params;
  let escalation;

  if (parsed.data.status === "acknowledged") {
    escalation = await acknowledgeEscalation(
      actor,
      id,
      parsed.data.assignedSupervisor,
    );
  } else {
    escalation = await updateEscalationStatus(
      actor,
      id,
      parsed.data.status,
      parsed.data.resolutionNotes,
    );
  }

  if (!escalation) {
    return NextResponse.json(
      { success: false, error: "Escalation not found" },
      { status: 404 },
    );
  }

  if (parsed.data.status === "resolved" || parsed.data.status === "dismissed") {
    void auditLog({
      userId: actor.workspaceId,
      action: "operations.escalation_resolved",
      resourceType: "escalation_record",
      resourceId: escalation.id,
      metadata: { status: parsed.data.status },
      ipAddress: getClientIp(req),
    });
  }

  return NextResponse.json({ success: true, data: escalation });
}
