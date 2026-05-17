"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Accent = "brand" | "ember" | "sage" | "danger";

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
    bg: "from-[var(--color-brand-50)] via-white to-[var(--color-brand-100)]",
    dot: "var(--color-brand-500)",
    iconBg: "from-[var(--color-brand-500)] to-[var(--color-brand-700)]",
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
};

/**
 * Editorial hero for individual tool pages — gives /symptoms, /scan,
 * /chat, /explain etc. the same premium register as the landing and
 * Academy. Composable: pass an `aside` to render a beat next to the
 * headline (a stat card, a chip, etc.).
 */
export function ToolHero({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  accent = "brand",
  aside,
  children,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: Accent;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const a = ACCENTS[accent];

  return (
    <section
      className={`relative mb-6 overflow-hidden rounded-[28px] border border-[var(--color-border-subtle)] bg-gradient-to-br ${a.bg} shadow-1 md:rounded-[32px]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grain-overlay opacity-50"
      />
      <div className="relative grid items-start gap-4 p-5 md:grid-cols-[1fr_auto] md:gap-6 md:p-7">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${a.iconBg} grain-overlay shadow-2 md:h-14 md:w-14`}
            >
              <Icon className={`lucide h-6 w-6 ${a.iconText} md:h-7 md:w-7`} strokeWidth={1.85} />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-secondary)] shadow-1 backdrop-blur">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: a.dot }}
              />
              {eyebrow}
            </span>
          </div>

          <h1
            className="font-editorial mt-4 font-medium leading-[1.02] text-[var(--color-text-primary)]"
            style={{
              fontSize: "clamp(1.625rem, 1.15rem + 1.6vw, 2.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-[15px]">
              {subtitle}
            </p>
          )}

          {children && <div className="mt-4">{children}</div>}
        </div>

        {aside && <div className="flex shrink-0 items-start md:self-start">{aside}</div>}
      </div>
    </section>
  );
}
