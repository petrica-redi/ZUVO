"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import {
  ArrowRight,
  Flame,
  PlayCircle,
  Target,
  Trophy,
  Sparkles,
} from "lucide-react";
import type { AcademyNextStep } from "@/lib/student-health-progress";
import type { StageId } from "@/data/student-health";

export function MissionDeck({
  nextStep,
  streak,
  earnedBadges,
  totalStages,
  nextBadgeStage,
  nextBadgeRemaining,
  estimatedMinutes,
}: {
  nextStep: AcademyNextStep;
  streak: number;
  earnedBadges: number;
  totalStages: number;
  nextBadgeStage: StageId | null;
  nextBadgeRemaining: number;
  estimatedMinutes: number;
}) {
  const t = useTranslations("studentHealth.l8");
  const tStages = useTranslations("studentHealth.stages");

  return (
    <section
      aria-labelledby="mission-deck-title"
      className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-1 md:p-6"
    >
      <header className="mb-5 flex flex-col gap-1.5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--color-ember-500)" }}
            />
            {t("missionDeckSubtitle")}
          </p>
          <h2
            id="mission-deck-title"
            className="font-editorial mt-2 text-xl text-[var(--color-text-primary)] md:text-2xl"
          >
            {t("missionDeckTitle")}
          </h2>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        {/* Today's Mission — Primary */}
        <MissionTile
          accent="brand"
          label={t("missionTodayLabel")}
          icon={PlayCircle}
          primary
          headline={
            nextStep.type === "lesson"
              ? t("missionTodayBody", { min: estimatedMinutes })
              : nextStep.type === "quiz"
                ? t("missionTodayQuiz")
                : t("missionTodayDoneBody")
          }
          ctaLabel={
            nextStep.type === "lesson"
              ? t("missionTodayCta")
              : nextStep.type === "quiz"
                ? t("missionTodayQuiz")
                : t("missionTodayDone")
          }
          ctaHref={nextStep.type === "complete" ? "/students" : nextStep.href}
          subline={
            nextStep.type === "lesson"
              ? tStages(nextStep.stage)
              : nextStep.type === "quiz"
                ? tStages(nextStep.stage)
                : undefined
          }
        />

        {/* Streak */}
        <MissionTile
          accent="ember"
          label={t("missionStreakLabel")}
          icon={Flame}
          headline={t("missionStreakBody")}
          big={t("missionStreakDay", { count: streak })}
          ctaLabel={t("missionStreakCta")}
          ctaHref="/explain"
        />

        {/* Next Badge */}
        <MissionTile
          accent="sage"
          label={t("missionBadgeLabel")}
          icon={earnedBadges >= totalStages ? Trophy : Target}
          headline={
            earnedBadges >= totalStages
              ? t("missionBadgeAllDone")
              : nextBadgeStage
                ? t("missionBadgeBody", {
                    remaining: nextBadgeRemaining,
                    stage: tStages(nextBadgeStage),
                  })
                : t("missionTodayDoneBody")
          }
          progressLabel={`${earnedBadges} / ${totalStages}`}
        />
      </div>
    </section>
  );
}

function MissionTile({
  accent,
  label,
  icon: Icon,
  headline,
  ctaLabel,
  ctaHref,
  subline,
  big,
  primary = false,
  progressLabel,
}: {
  accent: "brand" | "ember" | "sage";
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  headline: string;
  ctaLabel?: string;
  ctaHref?: string;
  subline?: string;
  big?: string;
  primary?: boolean;
  progressLabel?: string;
}) {
  const tones = {
    brand: {
      bg: primary
        ? "bg-gradient-to-br from-[var(--color-brand-50)] via-[var(--color-brand-100)] to-[var(--color-ember-50)]"
        : "bg-[var(--color-brand-50)]",
      ring: "ring-1 ring-[var(--color-brand-200)]",
      icon: "text-[var(--color-brand-700)] bg-white",
      heading: "text-[var(--color-brand-900)]",
      muted: "text-[var(--color-brand-700)]",
      cta: "bg-[var(--color-brand-700)] text-white",
    },
    ember: {
      bg: "bg-[var(--color-ember-50)]",
      ring: "ring-1 ring-[var(--color-ember-200)]",
      icon: "text-[var(--color-ember-700)] bg-white",
      heading: "text-[var(--color-ember-900)]",
      muted: "text-[var(--color-ember-700)]",
      cta: "bg-[var(--color-ember-700)] text-white",
    },
    sage: {
      bg: "bg-[var(--color-sage-50)]",
      ring: "ring-1 ring-[var(--color-sage-200)]",
      icon: "text-[var(--color-sage-700)] bg-white",
      heading: "text-[var(--color-sage-900)]",
      muted: "text-[var(--color-sage-700)]",
      cta: "bg-[var(--color-sage-700)] text-white",
    },
  } as const;

  const tone = tones[accent];

  return (
    <div
      className={`flex flex-col rounded-2xl ${tone.bg} ${tone.ring} p-5 transition-all hover:-translate-y-0.5 hover:shadow-2`}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`text-[10px] font-extrabold uppercase tracking-[0.18em] ${tone.muted}`}
        >
          {label}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone.icon} shadow-1`}>
          <Icon className="lucide h-4 w-4" strokeWidth={1.95} />
        </div>
      </div>

      {big && (
        <div
          className={`font-editorial mt-3 leading-none ${tone.heading}`}
          style={{ fontSize: "clamp(1.625rem, 1.2rem + 1.4vw, 2.25rem)" }}
        >
          {big}
        </div>
      )}

      <p
        className={`mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]`}
      >
        {headline}
      </p>

      {subline && (
        <span
          className={`mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${tone.muted}`}
        >
          <Sparkles className="lucide h-3 w-3" strokeWidth={1.9} />
          {subline}
        </span>
      )}

      {progressLabel && (
        <div
          className={`mt-3 inline-flex w-fit items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold ${tone.heading} hairline`}
        >
          {progressLabel}
        </div>
      )}

      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className={`mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full ${tone.cta} px-4 py-2.5 text-xs font-extrabold shadow-1 transition-transform active:scale-[0.97]`}
        >
          {ctaLabel}
          <ArrowRight className="lucide h-3.5 w-3.5" strokeWidth={2.2} />
        </Link>
      )}
    </div>
  );
}
