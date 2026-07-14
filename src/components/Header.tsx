"use client";

import { Link } from "@/navigation";
import { LogoWordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguagePicker } from "@/components/LanguagePicker";
import { PersonaBanner } from "@/components/demo/PersonaBanner";
import { PersonaWorkspace } from "@/components/demo/PersonaWorkspace";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import { useTranslations } from "next-intl";

export function Header() {
  const { demoMode, personaId } = useDemoPersona();
  const t = useTranslations("demo");

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="glass-bar flex h-14 items-center justify-between gap-2 px-4">
          <Link
            href="/"
            className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <LogoWordmark iconSize={30} />
          </Link>
          <div className="flex items-center gap-2">
            {demoMode && (
              <Link
                href="/demo"
                className="hidden rounded-full bg-gradient-to-r from-[#EFF6FF] to-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[var(--color-blue-700)] sm:inline-flex"
              >
                {t(`persona${personaId.charAt(0).toUpperCase() + personaId.slice(1)}` as "personaCommunity")}
              </Link>
            )}
            <LanguagePicker variant="landing" />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <PersonaBanner />
      <PersonaWorkspace />
    </>
  );
}
