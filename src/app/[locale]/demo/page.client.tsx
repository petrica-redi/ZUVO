"use client";

import { useCallback, useEffect, useState } from "react";
import { Link, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  Users,
  Shield,
  BarChart3,
  Stethoscope,
  Settings,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import {
  DEMO_PERSONAS,
  DEMO_PERSONA_COOKIE,
  DEMO_MODE_KEY,
  dataAccessLabelKey,
  type DemoPersonaId,
} from "@/lib/demo/personas";
import { DEMO_COUNTY, DEMO_MEDIATOR_WORKSPACE } from "@/lib/demo/seed-data";
import { persistWorkspace } from "@/lib/mediator/workspace-client";

const ICONS = {
  users: Users,
  shield: Shield,
  "bar-chart": BarChart3,
  stethoscope: Stethoscope,
  settings: Settings,
} as const;

function setCookie(name: string, value: string, days = 30) {
  document.cookie = `${name}=${value}; path=/; max-age=${days * 86400}; SameSite=Lax`;
}

export default function DemoPageClient() {
  const t = useTranslations("demo");
  const router = useRouter();
  const [active, setActive] = useState<DemoPersonaId>("community");
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_MODE_KEY);
    if (stored === "false") setDemoMode(false);
    const match = document.cookie.match(new RegExp(`${DEMO_PERSONA_COOKIE}=([^;]+)`));
    if (match?.[1]) {
      const id = match[1] as DemoPersonaId;
      if (DEMO_PERSONAS.some((p) => p.id === id)) setActive(id);
    }
  }, []);

  const selectPersona = useCallback((id: DemoPersonaId) => {
    setActive(id);
    setCookie(DEMO_PERSONA_COOKIE, id);
    localStorage.setItem(DEMO_MODE_KEY, "true");
    setDemoMode(true);

    if (id === "mediator") {
      persistWorkspace(DEMO_MEDIATOR_WORKSPACE, DEMO_COUNTY, () => {});
    }
  }, []);

  const launchPersona = useCallback(
    (id: DemoPersonaId) => {
      selectPersona(id);
      const persona = DEMO_PERSONAS.find((p) => p.id === id);
      if (persona) router.push(persona.href);
    },
    [selectPersona, router],
  );

  const current = DEMO_PERSONAS.find((p) => p.id === active)!;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-4">
        <section className="relative overflow-hidden border-b border-[var(--color-border-subtle)]">
          <div aria-hidden className="pointer-events-none absolute inset-0 gradient-aurora" />
          <div className="relative mx-auto max-w-4xl px-5 py-10 text-center md:px-8 md:py-16">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl gradient-brand grain-overlay shadow-brand">
              <Sparkles className="lucide h-8 w-8 text-white" strokeWidth={1.85} />
            </div>
            <p className="eyebrow justify-center">{t("eyebrow")}</p>
            <h1
              className="font-editorial mt-4 font-medium leading-[1.05] text-[var(--color-text-primary)]"
              style={{ fontSize: "clamp(2rem, 1.4rem + 2.5vw, 3.25rem)" }}
            >
              {t("title")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
              {t("lead")}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-8 md:px-8">
          <h2 className="font-display text-lg font-extrabold text-[var(--color-text-primary)]">
            {t("choosePersona")}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {t("choosePersonaLead")}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {DEMO_PERSONAS.map((persona) => {
              const Icon = ICONS[persona.icon];
              const isActive = active === persona.id;
              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => selectPersona(persona.id)}
                  className={`rounded-3xl border p-5 text-left transition-all ${
                    isActive
                      ? "border-[var(--color-blue-600)] bg-white shadow-3 ring-2 ring-[var(--color-blue-600)]/20"
                      : "border-[var(--color-border-subtle)] bg-white shadow-2 hover:shadow-3"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${persona.gradient} text-white`}
                    >
                      <Icon className="lucide h-5 w-5" strokeWidth={2} />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                        persona.dataAccess === "aggregated"
                          ? "bg-[#EFF6FF] text-[#1E40AF]"
                          : persona.dataAccess === "pseudonymized"
                            ? "bg-[#ECFDF5] text-[#065F46]"
                            : persona.dataAccess === "full"
                              ? "bg-[#F0FDF4] text-[#166534]"
                              : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)]"
                      }`}
                    >
                      {t(dataAccessLabelKey(persona.dataAccess))}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-extrabold text-[var(--color-text-primary)]">
                    {t(persona.labelKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {t(persona.descriptionKey)}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 pb-8 md:px-8">
          <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2 md:p-8">
            <h2 className="font-display text-lg font-extrabold text-[var(--color-text-primary)]">
              {t("accessTitle", { persona: t(current.labelKey) })}
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[var(--color-brand-600)]">
                  <Eye className="lucide h-4 w-4" strokeWidth={2} />
                  {t("canAccess")}
                </p>
                <ul className="space-y-2">
                  {current.accessKeys.map((key) => (
                    <li key={key} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                      <CheckCircle2 className="lucide mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-600)]" strokeWidth={2} />
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[var(--color-blue-600)]">
                  <EyeOff className="lucide h-4 w-4" strokeWidth={2} />
                  {t("anonymization")}
                </p>
                <ul className="space-y-2">
                  {current.anonymizationKeys.map((key) => (
                    <li key={key} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                      <Lock className="lucide mt-0.5 h-4 w-4 shrink-0 text-[var(--color-blue-600)]" strokeWidth={2} />
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => launchPersona(active)}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full gradient-brand px-6 py-4 text-sm font-extrabold text-white shadow-brand transition-transform active:scale-[0.97] sm:w-auto"
            >
              {t("launch", { persona: t(current.labelKey) })}
              <ArrowRight className="lucide h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 pb-10 md:px-8">
          <div className="rounded-3xl border border-[var(--color-info-border)] bg-gradient-to-r from-[#EFF6FF] to-[#ECFDF5] p-6 md:p-8">
            <h2 className="font-display text-base font-extrabold text-[var(--color-text-primary)]">
              {t("privacyTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {t("privacyBody")}
            </p>
            <Link
              href="/methodology"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--color-blue-600)] hover:underline"
            >
              {t("privacyCta")}
              <ArrowRight className="lucide h-3.5 w-3.5" strokeWidth={2.2} />
            </Link>
          </div>
        </section>

        {demoMode && (
          <div className="fixed bottom-20 left-1/2 z-30 -translate-x-1/2 px-4 sm:bottom-24">
            <div className="flex items-center gap-3 rounded-full border border-[var(--color-border-subtle)] bg-white/95 px-4 py-2.5 shadow-3 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-brand-500)]" />
              <span className="text-xs font-bold text-[var(--color-text-secondary)]">
                {t("demoActive", { persona: t(current.labelKey) })}
              </span>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
