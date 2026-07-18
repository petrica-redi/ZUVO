"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, ClipboardList, HandHeart, ListTodo } from "lucide-react";
import { fetchIntakes } from "@/lib/operations/support-client";
import type { NavigationCase } from "@/lib/operations/types";

export function MediatorStartPanel({
  cases,
  onOpenCases,
  onOpenTasks,
  onOpenHelp,
}: {
  cases: NavigationCase[];
  onOpenCases: () => void;
  onOpenTasks: () => void;
  onOpenHelp: () => void;
}) {
  const t = useTranslations("operations");
  const [pendingIntakes, setPendingIntakes] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchIntakes().then((rows) => {
        setPendingIntakes(
          rows.filter((r) => !["converted", "closed"].includes(r.status)).length,
        );
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const openCases = cases.filter(
    (c) => !["completed", "closed_incomplete", "cancelled"].includes(c.status),
  ).length;

  if (openCases > 0 && pendingIntakes === 0) return null;

  return (
    <div className="mediator-glass-panel mb-6 animate-fade-in-up">
      <h2 className="mb-1 text-base font-extrabold text-[var(--color-text-primary)]">
        {t("startPanelTitle")}
      </h2>
      <p className="mb-4 text-sm font-medium leading-relaxed text-[var(--color-text-secondary)]">
        {t("startPanelLead")}
      </p>

      {pendingIntakes > 0 && (
        <button
          type="button"
          onClick={onOpenCases}
          className="mb-3 flex w-full items-center gap-3 rounded-xl border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] p-4 text-left transition-transform active:scale-[0.99]"
        >
          <HandHeart className="h-5 w-5 shrink-0 text-[var(--color-warning-text)]" />
          <div className="flex-1">
            <p className="text-sm font-bold text-[var(--color-warning-text)]">
              {t("startPanelIntakes", { count: pendingIntakes })}
            </p>
            <p className="text-xs font-medium text-[var(--color-text-secondary)]">
              {t("startPanelIntakesHint")}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--color-warning-text)]" />
        </button>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={onOpenCases} className="mediator-cta-primary">
          <ClipboardList className="h-4 w-4" />
          {t("openCase")}
        </button>
        <button type="button" onClick={onOpenTasks} className="mediator-cta-secondary">
          <ListTodo className="h-4 w-4" />
          {t("tasksTitle")}
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenHelp}
        className="mt-3 w-full text-center text-xs font-bold text-[var(--color-accent-text)] underline-offset-2 hover:underline"
      >
        {t("startPanelPublicHelp")}
      </button>
    </div>
  );
}
