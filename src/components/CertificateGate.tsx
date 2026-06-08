"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { Lock, GraduationCap } from "lucide-react";
import { readAcademyState, isStageQuizPassed, allStageModulesCompleted } from "@/lib/student-health-progress";

export function CertificateGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "locked" | "unlocked">("loading");

  useEffect(() => {
    const state = readAcademyState();
    const allCompleted = allStageModulesCompleted("national");
    const quizPassed = isStageQuizPassed("national");
    setStatus(allCompleted && quizPassed ? "unlocked" : "locked");
  }, []);

  if (status === "loading") return null;

  if (status === "locked") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-surface)] shadow-1">
          <Lock className="lucide h-10 w-10 text-[var(--color-text-muted)]" strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-[var(--color-text-primary)] mb-3">
          Complete the Academy first
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
          To earn your Health Literacy Certificate, you need to complete all lessons and pass the quiz in the National stage of the Student Health Academy.
        </p>
        <Link
          href="/students"
          className="inline-flex items-center gap-2 rounded-2xl gradient-brand px-6 py-3 text-sm font-extrabold text-white shadow-2 transition-all hover:shadow-3 active:scale-[0.97]"
        >
          <GraduationCap className="lucide h-5 w-5" strokeWidth={1.85} />
          Go to the Academy
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
