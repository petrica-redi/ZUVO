"use client";

import { useState, useRef } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, CheckCircle2, Flag, XCircle } from "lucide-react";
import {
  getModulesByStage,
  getNextStage,
  STAGE_QUIZZES,
  STAGE_QUIZ_PASS_PCT,
  studentHealthMessageKey,
  type StageId,
} from "@/data/student-health";
import {
  postProgressQuizComplete,
  recordQuizPass,
} from "@/lib/student-health-progress";

type Props = {
  stage: StageId;
};

export function StudentHealthStageQuiz({ stage }: Props) {
  const t = useTranslations("studentHealth");
  const defs = STAGE_QUIZZES[stage];
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const correctRef = useRef(0);
  const [showResult, setShowResult] = useState(false);
  const [resultSnapshot, setResultSnapshot] = useState<{
    correct: number;
    total: number;
    passed: boolean;
  } | null>(null);

  const q = defs[currentQ];
  const tk = (key: string) => t(studentHealthMessageKey(key));

  const handlePick = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.correctIndex) correctRef.current += 1;
  };

  const handleNext = () => {
    if (!answered) return;
    if (currentQ + 1 >= defs.length) {
      const prevCorrect = correctRef.current;
      const total = defs.length;
      const pct = Math.round((prevCorrect / total) * 100);
      const passed = pct >= STAGE_QUIZ_PASS_PCT;
      if (passed) {
        recordQuizPass(stage);
        postProgressQuizComplete(stage);
      }
      setResultSnapshot({ correct: prevCorrect, total, passed });
      setShowResult(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (showResult && resultSnapshot) {
    const { correct, total, passed } = resultSnapshot;
    const pct = Math.round((correct / total) * 100);
    const nextStage = getNextStage(stage);
    const nextStageModules = nextStage ? getModulesByStage(nextStage) : [];
    const nextHref =
      passed && nextStage && nextStageModules[0]
        ? `/students/${nextStage}/${nextStageModules[0].id}`
        : "/students";
    const nextLabel =
      passed && nextStage
        ? t("quiz.continueNextStage", { stage: t(`stages.${nextStage}`) })
        : t("quiz.continueHub");

    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="text-center">
          <span className="text-5xl">{passed ? "🏆" : "📚"}</span>
          <h2 className="mt-3 text-xl font-bold text-gray-900">
            {passed ? t("quiz.pass") : t("quiz.fail")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("quiz.scoreLine", { correct, total, pct })}
          </p>
          {!passed && (
            <p className="mt-2 text-sm text-amber-800">{t("quiz.needPct")}</p>
          )}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setCurrentQ(0);
                setSelected(null);
                setAnswered(false);
                correctRef.current = 0;
                setShowResult(false);
                setResultSnapshot(null);
              }}
              className="flex flex-1 items-center justify-center rounded-2xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-700"
            >
              {t("quiz.retry")}
            </button>
            <Link
              href={nextHref}
              className="flex flex-1 items-center justify-center rounded-2xl py-3 text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)" }}
            >
              {nextLabel}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <Link
        href="/students"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("quiz.back")}
      </Link>
      <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
        <h1 className="flex items-center gap-2 text-base font-black text-indigo-900">
          <Flag className="h-4 w-4" />
          {t("quiz.stageBriefTitle", { stage: t(`stages.${stage}`) })}
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-indigo-800">
          {t("quiz.stageBriefBody", { pct: STAGE_QUIZ_PASS_PCT })}
        </p>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${((currentQ + 1) / defs.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold text-gray-400">
          {t("quiz.progress")} {currentQ + 1} {t("quiz.of")} {defs.length}
        </span>
      </div>
      <p className="mb-4 text-base font-semibold text-gray-900">{tk(q.questionKey)}</p>
      <div className="flex flex-col gap-2">
        {([0, 1, 2] as const).map((i) => {
          const label = tk(q.optionKeys[i]);
          const isCorrect = i === q.correctIndex;
          const isSel = selected === i;
          let ring = "border-gray-100";
          if (answered) {
            if (isCorrect) ring = "border-green-500 bg-green-50";
            else if (isSel) ring = "border-red-300 bg-red-50";
          } else if (isSel) ring = "border-indigo-400";
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => handlePick(i)}
              className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left text-sm transition-all ${ring}`}
            >
              {answered && isCorrect && (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              )}
              {answered && isSel && !isCorrect && (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              )}
              {!answered && (
                <span className="font-bold text-gray-400">{String.fromCharCode(65 + i)}.</span>
              )}
              <span className="flex-1 text-gray-800">{label}</span>
            </button>
          );
        })}
      </div>
      {answered && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          {tk(q.explanationKey)}
        </p>
      )}
      {answered && (
        <button
          type="button"
          onClick={handleNext}
          className="mt-4 w-full rounded-2xl py-3 text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)" }}
        >
          {currentQ + 1 >= defs.length ? t("quiz.seeResults") : t("quiz.submit")}
        </button>
      )}
    </div>
  );
}
