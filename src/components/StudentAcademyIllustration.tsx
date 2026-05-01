"use client";

import type { VisualTheme } from "@/data/student-health";

type Props = {
  visual: VisualTheme;
  title: string;
  variant?: "hero" | "card" | "lesson" | "thumb";
  compact?: boolean;
  className?: string;
};

export function StudentAcademyIllustration({
  visual,
  title,
  variant = "card",
  compact = false,
  className = "",
}: Props) {
  const height = compact ? 64 : variant === "hero" ? 220 : variant === "lesson" ? 260 : 150;
  const gradientId = `visual-${visual.subject}-${variant}-${compact ? "compact" : "wide"}`;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/40 shadow-sm ${className}`}
      style={{
        minHeight: height,
        background: `linear-gradient(135deg, ${visual.bg} 0%, #FFFFFF 54%, ${visual.accent}22 100%)`,
      }}
      aria-label={title}
    >
      <svg
        viewBox="0 0 640 360"
        className="absolute inset-0 h-full w-full"
        role="img"
        focusable="false"
      >
        <defs>
          <radialGradient id={`${gradientId}-sun`} cx="72%" cy="18%" r="45%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${gradientId}-hill`} x1="0" x2="1">
            <stop offset="0%" stopColor={visual.accent} stopOpacity="0.22" />
            <stop offset="100%" stopColor="#111827" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill={`url(#${gradientId}-sun)`} />
        <path
          d="M0 260 C110 210 180 245 285 212 C385 180 490 215 640 165 L640 360 L0 360 Z"
          fill={`url(#${gradientId}-hill)`}
        />
        <path
          d="M0 292 C125 250 238 291 344 250 C430 217 535 248 640 218 L640 360 L0 360 Z"
          fill="#fff"
          opacity="0.28"
        />
        <circle cx="500" cy="74" r="42" fill="#FBBF24" opacity="0.75" />
        <g transform="translate(72 82)">
          <rect x="0" y="86" width="215" height="126" rx="28" fill="#FFFFFF" opacity="0.88" />
          <rect x="24" y="112" width="116" height="14" rx="7" fill={visual.accent} opacity="0.7" />
          <rect x="24" y="142" width="166" height="10" rx="5" fill="#111827" opacity="0.18" />
          <rect x="24" y="164" width="134" height="10" rx="5" fill="#111827" opacity="0.14" />
          <circle cx="174" cy="83" r="44" fill="#111827" opacity="0.08" />
          <text
            x="174"
            y="100"
            textAnchor="middle"
            fontSize="52"
            fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
          >
            {subjectSymbol(visual.subject)}
          </text>
        </g>
        <g transform="translate(358 128)" opacity="0.95">
          <path d="M70 24 C116 24 154 62 154 108 C154 154 116 192 70 192 C24 192 -14 154 -14 108 C-14 62 24 24 70 24Z" fill="#FFFFFF" opacity="0.72" />
          <path d="M55 86 L92 108 L55 130 Z" fill={visual.accent} />
          <circle cx="71" cy="108" r="86" fill="none" stroke="#FFFFFF" strokeWidth="12" opacity="0.45" />
        </g>
        <g opacity="0.5">
          <circle cx="72" cy="54" r="4" fill="#fff" />
          <circle cx="122" cy="42" r="3" fill="#fff" />
          <circle cx="584" cy="150" r="4" fill="#fff" />
          <circle cx="548" cy="114" r="3" fill="#fff" />
        </g>
      </svg>
      {!compact && (
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="inline-flex rounded-full bg-white/85 px-3 py-1 text-xs font-black uppercase tracking-wider text-gray-900 backdrop-blur">
          {variant === "lesson" ? "Field guide" : "Student mission"}
          </div>
        </div>
      )}
    </div>
  );
}

function subjectSymbol(subject: VisualTheme["subject"]) {
  const symbols: Record<VisualTheme["subject"], string> = {
    emergency: "112",
    care: "+",
    water: "≈",
    shield: "◈",
    consent: "✓",
    airway: "!",
    lab: "⚕",
    vaccine: "V",
    world: "◎",
    aid: "✚",
    myth: "?",
    source: "⌕",
    capstone: "★",
  };
  return symbols[subject];
}
