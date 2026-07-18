"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { LogoWordmark } from "@/components/Logo";
import { LanguagePicker } from "@/components/LanguagePicker";
import { useTranslations } from "next-intl";

/**
 * Sticky marketing header over the full-bleed hero.
 * Uses a dark translucent bar at rest (readable on photo + emergency strip),
 * then switches to light glass after scroll.
 */
export function LandingHeader({ logoUrl }: { logoUrl?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("landing");
  const tFooter = useTranslations("footer");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const inverted = !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-bar"
          : "border-b border-white/10 bg-[rgba(4,22,20,0.42)] backdrop-blur-md"
      }`}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5 md:h-16 md:px-8">
        <Link
          href="/"
          className="shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <LogoWordmark iconSize={32} logoUrl={logoUrl} inverted={inverted} />
        </Link>

        <nav className="hidden items-center gap-4 xl:gap-5 lg:flex">
          {(
            [
              ["/chat", t("navChat")],
              ["/scan", t("navScan")],
              ["/explain", t("navExplain")],
              ["/mediator", t("navMediator")],
              ["/providers", t("navProviders")],
              ["/impact", tFooter("impact")],
            ] as const
          ).map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-semibold transition-colors ${
                inverted
                  ? "text-white/80 hover:text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguagePicker variant="landing" />
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
                ? "bg-white text-[var(--color-brand-900)] hover:bg-white/92"
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
