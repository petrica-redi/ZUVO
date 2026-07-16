"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import Image from "next/image";

type Accent = "brand" | "ember" | "sage" | "danger" | "ink";

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
    bg: "from-[var(--color-brand-50)] via-[var(--color-cream-50,#F7F4EE)] to-white",
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
};

/**
 * Editorial hero for tool pages — full-bleed photographic panel by default
 * when `heroImage` is provided (premium register, not inset SVG cards).
 */
export function ToolHero({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  accent = "brand",
  aside,
  heroImage,
  children,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: Accent;
  aside?: ReactNode;
  /** Premium surface photograph — rendered as a full-bleed media plane. */
  heroImage?: { src: string; alt: string };
  children?: ReactNode;
}) {
  const a = ACCENTS[accent];

  if (heroImage) {
    return (
      <section className="surface-hero relative mb-6 overflow-hidden rounded-[28px] border border-[var(--color-border-subtle)] shadow-2 md:rounded-[32px]">
        <div className="relative min-h-[280px] md:min-h-[320px]">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 960px"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink-900)]/88 via-[var(--color-ink-900)]/55 to-[var(--color-ink-900)]/20"
            aria-hidden
          />
          <div className="relative flex h-full min-h-[280px] flex-col justify-end p-5 md:min-h-[320px] md:p-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/12 text-white ring-1 ring-white/25 backdrop-blur-md md:h-12 md:w-12`}
                >
                  <Icon className="lucide h-5 w-5 md:h-6 md:w-6" strokeWidth={1.85} />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-brand-300)]" />
                  {eyebrow}
                </span>
              </div>
              <h1
                className="font-headline mt-4 leading-[1.02] text-white"
                style={{
                  fontSize: "clamp(1.75rem, 1.2rem + 1.8vw, 2.75rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-white/78 md:text-[15px]">
                  {subtitle}
                </p>
              ) : null}
              {children ? <div className="mt-4">{children}</div> : null}
              {aside ? <div className="mt-4">{aside}</div> : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative mb-6 overflow-hidden rounded-[28px] border border-[var(--color-border-subtle)] bg-gradient-to-br ${a.bg} shadow-1 md:rounded-[32px]`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 grain-overlay opacity-50" />
      <div className="relative p-5 md:p-7">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${a.iconBg} grain-overlay shadow-2 md:h-14 md:w-14`}
          >
            <Icon className={`lucide h-6 w-6 ${a.iconText} md:h-7 md:w-7`} strokeWidth={1.85} />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-secondary)] shadow-1 backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: a.dot }} />
            {eyebrow}
          </span>
        </div>
        <h1
          className="font-headline mt-4 leading-[1.02] text-[var(--color-text-primary)]"
          style={{
            fontSize: "clamp(1.625rem, 1.15rem + 1.6vw, 2.5rem)",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-[15px]">
            {subtitle}
          </p>
        ) : null}
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </section>
  );
}
