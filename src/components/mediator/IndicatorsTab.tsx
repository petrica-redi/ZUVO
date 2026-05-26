"use client";

import { useMemo } from "react";
import {
  Activity,
  Baby,
  HeartPulse,
  Home,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Users,
} from "lucide-react";
import {
  HEALTH_FACILITATIONS,
  SESSION_THEMES,
  VULNERABILITY_TAGS,
  type HealthFacilitation,
  type MediatorCase,
  type MediatorSession,
  type MediatorVisit,
  type SessionTheme,
  type VulnerabilityTag,
} from "@/lib/mediator/types";
import { computeIndicators } from "@/lib/mediator/indicators";
import type { MediatorLabels } from "./labels";

export function IndicatorsTab({
  labels,
  cases,
  visits,
  sessions,
}: {
  labels: MediatorLabels;
  cases: MediatorCase[];
  visits: MediatorVisit[];
  sessions: MediatorSession[];
}) {
  const indicators = useMemo(
    () =>
      computeIndicators({
        version: 1,
        cases,
        visits,
        sessions,
        training: [],
      }),
    [cases, visits, sessions],
  );

  return (
    <>
      <h2 className="mb-1 text-lg font-bold text-[var(--color-text-primary)]">
        {labels.indicatorsTitle}
      </h2>
      <p className="mb-5 text-xs text-[var(--color-text-muted)]">
        {labels.indicatorsHint}
      </p>

      <Section title={labels.indicatorsCoverage}>
        <KpiCard
          icon={Users}
          value={indicators.uniquePeople}
          label={labels.indicatorsUniquePeople}
          tone="info"
        />
        <KpiCard
          icon={Home}
          value={indicators.households}
          label={labels.indicatorsHouseholds}
          tone="info"
        />
        <KpiCard
          icon={Activity}
          value={indicators.cases.open}
          label={labels.openCases}
          tone="warning"
        />
        <KpiCard
          icon={ShieldCheck}
          value={indicators.cases.closed}
          label={labels.indicatorsClosedCases}
          tone="success"
        />
      </Section>

      <Section title={labels.indicatorsActivity}>
        <KpiCard
          icon={Stethoscope}
          value={indicators.visitsThisMonth}
          label={labels.logsThisMonth}
          tone="success"
        />
        <KpiCard
          icon={Stethoscope}
          value={indicators.visitsThisYear}
          label={labels.indicatorsVisitsThisYear}
          tone="info"
        />
        <KpiCard
          icon={Users}
          value={indicators.sessionsThisMonth}
          label={labels.sessionsThisMonth}
          tone="success"
        />
        <KpiCard
          icon={Users}
          value={indicators.sessionAttendeesThisYear}
          label={labels.indicatorsAttendeesThisYear}
          tone="info"
        />
      </Section>

      <Section title={labels.indicatorsHealthFacilitation}>
        {HEALTH_FACILITATIONS.map((flag) => (
          <KpiCard
            key={flag}
            icon={facilitationIcon(flag)}
            value={indicators.facilitations[flag]}
            label={labels[`facilitation_${flag}` as keyof MediatorLabels]}
            tone="success"
            compact
          />
        ))}
      </Section>

      <Section title={labels.indicatorsSessionsByTheme} columns="single">
        {SESSION_THEMES.map((t) => (
          <ThemeRow
            key={t}
            label={labels[`sessionTheme_${t}` as keyof MediatorLabels]}
            value={indicators.sessionsByTheme[t as SessionTheme]}
          />
        ))}
      </Section>

      <Section title={labels.indicatorsVulnerability} columns="single">
        {VULNERABILITY_TAGS.map((v) => (
          <ThemeRow
            key={v}
            label={labels[`vuln_${v}` as keyof MediatorLabels]}
            value={indicators.vulnerabilities[v as VulnerabilityTag]}
          />
        ))}
      </Section>
    </>
  );
}

function facilitationIcon(flag: HealthFacilitation) {
  switch (flag) {
    case "vaccinationFacilitated":
      return Syringe;
    case "prenatalFacilitated":
      return Baby;
    case "screeningReferral":
      return ShieldCheck;
    case "chronicMonitoring":
      return HeartPulse;
    case "tbCommunicableScreening":
      return Stethoscope;
    case "gpEnrollment":
      return Users;
    case "insuranceEnrollment":
      return ShieldCheck;
    default:
      return ShieldCheck;
  }
}

function Section({
  title,
  children,
  columns = "grid",
}: {
  title: string;
  children: React.ReactNode;
  columns?: "grid" | "single";
}) {
  return (
    <section className="mb-6">
      <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
        {title}
      </h3>
      <div
        className={
          columns === "single"
            ? "flex flex-col gap-1.5"
            : "grid grid-cols-2 gap-2"
        }
      >
        {children}
      </div>
    </section>
  );
}

function KpiCard({
  icon: Icon,
  value,
  label,
  tone,
  compact = false,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  value: number;
  label: string;
  tone: "info" | "success" | "warning";
  compact?: boolean;
}) {
  const iconClass =
    tone === "info"
      ? "text-[var(--color-info-accent)]"
      : tone === "success"
        ? "text-[var(--color-success-accent)]"
        : "text-[var(--color-warning-accent)]";

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] shadow-1 ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} strokeWidth={1.85} />
      <div className="min-w-0">
        <div className="font-display text-lg font-extrabold text-[var(--color-text-primary)]">
          {value}
        </div>
        <div className="truncate text-[11px] text-[var(--color-text-muted)]">
          {label}
        </div>
      </div>
    </div>
  );
}

function ThemeRow({ label, value }: { label: string; value: number }) {
  const empty = value === 0;
  return (
    <div className="flex items-center justify-between rounded-xl bg-[var(--color-surface)] px-3 py-2 text-sm shadow-1">
      <span
        className={
          empty
            ? "text-[var(--color-text-muted)]"
            : "text-[var(--color-text-primary)]"
        }
      >
        {label}
      </span>
      <span
        className={`font-extrabold ${
          empty
            ? "text-[var(--color-text-muted)]"
            : "text-[var(--color-text-primary)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
