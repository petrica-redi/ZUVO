/**
 * GET  /api/operations/quality — List data-quality flags for workspace
 * POST /api/operations/quality — Raise flag or run supervisor scan
 * PATCH /api/operations/quality — Update flag status (supervisor)
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody, getClientIp } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import {
  QUALITY_FLAG_STATUSES,
  QUALITY_FLAG_TYPES,
  QUALITY_SEVERITIES,
} from "@/lib/operations/constants";
import {
  databaseUnavailableResponse,
  resolveReportingActor,
  reportingUnauthorizedResponse,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";
import {
  canManageQualityFlags,
  canViewQualityFlags,
} from "@/lib/operations/permissions";
import {
  listQualityFlags,
  raiseQualityFlag,
  scanWorkspaceQuality,
  updateQualityFlagStatus,
} from "@/lib/operations/quality-service";

const raiseFlagSchema = z.object({
  action: z.literal("raise").optional(),
  caseId: z.string().uuid().optional(),
  flagType: z.enum(QUALITY_FLAG_TYPES),
  severity: z.enum(QUALITY_SEVERITIES).optional(),
  message: z.string().trim().max(1000).optional(),
});

const scanSchema = z.object({
  action: z.literal("scan"),
});

const patchSchema = z.object({
  flagId: z.string().uuid(),
  status: z.enum(QUALITY_FLAG_STATUSES),
});

export async function GET(req: NextRequest) {
  const actor = await resolveReportingActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  if (!canViewQualityFlags(actor.role)) return reportingUnauthorizedResponse();

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-quality-read",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const status = req.nextUrl.searchParams.get("status")?.trim();
  const flags = await listQualityFlags(
    actor,
    actor.role,
    actor.workspaceId,
    status as (typeof QUALITY_FLAG_STATUSES)[number] | undefined,
  );

  return NextResponse.json({
    success: true,
    data: flags,
    capabilities: {
      canResolve: canManageQualityFlags(actor.role),
      canScan: canManageQualityFlags(actor.role),
    },
  });
}

export async function POST(req: NextRequest) {
  const actor = await resolveReportingActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-quality-write",
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const rawBody = await req.json().catch(() => null);
  const scanParsed = scanSchema.safeParse(rawBody);
  if (scanParsed.success) {
    if (!canManageQualityFlags(actor.role)) return reportingUnauthorizedResponse();
    const flags = await scanWorkspaceQuality(actor, actor.role, actor.workspaceId);
    return NextResponse.json({ success: true, data: flags, scanned: true });
  }

  const parsed = raiseFlagSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const flag = await raiseQualityFlag(actor, actor.role, actor.workspaceId, parsed.data);
  if (!flag) {
    return NextResponse.json(
      { success: false, error: "Failed to raise quality flag" },
      { status: 500 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.case_status_changed",
    resourceType: "quality_flag",
    resourceId: flag.id,
    metadata: { flagType: flag.flagType, severity: flag.severity },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: flag }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const actor = await resolveReportingActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  if (!canManageQualityFlags(actor.role)) return reportingUnauthorizedResponse();

  const parsed = await parseJsonBody(req, patchSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const flag = await updateQualityFlagStatus(
    actor,
    actor.role,
    parsed.data.flagId,
    parsed.data.status,
  );

  if (!flag) {
    return NextResponse.json(
      { success: false, error: "Failed to update quality flag" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: flag });
}
