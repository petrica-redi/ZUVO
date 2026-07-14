/**
 * Intake routing by geography, language, and help type.
 */

import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { intakeRequests, routingRules, teams } from "@/db/schema";
import type { IntakeHelpType } from "./constants";
import type { IntakeRequest, RoutingRule } from "./types";

export type RoutingMatchInput = {
  countryCode: string;
  municipalityCode?: string | null;
  preferredLanguage?: string | null;
  helpType?: IntakeHelpType | string | null;
};

function ruleToRow(row: typeof routingRules.$inferSelect, teamName?: string): RoutingRule {
  return {
    id: row.id,
    countryCode: row.countryCode,
    municipalityCode: row.municipalityCode ?? undefined,
    preferredLanguage: row.preferredLanguage ?? undefined,
    helpType: row.helpType as RoutingRule["helpType"],
    teamId: row.teamId,
    teamName,
    notifyWorkspaceId: row.notifyWorkspaceId ?? undefined,
    priority: row.priority,
    isActive: row.isActive,
  };
}

/** Score how well a rule matches — higher is more specific. */
export function scoreRoutingRule(
  rule: RoutingMatchInput & { priority: number },
  input: RoutingMatchInput,
): number {
  if (rule.countryCode !== input.countryCode) return -1;

  let score = rule.priority;

  if (rule.municipalityCode) {
    if (rule.municipalityCode !== input.municipalityCode) return -1;
    score += 40;
  }

  if (rule.preferredLanguage) {
    if (rule.preferredLanguage !== input.preferredLanguage) return -1;
    score += 30;
  }

  if (rule.helpType) {
    if (rule.helpType !== input.helpType) return -1;
    score += 20;
  }

  return score;
}

export function pickBestRule<T extends RoutingMatchInput & { priority: number }>(
  rules: T[],
  input: RoutingMatchInput,
): T | null {
  let best: T | null = null;
  let bestScore = -1;

  for (const rule of rules) {
    const score = scoreRoutingRule(rule, input);
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }

  return best;
}

export async function listRoutingRules(): Promise<RoutingRule[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      rule: routingRules,
      teamName: teams.name,
    })
    .from(routingRules)
    .leftJoin(teams, eq(routingRules.teamId, teams.id))
    .where(eq(routingRules.isActive, true))
    .orderBy(desc(routingRules.priority));

  return rows.map((r) => ruleToRow(r.rule, r.teamName ?? undefined));
}

export async function findRoutingMatch(
  input: RoutingMatchInput,
): Promise<(RoutingRule & { score: number }) | null> {
  const db = getDb();
  if (!db) return null;

  const rows = await db
    .select({
      rule: routingRules,
      teamName: teams.name,
    })
    .from(routingRules)
    .leftJoin(teams, eq(routingRules.teamId, teams.id))
    .where(and(eq(routingRules.isActive, true), eq(routingRules.countryCode, input.countryCode)));

  const candidates = rows.map((r) => ({
    ...ruleToRow(r.rule, r.teamName ?? undefined),
    priority: r.rule.priority,
  }));

  const best = pickBestRule(candidates, input);
  if (!best) return null;

  return { ...best, score: scoreRoutingRule(best, input) };
}

export async function routeIntake(intakeId: string): Promise<IntakeRequest | null> {
  const db = getDb();
  if (!db) return null;

  const [intake] = await db
    .select()
    .from(intakeRequests)
    .where(eq(intakeRequests.id, intakeId))
    .limit(1);

  if (!intake || intake.status !== "new") return null;

  const match = await findRoutingMatch({
    countryCode: intake.countryCode,
    municipalityCode: intake.municipalityCode,
    preferredLanguage: intake.preferredLanguage,
    helpType: intake.helpType,
  });

  if (!match) return null;

  const now = new Date();
  const [updated] = await db
    .update(intakeRequests)
    .set({
      status: "routed",
      routedTeamId: match.teamId,
      updatedAt: now,
    })
    .where(eq(intakeRequests.id, intakeId))
    .returning();

  if (!updated) return null;

  return {
    id: updated.id,
    referenceCode: updated.referenceCode,
    preferredLanguage: updated.preferredLanguage,
    contactMethod: updated.contactMethod,
    contactValue: updated.contactValue ?? undefined,
    countryCode: updated.countryCode,
    municipalityCode: updated.municipalityCode ?? undefined,
    helpType: updated.helpType as IntakeRequest["helpType"],
    consentGranted: updated.consentGranted,
    status: updated.status as IntakeRequest["status"],
    routedTeamId: updated.routedTeamId ?? undefined,
    routedTeamName: match.teamName,
    notes: updated.notes,
    createdAt: updated.createdAt?.toISOString() ?? now.toISOString(),
  };
}

export async function assignIntakeToTeam(
  intakeId: string,
  teamId: string,
): Promise<IntakeRequest | null> {
  const db = getDb();
  if (!db) return null;

  const now = new Date();
  const [updated] = await db
    .update(intakeRequests)
    .set({
      status: "assigned",
      routedTeamId: teamId,
      updatedAt: now,
    })
    .where(eq(intakeRequests.id, intakeId))
    .returning();

  if (!updated) return null;

  const [team] = await db
    .select({ name: teams.name })
    .from(teams)
    .where(eq(teams.id, teamId))
    .limit(1);

  return {
    id: updated.id,
    referenceCode: updated.referenceCode,
    preferredLanguage: updated.preferredLanguage,
    contactMethod: updated.contactMethod,
    contactValue: updated.contactValue ?? undefined,
    countryCode: updated.countryCode,
    municipalityCode: updated.municipalityCode ?? undefined,
    helpType: updated.helpType as IntakeRequest["helpType"],
    consentGranted: updated.consentGranted,
    status: updated.status as IntakeRequest["status"],
    routedTeamId: updated.routedTeamId ?? undefined,
    routedTeamName: team?.name,
    notes: updated.notes,
    createdAt: updated.createdAt?.toISOString() ?? now.toISOString(),
  };
}
