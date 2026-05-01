"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight, Lock, MapPin, Sparkles, Trophy } from "lucide-react";
import {
  getModulesByStage,
  STUDENT_HUB_THEME,
  STAGE_ORDER,
  type StageId,
} from "@/data/student-health";
import { getRegion, REGIONS, type RegionSlug } from "@/data/regions";
import {
  allStageModulesCompleted,
  isStageQuizPassed,
  isStageUnlockedForPlay,
  readAcademyState,
  setCountryId,
  type StudentAcademyState,
} from "@/lib/student-health-progress";

export function StudentAcademyHub() {
  const t = useTranslations("studentHealth");
  const tRegions = useTranslations("regions");
  const [state, setState] = useState<StudentAcademyState>(() => readAcademyState());

  useEffect(() => {
    const sync = () => setState(readAcademyState());
    sync();
    window.addEventListener("student-academy-update", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("student-academy-update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const countryValue = state.countryId ?? "";

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl border p-4 text-sm leading-relaxed text-indigo-900"
        style={{
          backgroundColor: STUDENT_HUB_THEME.bg,
          borderColor: STUDENT_HUB_THEME.borderColor,
        }}
      >
        {t("hub.disclaimer")}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          <MapPin className="h-4 w-4" />
          {t("hub.countryLabel")}
        </label>
        <p className="mb-2 text-xs text-gray-500">{t("hub.countryHint")}</p>
        <select
          className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-800"
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
          <p className="mt-2 text-xs text-gray-600">
            {t("hub.countryContext", {
              country: tRegions(state.countryId as RegionSlug),
            })}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-bold text-gray-700">
            {t("hub.xpLabel")}: <span className="text-indigo-600">{state.xp}</span>
          </span>
        </div>
        <div className="flex flex-1 flex-wrap gap-2">
          <span className="w-full text-xs font-bold uppercase tracking-wider text-gray-400">
            {t("hub.badgesTitle")}
          </span>
          {STAGE_ORDER.map((sid) => {
            const has = state.badges.includes(sid);
            return (
              <span
                key={sid}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                  has ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-400"
                }`}
              >
                <Trophy className="h-3.5 w-3.5" />
                {has ? t(`hub.badge${capitalize(sid)}`) : t(`stages.${sid}`)}
              </span>
            );
          })}
        </div>
      </div>

      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
        {t("hub.stageMapTitle")}
      </h2>

      <div className="flex flex-col gap-6">
        {STAGE_ORDER.map((stage) => (
          <StageBlock key={stage} stage={stage} />
        ))}
      </div>

      {STAGE_ORDER.every((s) => isStageQuizPassed(s)) && (
        <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-900">
          {t("hub.allStagesComplete")}
        </p>
      )}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function StageBlock({ stage }: { stage: StageId }) {
  const t = useTranslations("studentHealth");
  const modules = getModulesByStage(stage);
  const unlocked = isStageUnlockedForPlay(stage);
  const allDone = allStageModulesCompleted(stage);
  const quizDone = isStageQuizPassed(stage);
  const locked = !unlocked;

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        locked ? "border-gray-200 bg-gray-50 opacity-80" : "border-gray-100 bg-white"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            {locked && <Lock className="h-5 w-5 text-gray-400" />}
            {t(`stages.${stage}`)}
          </h3>
          <p className="text-sm text-gray-500">{t(`stages.${stage}Desc`)}</p>
        </div>
      </div>

      {locked && (
        <p className="mb-3 text-sm text-amber-800">{t("progress.stageLocked")}</p>
      )}

      <div className="flex flex-col gap-2">
        {modules.map((mod) => (
          <Link
            key={mod.id}
            href={locked ? "#" : `/students/${stage}/${mod.id}`}
            onClick={(e) => {
              if (locked) e.preventDefault();
            }}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
              locked
                ? "pointer-events-none cursor-not-allowed border-gray-100 bg-gray-100 text-gray-400"
                : "border-gray-100 bg-white hover:shadow-md active:scale-[0.99]"
            }`}
            aria-disabled={locked}
          >
            <span className="text-2xl">{mod.emoji}</span>
            <span className="flex-1 font-semibold text-gray-800">
              {t(`modules.${stage}.${mod.id}.title`)}
            </span>
            {!locked && <ChevronRight className="h-5 w-5 text-gray-300" />}
          </Link>
        ))}
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        {!allDone && (
          <p className="text-xs text-gray-500">{t("hub.quizLocked")}</p>
        )}
        {allDone && !quizDone && unlocked && (
          <Link
            href={`/students/quiz/${stage}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)" }}
          >
            {t("hub.takeStageQuiz")}
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
        {allDone && !quizDone && !unlocked && (
          <p className="text-xs text-gray-500">{t("progress.stageLocked")}</p>
        )}
        {quizDone && (
          <p className="flex items-center gap-2 text-sm font-semibold text-green-700">
            <Sparkles className="h-4 w-4" />
            {t("hub.stageComplete")}
          </p>
        )}
      </div>
    </div>
  );
}
