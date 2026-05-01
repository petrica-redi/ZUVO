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
  const [state, setState] = useState<StudentAcademyState>(() => readAcademyState());
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
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-violet-50/70 p-4 text-sm leading-relaxed text-indigo-900 shadow-sm">
        {t("hub.disclaimer")}
      </div>

      {/* Mission dashboard hero */}
      <Card variant="elevated" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, #C7D2FE 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-24 h-56 w-56 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #FED7AA 0%, transparent 70%)" }}
        />

        <div className="relative p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Badge variant="premium" className="mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                {t("hub.levelLabel", { level: academyLevel.level })}
              </Badge>
              <h2 className="text-xl font-black tracking-tight text-gray-900 md:text-2xl">
                {t("hub.commandCenterTitle")}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {t("hub.commandCenterSubtitle", {
                  completed: overall.completed,
                  total: overall.total,
                })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="rounded-2xl bg-amber-50 px-4 py-2 text-right ring-1 ring-amber-100">
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                  {t("hub.xpLabel")}
                </div>
                <div className="text-2xl font-black leading-tight text-amber-600">{state.xp}</div>
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
              icon={<Flame className="h-5 w-5 text-amber-500" />}
            />
            <div className="flex items-center gap-1 rounded-2xl bg-white px-3 py-2 ring-1 ring-gray-100">
              {weekly.map((d, i) => (
                <div key={d.date} className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      "h-7 w-7 rounded-lg text-[10px] font-black flex items-center justify-center transition",
                      d.active
                        ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm"
                        : "bg-gray-50 text-gray-300 ring-1 ring-gray-100",
                    )}
                    aria-label={d.active ? t("hub.dayActive") : t("hub.dayInactive")}
                  >
                    {d.active ? "✓" : ""}
                  </span>
                  <span className={cn("text-[9px] font-black", i === weekly.length - 1 ? "text-indigo-600" : "text-gray-400")}>
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {t("hub.badgesTitle")}
            </span>
            {STAGE_ORDER.map((sid) => {
              const has = state.badges.includes(sid);
              return (
                <Badge key={sid} variant={has ? "premium" : "muted"}>
                  <Trophy className="h-3 w-3" />
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
        className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/25"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)" }}
        />
        <div className="relative p-6">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-white/15 text-white ring-white/20">
              <Compass className="h-3.5 w-3.5" />
              {t("workflow.nextMission")}
            </Badge>
            {nextStep.type === "lesson" && (
              <Badge variant="default" className="bg-white/10 text-white ring-white/15">
                {t(`stages.${nextStep.stage}`)}
              </Badge>
            )}
          </div>
          <h2 className="mt-3 text-2xl font-black leading-tight">
            {nextStep.type === "lesson"
              ? t("workflow.continueLesson", {
                  stage: t(`stages.${nextStep.stage}`),
                  title: t(`modules.${nextStep.stage}.${nextStep.module.id}.title`),
                })
              : nextStep.type === "quiz"
                ? t("workflow.takeQuiz", { stage: t(`stages.${nextStep.stage}`) })
                : t("workflow.finishedTitle")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-indigo-100">
            {nextStep.type === "complete"
              ? t("workflow.finishedBody")
              : t("workflow.nextMissionBody")}
          </p>
          <Link
            href={nextStep.href}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-black text-indigo-700 shadow-lg shadow-black/10 transition active:scale-[0.97] sm:w-auto"
          >
            <PlayCircle className="h-5 w-5" />
            {nextStep.type === "lesson"
              ? t("workflow.startMission")
              : nextStep.type === "quiz"
                ? t("workflow.startQuiz")
                : t("workflow.reviewPath")}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </Card>

      {/* Country picker */}
      <Card>
        <div className="p-5">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <MapPin className="h-4 w-4" />
            {t("hub.countryLabel")}
          </label>
          <p className="mb-3 mt-1 text-xs leading-relaxed text-gray-500">{t("hub.countryHint")}</p>
          <select
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
            <p className="mt-3 text-xs text-gray-600">
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
          <Target className="h-4 w-4 text-indigo-500" />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500">
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
        <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 text-center shadow-md">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <p className="text-sm font-black text-emerald-900">{t("hub.allStagesComplete")}</p>
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
        "relative overflow-hidden transition",
        locked && "bg-gray-50/80 opacity-90",
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
            <Badge variant="default" className="bg-white/90 text-gray-900 shadow-sm">
              Stage {String(index + 1).padStart(2, "0")}
            </Badge>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-gray-900">
                {locked && <Lock className="h-4 w-4 text-gray-400" />}
                {t(`stages.${stage}`)}
              </h3>
              <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
                {t(`stages.${stage}Desc`)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <Badge variant={statusVariant === "muted" ? "muted" : statusVariant === "success" ? "success" : statusVariant === "warning" ? "warning" : "info"}>
                {statusText}
              </Badge>
              <span className="text-[11px] font-bold text-gray-500">
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
            <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800">
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
                    "group flex items-center gap-3 rounded-2xl border p-3 transition-all",
                    locked
                      ? "pointer-events-none cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                      : "border-gray-100 bg-white hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/10 active:scale-[0.99]",
                  )}
                  aria-disabled={locked}
                >
                  <StudentAcademyIllustration
                    visual={mod.visual}
                    title={t(`modules.${stage}.${mod.id}.title`)}
                    compact
                    className="h-12 w-12 flex-shrink-0 rounded-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span>L{String(i + 1).padStart(2, "0")}</span>
                      <span aria-hidden>·</span>
                      <span>{mod.durationMin}m</span>
                    </div>
                    <div className="truncate text-sm font-bold text-gray-900">
                      {t(`modules.${stage}.${mod.id}.title`)}
                    </div>
                  </div>
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />
                  ) : !locked ? (
                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            {!allDone && (
              <p className="text-xs leading-relaxed text-gray-500">{t("hub.quizLocked")}</p>
            )}
            {allDone && !quizDone && unlocked && (
              <Link
                href={`/students/quiz/${stage}`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 py-3 text-sm font-black text-white shadow-md shadow-indigo-500/20 transition active:scale-[0.97]"
              >
                <Target className="h-4 w-4" />
                {t("hub.takeStageQuiz")}
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
            {allDone && !quizDone && !unlocked && (
              <p className="text-xs text-gray-500">{t("progress.stageLocked")}</p>
            )}
            {quizDone && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">
                <Sparkles className="h-4 w-4" />
                {t("hub.stageComplete")}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
