/**
 * GET  /api/operations/escalations — List escalation queue
 * POST /api/operations/escalations — Create escalation
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { getClientIp } from "@/lib/api/validation";
import { CASE_URGENCIES, ESCALATION_STATUSES } from "@/lib/operations/constants";
import { createEscalation, listEscalations } from "@/lib/operations/escalation-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const createSchema = z
  .object({
    caseId: z.string().uuid().optional(),
    intakeId: z.string().uuid().optional(),
    reason: z.string().trim().min(1).max(1000),
    priority: z.enum(CASE_URGENCIES).optional(),
    assignedSupervisor: z.string().trim().max(80).optional(),
  })
  .refine((d) => d.caseId || d.intakeId, {
    message: "caseId or intakeId required",
  });

export async function GET(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-escalations-read",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const statusParam = req.nextUrl.searchParams.get("status");
  const status = statusParam
    ? (ESCALATION_STATUSES.includes(statusParam as (typeof ESCALATION_STATUSES)[number])
        ? (statusParam as (typeof ESCALATION_STATUSES)[number])
        : undefined)
    : undefined;

  const escalations = await listEscalations(actor, status);
  return NextResponse.json({ success: true, data: escalations });
}

export async function POST(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-escalations-write",
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, createSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const escalation = await createEscalation(actor, parsed.data);
  if (!escalation) {
    return NextResponse.json(
      { success: false, error: "Failed to create escalation" },
      { status: 500 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.escalation_created",
    resourceType: "escalation_record",
    resourceId: escalation.id,
    metadata: {
      caseId: escalation.caseId,
      intakeId: escalation.intakeId,
      priority: escalation.priority,
    },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: escalation }, { status: 201 });
}
