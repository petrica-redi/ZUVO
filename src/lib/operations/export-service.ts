import { eq, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { dataExports, navigationCases } from "@/db/schema";
import type { ExportScope, ExportType } from "./constants";
import {
  canExportIdentifiable,
  canExportScope,
  canReadAggregates,
  ministryCannotSeePseudonym,
  type OperationActor,
} from "./permissions";
import {
  aggregateOutcomesByType,
  listOutcomesForExport,
  redactOutcomeExportRow,
} from "./outcome-service";
import { listQualityFlags } from "./quality-service";

export type ExportRequest = {
  exportType: ExportType;
  scope?: ExportScope;
  workspaceId?: string;
};

export type ExportResult = {
  csv: string;
  fileName: string;
  rowCount: number;
  includesIdentifiable: boolean;
  exportId?: string;
};

function escapeCsv(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(headers: string[], rows: Record<string, unknown>[]): string {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsv(row[h])).join(","));
  }
  return lines.join("\n");
}

export function isExportAllowed(role: string, request: ExportRequest): boolean {
  const scope = request.scope ?? "workspace";

  if (request.exportType === "outcomes_aggregate") {
    return canReadAggregates(role);
  }

  if (request.exportType === "quality_report") {
    return ["admin", "supervisor", "mediator"].includes(role);
  }

  return canExportScope(role, scope);
}

export function exportIncludesIdentifiable(
  role: string,
  exportType: ExportType,
): boolean {
  if (exportType === "outcomes_aggregate") return false;
  return canExportIdentifiable(role) && !ministryCannotSeePseudonym(role);
}

async function buildCasesExport(
  role: string,
  workspaceId: string,
): Promise<{ rows: Record<string, unknown>[]; headers: string[] }> {
  const db = getDb();
  if (!db) return { rows: [], headers: [] };

  const rows = await db
    .select()
    .from(navigationCases)
    .where(eq(navigationCases.workspaceId, workspaceId))
    .orderBy(desc(navigationCases.updatedAt));

  const includePseudonym = !ministryCannotSeePseudonym(role) && canExportIdentifiable(role);
  const headers = [
    "caseNumber",
    "status",
    "categorySlug",
    "urgency",
    "countryCode",
    "municipalityCode",
    "openedAt",
    "closedAt",
    ...(includePseudonym ? ["beneficiaryPseudonym"] : []),
  ];

  const mapped = rows.map((r) =>
    redactOutcomeExportRow(role, {
      caseNumber: r.caseNumber,
      status: r.status,
      categorySlug: r.categorySlug,
      urgency: r.urgency,
      countryCode: r.countryCode,
      municipalityCode: r.municipalityCode ?? "",
      openedAt: r.openedAt?.toISOString() ?? "",
      closedAt: r.closedAt?.toISOString() ?? "",
      ...(includePseudonym ? { beneficiaryPseudonym: r.beneficiaryPseudonym } : {}),
    }),
  );

  return { rows: mapped, headers };
}

async function buildQualityExport(
  actor: OperationActor,
  role: string,
  workspaceId: string,
): Promise<{ rows: Record<string, unknown>[]; headers: string[] }> {
  const flags = await listQualityFlags(actor, role, workspaceId);
  const headers = [
    "flagType",
    "severity",
    "status",
    "message",
    "caseId",
    "createdAt",
    "resolvedAt",
  ];
  const rows = flags.map((f) => ({
    flagType: f.flagType,
    severity: f.severity,
    status: f.status,
    message: f.message,
    caseId: f.caseId ?? "",
    createdAt: f.createdAt,
    resolvedAt: f.resolvedAt ?? "",
  }));
  return { rows, headers };
}

async function buildAggregateExport(): Promise<{
  rows: Record<string, unknown>[];
  headers: string[];
}> {
  const aggregates = await aggregateOutcomesByType();
  const headers = ["outcomeType", "achieved", "pending", "notAchieved"];
  const rows = aggregates.map((a) => ({
    outcomeType: a.outcomeType,
    achieved: a.achieved,
    pending: a.pending,
    notAchieved: a.notAchieved,
  }));
  return { rows, headers };
}

export async function buildExport(
  actor: OperationActor,
  role: string,
  request: ExportRequest,
): Promise<ExportResult | null> {
  if (!isExportAllowed(role, request)) return null;

  const scope = request.scope ?? "workspace";
  const workspaceId = request.workspaceId ?? actor.workspaceId;
  const includesIdentifiable = exportIncludesIdentifiable(role, request.exportType);

  let headers: string[] = [];
  let rows: Record<string, unknown>[] = [];
  let fileName = `redi-export-${request.exportType}-${Date.now()}.csv`;

  switch (request.exportType) {
    case "outcomes_aggregate": {
      const built = await buildAggregateExport();
      headers = built.headers;
      rows = built.rows;
      fileName = `redi-outcomes-aggregate-${Date.now()}.csv`;
      break;
    }
    case "outcomes_workspace": {
      const outcomes = await listOutcomesForExport(role, workspaceId);
      headers = [
        "caseNumber",
        "outcomeType",
        "status",
        "achievedAt",
        "countryCode",
        "municipalityCode",
        ...(includesIdentifiable ? ["beneficiaryPseudonym"] : []),
      ];
      rows = outcomes.map((o) => ({
        caseNumber: o.caseNumber,
        outcomeType: o.outcomeType,
        status: o.status,
        achievedAt: o.achievedAt ?? "",
        countryCode: o.countryCode,
        municipalityCode: o.municipalityCode ?? "",
        ...(includesIdentifiable && o.beneficiaryPseudonym
          ? { beneficiaryPseudonym: o.beneficiaryPseudonym }
          : {}),
      }));
      fileName = `redi-outcomes-${workspaceId.slice(0, 8)}-${Date.now()}.csv`;
      break;
    }
    case "cases_workspace": {
      const built = await buildCasesExport(role, workspaceId);
      headers = built.headers;
      rows = built.rows;
      fileName = `redi-cases-${workspaceId.slice(0, 8)}-${Date.now()}.csv`;
      break;
    }
    case "quality_report": {
      const built = await buildQualityExport(actor, role, workspaceId);
      headers = built.headers;
      rows = built.rows;
      fileName = `redi-quality-${workspaceId.slice(0, 8)}-${Date.now()}.csv`;
      break;
    }
    default:
      return null;
  }

  const csv = toCsv(headers, rows);

  const exportId = await logExport({
    requestedBy: actor.workspaceId,
    role,
    exportType: request.exportType,
    scope,
    rowCount: rows.length,
    includesIdentifiable,
    fileName,
    metadata: { workspaceId },
  });

  return {
    csv,
    fileName,
    rowCount: rows.length,
    includesIdentifiable,
    exportId,
  };
}

export async function logExport(params: {
  requestedBy: string;
  role: string;
  exportType: ExportType;
  scope: ExportScope;
  rowCount: number;
  includesIdentifiable: boolean;
  fileName: string;
  metadata?: Record<string, unknown>;
}): Promise<string | undefined> {
  const db = getDb();
  if (!db) return undefined;

  const [row] = await db
    .insert(dataExports)
    .values({
      requestedBy: params.requestedBy,
      role: params.role,
      exportType: params.exportType,
      scope: params.scope,
      rowCount: params.rowCount,
      includesIdentifiable: params.includesIdentifiable,
      fileName: params.fileName,
      metadata: params.metadata ?? {},
    })
    .returning({ id: dataExports.id });

  return row?.id;
}

export async function listExportAudit(
  role: string,
  limit = 50,
): Promise<
  {
    id: string;
    requestedBy: string;
    role: string;
    exportType: string;
    scope: string;
    rowCount: number;
    includesIdentifiable: boolean;
    fileName: string | null;
    createdAt: string;
  }[]
> {
  if (!["admin", "supervisor"].includes(role)) return [];

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(dataExports)
    .orderBy(desc(dataExports.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    requestedBy: r.requestedBy,
    role: r.role,
    exportType: r.exportType,
    scope: r.scope,
    rowCount: r.rowCount,
    includesIdentifiable: r.includesIdentifiable,
    fileName: r.fileName,
    createdAt: r.createdAt?.toISOString() ?? new Date().toISOString(),
  }));
}
