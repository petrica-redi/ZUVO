"use client";

import { useId } from "react";

type Props = {
  size?: number;
  className?: string;
};

/**
 * Sastipe app icon — warm gradient, soft inner highlight, “S” from two strokes.
 * Scales cleanly at any size.
 */
export function Logo({ size = 36, className }: Props) {
  const uid = useId();
  const gid = `sastipe-g-${uid.replace(/:/g, "")}`;
  const sid = `sastipe-s-${uid.replace(/:/g, "")}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-label="Sastipe"
      className={className}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E74C3C" />
          <stop offset="0.5" stopColor="#C0392B" />
          <stop offset="1" stopColor="#A93226" />
        </linearGradient>
        <linearGradient id={sid} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="white" stopOpacity="0.22" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="11" fill={`url(#${gid})`} />
      <rect width="36" height="18" rx="11" fill={`url(#${sid})`} />
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
        className="text-[1.12rem] font-extrabold tracking-[-0.04em] text-slate-900"
      >
        Sastipe
      </span>
    </span>
  );
}
