/**
 * GET  /api/operations/referrals — List referrals for workspace
 * POST /api/operations/referrals — Create a referral from a case
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody, getClientIp } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { createReferral, listReferrals } from "@/lib/operations/referral-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const createReferralSchema = z.object({
  caseId: z.string().uuid(),
  providerId: z.string().uuid(),
  purpose: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(2000).optional(),
  scheduledFollowUp: z.string().trim().max(20).optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-referrals-read",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const caseId = req.nextUrl.searchParams.get("caseId") ?? undefined;
  const referrals = await listReferrals(actor.workspaceId, caseId);
  return NextResponse.json({ success: true, data: referrals });
}

export async function POST(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-referrals-write",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, createReferralSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const referral = await createReferral(actor, parsed.data);
  if (!referral) {
    return NextResponse.json(
      { success: false, error: "Failed to create referral" },
      { status: 404 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.referral_created",
    resourceType: "referral",
    resourceId: referral.id,
    metadata: { caseId: referral.caseId, providerId: referral.providerId },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: referral }, { status: 201 });
}
