"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Accent = "brand" | "ember" | "sage" | "danger" | "ink" | "violet";

const ACCENTS: Record<
  Accent,
  {
    bg: string;
    dot: string;
    iconBg: string;
    iconText: string;
  }
> = {
  brand: {
    bg: "from-[var(--color-brand-50)] via-white to-[var(--color-brand-50)]",
    dot: "var(--color-brand-600)",
    iconBg: "from-[var(--color-ink-900)] to-[var(--color-brand-700)]",
    iconText: "text-white",
  },
  ember: {
    bg: "from-[var(--color-ember-50)] via-white to-[var(--color-ember-100)]",
    dot: "var(--color-ember-500)",
    iconBg: "from-[var(--color-ember-500)] to-[var(--color-ember-700)]",
    iconText: "text-white",
  },
  sage: {
    bg: "from-[var(--color-sage-50)] via-white to-[var(--color-sage-100)]",
    dot: "var(--color-sage-500)",
    iconBg: "from-[var(--color-sage-500)] to-[var(--color-sage-700)]",
    iconText: "text-white",
  },
  danger: {
    bg: "from-rose-50 via-white to-orange-50",
    dot: "#DC2626",
    iconBg: "from-rose-500 to-orange-600",
    iconText: "text-white",
  },
  ink: {
    bg: "from-[var(--color-neutral-100)] via-white to-[var(--color-brand-50)]",
    dot: "var(--color-ink-900)",
    iconBg: "from-[var(--color-ink-900)] to-[#0F3D38]",
    iconText: "text-white",
  },
  violet: {
    bg: "from-[#F5F3FF] via-white to-[#EDE9FE]",
    dot: "#6D28D9",
    iconBg: "from-[#7C3AED] to-[#5B21B6]",
    iconText: "text-white",
  },
};

/**
 * Compact tool header — text + icon only. Photographic heroes were removed
 * so pages open straight on functionality.
 */
export function ToolHero({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  accent = "violet",
  aside,
  children,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: Accent;
  aside?: ReactNode;
  /** @deprecated Ignored — photo heroes removed in favour of tool-first layouts. */
  heroImage?: { src: string; alt: string };
  children?: ReactNode;
}) {
  const a = ACCENTS[accent];

  return (
    <section
      className={`relative mb-5 overflow-hidden rounded-[22px] border border-[var(--color-border-subtle)] bg-gradient-to-br ${a.bg} shadow-1`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 grain-overlay opacity-40" />
      <div className="relative p-4 md:p-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${a.iconBg} grain-overlay shadow-2`}
          >
            <Icon className={`lucide h-5 w-5 ${a.iconText}`} strokeWidth={1.85} />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-secondary)] shadow-1 backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: a.dot }} />
            {eyebrow}
          </span>
        </div>
        <h1
          className="font-headline mt-3 leading-[1.08] text-[var(--color-text-primary)]"
          style={{
            fontSize: "clamp(1.45rem, 1.1rem + 1.2vw, 2rem)",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 max-w-prose text-sm font-medium leading-relaxed text-[var(--color-text-secondary)]">
            {subtitle}
          </p>
        ) : null}
        {children ? <div className="mt-3">{children}</div> : null}
        {aside ? <div className="mt-3">{aside}</div> : null}
      </div>
    </section>
  );
}
