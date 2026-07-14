"use client";

import { useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Globe,
  LineChart,
  Presentation,
  Wrench,
} from "lucide-react";
import type { MediatorCase, MediatorSession, MediatorVisit } from "@/lib/mediator/types";
import type { NavigationCase } from "@/lib/operations/types";
import type { MediatorLabels } from "./labels";
import { CasesTab } from "./CasesTab";
import { SessionsTab } from "./SessionsTab";
import { IndicatorsTab } from "./IndicatorsTab";
import { TrainingTab } from "./TrainingTab";
import { ToolsTab } from "./ToolsTab";
import { CrossBorderTab } from "./CrossBorderTab";
import type { useCrossBorder } from "./useCrossBorder";

type CrossBorderHook = ReturnType<typeof useCrossBorder>;

type SectionId =
  | "poidsCases"
  | "sessions"
  | "indicators"
  | "training"
  | "tools"
  | "crossBorder";

const SECTIONS: {
  id: SectionId;
  icon: typeof FolderOpen;
  labelKey: keyof MediatorLabels;
}[] = [
  { id: "poidsCases", icon: FolderOpen, labelKey: "tabCases" },
  { id: "sessions", icon: Presentation, labelKey: "tabSessions" },
  { id: "indicators", icon: LineChart, labelKey: "tabIndicators" },
  { id: "training", icon: BookOpen, labelKey: "tabTraining" },
  { id: "tools", icon: Wrench, labelKey: "tabTools" },
  { id: "crossBorder", icon: Globe, labelKey: "tabCrossBorder" },
];

function Section({
  id,
  icon: Icon,
  title,
  defaultOpen,
  children,
}: {
  id: string;
  icon: typeof FolderOpen;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <section className="mb-4 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
      <button
        type="button"
        id={`more-section-${id}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <Icon className="h-5 w-5 shrink-0 text-[var(--color-sage-700)]" strokeWidth={2} />
        <span className="flex-1 text-sm font-extrabold text-[var(--color-text-primary)]">
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
        )}
      </button>
      {open && <div className="border-t border-[var(--color-border-subtle)] px-5 py-5">{children}</div>}
    </section>
  );
}

export function MediatorMoreTab({
  labels,
  countyCode,
  poidsCases,
  visits,
  sessions,
  training,
  navCases,
  crossBorder,
  onSavePoidsCase,
  onSaveSession,
  onToggleTraining,
}: {
  labels: MediatorLabels;
  countyCode: string;
  poidsCases: MediatorCase[];
  visits: MediatorVisit[];
  sessions: MediatorSession[];
  training: { moduleId: string; completedAt: string }[];
  navCases: NavigationCase[];
  crossBorder: CrossBorderHook;
  onSavePoidsCase: (record: MediatorCase) => void;
  onSaveSession: (record: MediatorSession) => void;
  onToggleTraining: (moduleId: string, completed: boolean) => void;
}) {
  const locale = useLocale();

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">{labels.moreTabLead}</p>
      {SECTIONS.map((section, index) => (
        <Section
          key={section.id}
          id={section.id}
          icon={section.icon}
          title={labels[section.labelKey]}
          defaultOpen={index === 0}
        >
          {section.id === "poidsCases" && (
            <CasesTab labels={labels} cases={poidsCases} onSave={onSavePoidsCase} />
          )}
          {section.id === "sessions" && (
            <SessionsTab labels={labels} sessions={sessions} onSave={onSaveSession} />
          )}
          {section.id === "indicators" && (
            <IndicatorsTab
              labels={labels}
              cases={poidsCases}
              visits={visits}
              sessions={sessions}
            />
          )}
          {section.id === "training" && (
            <TrainingTab
              labels={labels}
              training={training}
              onToggleModule={onToggleTraining}
            />
          )}
          {section.id === "tools" && (
            <ToolsTab
              labels={labels}
              locale={locale}
              countyCode={countyCode}
              cases={poidsCases}
              visits={visits}
              sessions={sessions}
            />
          )}
          {section.id === "crossBorder" && (
            <CrossBorderTab cases={navCases} crossBorder={crossBorder} />
          )}
        </Section>
      ))}
    </div>
  );
}
