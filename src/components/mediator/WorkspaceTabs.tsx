"use client";

import type { ComponentType } from "react";
import {
  BookOpen,
  ClipboardList,
  FolderOpen,
  LineChart,
  Presentation,
  Wrench,
} from "lucide-react";
import type { MediatorLabels } from "./labels";

export type TabId =
  | "overview"
  | "cases"
  | "sessions"
  | "indicators"
  | "training"
  | "tools";

const ICONS: Record<
  TabId,
  ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  overview: ClipboardList,
  cases: FolderOpen,
  sessions: Presentation,
  indicators: LineChart,
  training: BookOpen,
  tools: Wrench,
};

const LABEL_KEY: Record<TabId, keyof MediatorLabels> = {
  overview: "tabDashboard",
  cases: "tabCases",
  sessions: "tabSessions",
  indicators: "tabIndicators",
  training: "tabTraining",
  tools: "tabTools",
};

const TABS: TabId[] = [
  "overview",
  "cases",
  "sessions",
  "indicators",
  "training",
  "tools",
];

export function WorkspaceTabs({
  labels,
  tab,
  onChange,
}: {
  labels: MediatorLabels;
  tab: TabId;
  onChange: (next: TabId) => void;
}) {
  return (
    <div
      className="sticky top-[64px] z-20 mb-6 flex gap-2 overflow-x-auto rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/92 p-2 shadow-[0_14px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur-xl"
      role="tablist"
      aria-label={labels.title}
    >
      {TABS.map((id) => {
        const Icon = ICONS[id];
        const active = tab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`flex min-h-[52px] min-w-[105px] flex-none flex-col items-center justify-center gap-1 whitespace-nowrap rounded-2xl px-3 py-2 text-[11px] font-extrabold transition-all ${
              active
                ? "bg-gradient-to-br from-[var(--color-sage-700)] to-[var(--color-sage-600)] text-white shadow-[0_10px_24px_-12px_rgba(21,128,61,0.65)]"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.25 : 1.9} />
            <span>{labels[LABEL_KEY[id]]}</span>
          </button>
        );
      })}
    </div>
  );
}
