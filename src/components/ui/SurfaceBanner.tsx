import Image from "next/image";
import type { SurfaceId } from "@/lib/visuals/surfaces";
import { surfaceVisual } from "@/lib/visuals/surfaces";

/**
 * Full-bleed photographic band for pages that aren't tool flows
 * (impact, methodology, mediator, providers).
 */
export function SurfaceBanner({
  surface,
  eyebrow,
  title,
  lead,
  compact = false,
}: {
  surface: SurfaceId;
  eyebrow: string;
  title: string;
  lead?: string;
  compact?: boolean;
}) {
  const visual = surfaceVisual(surface);

  return (
    <section
      className={`surface-hero relative overflow-hidden rounded-[28px] border border-[var(--color-border-subtle)] shadow-2 md:rounded-[32px] ${
        compact ? "mb-6" : "mb-8"
      }`}
    >
      <div className={`relative ${compact ? "min-h-[200px] md:min-h-[240px]" : "min-h-[260px] md:min-h-[340px]"}`}>
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          priority
          className="object-cover animate-surface-ken"
          sizes="(max-width: 768px) 100vw, 1100px"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink-900)]/90 via-[var(--color-ink-900)]/60 to-[var(--color-ink-900)]/25"
          aria-hidden
        />
        <div className="relative flex h-full flex-col justify-end p-5 md:p-8">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/60">
            {eyebrow}
          </p>
          <h1
            className="font-headline mt-2 max-w-2xl leading-[1.02] text-white"
            style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 3rem)" }}
          >
            {title}
          </h1>
          {lead ? (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 md:text-[15px]">
              {lead}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
