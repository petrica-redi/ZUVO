type Props = {
  size?: number;
  className?: string;
  /** Render the dark inverted variant (white mark on transparent). */
  inverted?: boolean;
};

/**
 * Sastipe brand mark — a sunrise-over-horizon glyph in a soft squircle.
 *
 * Concept: "sastipe" is the Romani word for health and wholeness. The mark is a
 * rising sun over a steady horizon — health as something that returns each day.
 * The two arcs read as both a sunrise *and* a stylised "S".
 *
 * Built to be readable down to 16px and crisp at any scale.
 */
export function Logo({ size = 36, className, inverted = false }: Props) {
  const fg = inverted ? "#FFFFFF" : "url(#sastipe-mark-bg)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sastipe"
      className={className}
    >
      <defs>
        <linearGradient id="sastipe-mark-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="55%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
        <radialGradient id="sastipe-mark-glow" cx="0.7" cy="0.25" r="0.7">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Squircle base */}
      <rect width="40" height="40" rx="11" fill={fg} />
      {/* Sun-glow accent (skipped on inverted) */}
      {!inverted && <rect width="40" height="40" rx="11" fill="url(#sastipe-mark-glow)" />}

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

/**
 * Horizontal lockup: mark + Sastipe wordmark.
 *
 * Letterspacing is tuned to read as a designed wordmark, not a styled string.
 */
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
        Sastipe
      </span>
    </span>
  );
}
