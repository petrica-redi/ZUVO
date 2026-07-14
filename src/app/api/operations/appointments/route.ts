/**
 * GET  /api/operations/appointments — List appointments for workspace
 * POST /api/operations/appointments — Schedule an appointment
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody, getClientIp } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { createAppointment, listAppointments } from "@/lib/operations/appointment-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const createAppointmentSchema = z.object({
  caseId: z.string().uuid(),
  providerId: z.string().uuid(),
  referralId: z.string().uuid().optional(),
  appointmentDate: z.string().trim().min(1).max(20),
  appointmentTime: z.string().trim().max(20).optional(),
  location: z.string().trim().max(300).optional(),
  accompanimentRequired: z.boolean().optional(),
  interpretationRequired: z.boolean().optional(),
  notes: z.string().trim().max(2000).optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-appointments-read",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const caseId = req.nextUrl.searchParams.get("caseId") ?? undefined;
  const appointments = await listAppointments(actor.workspaceId, caseId);
  return NextResponse.json({ success: true, data: appointments });
}

export async function POST(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-appointments-write",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, createAppointmentSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const appointment = await createAppointment(actor, parsed.data);
  if (!appointment) {
    return NextResponse.json(
      { success: false, error: "Failed to create appointment" },
      { status: 404 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.appointment_created",
    resourceType: "appointment",
    resourceId: appointment.id,
    metadata: { caseId: appointment.caseId, providerId: appointment.providerId },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: appointment }, { status: 201 });
}
