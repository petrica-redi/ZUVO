/**
 * PATCH /api/operations/referrals/[id] — Update referral status
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody, getClientIp } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { REFERRAL_STATUSES } from "@/lib/operations/constants";
import { updateReferralStatus } from "@/lib/operations/referral-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const patchSchema = z.object({
  status: z.enum(REFERRAL_STATUSES),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-referrals-patch",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, patchSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const { id } = await context.params;
  const referral = await updateReferralStatus(actor, id, parsed.data.status);

  if (!referral) {
    return NextResponse.json(
      { success: false, error: "Referral not found or access denied" },
      { status: 404 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.referral_status_changed",
    resourceType: "referral",
    resourceId: referral.id,
    metadata: { status: referral.status },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: referral });
}
