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
        void import("@/lib/native/bridge").then(({ hapticSuccess }) => hapticSuccess());
      } else {
        recordQuizScore(stage, pct);
        void track("quiz_failed", { stage, score: pct, correct, total });
        void import("@/lib/native/bridge").then(({ hapticTap }) => hapticTap());
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
      <Card variant="elevated" className="relative overflow-hidden gradient-aurora grain-overlay">
        {celebration && <Confetti />}
        <div className="relative p-6 text-center">
          <div
            className={cn(
              "mx-auto flex h-20 w-20 items-center justify-center rounded-3xl grain-overlay",
              passed
                ? "gradient-ember shadow-ember"
                : "bg-gradient-to-br from-amber-500 to-orange-600 shadow-2",
            )}
          >
            {passed ? (
              <Trophy className="lucide h-10 w-10 text-white" strokeWidth={1.85} />
            ) : (
              <Sparkles className="lucide h-10 w-10 text-white" strokeWidth={1.85} />
            )}
          </div>

          <h2
            className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)]"
            style={{ letterSpacing: "-0.025em" }}
          >
            {passed ? t("quiz.pass") : t("quiz.fail")}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {t("quiz.scoreLine", { correct, total, pct })}
          </p>

          <div className="mx-auto mt-4 max-w-xs">
            <Progress value={pct} variant={passed ? "success" : "amber"} size="lg" />
          </div>

          {!passed && (
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-warning-text)]">
              {t("quiz.needPct")}
            </p>
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
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl gradient-brand grain-overlay px-5 text-sm font-extrabold text-white shadow-brand transition-all active:scale-[0.97]"
            >
              {nextLabel}
              <ChevronRight className="lucide h-4 w-4" strokeWidth={2} />
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
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
      >
        <ArrowLeft className="lucide h-4 w-4" strokeWidth={1.75} />
        {t("quiz.back")}
      </Link>

      {/* Stage brief */}
      <Card variant="elevated" className="relative overflow-hidden border-0 gradient-brand grain-overlay text-white">
        <div className="p-5">
          <Badge
            variant="default"
            className="border-white/15 bg-white/15 text-white ring-white/20"
          >
            <Flag className="lucide h-3.5 w-3.5" strokeWidth={1.85} />
            {t("quiz.stageBriefTitle", { stage: t(`stages.${stage}`) })}
          </Badge>
          <p className="mt-3 text-sm leading-relaxed text-white/85">
            {t("quiz.stageBriefBody", { pct: STAGE_QUIZ_PASS_PCT })}
          </p>
        </div>
      </Card>

      {/* Progress */}
      <Card variant="elevated">
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between text-xs font-bold text-[var(--color-text-secondary)]">
            <span>
              {t("quiz.progress")} {currentQ + 1} {t("quiz.of")} {defs.length}
            </span>
            <span className="font-extrabold text-[var(--color-accent)]">
              {Math.round(stepProgress)}%
            </span>
          </div>
          <Progress value={stepProgress} variant="default" size="md" className="mb-5" />

          <p
            className="mb-4 font-display text-base font-extrabold leading-snug text-[var(--color-text-primary)] md:text-lg"
            style={{ letterSpacing: "-0.015em" }}
          >
            {tk(q.questionKey)}
          </p>

          <div className="flex flex-col gap-2.5">
            {([0, 1, 2] as const).map((i) => {
              const label = tk(q.optionKeys[i]);
              const isCorrect = i === q.correctIndex;
              const isSel = selected === i;
              const variant = answered
                ? isCorrect
                  ? "border-[var(--color-success-border)] bg-[var(--color-success-bg)] shadow-2"
                  : isSel
                    ? "border-[var(--color-danger-border)] bg-[var(--color-danger-bg)]"
                    : "border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]"
                : isSel
                  ? "border-[var(--color-brand-400)] bg-[var(--color-accent-soft)]"
                  : "border-[var(--color-border-default)] bg-[var(--color-surface)] hover:border-[var(--color-brand-200)] hover:bg-[var(--color-accent-soft)]/40";

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
                  style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl font-extrabold",
                      answered && isCorrect
                        ? "bg-[var(--color-success-accent)] text-white"
                        : answered && isSel
                          ? "bg-[var(--color-danger-accent)] text-white"
                          : isSel
                            ? "bg-[var(--color-accent)] text-white"
                            : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hairline",
                    )}
                  >
                    {answered && isCorrect ? (
                      <CheckCircle2 className="lucide h-5 w-5" strokeWidth={2} />
                    ) : answered && isSel ? (
                      <XCircle className="lucide h-5 w-5" strokeWidth={2} />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="flex-1 text-[var(--color-text-primary)]">{label}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-4 rounded-2xl border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] p-4 text-sm leading-relaxed text-[var(--color-warning-text)] animate-fade-in-up">
              <div className="mb-1 text-[10px] font-extrabold uppercase tracking-widest opacity-80">
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
              <ChevronRight className="lucide h-4 w-4" strokeWidth={2} />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

/**
 * Refined SVG confetti burst.
 *
 * Pre-computed deterministic positions render a designed splash with two shape
 * families (circles and rectangles) at varied scales. CSS variables drive the
 * keyframes so each piece has a unique trajectory without runtime randomness.
 */
const CONFETTI_PIECES: Array<{
  shape: "circle" | "rect";
  x: number;
  y: number;
  tx: number;
  ty: number;
  rot: number;
  scale: number;
  delay: number;
  color: string;
}> = [
  { shape: "rect",   x: 12, y: 32, tx:  -60, ty:  -120, rot:  220, scale: 1.0, delay:  20, color: "#A78BFA" },
  { shape: "circle", x: 22, y: 44, tx:  -90, ty:   -60, rot:  140, scale: 0.8, delay:  60, color: "#FBBF24" },
  { shape: "rect",   x: 30, y: 26, tx:  -40, ty:  -180, rot:  300, scale: 1.2, delay:  90, color: "#34D399" },
  { shape: "circle", x: 40, y: 50, tx:    0, ty:  -200, rot:   90, scale: 1.0, delay: 120, color: "#60A5FA" },
  { shape: "rect",   x: 50, y: 32, tx:   30, ty:  -160, rot:  120, scale: 0.9, delay: 150, color: "#F472B6" },
  { shape: "circle", x: 58, y: 48, tx:   60, ty:   -90, rot:   45, scale: 1.1, delay: 180, color: "#FBBF24" },
  { shape: "rect",   x: 66, y: 28, tx:   90, ty:  -180, rot:  340, scale: 1.0, delay: 210, color: "#A78BFA" },
  { shape: "circle", x: 76, y: 42, tx:  120, ty:   -70, rot:   60, scale: 0.85, delay: 240, color: "#34D399" },
  { shape: "rect",   x: 84, y: 30, tx:  140, ty:  -150, rot:  280, scale: 1.0, delay: 270, color: "#60A5FA" },
  { shape: "circle", x: 90, y: 50, tx:  150, ty:   -50, rot:   30, scale: 0.9, delay: 300, color: "#F472B6" },
  { shape: "rect",   x: 18, y: 22, tx:  -90, ty:  -200, rot:  180, scale: 0.85, delay: 100, color: "#34D399" },
  { shape: "circle", x: 36, y: 40, tx:  -10, ty:   -90, rot:  120, scale: 0.7, delay: 200, color: "#A78BFA" },
  { shape: "rect",   x: 60, y: 22, tx:   60, ty:  -200, rot:  220, scale: 0.95, delay: 130, color: "#FBBF24" },
  { shape: "circle", x: 80, y: 36, tx:  130, ty:  -120, rot:  240, scale: 1.05, delay: 250, color: "#60A5FA" },
];

function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
      >
        {CONFETTI_PIECES.map((p, i) => {
          const styles: React.CSSProperties = {
            transformOrigin: `${p.x}% ${p.y}%`,
            animation: `confetti-burst 1500ms var(--ease-emphasized) ${p.delay}ms forwards`,
            // CSS custom properties consumed by @keyframes confetti-burst
            ["--tx" as string]: `${p.tx * 0.4}%`,
            ["--ty" as string]: `${p.ty * 0.4}%`,
            ["--rot" as string]: `${p.rot}deg`,
          };
          if (p.shape === "circle") {
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={1.1 * p.scale}
                fill={p.color}
                style={styles}
              />
            );
          }
          return (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={2.2 * p.scale}
              height={1.0 * p.scale}
              rx={0.4}
              fill={p.color}
              style={styles}
            />
          );
        })}
      </svg>
    </div>
  );
}
