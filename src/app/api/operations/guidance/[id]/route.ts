/**
 * GET   /api/operations/guidance/[id] — Get guidance template
 * PATCH /api/operations/guidance/[id] — Update guidance template (admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody, getClientIp } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { isAdminApiAuthorized } from "@/lib/admin/api-auth";
import { getGuidance, updateGuidance } from "@/lib/operations/guidance-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const patchSchema = z.object({
  contentTemplate: z.string().trim().max(10000).optional(),
  titleKey: z.string().trim().min(1).max(120).optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
  isActive: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  if (!getDb()) return databaseUnavailableResponse();

  const { id } = await context.params;
  const guidance = await getGuidance(id);
  if (!guidance) {
    return NextResponse.json(
      { success: false, error: "Guidance not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: guidance });
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  if (!isAdminApiAuthorized(req)) {
    return NextResponse.json(
      { success: false, error: "Admin access required" },
      { status: 403 },
    );
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-guidance-patch",
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, patchSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const { id } = await context.params;
  const guidance = await updateGuidance(id, parsed.data, "admin");
  if (!guidance) {
    return NextResponse.json(
      { success: false, error: "Guidance not found" },
      { status: 404 },
    );
  }

  void auditLog({
    userId: "admin",
    action: "operations.guidance_updated",
    resourceType: "country_access_guidance",
    resourceId: guidance.id,
    metadata: { topicSlug: guidance.topicSlug },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: guidance });
}
