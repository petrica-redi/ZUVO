"use client";

import { useMemo, useState } from "react";
import {
  ChevronRight,
  Download,
  FileText,
  MapPin,
  Phone,
  Printer,
} from "lucide-react";
import { Link } from "@/navigation";
import {
  getCountyContact,
  POIDS_NATIONAL_NOTE,
} from "@/data/romania-eci-contacts";
import type {
  MediatorCase,
  MediatorSession,
  MediatorVisit,
} from "@/lib/mediator/types";
import {
  buildMediatorReportHtml,
  downloadMediatorReportHtml,
  printMediatorReport,
  type MediatorReportLabels,
} from "@/lib/mediator/report";
import { CATEGORY_LABEL_KEYS, STATUS_LABEL_KEYS, type MediatorLabels } from "./labels";

export function ToolsTab({
  labels,
  locale,
  countyCode,
  cases,
  visits,
  sessions,
}: {
  labels: MediatorLabels;
  locale: string;
  countyCode: string;
  cases: MediatorCase[];
  visits: MediatorVisit[];
  sessions: MediatorSession[];
}) {
  const [contactsOpen, setContactsOpen] = useState(false);
  const county = useMemo(() => getCountyContact(countyCode), [countyCode]);

  const reportLabels: MediatorReportLabels = {
    title: labels.reportTitle,
    generatedAt: labels.reportGenerated,
    county: labels.countyLabel,
    casesSection: labels.casesTitle,
    visitsSection: labels.recentActivity,
    sessionsSection: labels.sessionsTitle,
    noCases: labels.noCases,
    noVisits: labels.noActivity,
    noSessions: labels.noSessions,
    beneficiary: labels.caseName,
    status: labels.caseStatus,
    category: labels.caseCategory,
    notes: labels.notes,
    date: labels.visitDate,
    topic: labels.sessionTopic,
    location: labels.sessionLocation,
    attendees: labels.sessionAttendees,
  };

  const buildReport = () => {
    const localisedCases = cases.map((c) => ({
      ...c,
      status: labels[STATUS_LABEL_KEYS[c.status]] ?? c.status,
      category: labels[CATEGORY_LABEL_KEYS[c.category]] ?? c.category,
    })) as unknown as typeof cases;

    return buildMediatorReportHtml(
      { version: 1, cases: localisedCases, visits, sessions },
      reportLabels,
      county?.name ?? labels.countyPlaceholder,
      locale,
    );
  };

  const onPrint = () => printMediatorReport(buildReport());
  const onDownload = () =>
    downloadMediatorReportHtml(
      buildReport(),
      `raport-mediator-${new Date().toISOString().slice(0, 10)}.html`,
    );

  return (
    <>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {labels.toolsTitle}
      </h2>
      <div className="mb-6 flex flex-col gap-2">
        <ToolLink href="/scan" label={labels.toolsScan} />
        <ToolLink href="/vaccines" label={labels.toolsVaccines} />
        <ToolLink href="/rights" label={labels.toolsRights} />
        <ToolLink href="/explain" label={labels.toolsExplain} />
        <ToolLink href="/chat" label={labels.toolsChat} />
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {labels.resources}
      </h2>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setContactsOpen((v) => !v)}
          className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-4 shadow-1"
        >
          <Phone className="h-5 w-5 text-purple-500" />
          <span className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)]">
            {labels.contactSupport}
          </span>
        </button>

        {contactsOpen && (
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] p-4 text-sm">
            <p className="mb-2 flex items-center gap-1.5 font-semibold text-[var(--color-text-primary)]">
              <MapPin className="h-4 w-4" />
              {county?.ujssName ?? labels.contactUjssGeneric}
            </p>
            <p className="mb-2 text-[var(--color-text-secondary)]">
              {POIDS_NATIONAL_NOTE}
            </p>
            {county?.note && (
              <p className="mb-2 text-xs text-[var(--color-text-muted)]">
                {county.note}
              </p>
            )}
            {county?.phone && (
              <a
                className="font-semibold text-[var(--color-accent)]"
                href={`tel:${county.phone}`}
              >
                {county.phone}
              </a>
            )}
            {county?.email && (
              <p className="text-xs">
                <a className="text-[var(--color-accent)]" href={`mailto:${county.email}`}>
                  {county.email}
                </a>
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-4 shadow-1"
        >
          <Printer className="h-5 w-5 text-[var(--color-text-muted)]" />
          <span className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)]">
            {labels.exportPrint}
          </span>
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-4 shadow-1"
        >
          <Download className="h-5 w-5 text-[var(--color-text-muted)]" />
          <span className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)]">
            {labels.exportDownload}
          </span>
        </button>
        <button
          type="button"
          className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-4 shadow-1"
        >
          <FileText className="h-5 w-5 text-[var(--color-text-muted)]" />
          <span className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)]">
            {labels.downloadGuide}
          </span>
        </button>
      </div>
    </>
  );
}

function ToolLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-4 shadow-1 transition-transform active:scale-[0.99]"
    >
      <FileText className="h-5 w-5 text-[var(--color-accent-text)]" />
      <span className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)]">
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
    </Link>
  );
}
