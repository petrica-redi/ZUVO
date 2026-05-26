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
  variant = "responsive",
}: {
  labels: MediatorLabels;
  tab: TabId;
  onChange: (next: TabId) => void;
  variant?: "responsive" | "desktop" | "mobile";
}) {
  return (
    <>
      {variant !== "mobile" && (
      <div
        className="hidden flex-col gap-2 lg:flex"
        role="tablist"
        aria-label={labels.title}
      >
        {TABS.map((id, index) => {
          const Icon = ICONS[id];
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(id)}
              className={`group relative flex min-h-[58px] items-center gap-3 rounded-3xl border px-4 text-left transition-all ${
                active
                  ? "border-white/24 bg-white text-[#123C31] shadow-[0_18px_40px_-22px_rgba(2,6,23,0.55)]"
                  : "border-white/10 bg-white/8 text-white/68 hover:border-white/20 hover:bg-white/12 hover:text-white"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                  active ? "bg-[#F4F1EA] text-[#006B3F]" : "bg-white/10 text-white/72"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.35 : 1.9} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-black uppercase tracking-[0.18em] opacity-50">
                  0{index + 1}
                </span>
                <span className="block truncate text-sm font-extrabold">
                  {labels[LABEL_KEY[id]]}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      )}

      {variant !== "desktop" && (
      <div
        className="sticky top-3 z-20 mb-5 flex gap-2 overflow-x-auto rounded-[1.75rem] border border-black/5 bg-white/82 p-2 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:hidden"
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
              className={`flex min-h-[52px] min-w-[96px] flex-none flex-col items-center justify-center gap-1 rounded-2xl px-3 text-[10px] font-extrabold transition-all ${
                active
                  ? "bg-[#123C31] text-white shadow-[0_10px_22px_-14px_rgba(18,60,49,0.75)]"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.3 : 1.9} />
              <span>{labels[LABEL_KEY[id]]}</span>
            </button>
          );
        })}
      </div>
      )}
    </>
  );
}
