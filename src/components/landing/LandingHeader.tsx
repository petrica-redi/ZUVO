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
 * - Inline nav (impact, methodology, providers) on md+.
 * - Falls back to the wordmark + primary CTA on mobile.
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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <LogoWordmark iconSize={28} logoUrl={logoUrl} />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
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
            href="/admin/login"
            className="text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            {t("demoNav")}
          </Link>
          <Link
            href="/impact"
            className="text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            {tFooter("impact")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguagePicker variant="landing" />
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Link
            href="/admin/login"
            className="glass-btn glass-btn-accent inline-flex h-10 items-center gap-2 rounded-full px-5 text-[13px] font-extrabold"
          >
            <span className="glass-btn-icon flex h-5 w-5 items-center justify-center rounded-full text-[10px]">▶</span>
            {t("demoNav")}
          </Link>
        </div>
      </div>
    </header>
  );
}
