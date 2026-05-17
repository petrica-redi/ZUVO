/** Default product name — override with `NEXT_PUBLIC_APP_NAME`. */
const BRAND_MARK = () => process.env.NEXT_PUBLIC_APP_NAME?.trim() || "Redi Health";

type Props = {
  size?: number;
  className?: string;
  /** Render the dark inverted variant (white mark on transparent). */
  inverted?: boolean;
};

/**
 * Redi Health brand mark — a sunrise-over-horizon glyph in a soft squircle.
 *
 * The rising sun over a horizon reads as vitality returning daily; the arcs double
 * as a soft logomark. Built to stay legible down to ~16px.
 */
export function Logo({ size = 36, className, inverted = false }: Props) {
  const fg = inverted ? "#FFFFFF" : "url(#redi-mark-bg)";
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
        <linearGradient id="redi-mark-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="55%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
        <radialGradient id="redi-mark-glow" cx="0.7" cy="0.25" r="0.7">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Squircle base */}
      <rect width="40" height="40" rx="11" fill={fg} />
      {/* Sun-glow accent (skipped on inverted) */}
      {!inverted && <rect width="40" height="40" rx="11" fill="url(#redi-mark-glow)" />}

      {/* Horizon line */}
      <path
        d="M9 27 H31"
        stroke={inverted ? "currentColor" : "#FFFFFF"}
        strokeOpacity={inverted ? "0.85" : "0.85"}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Rising sun arc */}
      <path
        d="M11.5 27 A8.5 8.5 0 0 1 28.5 27"
        stroke={inverted ? "currentColor" : "#FFFFFF"}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Sun core */}
      <circle cx="20" cy="22.5" r="2.6" fill="#FBBF24" />
      <circle
        cx="20"
        cy="22.5"
        r="2.6"
        fill="none"
        stroke={inverted ? "currentColor" : "#FFFFFF"}
        strokeOpacity={inverted ? "0.6" : "0.4"}
        strokeWidth="0.8"
      />

      {/* Subtle ray hint */}
      <path
        d="M20 14 V11.5"
        stroke="#FBBF24"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Horizontal lockup: mark + product wordmark (`NEXT_PUBLIC_APP_NAME` fallback). */
export function LogoWordmark({
  iconSize = 32,
  className,
}: {
  iconSize?: number;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <Logo size={iconSize} />
      <span
        className="font-display text-[1.125rem] font-extrabold leading-none text-[var(--color-text-primary)]"
        style={{ letterSpacing: "-0.025em" }}
      >
        {BRAND_MARK()}
      </span>
    </span>
  );
}
