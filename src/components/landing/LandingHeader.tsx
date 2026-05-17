"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { LogoWordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

/**
 * Desktop-first sticky header for the marketing surface.
 *
 * - Transparent at top, glass-blurred after the first scroll tick.
 * - Inline nav (impact, methodology, providers) on md+.
 * - Falls back to the wordmark + primary CTA on mobile.
 */
export function LandingHeader() {
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
          <LogoWordmark iconSize={28} />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
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

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Link
            href="/chat"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--color-text-primary)] px-4 text-[13px] font-extrabold text-[var(--color-bg-canvas)] shadow-2 transition-transform active:scale-95"
          >
            {t("ctaPrimary")}
            <ArrowRight className="lucide h-3.5 w-3.5" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </header>
  );
}
