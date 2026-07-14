"use client";

import type { ComponentType } from "react";
import {
  BookOpen,
  ClipboardList,
  FolderOpen,
  LineChart,
  ListTodo,
  Navigation,
  Presentation,
  Wrench,
} from "lucide-react";
import type { MediatorLabels } from "./labels";

export type TabId =
  | "overview"
  | "navigation"
  | "tasks"
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
  navigation: Navigation,
  tasks: ListTodo,
  cases: FolderOpen,
  sessions: Presentation,
  indicators: LineChart,
  training: BookOpen,
  tools: Wrench,
};

const LABEL_KEY: Record<TabId, keyof MediatorLabels> = {
  overview: "tabDashboard",
  navigation: "tabNavigation",
  tasks: "tabTasks",
  cases: "tabCases",
  sessions: "tabSessions",
  indicators: "tabIndicators",
  training: "tabTraining",
  tools: "tabTools",
};

const TABS: TabId[] = [
  "overview",
  "navigation",
  "tasks",
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
      className="mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-[var(--color-surface-subtle)] p-1"
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
            className={`flex min-h-[44px] min-w-[88px] flex-none items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-[11px] font-extrabold transition-colors ${
              active
                ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-1"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {labels[LABEL_KEY[id]]}
          </button>
        );
      })}
    </div>
  );
}
