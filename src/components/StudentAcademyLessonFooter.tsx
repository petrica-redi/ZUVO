"use client";

import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import { addAcademyXp } from "@/lib/student-health-progress";

type Props = {
  pillarId: string;
  moduleId: string;
  completeLabel: string;
  completedLabel: string;
  pillarColor: string;
};

export function StudentAcademyLessonFooter(props: Props) {
  return (
    <MarkCompleteButton
      {...props}
      onCompleted={() => {
        addAcademyXp(10);
      }}
    />
  );
}
