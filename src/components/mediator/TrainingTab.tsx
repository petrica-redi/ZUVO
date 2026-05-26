"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Link } from "@/navigation";
import {
  TRAINING_MODULES,
  type TrainingModule,
  type TrainingTier,
  trainingProgressPercent,
} from "@/data/mediator-training";
import type { TrainingProgress } from "@/lib/mediator/types";
import type { MediatorLabels } from "./labels";

const TIER_ORDER: TrainingTier[] = ["foundations", "health", "social", "fieldwork"];

const TIER_LABEL_KEY: Record<TrainingTier, keyof MediatorLabels> = {
  foundations: "trainingTierFoundations",
  health: "trainingTierHealth",
  social: "trainingTierSocial",
  fieldwork: "trainingTierFieldwork",
};

export function TrainingTab({
  labels,
  training,
  onToggleModule,
}: {
  labels: MediatorLabels;
  training: TrainingProgress[];
  onToggleModule: (moduleId: string, completed: boolean) => void;
}) {
  const t = useTranslations();
  const completedIds = useMemo(
    () => new Set(training.map((p) => p.moduleId)),
    [training],
  );
  const progressPct = trainingProgressPercent(completedIds);

  const tierGroups = useMemo(() => {
    const groups = new Map<TrainingTier, TrainingModule[]>();
    for (const tier of TIER_ORDER) groups.set(tier, []);
    for (const m of TRAINING_MODULES) {
      groups.get(m.tier)!.push(m);
    }
    return groups;
  }, []);

  return (
    <>
      <div className="mb-5 rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              {labels.trainingTitle}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              {labels.trainingSubtitle}
            </p>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-extrabold text-[var(--color-text-primary)]">
              {progressPct}%
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              {labels.trainingProgress}
            </div>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-subtle)]">
          <div
            className="h-full rounded-full bg-[var(--color-sage-600)] transition-all"
            style={{ width: `${progressPct}%` }}
            aria-hidden
          />
        </div>
      </div>

      {TIER_ORDER.map((tier) => {
        const modules = tierGroups.get(tier) ?? [];
        if (modules.length === 0) return null;
        return (
          <section key={tier} className="mb-6">
            <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
              {labels[TIER_LABEL_KEY[tier]]}
            </h3>
            <ul className="flex flex-col gap-2">
              {modules.map((module) => (
                <TrainingModuleCard
                  key={module.id}
                  module={module}
                  completed={completedIds.has(module.id)}
                  t={t}
                  labels={labels}
                  onToggle={(completed) => onToggleModule(module.id, completed)}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

function TrainingModuleCard({
  module,
  completed,
  t,
  labels,
  onToggle,
}: {
  module: TrainingModule;
  completed: boolean;
  t: (key: string) => string;
  labels: MediatorLabels;
  onToggle: (completed: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className={`rounded-2xl border bg-[var(--color-surface)] p-4 shadow-1 transition-colors ${
        completed
          ? "border-[var(--color-success-accent)]/40"
          : "border-[var(--color-border-subtle)]"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 text-left"
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            completed
              ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)]"
              : "bg-[var(--color-sage-100)] text-[var(--color-sage-700)]"
          }`}
        >
          {completed ? (
            <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
          ) : (
            <BookOpen className="h-5 w-5" strokeWidth={1.85} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-[var(--color-text-primary)]">
            {t(module.titleKey)}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {module.minutes} {labels.trainingMinutes}
            </span>
            {completed && <span>· {labels.trainingCompleted}</span>}
          </div>
        </div>
        {open ? (
          <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
        ) : (
          <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
        )}
      </button>

      {open && (
        <div className="mt-3 border-t border-[var(--color-border-subtle)] pt-3 text-sm">
          <p className="mb-3 text-[var(--color-text-secondary)]">
            {t(module.summaryKey)}
          </p>

          <ul className="mb-3 space-y-1.5 text-[var(--color-text-primary)]">
            {module.keyPointKeys.map((k) => (
              <li key={k} className="flex gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-sage-600)]" />
                <span>{t(k)}</span>
              </li>
            ))}
          </ul>

          {module.toolLinks && module.toolLinks.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {module.toolLinks.map((tool) => (
                <Link
                  key={tool.href + tool.labelKey}
                  href={tool.href}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--color-sage-100)] px-3 py-1 text-[11px] font-extrabold text-[var(--color-sage-800)]"
                >
                  {t(tool.labelKey)}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          )}

          <div className="mb-3 space-y-1">
            {module.references.map((ref) => (
              <a
                key={ref.url}
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[12px] text-[var(--color-accent)] hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {ref.title}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onToggle(!completed)}
            className={`w-full rounded-xl py-2 text-sm font-semibold transition-colors ${
              completed
                ? "bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]"
                : "bg-[var(--color-sage-700)] text-white"
            }`}
          >
            {completed ? labels.trainingMarkIncomplete : labels.trainingMarkComplete}
          </button>
        </div>
      )}
    </li>
  );
}
