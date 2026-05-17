"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  Flame,
  GraduationCap,
  Lock,
  MapPin,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  Target,
} from "lucide-react";
import {
  getModulesByStage,
  STAGE_VISUALS,
  STAGE_ORDER,
  type StageId,
} from "@/data/student-health";
import { StudentAcademyIllustration } from "@/components/StudentAcademyIllustration";
import { getRegion, REGIONS, type RegionSlug } from "@/data/regions";
import {
  allStageModulesCompleted,
  defaultAcademyState,
  getAcademyLevel,
  getAcademyNextStep,
  getCompletedModuleIdSet,
  getCurrentStreak,
  getOverallCompletion,
  getStageCompletion,
  getWeeklyActivity,
  isStageQuizPassed,
  isStageUnlockedForPlay,
  readAcademyState,
  setCountryId,
  type StudentAcademyState,
} from "@/lib/student-health-progress";
import { cn } from "@/components/ui/cn";
import { CountUp } from "@/components/ui";
import { AcademyShellOptOut } from "@/components/academy/AcademyShellOptOut";
import { JourneyMap } from "@/components/academy/JourneyMap";
import { MissionDeck } from "@/components/academy/MissionDeck";
import { AchievementWall } from "@/components/academy/AchievementWall";
import { Leaderboard } from "@/components/academy/Leaderboard";
import { DiplomaPreview } from "@/components/academy/DiplomaPreview";

export function StudentAcademyHub() {
  const t = useTranslations("studentHealth");
  const tL8 = useTranslations("studentHealth.l8");
  const tRegions = useTranslations("regions");
  const locale = useLocale();
  const [state, setState] = useState<StudentAcademyState>(() => defaultAcademyState());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sync = () => {
      if (cancelled) return;
      setState(readAcademyState());
      setMounted(true);
    };
    const tm = setTimeout(sync, 0);
    window.addEventListener("student-academy-update", sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelled = true;
      clearTimeout(tm);
      window.removeEventListener("student-academy-update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const countryValue = state.countryId ?? "";
  const overall = getOverallCompletion();
  const academyLevel = getAcademyLevel(state.xp);
  const streak = mounted ? getCurrentStreak() : 0;
  const weekly = useMemo(
    () => (mounted ? getWeeklyActivity(new Date(), locale) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mounted, state, locale],
  );
  const nextStep = getAcademyNextStep();

  // Derived for the deck / wall / leaderboard.
  const stageMarks = STAGE_ORDER.map((stage) => {
    const completion = getStageCompletion(stage);
    const unlocked = isStageUnlockedForPlay(stage);
    const quizDone = isStageQuizPassed(stage);
    const status: "complete" | "current" | "locked" | "unlocked" = quizDone
      ? "complete"
      : !unlocked
        ? "locked"
        : completion.completed > 0 || nextStep.type !== "complete"
          ? "current"
          : "unlocked";
    // Pick only one stage as "current" — the first non-complete unlocked one.
    return { stage, status, completion: completion.percent };
  });
  let foundCurrent = false;
  const journeyStages = stageMarks.map((m) => {
    if (m.status === "current" && !foundCurrent) {
      foundCurrent = true;
      return m;
    }
    if (m.status === "current") {
      return { ...m, status: m.completion === 0 ? ("unlocked" as const) : ("unlocked" as const) };
    }
    return m;
  });

  const achievementItems = STAGE_ORDER.map((stage) => ({
    stage,
    earned: state.badges.includes(stage),
    percent: getStageCompletion(stage).percent,
  }));
  const earnedBadges = achievementItems.filter((i) => i.earned).length;

  const nextBadgeStage =
    nextStep.type === "lesson" || nextStep.type === "quiz" ? nextStep.stage : null;
  const nextBadgeRemaining = nextBadgeStage
    ? getStageCompletion(nextBadgeStage).total -
      getStageCompletion(nextBadgeStage).completed
    : 0;

  const country = state.countryId
    ? tRegions(state.countryId as RegionSlug)
    : tL8("leaderboardCountryFallback");

  const allCleared = STAGE_ORDER.every((s) => isStageQuizPassed(s));

  const estimatedMinutes =
    nextStep.type === "lesson" ? nextStep.module.durationMin : 5;

  return (
    <>
      {/* Break out of the mobile-shell on desktop. */}
      <AcademyShellOptOut />

      <div className="space-y-7 md:space-y-10">
        {/* ===== HERO ============================================== */}
        <Hero
          xp={state.xp}
          level={academyLevel.level}
          levelProgress={academyLevel.progressPercent}
          xpToNext={academyLevel.nextLevelXp}
          isMaxLevel={academyLevel.level >= 10}
          streak={streak}
          badges={earnedBadges}
          totalBadges={STAGE_ORDER.length}
          lessonsDone={overall.completed}
          totalLessons={overall.total}
          weekly={weekly}
          mounted={mounted}
          nextStepHref={nextStep.type === "complete" ? "/students" : nextStep.href}
        />

        {/* ===== SAFETY DISCLAIMER ================================ */}
        <p className="rounded-2xl border border-[var(--color-brand-200)] bg-[var(--color-accent-soft)] p-4 text-sm leading-relaxed text-[var(--color-accent-text)] shadow-1">
          {t("hub.disclaimer")}
        </p>

        {/* ===== MISSION DECK ====================================== */}
        <MissionDeck
          nextStep={nextStep}
          streak={streak}
          earnedBadges={earnedBadges}
          totalStages={STAGE_ORDER.length}
          nextBadgeStage={nextBadgeStage}
          nextBadgeRemaining={Math.max(0, nextBadgeRemaining)}
          estimatedMinutes={estimatedMinutes}
        />

        {/* ===== JOURNEY MAP ======================================= */}
        <section className="overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-gradient-to-br from-[var(--color-cream-50)] via-white to-[var(--color-brand-50)] p-5 shadow-1 md:p-8">
          <header className="mb-5 flex flex-col gap-2 md:mb-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--color-brand-500)" }}
                />
                {tL8("journeySubtitle")}
              </p>
              <h2 className="font-editorial mt-2 text-2xl text-[var(--color-text-primary)] md:text-3xl">
                {tL8("journeyTitle")}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <WhatsInsideChip
                icon={Stethoscope}
                label={tL8("whatsInsideFirstAid")}
              />
              <WhatsInsideChip
                icon={ShieldCheck}
                label={tL8("whatsInsideSTI")}
              />
              <WhatsInsideChip icon={Syringe} label={tL8("whatsInsideVaccines")} />
              <WhatsInsideChip icon={Sparkles} label={tL8("whatsInsideMyths")} />
            </div>
          </header>

          <JourneyMap stages={journeyStages} />

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {STAGE_ORDER.map((stage, i) => (
              <StageCard key={stage} stage={stage} index={i} />
            ))}
          </div>
        </section>

        {/* ===== ACHIEVEMENTS + LEADERBOARD ======================== */}
        <section className="grid gap-5 md:grid-cols-[1.2fr_1fr] md:gap-6">
          <AchievementWall items={achievementItems} />
          <Leaderboard yourXp={state.xp} country={country} />
        </section>

        {/* ===== DIPLOMA PREVIEW =================================== */}
        <DiplomaPreview
          earnedStages={earnedBadges}
          totalStages={STAGE_ORDER.length}
          unlocked={allCleared}
        />

        {/* ===== COUNTRY + STUCK CTA =============================== */}
        <section className="grid gap-5 md:grid-cols-[1fr_0.9fr] md:gap-6">
          <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-1 md:p-6">
            <label
              htmlFor="academy-country-select"
              className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]"
            >
              <MapPin className="lucide h-4 w-4" strokeWidth={1.75} />
              {tL8("countryTitle")}
            </label>
            <p className="mb-3 mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
              {tL8("countryHint")}
            </p>
            <select
              id="academy-country-select"
              className="w-full rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] transition focus:border-[var(--color-accent)] focus:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              value={countryValue}
              onChange={(e) => {
                const v = e.target.value || null;
                setCountryId(v);
                setState(readAcademyState());
              }}
            >
              <option value="">{t("hub.countryPlaceholder")}</option>
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.flag} {tRegions(r.id as RegionSlug)}
                </option>
              ))}
            </select>
            {state.countryId && getRegion(state.countryId) && (
              <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
                {t("hub.countryContext", {
                  country: tRegions(state.countryId as RegionSlug),
                })}
              </p>
            )}
          </div>

          <Link
            href="/chat"
            className="group relative overflow-hidden rounded-3xl bg-[var(--color-ink-900)] p-5 text-white shadow-3 transition-all hover:-translate-y-0.5 hover:shadow-4 md:p-6"
            style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-30 blur-3xl"
              style={{ background: "var(--color-brand-500)" }}
            />
            <div className="relative">
              <Compass className="lucide h-5 w-5 text-[var(--color-ember-300)]" strokeWidth={1.85} />
              <p className="font-editorial mt-3 text-2xl leading-tight">
                {tL8("ctaBanner")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--color-ember-300)]">
                {tL8("ctaBannerLink")}
                <ArrowRight className="lucide h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
              </span>
            </div>
          </Link>
        </section>
      </div>
    </>
  );
}

/* ============================================================
 *  Hero — split-screen editorial with live stat panel
 * ============================================================ */

function Hero({
  xp,
  level,
  levelProgress,
  xpToNext,
  isMaxLevel,
  streak,
  badges,
  totalBadges,
  lessonsDone,
  totalLessons,
  weekly,
  mounted,
  nextStepHref,
}: {
  xp: number;
  level: number;
  levelProgress: number;
  xpToNext: number;
  isMaxLevel: boolean;
  streak: number;
  badges: number;
  totalBadges: number;
  lessonsDone: number;
  totalLessons: number;
  weekly: { day: string; active: boolean; date: string }[];
  mounted: boolean;
  nextStepHref: string;
}) {
  const t = useTranslations("studentHealth");
  const tL8 = useTranslations("studentHealth.l8");

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-3 md:rounded-[36px]">
      {/* Atmospheric backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 100% 0%, rgba(99,102,241,0.10) 0%, transparent 60%), radial-gradient(60% 50% at 0% 100%, rgba(110,140,94,0.08) 0%, transparent 60%), radial-gradient(50% 50% at 100% 100%, rgba(251,191,36,0.06) 0%, transparent 60%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 grain-overlay opacity-60" />

      <div className="relative grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
        {/* Left: editorial pitch */}
        <div className="p-6 md:p-10">
          <span className="eyebrow">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--color-ember-500)" }}
            />
            <GraduationCap className="lucide h-3.5 w-3.5" strokeWidth={1.9} />
            {tL8("eyebrow")}
          </span>

          <h1
            className="font-editorial mt-4 font-medium leading-[0.96] text-[var(--color-text-primary)] md:mt-5"
            style={{
              fontSize: "clamp(2rem, 1.3rem + 3.5vw, 3.75rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {tL8("heroTitle1")}{" "}
            <span className="italic text-[var(--color-brand-700)]">
              {tL8("heroTitle2")}
            </span>
            <br />
            {tL8("heroTitle3")}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
            {tL8("heroLead")}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={nextStepHref}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-text-primary)] px-5 py-3 text-sm font-extrabold text-[var(--color-bg-canvas)] shadow-2 transition-all hover:shadow-3 active:scale-[0.97]"
            >
              <PlayCircle className="lucide h-4 w-4" strokeWidth={2} />
              {tL8("heroPrimaryCta")}
            </Link>
            <a
              href="#journey"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-canvas)] px-5 py-3 text-sm font-extrabold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-text-primary)]"
            >
              {tL8("heroSecondaryCta")}
              <ChevronRight className="lucide h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>

        {/* Right: live stat panel */}
        <div className="relative border-t border-[var(--color-border-subtle)] bg-gradient-to-br from-[var(--color-cream-50)] via-white to-[var(--color-brand-50)] p-6 md:border-t-0 md:border-l md:p-8">
          <div className="relative mb-6 aspect-[21/11] w-full overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] shadow-2 md:aspect-[16/10]">
            <Image
              src="/images/ai/ai-spot-academy.png"
              alt={tL8("heroStatPanelImageAlt")}
              fill
              className="object-cover object-[center_35%]"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          {/* Level + XP */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
                {tL8("statLevel")}
              </div>
              <div
                className="font-editorial mt-0.5 leading-none text-[var(--color-text-primary)]"
                style={{ fontSize: "clamp(2.5rem, 1.8rem + 2.5vw, 3.5rem)" }}
              >
                {mounted ? <CountUp to={level} duration={700} /> : "—"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
                {tL8("statXp")}
              </div>
              <div className="font-display text-2xl font-extrabold leading-none text-[var(--color-brand-700)]">
                {mounted ? <CountUp to={xp} duration={900} /> : "—"}
              </div>
            </div>
          </div>

          {/* Level progress */}
          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-ember-500)] via-[var(--color-brand-500)] to-[var(--color-brand-700)] transition-all"
                style={{
                  width: `${isMaxLevel ? 100 : levelProgress}%`,
                  transitionTimingFunction: "var(--ease-emphasized)",
                }}
              />
            </div>
            <p className="mt-1 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
              {isMaxLevel
                ? t("hub.maxLevel")
                : t("hub.nextLevelXp", { xp: xpToNext })}
            </p>
          </div>

          {/* Stat grid */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <StatPill
              label={tL8("statStreak")}
              value={mounted ? <CountUp to={streak} duration={800} /> : "—"}
              icon={Flame}
              tone="ember"
            />
            <StatPill
              label={tL8("statBadges")}
              value={
                mounted ? (
                  <>
                    <CountUp to={badges} duration={700} />/{totalBadges}
                  </>
                ) : (
                  "—"
                )
              }
              icon={Sparkles}
              tone="brand"
            />
            <StatPill
              label={tL8("statLessons")}
              value={
                mounted ? (
                  <>
                    <CountUp to={lessonsDone} duration={900} />/{totalLessons}
                  </>
                ) : (
                  "—"
                )
              }
              icon={CheckCircle2}
              tone="sage"
            />
          </div>

          {/* Weekly streak strip */}
          {mounted && weekly.length > 0 && (
            <div className="mt-5 flex items-center justify-between gap-1.5 rounded-2xl bg-white px-3 py-2.5 shadow-1 hairline">
              {weekly.map((d, i) => (
                <div key={d.date} className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      "h-6 w-6 rounded-md text-[9px] font-extrabold flex items-center justify-center transition-all",
                      d.active
                        ? "bg-gradient-to-br from-[var(--color-ember-400)] to-[var(--color-ember-600)] text-white shadow-1"
                        : "bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hairline",
                    )}
                  >
                    {d.active ? "✓" : ""}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-extrabold uppercase",
                      i === weekly.length - 1
                        ? "text-[var(--color-brand-700)]"
                        : "text-[var(--color-text-muted)]",
                    )}
                  >
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatPill({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: "ember" | "brand" | "sage";
}) {
  const styles = {
    ember: "text-[var(--color-ember-700)]",
    brand: "text-[var(--color-brand-700)]",
    sage: "text-[var(--color-sage-700)]",
  } as const;
  return (
    <div className="rounded-2xl bg-white px-3 py-2.5 shadow-1 hairline">
      <div className="flex items-center justify-between">
        <Icon className={`lucide h-3.5 w-3.5 ${styles[tone]}`} strokeWidth={2} />
      </div>
      <div className="font-display mt-1 text-lg font-extrabold leading-none text-[var(--color-text-primary)]">
        {value}
      </div>
      <div className="mt-0.5 text-[9px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
        {label}
      </div>
    </div>
  );
}

/* ============================================================
 *  StageCard — rich card per stage with module list
 * ============================================================ */

function StageCard({ stage, index }: { stage: StageId; index: number }) {
  const t = useTranslations("studentHealth");
  const modules = getModulesByStage(stage);
  const done = getCompletedModuleIdSet();
  const completion = getStageCompletion(stage);
  const unlocked = isStageUnlockedForPlay(stage);
  const allDone = allStageModulesCompleted(stage);
  const quizDone = isStageQuizPassed(stage);
  const locked = !unlocked;

  const statusKey = locked
    ? "workflow.lockedStatus"
    : quizDone
      ? "workflow.completeStatus"
      : allDone
        ? "workflow.quizReadyStatus"
        : "workflow.inProgressStatus";
  const statusTone = locked
    ? "muted"
    : quizDone
      ? "success"
      : allDone
        ? "warning"
        : "info";

  return (
    <article
      id={index === 0 ? "journey" : undefined}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-[var(--color-surface)] shadow-1 transition-all duration-300",
        locked
          ? "border-[var(--color-border-subtle)] opacity-90"
          : "border-[var(--color-border-subtle)] hover:-translate-y-0.5 hover:shadow-3",
      )}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
    >
      {/* Visual top */}
      <div className="relative">
        <StudentAcademyIllustration
          visual={STAGE_VISUALS[stage]}
          title={t(`stages.${stage}`)}
          variant="thumb"
          className="h-32 rounded-none border-0 shadow-none"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-primary)] shadow-1 backdrop-blur">
          {t(`stages.${stage}`)}
          <span aria-hidden className="text-[var(--color-text-muted)]">
            · {String(index + 1).padStart(2, "0")}
          </span>
        </span>
        <span
          className={cn(
            "absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest shadow-1",
            statusTone === "muted"
              ? "bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]"
              : statusTone === "success"
                ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)]"
                : statusTone === "warning"
                  ? "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]"
                  : "bg-[var(--color-brand-100)] text-[var(--color-brand-800)]",
          )}
        >
          {locked && <Lock className="lucide h-3 w-3" strokeWidth={2} />}
          {t(statusKey)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className="font-display text-lg font-extrabold leading-tight tracking-tight text-[var(--color-text-primary)]"
          style={{ letterSpacing: "-0.015em" }}
        >
          {t(`stages.${stage}`)}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
          {t(`stages.${stage}Desc`)}
        </p>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
            <span>
              {completion.completed}/{completion.total} {t("hub.modulesInStage")}
            </span>
            <span>{completion.percent}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                quizDone
                  ? "bg-gradient-to-r from-[var(--color-success-accent)] to-[var(--color-success-accent)]"
                  : "bg-gradient-to-r from-[var(--color-brand-400)] to-[var(--color-brand-700)]",
              )}
              style={{ width: `${completion.percent}%` }}
            />
          </div>
        </div>

        {locked && (
          <p className="mt-3 rounded-xl border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] px-3 py-2 text-[11px] leading-relaxed text-[var(--color-warning-text)]">
            {t("progress.stageLocked")}
          </p>
        )}

        {/* Module list */}
        <ul className="mt-4 flex flex-col gap-1.5">
          {modules.map((mod, i) => {
            const completed = done.has(mod.id);
            const href = locked ? "#" : `/students/${stage}/${mod.id}`;
            return (
              <li key={mod.id}>
                <Link
                  href={href}
                  onClick={(e) => {
                    if (locked) e.preventDefault();
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-2.5 py-2 transition-all duration-200",
                    locked
                      ? "pointer-events-none cursor-not-allowed text-[var(--color-text-muted)]"
                      : "hover:bg-[var(--color-surface-subtle)]",
                  )}
                  aria-disabled={locked}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold",
                      completed
                        ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)]"
                        : locked
                          ? "bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hairline"
                          : "bg-[var(--color-brand-50)] text-[var(--color-brand-700)] hairline",
                    )}
                  >
                    {completed ? <CheckCircle2 className="lucide h-3.5 w-3.5" strokeWidth={2.4} /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-bold text-[var(--color-text-primary)]">
                    {t(`modules.${stage}.${mod.id}.title`)}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
                    {mod.durationMin}m
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom CTA */}
        <div className="mt-4 border-t border-[var(--color-border-subtle)] pt-4">
          {allDone && !quizDone && unlocked && (
            <Link
              href={`/students/quiz/${stage}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--color-brand-700)] px-4 py-2.5 text-xs font-extrabold text-white shadow-1 transition-all active:scale-[0.97]"
            >
              <Target className="lucide h-3.5 w-3.5" strokeWidth={2} />
              {t("hub.takeStageQuiz")}
            </Link>
          )}
          {quizDone && (
            <div className="flex items-center gap-2 rounded-full border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-3 py-2 text-xs font-extrabold text-[var(--color-success-text)]">
              <Sparkles className="lucide h-3.5 w-3.5" strokeWidth={1.85} />
              {t("hub.stageComplete")}
            </div>
          )}
          {!allDone && !locked && (
            <p className="text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
              {t("hub.quizLocked")}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function WhatsInsideChip({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-secondary)] shadow-1 hairline">
      <Icon className="lucide h-3.5 w-3.5 text-[var(--color-brand-700)]" strokeWidth={1.95} />
      {label}
    </span>
  );
}
