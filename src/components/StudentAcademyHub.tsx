"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  ChevronRight,
  Compass,
  Flame,
  Lock,
  MapPin,
  PlayCircle,
  Sparkles,
  Target,
  Trophy,
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
import { Badge, Card, Progress, Stat } from "@/components/ui";
import { cn } from "@/components/ui/cn";

export function StudentAcademyHub() {
  const t = useTranslations("studentHealth");
  const tRegions = useTranslations("regions");
  const [state, setState] = useState<StudentAcademyState>(() => defaultAcademyState());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sync = () => {
      if (cancelled) return;
      setState(readAcademyState());
      setMounted(true);
    };
    // Schedule first read on next tick to avoid render-cascade lint warning.
    const t = setTimeout(sync, 0);
    window.addEventListener("student-academy-update", sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelled = true;
      clearTimeout(t);
      window.removeEventListener("student-academy-update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const countryValue = state.countryId ?? "";
  const overall = getOverallCompletion();
  const academyLevel = getAcademyLevel(state.xp);
  const streak = mounted ? getCurrentStreak() : 0;
  const weekly = useMemo(
    () => (mounted ? getWeeklyActivity() : []),
    // state is referenced indirectly through getWeeklyActivity localStorage read.
    // Including it forces recompute when the academy state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mounted, state],
  );
  const nextStep = getAcademyNextStep();
  const allCleared = STAGE_ORDER.every((s) => isStageQuizPassed(s));

  return (
    <div className="space-y-6">
      {/* Safety disclaimer */}
      <div className="rounded-3xl border border-[var(--color-brand-200)] bg-[var(--color-accent-soft)] p-4 text-sm leading-relaxed text-[var(--color-accent-text)] shadow-1">
        {t("hub.disclaimer")}
      </div>

      {/* Mission dashboard hero */}
      <Card variant="elevated" className="relative overflow-hidden gradient-aurora grain-overlay">
        <div className="relative p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Badge variant="premium" className="mb-3">
                <Sparkles className="lucide h-3.5 w-3.5" strokeWidth={1.75} />
                {t("hub.levelLabel", { level: academyLevel.level })}
              </Badge>
              <h2
                className="font-display text-xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-2xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                {t("hub.commandCenterTitle")}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {t("hub.commandCenterSubtitle", {
                  completed: overall.completed,
                  total: overall.total,
                })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="rounded-2xl bg-gradient-to-br from-[var(--color-ember-50)] to-[var(--color-ember-100)] px-4 py-2 text-right ring-1 ring-[var(--color-ember-200)] shadow-1">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-ember-700)]">
                  {t("hub.xpLabel")}
                </div>
                <div className="font-display text-2xl font-extrabold leading-tight text-[var(--color-ember-600)]">
                  {state.xp}
                </div>
              </div>
            </div>
          </div>

          {/* Progress rings */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Progress
              value={overall.percent}
              variant="default"
              size="md"
              label={t("hub.overallProgress")}
              hint={`${overall.percent}%`}
            />
            <Progress
              value={academyLevel.progressPercent}
              variant="amber"
              size="md"
              label={t("hub.levelProgress")}
              hint={
                academyLevel.level >= 10
                  ? t("hub.maxLevel")
                  : t("hub.nextLevelXp", { xp: academyLevel.nextLevelXp })
              }
            />
          </div>

          {/* Streak strip + weekly cells */}
          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Stat
              label={t("hub.streakLabel")}
              value={mounted ? `${streak} ${streak === 1 ? t("hub.streakUnitOne") : t("hub.streakUnitMany")}` : "—"}
              hint={t("hub.streakHint")}
              tone="amber"
              icon={<Flame className="lucide h-5 w-5 text-[var(--color-ember-500)]" strokeWidth={1.75} />}
            />
            <div className="flex items-center gap-1 rounded-2xl bg-[var(--color-surface)] px-3 py-2 hairline">
              {weekly.map((d, i) => (
                <div key={d.date} className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      "h-7 w-7 rounded-lg text-[10px] font-extrabold flex items-center justify-center transition-all",
                      d.active
                        ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-1"
                        : "bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hairline",
                    )}
                    aria-label={d.active ? t("hub.dayActive") : t("hub.dayInactive")}
                  >
                    {d.active ? "✓" : ""}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-extrabold",
                      i === weekly.length - 1
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-text-muted)]",
                    )}
                  >
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
              {t("hub.badgesTitle")}
            </span>
            {STAGE_ORDER.map((sid) => {
              const has = state.badges.includes(sid);
              return (
                <Badge key={sid} variant={has ? "premium" : "muted"}>
                  <Trophy className="lucide h-3 w-3" strokeWidth={1.75} />
                  {has ? t(`hub.badge${capitalize(sid)}`) : t(`stages.${sid}`)}
                </Badge>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Next mission CTA */}
      <Card
        variant="elevated"
        className="relative overflow-hidden border-0 gradient-brand grain-overlay text-white shadow-brand"
      >
        <div className="relative p-6">
          <div className="flex items-center gap-2">
            <Badge
              variant="default"
              className="border-white/15 bg-white/15 text-white ring-white/20"
            >
              <Compass className="lucide h-3.5 w-3.5" strokeWidth={1.75} />
              {t("workflow.nextMission")}
            </Badge>
            {nextStep.type === "lesson" && (
              <Badge
                variant="default"
                className="border-white/10 bg-white/10 text-white ring-white/15"
              >
                {t(`stages.${nextStep.stage}`)}
              </Badge>
            )}
          </div>
          <p
            className="mt-3 font-display text-2xl font-extrabold leading-tight"
            style={{ letterSpacing: "-0.025em" }}
          >
            {nextStep.type === "lesson"
              ? t("workflow.continueLesson", {
                  stage: t(`stages.${nextStep.stage}`),
                  title: t(`modules.${nextStep.stage}.${nextStep.module.id}.title`),
                })
              : nextStep.type === "quiz"
                ? t("workflow.takeQuiz", { stage: t(`stages.${nextStep.stage}`) })
                : t("workflow.finishedTitle")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">
            {nextStep.type === "complete"
              ? t("workflow.finishedBody")
              : t("workflow.nextMissionBody")}
          </p>
          <Link
            href={nextStep.href}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-extrabold text-[var(--color-brand-700)] shadow-3 transition-all hover:shadow-4 active:scale-[0.97] sm:w-auto"
          >
            <PlayCircle className="lucide h-5 w-5" strokeWidth={2} />
            {nextStep.type === "lesson"
              ? t("workflow.startMission")
              : nextStep.type === "quiz"
                ? t("workflow.startQuiz")
                : t("workflow.reviewPath")}
            <ChevronRight className="lucide h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </Card>

      {/* Country picker */}
      <Card>
        <div className="p-5">
          <label className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
            <MapPin className="lucide h-4 w-4" strokeWidth={1.75} />
            {t("hub.countryLabel")}
          </label>
          <p className="mb-3 mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {t("hub.countryHint")}
          </p>
          <select
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
      </Card>

      {/* Stage map */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Target className="lucide h-4 w-4 text-[var(--color-accent)]" strokeWidth={1.75} />
          <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
            {t("hub.stageMapTitle")}
          </h2>
        </div>
        <div className="flex flex-col gap-5">
          {STAGE_ORDER.map((stage, i) => (
            <StageBlock key={stage} stage={stage} index={i} />
          ))}
        </div>
      </div>

      {allCleared && (
        <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 text-center shadow-3">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-3">
            <Trophy className="lucide h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <p className="font-display text-sm font-extrabold text-emerald-900">
            {t("hub.allStagesComplete")}
          </p>
        </div>
      )}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function StageBlock({ stage, index }: { stage: StageId; index: number }) {
  const t = useTranslations("studentHealth");
  const modules = getModulesByStage(stage);
  const done = getCompletedModuleIdSet();
  const completion = getStageCompletion(stage);
  const unlocked = isStageUnlockedForPlay(stage);
  const allDone = allStageModulesCompleted(stage);
  const quizDone = isStageQuizPassed(stage);
  const locked = !unlocked;
  const statusVariant = locked
    ? "muted"
    : quizDone
      ? "success"
      : allDone
        ? "warning"
        : "info";
  const statusText = locked
    ? t("workflow.lockedStatus")
    : quizDone
      ? t("workflow.completeStatus")
      : allDone
        ? t("workflow.quizReadyStatus")
        : t("workflow.inProgressStatus");

  return (
    <Card
      variant={locked ? "outline" : "elevated"}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        locked && "bg-[var(--color-surface-subtle)]/80 opacity-90",
      )}
    >
      <div className="grid gap-0 sm:grid-cols-[160px_1fr]">
        <div className="relative">
          <StudentAcademyIllustration
            visual={STAGE_VISUALS[stage]}
            title={t(`stages.${stage}`)}
            variant="thumb"
            className="h-full min-h-[140px] rounded-none rounded-l-3xl sm:min-h-full"
          />
          <div className="absolute left-3 top-3">
            <Badge
              variant="default"
              className="bg-white/95 text-[var(--color-text-primary)] shadow-1 backdrop-blur"
            >
              Stage {String(index + 1).padStart(2, "0")}
            </Badge>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-[var(--color-text-primary)]"
                style={{ letterSpacing: "-0.02em" }}
              >
                {locked && (
                  <Lock className="lucide h-4 w-4 text-[var(--color-text-muted)]" strokeWidth={1.75} />
                )}
                {t(`stages.${stage}`)}
                {locked && <span className="sr-only"> {t("a11yLocked")}</span>}
              </h3>
              <p className="mt-0.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {t(`stages.${stage}Desc`)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <Badge variant={statusVariant === "muted" ? "muted" : statusVariant === "success" ? "success" : statusVariant === "warning" ? "warning" : "info"}>
                {statusText}
              </Badge>
              <span className="text-[11px] font-bold text-[var(--color-text-secondary)]">
                {completion.completed}/{completion.total} {t("hub.modulesInStage")}
              </span>
            </div>
          </div>

          <Progress
            value={completion.percent}
            variant={quizDone ? "success" : "default"}
            size="sm"
            className="mb-4"
          />

          {locked && (
            <div className="mb-4 rounded-2xl border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] p-3 text-xs text-[var(--color-warning-text)]">
              {t("progress.stageLocked")}
            </div>
          )}

          <div className="flex flex-col gap-2">
            {modules.map((mod, i) => {
              const completed = done.has(mod.id);
              return (
                <Link
                  key={mod.id}
                  href={locked ? "#" : `/students/${stage}/${mod.id}`}
                  onClick={(e) => {
                    if (locked) e.preventDefault();
                  }}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl p-3 transition-all duration-200",
                    locked
                      ? "pointer-events-none cursor-not-allowed bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hairline"
                      : "card-interactive bg-[var(--color-surface)] hover:border-[var(--color-brand-200)]",
                  )}
                  style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
                  aria-disabled={locked}
                >
                  <StudentAcademyIllustration
                    visual={mod.visual}
                    title={t(`modules.${stage}.${mod.id}.title`)}
                    compact
                    className="h-12 w-12 flex-shrink-0 rounded-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
                      <span>L{String(i + 1).padStart(2, "0")}</span>
                      <span aria-hidden>·</span>
                      <span>{mod.durationMin}m</span>
                    </div>
                    <div className="truncate text-sm font-bold text-[var(--color-text-primary)]">
                      {t(`modules.${stage}.${mod.id}.title`)}
                    </div>
                  </div>
                  {completed ? (
                    <CheckCircle2
                      className="lucide h-5 w-5 flex-shrink-0 text-[var(--color-success-accent)]"
                      strokeWidth={1.75}
                    />
                  ) : !locked ? (
                    <ChevronRight
                      className="lucide h-5 w-5 flex-shrink-0 text-[var(--color-text-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                      strokeWidth={1.75}
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 border-t border-[var(--color-border-subtle)] pt-4">
            {!allDone && (
              <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {t("hub.quizLocked")}
              </p>
            )}
            {allDone && !quizDone && unlocked && (
              <Link
                href={`/students/quiz/${stage}`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand grain-overlay py-3 text-sm font-extrabold text-white shadow-brand transition-all active:scale-[0.97]"
              >
                <Target className="lucide h-4 w-4" strokeWidth={2} />
                {t("hub.takeStageQuiz")}
                <ChevronRight className="lucide h-4 w-4" strokeWidth={2} />
              </Link>
            )}
            {allDone && !quizDone && !unlocked && (
              <p className="text-xs text-[var(--color-text-secondary)]">
                {t("progress.stageLocked")}
              </p>
            )}
            {quizDone && (
              <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-3 py-2 text-sm font-bold text-[var(--color-success-text)]">
                <Sparkles className="lucide h-4 w-4" strokeWidth={1.75} />
                {t("hub.stageComplete")}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
