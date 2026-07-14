"use client";

import Image from "next/image";
import { Link, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Lock,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import { getPersonaModel } from "@/lib/demo/persona-models";
import { TOUR_STEPS, type TourStep } from "@/lib/demo/tour";
import type { DemoPersonaId } from "@/lib/demo/personas";

type Phase = "intro" | "tour";

type Props = {
  /** Skip intro and jump to tour step 0 */
  autoStart?: boolean;
  /** Launch this persona immediately (one click from landing) */
  quickLaunch?: DemoPersonaId;
};

export function GuidedDemoTour({ autoStart, quickLaunch }: Props) {
  const t = useTranslations("demo");
  const router = useRouter();
  const { setPersona, enableDemoMode } = useDemoPersona();
  const [phase, setPhase] = useState<Phase>(autoStart ? "tour" : "intro");
  const [step, setStep] = useState(0);

  const launch = useCallback(
    (id: DemoPersonaId) => {
      setPersona(id);
      enableDemoMode();
      sessionStorage.setItem("redi_demo_welcome", id);
      router.push(getPersonaModel(id).homeHref);
    },
    [setPersona, enableDemoMode, router],
  );

  useEffect(() => {
    if (quickLaunch) launch(quickLaunch);
  }, [quickLaunch, launch]);

  const current: TourStep = TOUR_STEPS[step]!;

  if (phase === "intro") {
    return (
      <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#0A1628] text-white">
        <DemoTopBar />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 80% 10%, rgba(37,99,235,0.45) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 10% 90%, rgba(16,185,129,0.4) 0%, transparent 55%)",
          }}
        />

        <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#34D399]" />
            {t("tourBadge")}
          </div>

          <h1
            className="font-editorial max-w-3xl font-medium leading-[1.02]"
            style={{ fontSize: "clamp(2.25rem, 1.5rem + 3.5vw, 4rem)" }}
          >
            {t("tourIntroTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            {t("tourIntroLead")}
          </p>

          {/* Dawa ↔ Redi comparison strip */}
          <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl border border-[#2563EB]/40 bg-[#2563EB]/15 p-4 backdrop-blur-sm">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#93C5FD]">
                {t("tourInspiredBy")}
              </p>
              <p className="mt-1 font-display text-sm font-extrabold">Dawa Health</p>
              <p className="mt-2 text-xs text-white/70">{t("tourDawaPitch")}</p>
            </div>
            <div className="rounded-2xl border border-[#10B981]/40 bg-[#10B981]/15 p-4 backdrop-blur-sm">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6EE7B7]">
                {t("tourBuiltFor")}
              </p>
              <p className="mt-1 font-display text-sm font-extrabold">Redi Health</p>
              <p className="mt-2 text-xs text-white/70">{t("tourRediPitch")}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhase("tour")}
            className="group mt-12 inline-flex h-16 items-center gap-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#059669] px-10 text-lg font-extrabold shadow-[0_8px_32px_rgba(37,99,235,0.45)] transition-transform active:scale-[0.97]"
          >
            <Play className="h-6 w-6 fill-white" />
            {t("tourStartBtn")}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-xs text-white/50">{t("tourStartHint")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[var(--color-bg-canvas)]">
      <DemoTopBar step={step} total={TOUR_STEPS.length} />

      <div className="relative flex flex-1 flex-col lg:flex-row">
        {/* Visual panel */}
        <div className="relative min-h-[42vh] flex-1 lg:min-h-0">
          <Image
            src={current.image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r ${current.gradient} mix-blend-multiply opacity-80`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-canvas)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[var(--color-bg-canvas)] lg:via-transparent lg:to-transparent" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 top-1/4 h-64 w-64 rounded-full blur-3xl"
            style={{ background: current.glowColor }}
          />
        </div>

        {/* Content panel */}
        <div className="relative z-10 flex w-full flex-col justify-center px-6 py-8 lg:w-[44%] lg:max-w-xl lg:px-10 lg:py-12">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-blue-600)]">
            {t("tourStep", { current: step + 1, total: TOUR_STEPS.length })}
          </p>

          <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#2563EB]/25 bg-[#EFF6FF] px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
            <span className="text-[11px] font-bold text-[#1E40AF]">{t(current.dawaKey)}</span>
          </div>

          <h2
            className="font-editorial mt-5 font-medium leading-[1.05] text-[var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
          >
            {t(current.headlineKey)}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            {t(current.taglineKey)}
          </p>

          <p className="mt-4 rounded-xl border border-[#10B981]/30 bg-[#ECFDF5] px-4 py-3 text-sm text-[#065F46]">
            <span className="font-bold">{t("tourParallelLabel")}</span>{" "}
            {t(current.dawaParallelKey)}
          </p>

          <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)]">
            <Lock className="h-3.5 w-3.5 text-[var(--color-blue-600)]" />
            {t(current.privacyKey)}
          </p>

          <button
            type="button"
            onClick={() => launch(current.id)}
            className={`mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${current.gradient} text-base font-extrabold text-white shadow-brand transition-transform active:scale-[0.97] lg:w-auto lg:px-10`}
          >
            {t("tourTryBtn", { role: t(`persona${cap(current.id)}` as "personaCommunity") })}
            <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-text-muted)] disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("tourBack")}
            </button>
            <div className="flex gap-2">
              {TOUR_STEPS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={t(`persona${cap(s.id)}` as "personaCommunity")}
                  onClick={() => setStep(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === step ? "w-8 bg-[var(--color-blue-600)]" : "w-2.5 bg-[var(--color-neutral-300)]"
                  }`}
                />
              ))}
            </div>
            {step < TOUR_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-blue-600)]"
              >
                {t("tourNext")}
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <Link href="/" className="text-sm font-bold text-[var(--color-text-muted)]">
                {t("tourDone")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoTopBar({ step, total }: { step?: number; total?: number }) {
  const t = useTranslations("demo");
  return (
    <header className="relative z-20 flex h-14 items-center justify-between border-b border-[var(--color-border-subtle)] bg-white/90 px-4 backdrop-blur-md">
      <Link href="/" className="text-sm font-extrabold text-[var(--color-text-primary)]">
        Redi Health
      </Link>
      {typeof step === "number" && typeof total === "number" && (
        <span className="text-xs font-bold text-[var(--color-text-muted)]">
          {t("tourStep", { current: step + 1, total })}
        </span>
      )}
      <Link
        href="/"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-neutral-100)] text-[var(--color-text-muted)]"
        aria-label={t("tourClose")}
      >
        <X className="h-4 w-4" />
      </Link>
    </header>
  );
}

function cap(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}
