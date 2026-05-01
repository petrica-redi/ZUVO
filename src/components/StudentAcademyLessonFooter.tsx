"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { ArrowRight, CheckCircle2, Sparkles, Target } from "lucide-react";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import {
  addAcademyXp,
  getLessonNextStep,
  recordActivityToday,
  type AcademyNextStep,
} from "@/lib/student-health-progress";
import type { StageId } from "@/data/student-health";
import { Card, Badge } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";

type Props = {
  pillarId: string;
  moduleId: string;
  stage: StageId;
  completeLabel: string;
  completedLabel: string;
  pillarColor: string;
  nextLessonLabel: string;
  quizLabel: string;
  backToAcademyLabel: string;
  completedTitle: string;
  completedBody: string;
  xpToastTitle?: string;
  xpToastBody?: string;
  onCompleted?: () => void;
};

export function StudentAcademyLessonFooter(props: Props) {
  const {
    onCompleted,
    stage,
    nextLessonLabel,
    quizLabel,
    backToAcademyLabel,
    completedTitle,
    completedBody,
    xpToastTitle,
    xpToastBody,
    ...buttonProps
  } = props;
  const [nextStep, setNextStep] = useState<AcademyNextStep | null>(null);
  const [animating, setAnimating] = useState(false);
  const toast = useToast();

  // Recompute next step if academy state changes (e.g. quiz pass elsewhere).
  useEffect(() => {
    if (!nextStep) return;
    const sync = () => setNextStep(getLessonNextStep(stage, buttonProps.moduleId));
    window.addEventListener("student-academy-update", sync);
    return () => window.removeEventListener("student-academy-update", sync);
  }, [nextStep, stage, buttonProps.moduleId]);

  const label =
    nextStep?.type === "lesson"
      ? nextLessonLabel
      : nextStep?.type === "quiz"
        ? quizLabel
        : backToAcademyLabel;

  const Icon =
    nextStep?.type === "lesson"
      ? ArrowRight
      : nextStep?.type === "quiz"
        ? Target
        : Sparkles;

  return (
    <div className="space-y-3">
      <MarkCompleteButton
        {...buttonProps}
        onCompleted={() => {
          addAcademyXp(10);
          recordActivityToday();
          setAnimating(true);
          setNextStep(getLessonNextStep(stage, buttonProps.moduleId));
          toast.success(
            xpToastBody ?? "+10 XP added. Streak updated.",
            xpToastTitle ?? "Lesson logged",
          );
          onCompleted?.();
          setTimeout(() => setAnimating(false), 1200);
        }}
      />
      {nextStep && (
        <Card
          variant="elevated"
          className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-30 blur-2xl"
            style={{ background: "radial-gradient(circle, #FFFFFF 0%, transparent 70%)" }}
          />
          <div className="relative p-5">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-white/20 text-white ring-white/20">
                <CheckCircle2 className="h-3.5 w-3.5" />
                +10 XP
              </Badge>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                {completedTitle}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/90">{completedBody}</p>
            <Link
              href={nextStep.href}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-emerald-700 shadow-md shadow-black/10 transition active:scale-[0.97]"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </div>
          {animating && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 animate-pulse-glow"
              style={{ borderRadius: "1.5rem" }}
            />
          )}
        </Card>
      )}
    </div>
  );
}
