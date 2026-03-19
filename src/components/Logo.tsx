type Props = {
  size?: number;
  className?: string;
};

/**
 * Sastipe wordmark logo — red rounded square with an "S" formed from two arcs.
 * Scales cleanly at any size.
 */
export function Logo({ size = 36, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-label="Sastipe"
      className={className}
    >
      <rect width="36" height="36" rx="10" fill="#C0392B" />
      {/* Upper arc */}
      <path
        d="M12 14a4 4 0 014-4h4a4 4 0 010 8h-4"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower arc */}
      <path
        d="M16 18h4a4 4 0 010 8h-4a4 4 0 01-4-4"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Horizontal lockup: icon + "Sastipe" wordmark */
export function LogoWordmark({ iconSize = 32 }: { iconSize?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <Logo size={iconSize} />
      <span
        className="text-[1.15rem] font-bold tracking-tight text-gray-900"
        style={{ letterSpacing: "-0.02em" }}
      >
        Sastipe
      </span>
    </span>
  );
}
