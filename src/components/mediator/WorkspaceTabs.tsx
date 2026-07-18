"use client";

import type { ComponentType } from "react";
import { FolderOpen, Inbox, ListTodo, MoreHorizontal } from "lucide-react";
import type { MediatorLabels } from "./labels";

export type TabId = "inbox" | "cases" | "tasks" | "more";

const ICONS: Record<
  TabId,
  ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  inbox: Inbox,
  cases: FolderOpen,
  tasks: ListTodo,
  more: MoreHorizontal,
};

const LABEL_KEY: Record<TabId, keyof MediatorLabels> = {
  inbox: "tabInbox",
  cases: "tabCases",
  tasks: "tabTasks",
  more: "tabMore",
};

const TABS: TabId[] = ["inbox", "cases", "tasks", "more"];

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
      className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-1 backdrop-blur-xl"
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
            className={`flex min-h-[44px] min-w-[88px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-xs font-extrabold transition-colors sm:text-[13px] ${
              active
                ? "bg-[var(--color-accent)] text-white shadow-1"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
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
