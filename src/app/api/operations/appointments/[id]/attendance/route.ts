/**
 * POST /api/operations/appointments/[id]/attendance — Record attendance outcome
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody, getClientIp } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { ATTENDANCE_OUTCOMES } from "@/lib/operations/constants";
import { recordAttendance } from "@/lib/operations/appointment-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const attendanceSchema = z.object({
  outcome: z.enum(ATTENDANCE_OUTCOMES),
  followUpRequired: z.boolean().optional(),
  followUpAction: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(2000).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, context: RouteContext) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-attendance-write",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, attendanceSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const { id } = await context.params;
  const result = await recordAttendance(actor, id, parsed.data);

  if (!result) {
    return NextResponse.json(
      { success: false, error: "Appointment not found or access denied" },
      { status: 404 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.attendance_recorded",
    resourceType: "attendance_outcome",
    resourceId: result.attendance.id,
    metadata: {
      appointmentId: id,
      outcome: result.attendance.outcome,
      followUpRequired: result.attendance.followUpRequired,
    },
    ipAddress: getClientIp(req),
  });

  if (parsed.data.outcome === "missed" || parsed.data.outcome === "no_show") {
    void auditLog({
      userId: actor.workspaceId,
      action: "operations.missed_appointment_recovery",
      resourceType: "appointment",
      resourceId: id,
      metadata: { outcome: parsed.data.outcome },
      ipAddress: getClientIp(req),
    });
  }

  return NextResponse.json({ success: true, data: result }, { status: 201 });
}
