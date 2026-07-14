"use client";

import Image from "next/image";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Lock, Shield, Users, BarChart3, Stethoscope, LogIn } from "lucide-react";
import { TOUR_STEPS } from "@/lib/demo/tour";

const ICONS = {
  community: Users,
  mediator: Shield,
  doctor: Stethoscope,
  manager: BarChart3,
  admin: Lock,
} as const;

/**
 * Public demo overview — informational only. Persona preview lives in Admin CMS.
 */
export function DemoOverview() {
  const t = useTranslations("demo");

  return (
    <div className="min-h-[100dvh] bg-[var(--color-bg-canvas)]">
      <header className="border-b border-[var(--color-border-subtle)] bg-white/90 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="font-display text-lg font-extrabold text-[var(--color-text-primary)]">
            Redi Health
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#059669] px-5 py-2.5 text-sm font-extrabold text-white shadow-brand"
          >
            <LogIn className="h-4 w-4" />
            {t("overviewLoginCta")}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 md:py-16">
        <div className="text-center">
          <p className="eyebrow justify-center">{t("overviewEyebrow")}</p>
          <h1
            className="font-editorial mx-auto mt-4 max-w-2xl font-medium leading-[1.05] text-[var(--color-text-primary)]"
            style={{ fontSize: "clamp(2rem, 1.4rem + 2.5vw, 3.25rem)" }}
          >
            {t("overviewTitle")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-[var(--color-text-secondary)]">
            {t("overviewLead")}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOUR_STEPS.map((step) => {
            const Icon = ICONS[step.id as keyof typeof ICONS] ?? Users;
            return (
              <article
                key={step.id}
                className="group overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-white shadow-2 transition-all hover:shadow-3"
              >
                <div className="relative h-36 overflow-hidden">
                  <Image src={step.image} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="320px" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${step.gradient} opacity-60`} />
                  <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-[var(--color-text-primary)] shadow-md">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-blue-600)]">
                    {t(step.roleBadgeKey)}
                  </p>
                  <h2 className="mt-1 font-display text-base font-extrabold text-[var(--color-text-primary)]">
                    {t(step.headlineKey)}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {t(step.taglineKey)}
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-brand-700)]">
                    <Lock className="h-3 w-3" />
                    {t(step.privacyKey)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl border border-[var(--color-border-subtle)] bg-gradient-to-br from-[#EFF6FF] to-[#ECFDF5] p-8 text-center shadow-2">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-text-primary)]">
            {t("overviewCtaTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-text-secondary)]">
            {t("overviewCtaLead")}
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#059669] px-8 py-4 text-base font-extrabold text-white shadow-brand transition-transform active:scale-[0.98]"
          >
            <LogIn className="h-5 w-5" />
            {t("overviewLoginCta")}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
