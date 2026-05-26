/**
 * Builds a self-contained, print-friendly HTML report for a mediator's field
 * activity. The output is intentionally a plain `<html>` document so it can
 * be opened in a new tab and printed to PDF via the browser without needing
 * a heavyweight PDF library bundled into the app.
 */

import type { MediatorWorkspacePayload } from "./types";

export type MediatorReportLabels = {
  title: string;
  generatedAt: string;
  county: string;
  casesSection: string;
  visitsSection: string;
  sessionsSection: string;
  noCases: string;
  noVisits: string;
  noSessions: string;
  beneficiary: string;
  status: string;
  category: string;
  notes: string;
  date: string;
  topic: string;
  location: string;
  attendees: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cell(value: string): string {
  return `<td>${escapeHtml(value || "—")}</td>`;
}

function row(values: string[]): string {
  return `<tr>${values.map(cell).join("")}</tr>`;
}

function emptyRow(colSpan: number, message: string): string {
  return `<tr><td colspan="${colSpan}" class="empty">${escapeHtml(message)}</td></tr>`;
}

function formatDate(value: string, locale: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(locale);
}

export function buildMediatorReportHtml(
  payload: MediatorWorkspacePayload,
  labels: MediatorReportLabels,
  countyName: string,
  locale: string,
): string {
  const generated = new Date().toLocaleString(locale);

  const casesRows = payload.cases.length
    ? payload.cases
        .map((c) =>
          row([c.name, c.status, c.category, c.notes]),
        )
        .join("")
    : emptyRow(4, labels.noCases);

  const visitRows = payload.visits.length
    ? payload.visits
        .map((v) =>
          row([v.memberName, formatDate(v.visitDate, locale), v.notes]),
        )
        .join("")
    : emptyRow(3, labels.noVisits);

  const sessionRows = payload.sessions.length
    ? payload.sessions
        .map((s) =>
          row([
            s.title,
            s.topic,
            s.location,
            s.attendees,
            formatDate(s.sessionDate, locale),
          ]),
        )
        .join("")
    : emptyRow(5, labels.noSessions);

  const htmlLang = locale.startsWith("ro") ? "ro" : "en";

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(labels.title)}</title>
  <style>
    :root { color-scheme: light; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
      margin: 2rem; color: #111; background: #fff;
    }
    h1 { font-size: 1.45rem; margin: 0 0 0.25rem; }
    .meta { color: #555; font-size: 0.85rem; margin-bottom: 1.75rem; }
    h2 {
      font-size: 1.05rem; margin: 1.75rem 0 0.5rem;
      border-bottom: 1px solid #ddd; padding-bottom: 0.35rem;
    }
    table {
      width: 100%; border-collapse: collapse; font-size: 0.85rem;
      margin-bottom: 1.5rem; table-layout: fixed;
    }
    th, td {
      border: 1px solid #ddd; padding: 0.5rem 0.6rem;
      text-align: left; vertical-align: top; word-wrap: break-word;
    }
    th { background: #f4f4f4; font-weight: 600; }
    td.empty { color: #888; font-style: italic; text-align: center; }
    @media print {
      body { margin: 1rem; }
      h2 { page-break-after: avoid; }
      table { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(labels.title)}</h1>
  <p class="meta">
    ${escapeHtml(labels.generatedAt)}: ${escapeHtml(generated)}<br />
    ${escapeHtml(labels.county)}: ${escapeHtml(countyName)}
  </p>

  <h2>${escapeHtml(labels.casesSection)}</h2>
  <table>
    <thead>
      <tr>
        <th>${escapeHtml(labels.beneficiary)}</th>
        <th>${escapeHtml(labels.status)}</th>
        <th>${escapeHtml(labels.category)}</th>
        <th>${escapeHtml(labels.notes)}</th>
      </tr>
    </thead>
    <tbody>${casesRows}</tbody>
  </table>

  <h2>${escapeHtml(labels.visitsSection)}</h2>
  <table>
    <thead>
      <tr>
        <th>${escapeHtml(labels.beneficiary)}</th>
        <th>${escapeHtml(labels.date)}</th>
        <th>${escapeHtml(labels.notes)}</th>
      </tr>
    </thead>
    <tbody>${visitRows}</tbody>
  </table>

  <h2>${escapeHtml(labels.sessionsSection)}</h2>
  <table>
    <thead>
      <tr>
        <th>${escapeHtml(labels.title)}</th>
        <th>${escapeHtml(labels.topic)}</th>
        <th>${escapeHtml(labels.location)}</th>
        <th>${escapeHtml(labels.attendees)}</th>
        <th>${escapeHtml(labels.date)}</th>
      </tr>
    </thead>
    <tbody>${sessionRows}</tbody>
  </table>
</body>
</html>`;
}

/** Opens the report in a new tab and triggers the print dialog. */
export function printMediatorReport(html: string): void {
  if (typeof window === "undefined") return;
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  // Defer print until layout has settled (some browsers ignore an immediate
  // print() call from a freshly-opened document).
  win.onload = () => {
    setTimeout(() => win.print(), 50);
  };
}

/** Downloads the same report as an `.html` file for offline archiving. */
export function downloadMediatorReportHtml(html: string, filename: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
