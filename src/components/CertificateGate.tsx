"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { Lock, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import { isStageQuizPassed, allStageModulesCompleted } from "@/lib/student-health-progress";

export function CertificateGate({ children }: { children: React.ReactNode }) {
  const t = useTranslations("certificate.gate");
  const [status, setStatus] = useState<"loading" | "locked" | "unlocked">("loading");

  useEffect(() => {
    const allCompleted = allStageModulesCompleted("national");
    const quizPassed = isStageQuizPassed("national");
    const timer = setTimeout(() => {
      setStatus(allCompleted && quizPassed ? "unlocked" : "locked");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") return null;

  if (status === "locked") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-surface)] shadow-1">
          <Lock className="lucide h-10 w-10 text-[var(--color-text-muted)]" strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-[var(--color-text-primary)] mb-3">
          {t("title")}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
          {t("description")}
        </p>
        <Link
          href="/students"
          className="inline-flex items-center gap-2 rounded-2xl gradient-brand px-6 py-3 text-sm font-extrabold text-white shadow-2 transition-all hover:shadow-3 active:scale-[0.97]"
        >
          <GraduationCap className="lucide h-5 w-5" strokeWidth={1.85} />
          {t("cta")}
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
