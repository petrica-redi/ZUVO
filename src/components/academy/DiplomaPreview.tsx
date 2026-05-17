"use client";

import { useTranslations } from "next-intl";
import { Award, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "@/navigation";

export function DiplomaPreview({
  earnedStages,
  totalStages,
  unlocked,
}: {
  earnedStages: number;
  totalStages: number;
  unlocked: boolean;
}) {
  const t = useTranslations("studentHealth.l8");

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-3">
      <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
        {/* Left: pitch */}
        <div className="p-6 md:p-8">
          <span className="eyebrow">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--color-ember-500)" }}
            />
            {t("diplomaSubtitle")}
          </span>
          <h2
            className="font-editorial mt-3 font-medium leading-[1.05] text-[var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.5rem, 1.1rem + 1.4vw, 2rem)" }}
          >
            {t("diplomaTitle")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {t("diplomaBody")}
          </p>
          <p className="mt-4 text-xs font-bold text-[var(--color-text-muted)]">
            {t("diplomaProgress", { completed: earnedStages, total: totalStages })}
          </p>

          {/* Progress bar */}
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-ember-500)] via-[var(--color-brand-500)] to-[var(--color-sage-500)] transition-all"
              style={{ width: `${(earnedStages / Math.max(1, totalStages)) * 100}%` }}
            />
          </div>

          {unlocked ? (
            <Link
              href="/students/certificate"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-text-primary)] px-5 py-3 text-sm font-extrabold text-[var(--color-bg-canvas)] shadow-2 active:scale-[0.97]"
            >
              <Award className="lucide h-4 w-4" strokeWidth={2} />
              {t("diplomaCta")}
              <ChevronRight className="lucide h-4 w-4" strokeWidth={2} />
            </Link>
          ) : (
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-5 py-3 text-sm font-extrabold text-[var(--color-text-muted)]">
              <Sparkles className="lucide h-4 w-4" strokeWidth={2} />
              {t("diplomaPreview")}
            </span>
          )}
        </div>

        {/* Right: certificate card */}
        <div className="relative bg-gradient-to-br from-[var(--color-ember-50)] via-[var(--color-brand-50)] to-[var(--color-sage-50)] p-6 md:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30 grain-overlay"
          />
          <div className="relative rounded-2xl border-2 border-dashed border-[var(--color-border-strong)] bg-white p-5 shadow-1">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
              <div className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Sastipe
              </div>
              <div className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                {t("diplomaTitle")}
              </div>
            </div>
            <div className="mt-5 flex flex-col items-center text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-ember-500)] to-[var(--color-brand-700)] shadow-2">
                <Award className="lucide h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <p className="font-editorial text-xl leading-tight text-[var(--color-text-primary)]">
                {t("diplomaPreviewName")}
              </p>
              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
                {t("diplomaPreviewDate", { date: "—" })}
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-3">
              <div className="text-[9px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
                {t("diplomaSignature")}
              </div>
              <div className="font-editorial text-[11px] italic text-[var(--color-text-secondary)]">
                ✦ ✦ ✦
              </div>
            </div>
          </div>
          {unlocked && (
            <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-[var(--color-success-accent)] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-2">
              <Sparkles className="lucide h-3 w-3" strokeWidth={2.2} />
              {t("diplomaUnlocked")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
