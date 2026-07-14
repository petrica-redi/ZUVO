import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { qualityFlags, navigationCases, caseOutcomes } from "@/db/schema";
import {
  assertWorkspaceAccess,
  canManageQualityFlags,
  canViewQualityFlags,
  type OperationActor,
} from "./permissions";
import type { QualityFlag, RaiseQualityFlagInput } from "./types";
import type { QualityFlagStatus } from "./constants";

function rowToFlag(row: typeof qualityFlags.$inferSelect): QualityFlag {
  return {
    id: row.id,
    caseId: row.caseId ?? undefined,
    workspaceId: row.workspaceId,
    flagType: row.flagType as QualityFlag["flagType"],
    severity: row.severity as QualityFlag["severity"],
    status: row.status as QualityFlag["status"],
    message: row.message,
    raisedBy: row.raisedBy ?? undefined,
    resolvedBy: row.resolvedBy ?? undefined,
    resolvedAt: row.resolvedAt?.toISOString(),
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function listQualityFlags(
  actor: OperationActor,
  role: string,
  workspaceId: string,
  status?: QualityFlagStatus,
): Promise<QualityFlag[]> {
  if (!canViewQualityFlags(role)) return [];

  const db = getDb();
  if (!db) return [];

  if (!assertWorkspaceAccess(actor, workspaceId) && !canManageQualityFlags(role)) {
    return [];
  }

  const conditions = [eq(qualityFlags.workspaceId, workspaceId)];
  if (status) conditions.push(eq(qualityFlags.status, status));

  const rows = await db
    .select()
    .from(qualityFlags)
    .where(and(...conditions))
    .orderBy(desc(qualityFlags.createdAt));

  return rows.map(rowToFlag);
}

export async function raiseQualityFlag(
  actor: OperationActor,
  role: string,
  workspaceId: string,
  input: RaiseQualityFlagInput,
): Promise<QualityFlag | null> {
  if (!canManageQualityFlags(role) && !assertWorkspaceAccess(actor, workspaceId)) {
    return null;
  }

  const db = getDb();
  if (!db) return null;

  if (input.caseId) {
    const [navCase] = await db
      .select()
      .from(navigationCases)
      .where(eq(navigationCases.id, input.caseId))
      .limit(1);
    if (!navCase || !assertWorkspaceAccess(actor, navCase.workspaceId)) return null;
  }

  const now = new Date();
  const [row] = await db
    .insert(qualityFlags)
    .values({
      caseId: input.caseId,
      workspaceId,
      flagType: input.flagType,
      severity: input.severity ?? "warning",
      message: input.message ?? "",
      raisedBy: actor.workspaceId,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return row ? rowToFlag(row) : null;
}

export async function updateQualityFlagStatus(
  actor: OperationActor,
  role: string,
  flagId: string,
  status: QualityFlagStatus,
): Promise<QualityFlag | null> {
  if (!canManageQualityFlags(role)) return null;

  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(qualityFlags)
    .where(eq(qualityFlags.id, flagId))
    .limit(1);

  if (!existing) return null;
  if (!actor.isAdmin && !assertWorkspaceAccess(actor, existing.workspaceId)) {
    return null;
  }

  const now = new Date();
  const [row] = await db
    .update(qualityFlags)
    .set({
      status,
      resolvedBy: ["resolved", "dismissed"].includes(status)
        ? actor.workspaceId
        : existing.resolvedBy,
      resolvedAt: ["resolved", "dismissed"].includes(status) ? now : null,
      updatedAt: now,
    })
    .where(eq(qualityFlags.id, flagId))
    .returning();

  return row ? rowToFlag(row) : null;
}

/** Scan workspace cases and raise automated quality flags. */
export async function scanWorkspaceQuality(
  actor: OperationActor,
  role: string,
  workspaceId: string,
): Promise<QualityFlag[]> {
  if (!canManageQualityFlags(role)) return [];

  const db = getDb();
  if (!db) return [];

  const cases = await db
    .select()
    .from(navigationCases)
    .where(eq(navigationCases.workspaceId, workspaceId));

  const raised: QualityFlag[] = [];
  const staleCutoff = new Date();
  staleCutoff.setDate(staleCutoff.getDate() - 30);

  for (const navCase of cases) {
    if (
      !["completed", "closed_incomplete", "cancelled"].includes(navCase.status) &&
      navCase.updatedAt &&
      navCase.updatedAt < staleCutoff
    ) {
      const flag = await raiseQualityFlag(actor, role, workspaceId, {
        caseId: navCase.id,
        flagType: "stale_case",
        severity: "warning",
        message: `Case ${navCase.caseNumber} unchanged for 30+ days`,
      });
      if (flag) raised.push(flag);
    }

    if (navCase.consentStatus === "pending" && navCase.status !== "new") {
      const flag = await raiseQualityFlag(actor, role, workspaceId, {
        caseId: navCase.id,
        flagType: "missing_consent",
        severity: "critical",
        message: `Case ${navCase.caseNumber} progressed without recorded consent`,
      });
      if (flag) raised.push(flag);
    }

    if (
      navCase.status === "completed" &&
      !(navCase.barriers as unknown[])?.length
    ) {
      const [outcomeCount] = await db
        .select({ n: sql<number>`count(*)` })
        .from(caseOutcomes)
        .where(eq(caseOutcomes.caseId, navCase.id));

      if (Number(outcomeCount?.n ?? 0) === 0) {
        const flag = await raiseQualityFlag(actor, role, workspaceId, {
          caseId: navCase.id,
          flagType: "missing_outcome",
          severity: "warning",
          message: `Completed case ${navCase.caseNumber} has no recorded outcome`,
        });
        if (flag) raised.push(flag);
      }
    }
  }

  return raised;
}

export async function countOpenQualityFlags(workspaceId: string): Promise<number> {
  const db = getDb();
  if (!db) return 0;

  const [row] = await db
    .select({ n: sql<number>`count(*)` })
    .from(qualityFlags)
    .where(
      and(
        eq(qualityFlags.workspaceId, workspaceId),
        eq(qualityFlags.status, "open"),
      ),
    );

  return Number(row?.n ?? 0);
}
