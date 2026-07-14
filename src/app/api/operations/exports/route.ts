/**
 * GET /api/operations/exports — Generate restricted CSV export (audited)
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { getClientIp } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { EXPORT_SCOPES, EXPORT_TYPES } from "@/lib/operations/constants";
import {
  databaseUnavailableResponse,
  resolveReportingActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";
import { buildExport, isExportAllowed } from "@/lib/operations/export-service";

const exportQuerySchema = z.object({
  type: z.enum(EXPORT_TYPES),
  scope: z.enum(EXPORT_SCOPES).optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveReportingActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    if (!id && !req.headers.get("x-admin-key")) {
      return workspaceMissingResponse();
    }
    return workspaceUnauthorizedResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-exports",
    limit: 20,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = exportQuerySchema.safeParse({
    type: req.nextUrl.searchParams.get("type"),
    scope: req.nextUrl.searchParams.get("scope") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid export parameters" },
      { status: 400 },
    );
  }

  if (!getDb()) return databaseUnavailableResponse();

  const request = {
    exportType: parsed.data.type,
    scope: parsed.data.scope,
    workspaceId: actor.workspaceId,
  };

  if (!isExportAllowed(actor.role, request)) {
    return NextResponse.json(
      { success: false, error: "Export not permitted for this role" },
      { status: 403 },
    );
  }

  const result = await buildExport(actor, actor.role, request);
  if (!result) {
    return NextResponse.json(
      { success: false, error: "Export failed" },
      { status: 500 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.data_exported",
    resourceType: "data_export",
    resourceId: result.exportId,
    metadata: {
      exportType: parsed.data.type,
      scope: parsed.data.scope ?? "workspace",
      rowCount: result.rowCount,
      includesIdentifiable: result.includesIdentifiable,
      role: actor.role,
    },
    ipAddress: getClientIp(req),
  });

  return new NextResponse(result.csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${result.fileName}"`,
      "X-Export-Rows": String(result.rowCount),
      "X-Export-Identifiable": String(result.includesIdentifiable),
      "X-Export-Audit-Id": result.exportId ?? "",
    },
  });
}
