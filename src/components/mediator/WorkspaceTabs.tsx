"use client";

import type { ComponentType } from "react";
import { ClipboardList, FolderOpen, Presentation, Wrench } from "lucide-react";
import type { MediatorLabels } from "./labels";

export type TabId = "overview" | "cases" | "sessions" | "tools";

const ICONS: Record<TabId, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  overview: ClipboardList,
  cases: FolderOpen,
  sessions: Presentation,
  tools: Wrench,
};

const LABEL_KEY: Record<TabId, keyof MediatorLabels> = {
  overview: "tabDashboard",
  cases: "tabCases",
  sessions: "tabSessions",
  tools: "tabTools",
};

const TABS: TabId[] = ["overview", "cases", "sessions", "tools"];

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
            className={`flex min-h-[44px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2.5 text-[11px] font-extrabold transition-colors ${
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
