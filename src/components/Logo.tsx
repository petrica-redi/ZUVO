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
 * Redi Health mark — circular Adriatic seal with a rising care path.
 * Reads as community health + continuity, not a generic clinic tile.
 */
export function Logo({ size = 36, className, inverted = false }: Props) {
  const uid = useId().replace(/:/g, "");
  const gradId = `redi-seal-${uid}`;
  const ringId = `redi-ring-${uid}`;

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
        <circle cx="20" cy="20" r="19" fill="currentColor" fillOpacity="0.14" />
        <circle
          cx="20"
          cy="20"
          r="18.25"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <path
          d="M12.5 24.5c2.2-1.1 3.6-2.8 4.2-5.1.4-1.6 1.1-2.4 2.2-2.4 1.3 0 2 .9 2.5 2.6.7 2.4 1.8 4.1 4.1 5.1"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="20" cy="12.2" r="1.7" fill="currentColor" />
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
        <linearGradient id={gradId} x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2BC4A8" />
          <stop offset="45%" stopColor="#0E8074" />
          <stop offset="100%" stopColor="#063D3A" />
        </linearGradient>
        <linearGradient id={ringId} x1="20" y1="2" x2="20" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <circle cx="20" cy="20" r="19" fill={`url(#${gradId})`} />
      <circle cx="20" cy="20" r="18.25" stroke={`url(#${ringId})`} strokeWidth="1.5" />

      {/* Rising care path — continuity of community health */}
      <path
        d="M12.5 24.5c2.2-1.1 3.6-2.8 4.2-5.1.4-1.6 1.1-2.4 2.2-2.4 1.3 0 2 .9 2.5 2.6.7 2.4 1.8 4.1 4.1 5.1"
        stroke="#FFFFFF"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="20" cy="12.2" r="1.85" fill="#FFFFFF" />
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
  const secondary = inverted ? "text-white/85" : "text-[var(--color-ink-900)]";

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
        size={56}
        inverted={inverted}
        className={inverted ? "text-white drop-shadow-sm" : undefined}
      />
      <WordmarkText name={name} inverted={inverted} size="hero" />
    </div>
  );
}
