"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import {
  Users,
  Shield,
  Truck,
  Stethoscope,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";

const MODELS = [
  { id: "community", icon: Users, color: "#059669" },
  { id: "mediator", icon: Shield, color: "#2563EB" },
  { id: "outreach", icon: Truck, color: "#0D9488" },
  { id: "telehealth", icon: Stethoscope, color: "#1D4ED8" },
  { id: "manager", icon: BarChart3, color: "#7C3AED" },
] as const;

type ModelId = (typeof MODELS)[number]["id"];

/**
 * Dawa-inspired care model explorer — shows how each persona connects
 * to the platform (community member, mediator, outreach, tele-health, ministry).
 */
export function CareModelSection() {
  const t = useTranslations("landing");
  const [active, setActive] = useState<ModelId>("community");
  const current = MODELS.find((m) => m.id === active)!;

  return (
    <section
      aria-labelledby="care-model-title"
      className="section-marketing bg-gradient-to-b from-[#F0F9FF] to-[#ECFDF5]"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <header className="mb-10 max-w-3xl md:mb-14">
          <p className="eyebrow">{t("careModelEyebrow")}</p>
          <h2
            id="care-model-title"
            className="font-editorial mt-3 font-medium leading-[1.05] text-[var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.875rem, 1.3rem + 1.8vw, 3rem)" }}
          >
            {t("careModelTitle")}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
            {t("careModelLead")}
          </p>
        </header>

        <div className="flex flex-wrap gap-2 md:gap-3">
          {MODELS.map(({ id, icon: Icon, color }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
                  isActive
                    ? "text-white shadow-2"
                    : "border border-[var(--color-border-default)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                }`}
                style={
                  isActive
                    ? { background: `linear-gradient(135deg, ${color}, ${color}cc)` }
                    : undefined
                }
              >
                <Icon className="lucide h-4 w-4" strokeWidth={2.2} />
                {t(`careModel${id.charAt(0).toUpperCase() + id.slice(1)}` as "careModelCommunity")}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-white p-7 shadow-2 md:p-9">
            <div
              className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white"
              style={{ background: current.color }}
            >
              <current.icon className="lucide h-6 w-6" strokeWidth={2} />
            </div>
            <h3 className="font-display text-xl font-extrabold text-[var(--color-text-primary)]">
              {t(`careModel${active.charAt(0).toUpperCase() + active.slice(1)}` as "careModelCommunity")}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
              {t(`careModel${active.charAt(0).toUpperCase() + active.slice(1)}Desc` as "careModelCommunityDesc")}
            </p>
            <ul className="mt-6 space-y-2">
              {[1, 2, 3].map((n) => (
                <li
                  key={n}
                  className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: current.color }}
                  />
                  {t(`careModel${active.charAt(0).toUpperCase() + active.slice(1)}Point${n}` as "careModelCommunityPoint1")}
                </li>
              ))}
            </ul>
            <Link
              href={active === "manager" ? "/impact" : active === "mediator" ? "/mediator" : active === "telehealth" ? "/consult" : active === "outreach" ? "/navigate" : "/chat"}
              className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold text-white transition-transform active:scale-[0.97]"
              style={{ background: `linear-gradient(135deg, ${current.color}, #059669)` }}
            >
              {t("careModelCta")}
              <ArrowRight className="lucide h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>

          <div className="rounded-3xl border border-[var(--color-info-border)] bg-[var(--color-info-bg)] p-6 md:p-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-info-text)]">
              {t("careModelPrivacyLabel")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-info-text)]">
              {t(`careModel${active.charAt(0).toUpperCase() + active.slice(1)}Privacy` as "careModelCommunityPrivacy")}
            </p>
            <Link
              href="/demo"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--color-info-accent)] hover:underline"
            >
              {t("careModelDemoLink")}
              <ArrowRight className="lucide h-3.5 w-3.5" strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
