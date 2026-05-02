"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Flag,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
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
  recordQuizScore,
} from "@/lib/student-health-progress";
import { Badge, Button, Card, Progress } from "@/components/ui";
import { cn } from "@/components/ui/cn";
import { track } from "@/lib/analytics";

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
    pct: number;
  } | null>(null);
  const [celebration, setCelebration] = useState(false);

  const q = defs[currentQ];
  const tk = (key: string) => t(studentHealthMessageKey(key));
  const stepProgress = ((currentQ + (answered ? 1 : 0)) / defs.length) * 100;

  useEffect(() => {
    if (showResult && resultSnapshot?.passed) {
      const enableTimer = setTimeout(() => setCelebration(true), 0);
      const disableTimer = setTimeout(() => setCelebration(false), 1800);
      return () => {
        clearTimeout(enableTimer);
        clearTimeout(disableTimer);
      };
    }
  }, [showResult, resultSnapshot]);

  // Fire quiz_started event once per stage mount.
  const trackedStartRef = useRef(false);
  useEffect(() => {
    if (trackedStartRef.current) return;
    trackedStartRef.current = true;
    void track("quiz_started", { stage });
  }, [stage]);

  const handlePick = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.correctIndex) correctRef.current += 1;
  };

  const handleNext = () => {
    if (!answered) return;
    if (currentQ + 1 >= defs.length) {
      const correct = correctRef.current;
      const total = defs.length;
      const pct = Math.round((correct / total) * 100);
      const passed = pct >= STAGE_QUIZ_PASS_PCT;
      if (passed) {
        recordQuizPass(stage, pct);
        postProgressQuizComplete(stage);
        void track("quiz_passed", { stage, score: pct, correct, total });
      } else {
        recordQuizScore(stage, pct);
        void track("quiz_failed", { stage, score: pct, correct, total });
      }
      void track("quiz_attempted", { stage, score: pct, passed });
      setResultSnapshot({ correct, total, passed, pct });
      setShowResult(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    correctRef.current = 0;
    setShowResult(false);
    setResultSnapshot(null);
  };

  if (showResult && resultSnapshot) {
    const { correct, total, passed, pct } = resultSnapshot;
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
      <Card variant="elevated" className="relative overflow-hidden">
        {celebration && <Confetti />}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-50 blur-3xl",
          )}
          style={{
            background: passed
              ? "radial-gradient(circle, #6EE7B7 0%, transparent 70%)"
              : "radial-gradient(circle, #FCA5A5 0%, transparent 70%)",
          }}
        />
        <div className="relative p-6 text-center">
          <div
            className={cn(
              "mx-auto flex h-20 w-20 items-center justify-center rounded-3xl shadow-xl",
              passed
                ? "bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30"
                : "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30",
            )}
          >
            {passed ? (
              <Trophy className="h-10 w-10 text-white" />
            ) : (
              <Sparkles className="h-10 w-10 text-white" />
            )}
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-gray-900">
            {passed ? t("quiz.pass") : t("quiz.fail")}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            {t("quiz.scoreLine", { correct, total, pct })}
          </p>

          <div className="mx-auto mt-4 max-w-xs">
            <Progress value={pct} variant={passed ? "success" : "amber"} size="lg" />
          </div>

          {!passed && (
            <p className="mt-3 text-sm leading-relaxed text-amber-800">{t("quiz.needPct")}</p>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              onClick={reset}
            >
              {t("quiz.retry")}
            </Button>
            <Link
              href={nextHref}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-5 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition active:scale-[0.97]"
            >
              {nextLabel}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        href="/students"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 transition hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("quiz.back")}
      </Link>

      {/* Stage brief */}
      <Card variant="elevated" className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
        <div className="p-5">
          <Badge variant="default" className="bg-white/15 text-white ring-white/20">
            <Flag className="h-3.5 w-3.5" />
            {t("quiz.stageBriefTitle", { stage: t(`stages.${stage}`) })}
          </Badge>
          <p className="mt-3 text-sm leading-relaxed text-indigo-100">
            {t("quiz.stageBriefBody", { pct: STAGE_QUIZ_PASS_PCT })}
          </p>
        </div>
      </Card>

      {/* Progress */}
      <Card variant="elevated">
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between text-xs font-bold text-gray-500">
            <span>
              {t("quiz.progress")} {currentQ + 1} {t("quiz.of")} {defs.length}
            </span>
            <span className="font-black text-indigo-600">{Math.round(stepProgress)}%</span>
          </div>
          <Progress value={stepProgress} variant="default" size="md" className="mb-5" />

          <p className="mb-4 text-base font-black leading-snug text-gray-900 md:text-lg">
            {tk(q.questionKey)}
          </p>

          <div className="flex flex-col gap-2.5">
            {([0, 1, 2] as const).map((i) => {
              const label = tk(q.optionKeys[i]);
              const isCorrect = i === q.correctIndex;
              const isSel = selected === i;
              const variant = answered
                ? isCorrect
                  ? "border-emerald-400 bg-emerald-50 shadow-md shadow-emerald-500/10"
                  : isSel
                    ? "border-rose-300 bg-rose-50"
                    : "border-gray-100 bg-gray-50"
                : isSel
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30";

              return (
                <button
                  key={i}
                  type="button"
                  disabled={answered}
                  onClick={() => handlePick(i)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border-2 p-4 text-left text-sm leading-relaxed transition-all",
                    variant,
                    !answered && "active:scale-[0.99]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl font-black",
                      answered && isCorrect
                        ? "bg-emerald-500 text-white"
                        : answered && isSel
                          ? "bg-rose-500 text-white"
                          : isSel
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-gray-500 ring-1 ring-gray-200",
                    )}
                  >
                    {answered && isCorrect ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : answered && isSel ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="flex-1 text-gray-800">{label}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 animate-fade-in-up">
              <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-amber-700">
                {selected === q.correctIndex ? t("quiz.explainCorrect") : t("quiz.explainWrong")}
              </div>
              {tk(q.explanationKey)}
            </div>
          )}

          {answered && (
            <Button
              type="button"
              size="lg"
              fullWidth
              onClick={handleNext}
              className="mt-4"
            >
              {currentQ + 1 >= defs.length ? t("quiz.seeResults") : t("quiz.submit")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

// Pre-computed deterministic confetti positions to avoid Math.random() in render
const CONFETTI_PIECES = [
  { top: 4, left: 12, rot: 18 },
  { top: 9, left: 28, rot: 132 },
  { top: 14, left: 44, rot: 245 },
  { top: 6, left: 58, rot: 60 },
  { top: 19, left: 72, rot: 310 },
  { top: 11, left: 86, rot: 95 },
  { top: 23, left: 8, rot: 220 },
  { top: 27, left: 24, rot: 350 },
  { top: 17, left: 38, rot: 75 },
  { top: 22, left: 52, rot: 195 },
  { top: 7, left: 66, rot: 280 },
  { top: 13, left: 80, rot: 40 },
  { top: 25, left: 92, rot: 160 },
  { top: 18, left: 4, rot: 110 },
];
const CONFETTI_COLORS = ["#34D399", "#A78BFA", "#FBBF24", "#F472B6", "#60A5FA"];

function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {CONFETTI_PIECES.map((p, i) => (
        <span
          key={i}
          className="absolute block h-2 w-2 rounded-full"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animation: `fade-in-up 1.4s ease-out ${i * 80}ms both`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}
