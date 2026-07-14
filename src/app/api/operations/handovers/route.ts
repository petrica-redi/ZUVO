/**
 * GET  /api/operations/handovers — List cross-border handovers for workspace
 * POST /api/operations/handovers — Create handover request
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody, getClientIp } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { createHandover, listHandovers } from "@/lib/operations/handover-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const createSchema = z.object({
  caseId: z.string().uuid(),
  destinationCountryCode: z.string().trim().min(2).max(4),
  destinationWorkspaceId: z.string().trim().min(8).max(80).optional(),
  destinationTeamId: z.string().uuid().optional(),
  reason: z.string().trim().max(2000).optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-handovers-read",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const handovers = await listHandovers(actor);
  return NextResponse.json({ success: true, data: handovers });
}

export async function POST(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-handovers-write",
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, createSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const handover = await createHandover(actor, parsed.data);
  if (!handover) {
    return NextResponse.json(
      { success: false, error: "Failed to create handover or case not found" },
      { status: 404 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.handover_created",
    resourceType: "cross_border_handover",
    resourceId: handover.id,
    metadata: {
      caseId: handover.caseId,
      destinationCountry: handover.destinationCountryCode,
    },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: handover }, { status: 201 });
}
