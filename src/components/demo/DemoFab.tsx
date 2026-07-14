"use client";

import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";

/**
 * Always-visible one-click demo entry — fixed bottom-right on every page.
 */
export function DemoFab() {
  const t = useTranslations("demo");
  const pathname = usePathname();
  const { demoMode } = useDemoPersona();

  if (demoMode || pathname.includes("/demo")) return null;

  return (
    <Link
      href="/demo"
      className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#059669] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_28px_rgba(37,99,235,0.4)] transition-transform hover:scale-105 active:scale-95 md:bottom-8"
      style={{ animation: "demo-fab-pulse 2.5s ease-in-out infinite" }}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
        <Play className="h-4 w-4 fill-white" />
      </span>
      {t("fabLabel")}
    </Link>
  );
}
