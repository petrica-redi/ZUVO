import Image from "next/image";
import { Link } from "@/navigation";
import type { StaticImageData } from "next/image";

type MosaicTile = {
  href: string;
  /** Path under `public/` or imported static asset */
  src: string | StaticImageData;
  label: string;
  alt: string;
};

export function LandingVisualMosaic({
  eyebrow,
  title,
  lead,
  tiles,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  tiles: MosaicTile[];
}) {
  return (
    <section aria-labelledby="visual-mosaic-heading" className="bg-[var(--color-bg-canvas)]">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
        <header className="mb-10 max-w-2xl md:mb-12">
          <p className="eyebrow">{eyebrow}</p>
          <h2
            id="visual-mosaic-heading"
            className="font-headline mt-3 leading-[1.06] text-[var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.625rem, 1.05rem + 1.9vw, 2.375rem)" }}
          >
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
            {lead}
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {tiles.map(({ href, src, label, alt }) => (
            <Link
              key={href}
              href={href}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] shadow-1 outline-none ring-[var(--color-accent)]/30 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-brand-300)] hover:shadow-3 focus-visible:ring-4"
              style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-ink-900)]/92 via-[var(--color-ink-900)]/55 to-transparent pt-24 pb-4 px-4"
                aria-hidden
              />
              <span className="absolute inset-x-0 bottom-4 px-4 text-center font-display text-[13px] font-extrabold tracking-tight text-white drop-shadow-md md:text-sm">
                {label}
              </span>
              <ArrowHint />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowHint() {
  return (
    <span
      aria-hidden
      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--color-text-primary)] opacity-70 shadow-md backdrop-blur transition-all group-hover:opacity-100"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden stroke="currentColor" fill="none" strokeWidth={2.25}>
        <path d="M7 17L17 7M17 7H9M17 7V15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
