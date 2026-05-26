/**
 * POIDS / SCI 2000 health indicator calculations from the mediator workspace
 * payload. All functions are pure so they can be unit-tested and reused by
 * the IndicatorsTab UI, the printable report, and any future aggregation.
 */

import {
  HEALTH_FACILITATIONS,
  SESSION_THEMES,
  VULNERABILITY_TAGS,
  type HealthFacilitation,
  type MediatorWorkspacePayload,
  type SessionTheme,
  type VulnerabilityTag,
} from "./types";

export type IndicatorWindow = "month" | "year" | "all";

function inWindow(iso: string, window: IndicatorWindow): boolean {
  if (window === "all") return true;
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return false;
  const now = new Date();
  if (window === "year") return t.getFullYear() === now.getFullYear();
  return t.getFullYear() === now.getFullYear() && t.getMonth() === now.getMonth();
}

export type CaseTotals = {
  total: number;
  open: number;
  closed: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
};

export function summarizeCases(
  payload: MediatorWorkspacePayload,
): CaseTotals {
  const byStatus: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  let open = 0;
  let closed = 0;
  for (const c of payload.cases) {
    byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
    byCategory[c.category] = (byCategory[c.category] ?? 0) + 1;
    if (c.status === "closed") closed += 1;
    else open += 1;
  }
  return { total: payload.cases.length, open, closed, byStatus, byCategory };
}

export function uniquePeopleFollowed(payload: MediatorWorkspacePayload): number {
  const names = new Set<string>();
  for (const v of payload.visits) if (v.memberName) names.add(v.memberName.trim().toLowerCase());
  for (const c of payload.cases) if (c.name) names.add(c.name.trim().toLowerCase());
  return names.size;
}

export function householdCoverage(payload: MediatorWorkspacePayload): number {
  return payload.cases.reduce(
    (sum, c) => sum + (typeof c.householdSize === "number" ? c.householdSize : 0),
    0,
  );
}

export function visitsCount(
  payload: MediatorWorkspacePayload,
  window: IndicatorWindow = "month",
): number {
  return payload.visits.filter((v) => inWindow(v.visitDate, window)).length;
}

export function sessionsCount(
  payload: MediatorWorkspacePayload,
  window: IndicatorWindow = "month",
): number {
  return payload.sessions.filter((s) => inWindow(s.sessionDate, window)).length;
}

export type SessionsByTheme = Record<SessionTheme, number>;

export function sessionsByTheme(
  payload: MediatorWorkspacePayload,
  window: IndicatorWindow = "all",
): SessionsByTheme {
  const empty = SESSION_THEMES.reduce<SessionsByTheme>(
    (acc, t) => ((acc[t] = 0), acc),
    {} as SessionsByTheme,
  );
  for (const s of payload.sessions) {
    if (!inWindow(s.sessionDate, window)) continue;
    const theme = s.theme ?? "other";
    empty[theme] += 1;
  }
  return empty;
}

export function sessionsAttendees(
  payload: MediatorWorkspacePayload,
  window: IndicatorWindow = "year",
): number {
  return payload.sessions
    .filter((s) => inWindow(s.sessionDate, window))
    .reduce((sum, s) => sum + (Number.parseInt(s.attendees, 10) || 0), 0);
}

export type FacilitationCounts = Record<HealthFacilitation, number>;

export function healthFacilitationCounts(
  payload: MediatorWorkspacePayload,
): FacilitationCounts {
  const counts = HEALTH_FACILITATIONS.reduce<FacilitationCounts>(
    (acc, k) => ((acc[k] = 0), acc),
    {} as FacilitationCounts,
  );
  for (const c of payload.cases) {
    for (const flag of c.healthFacilitations ?? []) {
      counts[flag] += 1;
    }
  }
  return counts;
}

export type VulnerabilityCounts = Record<VulnerabilityTag, number>;

export function vulnerabilityCounts(
  payload: MediatorWorkspacePayload,
): VulnerabilityCounts {
  const counts = VULNERABILITY_TAGS.reduce<VulnerabilityCounts>(
    (acc, k) => ((acc[k] = 0), acc),
    {} as VulnerabilityCounts,
  );
  for (const c of payload.cases) {
    for (const tag of c.vulnerabilities ?? []) {
      counts[tag] += 1;
    }
  }
  return counts;
}

export type MediatorIndicators = {
  uniquePeople: number;
  households: number;
  cases: CaseTotals;
  visitsThisMonth: number;
  visitsThisYear: number;
  sessionsThisMonth: number;
  sessionsThisYear: number;
  sessionsByTheme: SessionsByTheme;
  sessionAttendeesThisYear: number;
  facilitations: FacilitationCounts;
  vulnerabilities: VulnerabilityCounts;
};

export function computeIndicators(
  payload: MediatorWorkspacePayload,
): MediatorIndicators {
  return {
    uniquePeople: uniquePeopleFollowed(payload),
    households: householdCoverage(payload),
    cases: summarizeCases(payload),
    visitsThisMonth: visitsCount(payload, "month"),
    visitsThisYear: visitsCount(payload, "year"),
    sessionsThisMonth: sessionsCount(payload, "month"),
    sessionsThisYear: sessionsCount(payload, "year"),
    sessionsByTheme: sessionsByTheme(payload, "year"),
    sessionAttendeesThisYear: sessionsAttendees(payload, "year"),
    facilitations: healthFacilitationCounts(payload),
    vulnerabilities: vulnerabilityCounts(payload),
  };
}
