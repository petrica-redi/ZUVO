"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import {
  Smartphone,
  HeartHandshake,
  Ambulance,
  Shield,
  Video,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { RomaHealthMark } from "@/components/landing/RomaHealthMark";

const STEPS = [
  { id: "join", icon: Smartphone, color: "#2563EB" },
  { id: "connect", icon: HeartHandshake, color: "#0D9488" },
  { id: "mobile", icon: Ambulance, color: "#059669" },
  { id: "mediator", icon: Shield, color: "#1D4ED8" },
  { id: "telehealth", icon: Video, color: "#7C3AED" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const STEP_HREFS: Record<StepId, string> = {
  join: "/chat",
  connect: "/providers",
  mobile: "/navigate",
  mediator: "/mediator",
  telehealth: "/consult",
};

/**
 * Five-step care journey stepper — adapted for Redi Health and Roma communities.
 */
export function CareProcessSection() {
  const t = useTranslations("landing");
  const [active, setActive] = useState<StepId>("join");
  const activeIndex = STEPS.findIndex((s) => s.id === active);
  const current = STEPS[activeIndex]!;

  return (
    <section
      aria-labelledby="care-process-title"
      className="section-marketing border-y border-[var(--color-border-subtle)] bg-white"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <header className="mb-10 text-center md:mb-14">
          <p className="eyebrow justify-center">{t("processEyebrow")}</p>
          <h2
            id="care-process-title"
            className="font-editorial mx-auto mt-3 max-w-3xl font-medium leading-[1.05] text-[var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.875rem, 1.3rem + 1.8vw, 3rem)" }}
          >
            {t("processTitle")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
            {t("processLead")}
          </p>
        </header>

        {/* Stepper */}
        <div className="relative mx-auto max-w-4xl">
          <div
            aria-hidden
            className="absolute left-[10%] right-[10%] top-[2.75rem] hidden h-0.5 bg-[var(--color-border-default)] md:block"
          />
          <div
            aria-hidden
            className="absolute left-[10%] top-[2.75rem] hidden h-0.5 bg-gradient-to-r from-[#2563EB] to-[#059669] transition-all duration-500 md:block"
            style={{
              width: `${(activeIndex / (STEPS.length - 1)) * 80}%`,
            }}
          />

          <ol className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-5 md:gap-x-2">
            {STEPS.map(({ id, icon: Icon, color }, index) => {
              const isActive = active === id;
              const isPast = index < activeIndex;
              return (
                <li key={id} className="flex flex-col items-center text-center">
                  <button
                    type="button"
                    onClick={() => setActive(id)}
                    className="group flex flex-col items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue-500)] focus-visible:ring-offset-2"
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 bg-white transition-all duration-300 md:h-[4.5rem] md:w-[4.5rem] ${
                        isActive
                          ? "scale-110 border-[var(--color-blue-500)] shadow-3"
                          : isPast
                            ? "border-[var(--color-blue-400)] shadow-1"
                            : "border-[var(--color-border-default)] group-hover:border-[var(--color-blue-300)] group-hover:shadow-2"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 transition-colors md:h-7 md:w-7 ${
                          isActive || isPast ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"
                        }`}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        style={isActive ? { color } : undefined}
                      />
                      {isActive && (
                        <span
                          className="absolute -inset-1 rounded-full opacity-30 blur-md"
                          style={{ background: color }}
                          aria-hidden
                        />
                      )}
                    </span>
                    <span
                      className={`max-w-[7rem] text-xs font-bold leading-tight md:text-sm ${
                        isActive
                          ? "text-[var(--color-text-primary)]"
                          : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {t(`process${cap(id)}` as "processJoin")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Active step detail card */}
        <div className="relative mx-auto mt-10 max-w-3xl md:mt-14">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] p-7 text-white shadow-4 md:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#3B82F6]/40 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[#059669]/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute right-1/4 top-1/2 h-32 w-32 rounded-full bg-white/10 blur-2xl"
            />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
              <div className="flex shrink-0 items-center gap-4">
                <RomaHealthMark className="h-14 w-14 shrink-0 shadow-lg md:h-16 md:w-16" />
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm md:hidden"
                  aria-hidden
                >
                  <current.icon className="h-6 w-6" strokeWidth={2} />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/70">
                  {t("processStepLabel", { step: activeIndex + 1, total: STEPS.length })}
                </p>
                <h3 className="mt-2 font-display text-2xl font-extrabold md:text-3xl">
                  {t(`process${cap(active)}` as "processJoin")}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/90 md:text-base">
                  {t(`process${cap(active)}Body` as "processJoinBody")}
                </p>
                <Link
                  href={STEP_HREFS[active]}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-[#1D4ED8] transition-transform hover:brightness-105 active:scale-[0.98]"
                >
                  {t("processCta")}
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function cap(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}
