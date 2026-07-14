"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";

export function PersonaBanner() {
  const t = useTranslations("demo");
  const { demoMode, personaId, model } = useDemoPersona();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d: { authenticated?: boolean }) => setIsAdmin(!!d.authenticated))
      .catch(() => setIsAdmin(false));
  }, []);

  if (!demoMode || isAdmin) return null;

  const role = t(`persona${personaId.charAt(0).toUpperCase() + personaId.slice(1)}` as "personaCommunity");

  return (
    <div
      className="sticky top-14 z-40 border-b border-white/20 bg-gradient-to-r from-[#1D4ED8] to-[#059669] px-4 py-2 text-white"
      role="status"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-extrabold">{t("bannerLive", { role })}</p>
          <p className="truncate text-[10px] text-white/80">{t(model.roleSubtitleKey)}</p>
        </div>
        <Link
          href="/admin/login"
          className="shrink-0 text-[11px] font-bold text-white/90 underline-offset-2 hover:underline"
        >
          {t("overviewLoginCta")}
        </Link>
      </div>
    </div>
  );
}
