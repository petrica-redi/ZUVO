"use client";

import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { ArrowRightLeft } from "lucide-react";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";

export function PersonaBanner() {
  const t = useTranslations("demo");
  const { demoMode, personaId, model } = useDemoPersona();

  if (!demoMode) return null;

  return (
    <div
      className="sticky top-14 z-40 border-b border-[var(--color-border-subtle)] bg-gradient-to-r from-[#EFF6FF] to-[#ECFDF5] px-4 py-2"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-blue-700)]">
            {t("demoActive", { persona: t(`persona${capitalize(personaId)}` as "personaCommunity") })}
          </p>
          <p className="truncate text-[10px] text-[var(--color-text-muted)]">
            {t(model.dawaAnalogueKey)}
          </p>
        </div>
        <Link
          href="/demo"
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--color-border-default)] bg-white px-3 py-1.5 text-[11px] font-bold text-[var(--color-text-secondary)] hover:border-[var(--color-blue-600)] hover:text-[var(--color-blue-600)]"
        >
          <ArrowRightLeft className="lucide h-3 w-3" strokeWidth={2.2} />
          {t("switchPersona")}
        </Link>
      </div>
    </div>
  );
}

function capitalize(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}
