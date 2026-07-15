"use client";

import { useId } from "react";

/** Default product name — override with `NEXT_PUBLIC_APP_NAME`. */
const BRAND_MARK = () => process.env.NEXT_PUBLIC_APP_NAME?.trim() || "Redi Health";

type Props = {
  size?: number;
  className?: string;
  /** Render the dark inverted variant (white mark on transparent). */
  inverted?: boolean;
};

/**
 * Redi Health mark — teal gradient tile with a single Rod of Asclepius.
 * Aligned with PWA icons; no overlapping Roma wheel (reads as a "no" symbol).
 */
export function Logo({ size = 36, className, inverted = false }: Props) {
  const uid = useId().replace(/:/g, "");
  const gradId = `redi-bg-${uid}`;

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
        <rect width="40" height="40" rx="10" fill="currentColor" fillOpacity="0.14" />
        <path
          d="M20 9v22"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M24.2 12.2c-2.1 2.6-3.2 5-3.2 7.4a3 3 0 0 1-6 0c0-2.4 1.1-4.8 3.2-7.4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
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
        <linearGradient id={gradId} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="55%" stopColor="#0E8074" />
          <stop offset="100%" stopColor="#0C5A60" />
        </linearGradient>
      </defs>

      <rect width="40" height="40" rx="10" fill={`url(#${gradId})`} />

      {/* Rod of Asclepius — single clear symbol */}
      <path
        d="M20 9v22"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M24.2 12.2c-2.1 2.6-3.2 5-3.2 7.4a3 3 0 0 1-6 0c0-2.4 1.1-4.8 3.2-7.4"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      <rect
        width="40"
        height="40"
        rx="10"
        fill="none"
        stroke="rgba(15,23,42,0.08)"
        strokeWidth="1"
      />
    </svg>
  );
}

function WordmarkText({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (
      <span className="flex flex-col leading-[1.05]">
        <span className="font-display text-[0.95rem] font-extrabold tracking-tight text-[var(--color-brand-700)]">
          {parts[0]}
        </span>
        <span className="font-display text-[0.95rem] font-bold tracking-tight text-[var(--color-text-primary)]">
          {parts.slice(1).join(" ")}
        </span>
      </span>
    );
  }

  return (
    <span
      className="font-display text-[1.05rem] font-extrabold leading-none tracking-tight text-[var(--color-text-primary)]"
    >
      {name}
    </span>
  );
}

/** Horizontal lockup: mark + product wordmark (`NEXT_PUBLIC_APP_NAME` fallback). */
export function LogoWordmark({
  iconSize = 32,
  className,
  logoUrl,
}: {
  iconSize?: number;
  className?: string;
  logoUrl?: string;
}) {
  const name = BRAND_MARK();

  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      {logoUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={logoUrl} alt="" style={{ height: iconSize, width: "auto" }} />
      ) : (
        <Logo size={iconSize} />
      )}
      <WordmarkText name={name} />
    </span>
  );
}
