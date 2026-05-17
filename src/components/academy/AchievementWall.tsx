"use client";

import { useTranslations } from "next-intl";
import { Trophy, Sparkles, Lock } from "lucide-react";
import { STAGE_ORDER, type StageId } from "@/data/student-health";
import { cn } from "@/components/ui/cn";

type AchievementProgress = {
  stage: StageId;
  earned: boolean;
  percent: number; // 0–100 progress towards earning (modules done in stage)
};

const STAGE_GRADIENTS: Record<StageId, string> = {
  local: "from-[var(--color-ember-400)] to-[var(--color-ember-600)]",
  regional: "from-[var(--color-brand-500)] to-[var(--color-brand-700)]",
  national: "from-[var(--color-sage-500)] to-[var(--color-sage-700)]",
};

export function AchievementWall({ items }: { items: AchievementProgress[] }) {
  const t = useTranslations("studentHealth.l8");
  const tStages = useTranslations("studentHealth.stages");

  return (
    <section
      className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-1 md:p-6"
      aria-labelledby="achievement-wall-title"
    >
      <header className="mb-5">
        <p className="eyebrow">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-brand-500)" }}
          />
          {t("achievementWallSubtitle")}
        </p>
        <h3
          id="achievement-wall-title"
          className="font-editorial mt-2 text-xl text-[var(--color-text-primary)]"
        >
          {t("achievementWallTitle")}
        </h3>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {STAGE_ORDER.map((stage) => {
          const item = items.find((i) => i.stage === stage) ?? {
            stage,
            earned: false,
            percent: 0,
          };
          return <Badge key={stage} item={item} stageLabel={tStages(stage)} />;
        })}
      </div>
    </section>
  );
}

function Badge({
  item,
  stageLabel,
}: {
  item: AchievementProgress;
  stageLabel: string;
}) {
  const t = useTranslations("studentHealth.l8");
  const earned = item.earned;
  const inProgress = !earned && item.percent > 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 transition-all duration-300",
        earned
          ? "border-[var(--color-success-border)] bg-gradient-to-br from-[var(--color-success-bg)] to-white shadow-2"
          : inProgress
            ? "border-[var(--color-brand-200)] bg-white hover:-translate-y-0.5 hover:shadow-2"
            : "border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]",
      )}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-1",
            earned
              ? `bg-gradient-to-br ${STAGE_GRADIENTS[item.stage]} text-white`
              : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hairline",
          )}
        >
          {earned ? (
            <Trophy className="lucide h-5 w-5" strokeWidth={2} />
          ) : inProgress ? (
            <Sparkles
              className="lucide h-5 w-5 text-[var(--color-brand-500)]"
              strokeWidth={2}
            />
          ) : (
            <Lock className="lucide h-5 w-5" strokeWidth={1.85} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
            {earned
              ? t("achievementEarned")
              : t("achievementProgress", { percent: item.percent })}
          </div>
          <div
            className={cn(
              "mt-0.5 font-display text-sm font-extrabold tracking-tight",
              earned
                ? "text-[var(--color-success-text)]"
                : "text-[var(--color-text-primary)]",
            )}
          >
            {stageLabel}
          </div>
          {!earned && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
              <div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r",
                  STAGE_GRADIENTS[item.stage],
                )}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          )}
          {!earned && !inProgress && (
            <p className="mt-2 text-[10px] leading-relaxed text-[var(--color-text-muted)]">
              {t("achievementLockedHint", { stage: stageLabel })}
            </p>
          )}
        </div>
      </div>

      {earned && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-40 blur-2xl"
          style={{ background: "var(--color-success-accent)" }}
        />
      )}
    </div>
  );
}
