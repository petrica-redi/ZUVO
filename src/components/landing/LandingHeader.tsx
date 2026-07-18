"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { LogoWordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguagePicker } from "@/components/LanguagePicker";
import { useTranslations } from "next-intl";

/**
 * Desktop-first sticky header for the marketing surface.
 *
 * - Transparent at top, glass-blurred after the first scroll tick.
 * - Inline nav on md+; Sign in / Sign up always visible in the right cluster.
 */
export function LandingHeader({ logoUrl }: { logoUrl?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("landing");
  const tFooter = useTranslations("footer");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-bar" : "bg-transparent"
      }`}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 md:px-8">
        <Link
          href="/"
          className="shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <LogoWordmark iconSize={28} logoUrl={logoUrl} />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href="/mediator"
            className="text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            {t("navMediator")}
          </Link>
          <Link
            href="/students"
            className="text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            {t("navAcademy")}
          </Link>
          <Link
            href="/providers"
            className="text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            {t("navProviders")}
          </Link>
          <Link
            href="/methodology"
            className="text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            {tFooter("methodology")}
          </Link>
          <Link
            href="/impact"
            className="text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
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
            className="inline-flex h-10 items-center rounded-full px-3 text-[13px] font-bold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] sm:px-4"
          >
            {t("signInCtaHero")}
          </Link>
          <Link
            href="/auth/register"
            className="glass-btn glass-btn-accent inline-flex h-10 items-center rounded-full px-4 text-[13px] font-extrabold sm:px-5"
          >
            {t("signUpCtaHero")}
          </Link>
        </div>
      </div>
    </header>
  );
}
