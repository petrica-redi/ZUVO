"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@/navigation";
import { Lock } from "lucide-react";
import type { StageId } from "@/data/student-health";
import { isStageUnlockedForPlay } from "@/lib/student-health-progress";
import { Card } from "@/components/ui";

export function StudentAcademyRouteGate({
  stage,
  children,
}: {
  stage: StageId;
  children: ReactNode;
}) {
  const [allowed, setAllowed] = useState(stage === "local");
  const [ready, setReady] = useState(stage === "local");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setAllowed(isStageUnlockedForPlay(stage));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [stage]);

  if (!ready) return null;

  if (!allowed) {
    return (
      <Card variant="elevated" className="p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]">
          <Lock className="lucide h-5 w-5" strokeWidth={1.85} />
        </div>
        <h1 className="font-display text-xl font-extrabold text-[var(--color-text-primary)]">
          Stage locked
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Complete the earlier stage quizzes to unlock this mission.
        </p>
        <Link
          href="/students"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl gradient-brand grain-overlay px-5 text-sm font-extrabold text-white shadow-brand"
        >
          Back to Academy
        </Link>
      </Card>
    );
  }

  return <>{children}</>;
}
