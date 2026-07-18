"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { LogoWordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguagePicker } from "@/components/LanguagePicker";
import { useTranslations } from "next-intl";

/**
 * Sticky marketing header.
 * Transparent + inverted over the full-bleed hero; glass after scroll.
 */
export function LandingHeader({ logoUrl }: { logoUrl?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("landing");
  const tFooter = useTranslations("footer");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const inverted = !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-bar" : "bg-transparent"
      }`}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 md:h-[4.25rem] md:px-8">
        <Link
          href="/"
          className="shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <LogoWordmark iconSize={34} logoUrl={logoUrl} inverted={inverted} />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href="/mediator"
            className={`text-sm font-semibold transition-colors ${
              inverted
                ? "text-white/80 hover:text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {t("navMediator")}
          </Link>
          <Link
            href="/students"
            className={`text-sm font-semibold transition-colors ${
              inverted
                ? "text-white/80 hover:text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {t("navAcademy")}
          </Link>
          <Link
            href="/providers"
            className={`text-sm font-semibold transition-colors ${
              inverted
                ? "text-white/80 hover:text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {t("navProviders")}
          </Link>
          <Link
            href="/methodology"
            className={`text-sm font-semibold transition-colors ${
              inverted
                ? "text-white/80 hover:text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {tFooter("methodology")}
          </Link>
          <Link
            href="/impact"
            className={`text-sm font-semibold transition-colors ${
              inverted
                ? "text-white/80 hover:text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {tFooter("impact")}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguagePicker variant="landing" />
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Link
            href="/auth/login"
            className={`inline-flex h-10 items-center rounded-xl px-3 text-[13px] font-bold transition-colors sm:px-4 ${
              inverted
                ? "text-white/90 hover:text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {t("signInCtaHero")}
          </Link>
          <Link
            href="/auth/register"
            className={`inline-flex h-10 items-center rounded-xl px-4 text-[13px] font-extrabold sm:px-5 ${
              inverted
                ? "border border-white/35 bg-white/12 text-white backdrop-blur-md hover:bg-white/20"
                : "glass-btn glass-btn-accent"
            }`}
          >
            {t("signUpCtaHero")}
          </Link>
        </div>
      </div>
    </header>
  );
}
