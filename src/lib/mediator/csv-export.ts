/**
 * POIDS / SCI 2000 indicator export as CSV for ministry reporting.
 * Column layout follows AMC field-report conventions (beneficiaries,
 * facilitations, sessions) — suitable for UJSS / ANPIS aggregation.
 */

import { computeIndicators } from "./indicators";
import type { MediatorWorkspacePayload } from "./types";

function esc(value: string | number): string {
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function row(cells: (string | number)[]): string {
  return cells.map(esc).join(",");
}

export type CsvExportMeta = {
  countyCode: string;
  workspaceId: string;
  generatedAt: string;
  mediatorLabel?: string;
};

/**
 * Single-workspace POIDS indicator CSV (one row of KPIs + facilitation counts).
 */
export function buildPoidsCsv(
  payload: MediatorWorkspacePayload,
  meta: CsvExportMeta,
): string {
  const ind = computeIndicators(payload);
  const lines: string[] = [];

  lines.push(row(["# Redi Health — POIDS / ECI indicator export"]));
  lines.push(row(["generated_at", meta.generatedAt]));
  lines.push(row(["county_code", meta.countyCode]));
  lines.push(row(["workspace_id", meta.workspaceId]));
  if (meta.mediatorLabel) lines.push(row(["mediator", meta.mediatorLabel]));
  lines.push("");

  lines.push(
    row([
      "metric",
      "value",
    ]),
  );

  const metrics: [string, number][] = [
    ["unique_people", ind.uniquePeople],
    ["households", ind.households],
    ["cases_total", ind.cases.total],
    ["cases_open", ind.cases.open],
    ["cases_closed", ind.cases.closed],
    ["visits_month", ind.visitsThisMonth],
    ["visits_year", ind.visitsThisYear],
    ["sessions_month", ind.sessionsThisMonth],
    ["sessions_year", ind.sessionsThisYear],
    ["session_attendees_year", ind.sessionAttendeesThisYear],
  ];

  for (const [k, v] of metrics) {
    lines.push(row([k, v]));
  }

  lines.push("");
  lines.push(row(["facilitation", "count"]));
  for (const [k, v] of Object.entries(ind.facilitations)) {
    if (v > 0) lines.push(row([k, v]));
  }

  lines.push("");
  lines.push(row(["vulnerability_tag", "count"]));
  for (const [k, v] of Object.entries(ind.vulnerabilities)) {
    if (v > 0) lines.push(row([k, v]));
  }

  lines.push("");
  lines.push(row(["session_theme", "count"]));
  for (const [k, v] of Object.entries(ind.sessionsByTheme)) {
    if (v > 0) lines.push(row([k, v]));
  }

  return lines.join("\n");
}

/** Trigger browser download of a CSV string. */
export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
