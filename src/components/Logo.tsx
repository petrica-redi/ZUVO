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
 * Community health mark: Roma flag (blue / green) with a central Rod of Asclepius.
 * Built to stay legible from favicon size up to header lockups.
 */
export function Logo({ size = 36, className, inverted = false }: Props) {
  const uid = useId().replace(/:/g, "");
  const bgId = `zuvo-flag-${uid}`;

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
        <rect width="40" height="40" rx="11" fill="currentColor" fillOpacity="0.12" />
        <path
          d="M20 10v20M14 16h12M14 24h12"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M20 12c-3 4-5 7-5 10a5 5 0 0 0 10 0c0-3-2-6-5-10z"
          stroke="currentColor"
          strokeWidth="1.8"
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
        <clipPath id={`${bgId}-clip`}>
          <rect width="40" height="40" rx="11" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${bgId}-clip)`}>
        <rect width="40" height="20" fill="#0038A8" />
        <rect y="20" width="40" height="20" fill="#006B3F" />
        {/* Roma wheel (simplified) */}
        <circle cx="20" cy="20" r="7.5" fill="none" stroke="#C8102E" strokeWidth="1.6" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const x1 = 20 + Math.cos(a) * 3.2;
          const y1 = 20 + Math.sin(a) * 3.2;
          const x2 = 20 + Math.cos(a) * 7.2;
          const y2 = 20 + Math.sin(a) * 7.2;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#C8102E"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          );
        })}
        {/* Rod of Asclepius */}
        <path
          d="M20 11.5v17"
          stroke="#F8FAFC"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M15.5 16h9M15.5 24h9" stroke="#F8FAFC" strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M23.5 14.5c-2.2 2.8-3.2 5.2-3.2 7.2a3.2 3.2 0 0 1-6.4 0c0-2 1-4.4 3.2-7.2"
          stroke="#F8FAFC"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      <rect
        width="40"
        height="40"
        rx="11"
        fill="none"
        stroke="rgba(15,23,42,0.12)"
        strokeWidth="1"
      />
    </svg>
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
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      {logoUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={logoUrl} alt="Logo" style={{ height: iconSize, width: "auto" }} />
      ) : (
        <Logo size={iconSize} />
      )}
      <span
        className="font-display text-[1.125rem] font-extrabold leading-none text-[var(--color-text-primary)]"
        style={{ letterSpacing: "-0.025em" }}
      >
        {BRAND_MARK()}
      </span>
    </span>
  );
}
