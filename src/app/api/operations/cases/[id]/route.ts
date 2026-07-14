/**
 * PATCH /api/operations/cases/[id] — Update case status
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { getClientIp } from "@/lib/api/validation";
import { CASE_STATUSES } from "@/lib/operations/constants";
import { updateCaseStatus } from "@/lib/operations/case-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const patchSchema = z.object({
  status: z.enum(CASE_STATUSES),
  notes: z.string().trim().max(500).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-cases-patch",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, patchSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const { id } = await context.params;
  const navCase = await updateCaseStatus(
    actor,
    id,
    parsed.data.status,
    parsed.data.notes,
  );

  if (!navCase) {
    return NextResponse.json(
      { success: false, error: "Case not found or access denied" },
      { status: 404 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.case_status_changed",
    resourceType: "navigation_case",
    resourceId: navCase.id,
    metadata: { status: navCase.status },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: navCase });
}
