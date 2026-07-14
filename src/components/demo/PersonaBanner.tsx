"use client";

import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { ArrowRightLeft } from "lucide-react";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";

export function PersonaBanner() {
  const t = useTranslations("demo");
  const { demoMode, personaId, model } = useDemoPersona();

  if (!demoMode) return null;

  const role = t(`persona${personaId.charAt(0).toUpperCase() + personaId.slice(1)}` as "personaCommunity");

  return (
    <div
      className="sticky top-14 z-40 border-b border-white/20 bg-gradient-to-r from-[#1D4ED8] to-[#059669] px-4 py-2.5 text-white shadow-md"
      role="status"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-extrabold">{t("bannerLive", { role })}</p>
          <p className="truncate text-[10px] text-white/75">{t(model.dawaAnalogueKey)}</p>
        </div>
        <Link
          href="/demo"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-extrabold backdrop-blur-sm hover:bg-white/30"
        >
          <ArrowRightLeft className="lucide h-3 w-3" strokeWidth={2.2} />
          {t("switchPersona")}
        </Link>
      </div>
    </div>
  );
}
