"use client";

import { useId } from "react";

/** Default product name — override with `NEXT_PUBLIC_APP_NAME`. */
const BRAND_MARK = () => process.env.NEXT_PUBLIC_APP_NAME?.trim() || "Redi Health";

type Props = {
  size?: number;
  className?: string;
  /** Render the light mark for dark / photographic surfaces. */
  inverted?: boolean;
};

/**
 * Redi Health mark — soft squircle with a clean heart-plus (care + medical).
 */
export function Logo({ size = 36, className, inverted = false }: Props) {
  const uid = useId().replace(/:/g, "");
  const gradId = `redi-mark-${uid}`;

  // Rounded-square (squircle) path on a 40×40 canvas.
  const squircle =
    "M20 1.5C7.5 1.5 1.5 7.5 1.5 20S7.5 38.5 20 38.5 38.5 32.5 38.5 20 32.5 1.5 20 1.5Z";
  // Heart-plus glyph: a heart silhouette with a subtle cross cut suggestion.
  const heart =
    "M20 29.5c-.5 0-1-.18-1.4-.53-4.9-4.24-8.1-7.03-8.1-11.06 0-2.86 2.2-5.16 5-5.16 1.72 0 3.36.86 4.5 2.26 1.14-1.4 2.78-2.26 4.5-2.26 2.8 0 5 2.3 5 5.16 0 4.03-3.2 6.82-8.1 11.06-.4.35-.9.53-1.4.53Z";

  if (inverted) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={BRAND_MARK()}
        className={className}
      >
        <path d={squircle} fill="currentColor" fillOpacity="0.16" />
        <path d={squircle} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.4" />
        <path d={heart} fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={BRAND_MARK()}
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="6" y1="3" x2="33" y2="37" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2BC4A8" />
          <stop offset="52%" stopColor="#0E8074" />
          <stop offset="100%" stopColor="#084A44" />
        </linearGradient>
      </defs>

      <path d={squircle} fill={`url(#${gradId})`} />
      <path d={squircle} stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
      <path d={heart} fill="#FFFFFF" />
    </svg>
  );
}

function WordmarkText({
  name,
  inverted = false,
  size = "nav",
}: {
  name: string;
  inverted?: boolean;
  size?: "nav" | "hero";
}) {
  const parts = name.trim().split(/\s+/);
  const primary = inverted ? "text-white" : "text-[var(--color-brand-800)]";
  const secondary = inverted ? "text-white/80" : "text-[var(--color-ink-900)]";

  if (size === "hero") {
    return (
      <span className="flex flex-col leading-[0.92]">
        <span
          className={`font-headline tracking-[-0.04em] ${primary}`}
          style={{ fontSize: "clamp(3.25rem, 2.2rem + 5vw, 6.5rem)" }}
        >
          {parts[0] ?? name}
        </span>
        {parts.length > 1 ? (
          <span
            className={`font-headline mt-1 tracking-[-0.03em] ${secondary}`}
            style={{ fontSize: "clamp(2.4rem, 1.6rem + 3.8vw, 4.75rem)" }}
          >
            {parts.slice(1).join(" ")}
          </span>
        ) : null}
      </span>
    );
  }

  if (parts.length >= 2) {
    return (
      <span className="flex flex-col leading-[1.02]">
        <span className={`font-headline text-[1.05rem] tracking-[-0.03em] ${primary}`}>
          {parts[0]}
        </span>
        <span
          className={`font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] ${secondary}`}
        >
          {parts.slice(1).join(" ")}
        </span>
      </span>
    );
  }

  return (
    <span className={`font-headline text-[1.15rem] tracking-[-0.03em] ${primary}`}>
      {name}
    </span>
  );
}

/** Horizontal lockup: mark + product wordmark (`NEXT_PUBLIC_APP_NAME` fallback). */
export function LogoWordmark({
  iconSize = 32,
  className,
  logoUrl,
  inverted = false,
}: {
  iconSize?: number;
  className?: string;
  logoUrl?: string;
  inverted?: boolean;
}) {
  const name = BRAND_MARK();

  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      {logoUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={logoUrl} alt="" style={{ height: iconSize, width: "auto" }} />
      ) : (
        <Logo size={iconSize} inverted={inverted} className={inverted ? "text-white" : undefined} />
      )}
      <WordmarkText name={name} inverted={inverted} />
    </span>
  );
}

/** Hero-scale brand signal — wordmark dominates the first viewport. */
export function LogoHero({
  className,
  inverted = true,
}: {
  className?: string;
  inverted?: boolean;
}) {
  const name = BRAND_MARK();
  return (
    <div className={`flex flex-col gap-5 ${className ?? ""}`}>
      <Logo
        size={58}
        inverted={inverted}
        className={inverted ? "text-white drop-shadow-sm" : undefined}
      />
      <WordmarkText name={name} inverted={inverted} size="hero" />
    </div>
  );
}
