import { eq, and, sql, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { caseOutcomes, navigationCases } from "@/db/schema";
import {
  PROGRAMME_INDICATORS,
  type OutcomeType,
  type OutcomeStatus,
} from "./constants";
import {
  applyIndicatorThreshold,
  assertWorkspaceAccess,
  canReadAggregates,
  ministryCannotSeePseudonym,
  type OperationActor,
} from "./permissions";
import type {
  CaseOutcome,
  OutcomeAggregateRow,
  ProgrammeIndicatorValue,
  RecordOutcomeInput,
} from "./types";

function rowToOutcome(row: typeof caseOutcomes.$inferSelect): CaseOutcome {
  return {
    id: row.id,
    caseId: row.caseId,
    workspaceId: row.workspaceId,
    outcomeType: row.outcomeType as CaseOutcome["outcomeType"],
    status: row.status as CaseOutcome["status"],
    achievedAt: row.achievedAt?.toISOString(),
    notes: row.notes,
    evidenceRef: row.evidenceRef ?? undefined,
    recordedBy: row.recordedBy ?? undefined,
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function listOutcomesForWorkspace(
  workspaceId: string,
): Promise<CaseOutcome[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(caseOutcomes)
    .where(eq(caseOutcomes.workspaceId, workspaceId))
    .orderBy(desc(caseOutcomes.updatedAt));

  return rows.map(rowToOutcome);
}

export async function listOutcomesForCase(
  actor: OperationActor,
  caseId: string,
): Promise<CaseOutcome[]> {
  const db = getDb();
  if (!db) return [];

  const [navCase] = await db
    .select()
    .from(navigationCases)
    .where(eq(navigationCases.id, caseId))
    .limit(1);

  if (!navCase || !assertWorkspaceAccess(actor, navCase.workspaceId)) return [];

  const rows = await db
    .select()
    .from(caseOutcomes)
    .where(eq(caseOutcomes.caseId, caseId))
    .orderBy(desc(caseOutcomes.updatedAt));

  return rows.map(rowToOutcome);
}

export async function recordOutcome(
  actor: OperationActor,
  input: RecordOutcomeInput,
): Promise<CaseOutcome | null> {
  const db = getDb();
  if (!db) return null;

  const [navCase] = await db
    .select()
    .from(navigationCases)
    .where(eq(navigationCases.id, input.caseId))
    .limit(1);

  if (!navCase || !assertWorkspaceAccess(actor, navCase.workspaceId)) return null;

  const now = new Date();
  const achievedAt =
    input.status === "achieved"
      ? input.achievedAt
        ? new Date(input.achievedAt)
        : now
      : null;

  const [existing] = await db
    .select()
    .from(caseOutcomes)
    .where(
      and(
        eq(caseOutcomes.caseId, input.caseId),
        eq(caseOutcomes.outcomeType, input.outcomeType),
      ),
    )
    .limit(1);

  if (existing) {
    const [row] = await db
      .update(caseOutcomes)
      .set({
        status: input.status,
        achievedAt,
        notes: input.notes ?? existing.notes,
        evidenceRef: input.evidenceRef ?? existing.evidenceRef,
        recordedBy: actor.workspaceId,
        updatedAt: now,
      })
      .where(eq(caseOutcomes.id, existing.id))
      .returning();

    return row ? rowToOutcome(row) : null;
  }

  const [row] = await db
    .insert(caseOutcomes)
    .values({
      caseId: input.caseId,
      workspaceId: navCase.workspaceId,
      outcomeType: input.outcomeType,
      status: input.status,
      achievedAt,
      notes: input.notes ?? "",
      evidenceRef: input.evidenceRef,
      recordedBy: actor.workspaceId,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return row ? rowToOutcome(row) : null;
}

export async function aggregateOutcomesByType(): Promise<OutcomeAggregateRow[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      outcomeType: caseOutcomes.outcomeType,
      achieved: sql<number>`count(*) filter (where ${caseOutcomes.status} = 'achieved')`,
      pending: sql<number>`count(*) filter (where ${caseOutcomes.status} = 'pending')`,
      notAchieved: sql<number>`count(*) filter (where ${caseOutcomes.status} = 'not_achieved')`,
    })
    .from(caseOutcomes)
    .groupBy(caseOutcomes.outcomeType);

  return rows.map((r) => ({
    outcomeType: r.outcomeType,
    achieved: Number(r.achieved),
    pending: Number(r.pending),
    notAchieved: Number(r.notAchieved),
  }));
}

export async function countCompletedCases(): Promise<number> {
  const db = getDb();
  if (!db) return 0;

  const [row] = await db
    .select({ n: sql<number>`count(*)` })
    .from(navigationCases)
    .where(eq(navigationCases.status, "completed"));

  return Number(row?.n ?? 0);
}

export async function getProgrammeIndicators(
  role: string,
): Promise<ProgrammeIndicatorValue[]> {
  if (!canReadAggregates(role)) return [];

  const aggregates = await aggregateOutcomesByType();
  const byType = new Map(aggregates.map((a) => [a.outcomeType, a]));
  const completedCases = await countCompletedCases();

  return PROGRAMME_INDICATORS.map((def) => {
    let count = 0;
    if (def.slug === "cases_completed") {
      count = completedCases;
    } else if (def.outcomeType) {
      count = byType.get(def.outcomeType)?.achieved ?? 0;
    }

    const thresholded = applyIndicatorThreshold(count, def.minThreshold);
    return {
      slug: def.slug,
      labelKey: def.labelKey,
      count: thresholded,
      suppressed: thresholded === null && count > 0,
    };
  });
}

/** Strip beneficiary pseudonyms from outcome rows for ministry/manager roles. */
export function redactOutcomeExportRow<T extends Record<string, unknown>>(
  role: string,
  row: T,
): T {
  if (!ministryCannotSeePseudonym(role)) return row;
  const copy = { ...row };
  delete copy.beneficiaryPseudonym;
  delete copy.beneficiary_pseudonym;
  delete copy.pseudonym;
  return copy;
}

export type OutcomeExportRow = {
  caseNumber: string;
  outcomeType: OutcomeType;
  status: OutcomeStatus;
  achievedAt?: string;
  countryCode: string;
  municipalityCode?: string;
  beneficiaryPseudonym?: string;
};

export async function listOutcomesForExport(
  role: string,
  workspaceId?: string,
): Promise<OutcomeExportRow[]> {
  const db = getDb();
  if (!db) return [];

  const base = db
    .select({
      caseNumber: navigationCases.caseNumber,
      outcomeType: caseOutcomes.outcomeType,
      status: caseOutcomes.status,
      achievedAt: caseOutcomes.achievedAt,
      countryCode: navigationCases.countryCode,
      municipalityCode: navigationCases.municipalityCode,
      beneficiaryPseudonym: navigationCases.beneficiaryPseudonym,
    })
    .from(caseOutcomes)
    .innerJoin(navigationCases, eq(caseOutcomes.caseId, navigationCases.id));

  const rows = workspaceId
    ? await base
        .where(eq(caseOutcomes.workspaceId, workspaceId))
        .orderBy(desc(caseOutcomes.updatedAt))
    : await base.orderBy(desc(caseOutcomes.updatedAt));

  return rows.map((r) =>
    redactOutcomeExportRow(role, {
      caseNumber: r.caseNumber,
      outcomeType: r.outcomeType as OutcomeType,
      status: r.status as OutcomeStatus,
      achievedAt: r.achievedAt?.toISOString(),
      countryCode: r.countryCode,
      municipalityCode: r.municipalityCode ?? undefined,
      beneficiaryPseudonym: ministryCannotSeePseudonym(role)
        ? undefined
        : r.beneficiaryPseudonym,
    }),
  );
}
