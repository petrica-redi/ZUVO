/**
 * County-level aggregation of mediator workspace payloads for ministry dashboards.
 */

import { computeIndicators, type MediatorIndicators } from "./indicators";
import { parseWorkspacePayload } from "./merge-workspace";
import type { HealthFacilitation, VulnerabilityTag } from "./types";

export type WorkspaceRow = {
  workspaceId: string;
  countyCode: string | null;
  payload: unknown;
  updatedAt: Date | null;
};

export type CountyAggregate = {
  countyCode: string;
  workspaceCount: number;
  uniquePeopleEstimate: number;
  households: number;
  visitsThisMonth: number;
  visitsThisYear: number;
  sessionsThisYear: number;
  facilitations: Record<HealthFacilitation, number>;
  vulnerabilities: Record<VulnerabilityTag, number>;
  openCases: number;
  closedCases: number;
};

function addFacilitations(
  target: Record<string, number>,
  source: MediatorIndicators["facilitations"],
): void {
  for (const [k, v] of Object.entries(source)) {
    target[k] = (target[k] ?? 0) + v;
  }
}

function addVulnerabilities(
  target: Record<string, number>,
  source: MediatorIndicators["vulnerabilities"],
): void {
  for (const [k, v] of Object.entries(source)) {
    target[k] = (target[k] ?? 0) + v;
  }
}

export function aggregateByCounty(
  rows: WorkspaceRow[],
  countyCode: string,
): CountyAggregate {
  const code = countyCode.toUpperCase();
  const filtered = rows.filter(
    (r) => (r.countyCode ?? "").toUpperCase() === code,
  );

  const emptyFac: Record<string, number> = {};
  const emptyVul: Record<string, number> = {};

  const agg: CountyAggregate = {
    countyCode: code,
    workspaceCount: filtered.length,
    uniquePeopleEstimate: 0,
    households: 0,
    visitsThisMonth: 0,
    visitsThisYear: 0,
    sessionsThisYear: 0,
    facilitations: emptyFac as CountyAggregate["facilitations"],
    vulnerabilities: emptyVul as CountyAggregate["vulnerabilities"],
    openCases: 0,
    closedCases: 0,
  };

  for (const row of filtered) {
    const payload = parseWorkspacePayload(row.payload);
    const ind = computeIndicators(payload);
    agg.uniquePeopleEstimate += ind.uniquePeople;
    agg.households += ind.households;
    agg.visitsThisMonth += ind.visitsThisMonth;
    agg.visitsThisYear += ind.visitsThisYear;
    agg.sessionsThisYear += ind.sessionsThisYear;
    agg.openCases += ind.cases.open;
    agg.closedCases += ind.cases.closed;
    addFacilitations(agg.facilitations, ind.facilitations);
    addVulnerabilities(agg.vulnerabilities, ind.vulnerabilities);
  }

  return agg;
}

export function aggregateNational(rows: WorkspaceRow[]): CountyAggregate[] {
  const codes = new Set<string>();
  for (const r of rows) {
    if (r.countyCode?.trim()) codes.add(r.countyCode.trim().toUpperCase());
  }
  return [...codes].sort().map((c) => aggregateByCounty(rows, c));
}
