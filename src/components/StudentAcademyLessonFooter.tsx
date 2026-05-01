"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import {
  addAcademyXp,
  getLessonNextStep,
  type AcademyNextStep,
} from "@/lib/student-health-progress";
import type { StageId } from "@/data/student-health";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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
    ...buttonProps
  } = props;
  const [nextStep, setNextStep] = useState<AcademyNextStep | null>(null);

  const label =
    nextStep?.type === "lesson"
      ? nextLessonLabel
      : nextStep?.type === "quiz"
        ? quizLabel
        : backToAcademyLabel;

  return (
    <div className="space-y-3">
      <MarkCompleteButton
        {...buttonProps}
        onCompleted={() => {
          addAcademyXp(10);
          setNextStep(getLessonNextStep(stage, buttonProps.moduleId));
          onCompleted?.();
        }}
      />
      {nextStep && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <h3 className="flex items-center gap-2 text-sm font-black text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            {completedTitle}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-green-900">{completedBody}</p>
          <Link
            href={nextStep.href}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-black text-white active:scale-[0.98]"
          >
            {label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
