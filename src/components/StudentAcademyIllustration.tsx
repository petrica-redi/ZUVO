"use client";

import type { VisualTheme } from "@/data/student-health";
import { cn } from "./ui/cn";

type Props = {
  visual: VisualTheme;
  title: string;
  variant?: "hero" | "card" | "lesson" | "thumb";
  compact?: boolean;
  className?: string;
  showLabel?: boolean;
  labelText?: string;
};

/**
 * v0-grade refined illustration. Hand-tuned SVG composition per subject:
 * layered horizon, soft gradients, tactile foreground card, contextual glyph.
 */
export function StudentAcademyIllustration({
  visual,
  title,
  variant = "card",
  compact = false,
  className,
  showLabel = false,
  labelText,
}: Props) {
  const minHeight = compact ? 56 : variant === "hero" ? 240 : variant === "lesson" ? 280 : 160;
  const id = `vis-${visual.subject}-${variant}-${compact ? "c" : "f"}`;
  const accentMid = `${visual.accent}66`;

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden border border-white/40 shadow-sm",
        compact ? "rounded-2xl" : "rounded-[28px]",
        className,
      )}
      style={{
        minHeight,
        background: `radial-gradient(120% 80% at 110% -10%, ${accentMid} 0%, transparent 60%), linear-gradient(180deg, ${visual.bg} 0%, #FFFFFF 100%)`,
      }}
      aria-label={title}
      role="img"
    >
      <svg
        viewBox="0 0 720 360"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        focusable="false"
      >
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={visual.accent} stopOpacity="0.18" />
            <stop offset="100%" stopColor={visual.accent} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-foreground`} x1="0" x2="1">
            <stop offset="0%" stopColor={visual.accent} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id={`${id}-card`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.78" />
          </linearGradient>
          <radialGradient id={`${id}-orb`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={visual.accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={visual.accent} stopOpacity="0" />
          </radialGradient>
          <pattern id={`${id}-grid`} width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#0F172A" strokeOpacity="0.04" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Sky wash */}
        <rect width="720" height="360" fill={`url(#${id}-sky)`} />
        {/* Subtle topo grid */}
        <rect width="720" height="360" fill={`url(#${id}-grid)`} />

        {/* Horizon ridges */}
        <path
          d="M0 250 C90 215 180 248 290 220 C400 192 510 226 720 188 L720 360 L0 360 Z"
          fill={`url(#${id}-foreground)`}
          opacity="0.22"
        />
        <path
          d="M0 286 C140 252 240 282 360 250 C480 220 600 248 720 222 L720 360 L0 360 Z"
          fill="#FFFFFF"
          opacity="0.32"
        />

        {/* Atmospheric orb */}
        <circle cx="582" cy="92" r="72" fill={`url(#${id}-orb)`} />

        {/* Foreground composition */}
        {compact ? (
          <CompactComposition id={id} accent={visual.accent} subject={visual.subject} />
        ) : (
          <FullComposition id={id} accent={visual.accent} subject={visual.subject} />
        )}
      </svg>

      {showLabel && !compact && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
          <div
            className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-gray-900 shadow-sm backdrop-blur"
            style={{ color: visual.fg }}
          >
            <span aria-hidden style={{ color: visual.accent }}>●</span>
            {labelText ?? subjectLabel(visual.subject)}
          </div>
        </div>
      )}
    </div>
  );
}

function FullComposition({ id, accent, subject }: { id: string; accent: string; subject: VisualTheme["subject"] }) {
  return (
    <g>
      {/* Editorial card */}
      <g transform="translate(72 78)">
        <rect x="0" y="0" width="280" height="200" rx="24" fill={`url(#${id}-card)`} />
        <rect x="24" y="28" width="120" height="10" rx="5" fill={accent} opacity="0.85" />
        <rect x="24" y="50" width="200" height="8" rx="4" fill="#0F172A" opacity="0.18" />
        <rect x="24" y="68" width="170" height="8" rx="4" fill="#0F172A" opacity="0.14" />
        <rect x="24" y="86" width="140" height="8" rx="4" fill="#0F172A" opacity="0.12" />
        <rect x="24" y="118" width="80" height="36" rx="18" fill={accent} opacity="0.18" />
        <rect x="112" y="118" width="56" height="36" rx="18" fill={accent} opacity="0.10" />
        <rect x="24" y="166" width="232" height="6" rx="3" fill="#0F172A" opacity="0.08" />
      </g>

      {/* Glyph badge */}
      <g transform="translate(440 90)">
        <circle cx="80" cy="80" r="80" fill="#FFFFFF" opacity="0.92" />
        <circle cx="80" cy="80" r="80" fill="none" stroke={accent} strokeOpacity="0.35" strokeWidth="3" strokeDasharray="2 8" />
        <SubjectGlyph subject={subject} accent={accent} />
      </g>

      {/* Accent dots */}
      <g opacity="0.55">
        <circle cx="84" cy="46" r="3" fill="#FFFFFF" />
        <circle cx="118" cy="34" r="2.5" fill="#FFFFFF" />
        <circle cx="640" cy="200" r="3" fill="#FFFFFF" />
        <circle cx="666" cy="248" r="2.5" fill="#FFFFFF" />
      </g>
    </g>
  );
}

function CompactComposition({
  id,
  accent,
  subject,
}: {
  id: string;
  accent: string;
  subject: VisualTheme["subject"];
}) {
  return (
    <g transform="translate(180 90)">
      <circle cx="180" cy="90" r="120" fill="#FFFFFF" opacity="0.9" />
      <circle cx="180" cy="90" r="120" fill="none" stroke={accent} strokeOpacity="0.4" strokeWidth="3" strokeDasharray="3 9" />
      <g transform="translate(110 20)">
        <SubjectGlyph subject={subject} accent={accent} />
      </g>
      {/* Subtle decorative dots tied to gradient id */}
      <g opacity="0.35">
        <circle cx="50" cy="60" r="3" fill={`url(#${id}-orb)`} />
        <circle cx="320" cy="120" r="3" fill={`url(#${id}-orb)`} />
      </g>
    </g>
  );
}

function SubjectGlyph({ subject, accent }: { subject: VisualTheme["subject"]; accent: string }) {
  const stroke = "#0F172A";
  const fill = "#FFFFFF";

  switch (subject) {
    case "emergency":
      return (
        <g transform="translate(20 10)">
          <rect x="20" y="18" width="100" height="92" rx="18" fill={accent} opacity="0.15" />
          <rect x="32" y="32" width="76" height="64" rx="10" fill={fill} stroke={stroke} strokeOpacity="0.12" />
          <text x="70" y="78" textAnchor="middle" fontSize="32" fontWeight="900" fill={accent} fontFamily="ui-sans-serif, system-ui, sans-serif">112</text>
          <path d="M44 110 L52 124 L62 110" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "care":
    case "aid":
      return (
        <g transform="translate(36 14)">
          <rect x="0" y="20" width="100" height="80" rx="18" fill={fill} />
          <rect x="44" y="32" width="12" height="56" rx="3" fill={accent} />
          <rect x="22" y="54" width="56" height="12" rx="3" fill={accent} />
          <rect x="0" y="20" width="100" height="80" rx="18" fill="none" stroke={accent} strokeOpacity="0.25" strokeWidth="2" />
        </g>
      );
    case "water":
      return (
        <g transform="translate(40 10)">
          <path d="M50 4 C 22 60, 18 96, 50 116 C 82 96, 78 60, 50 4 Z" fill={accent} opacity="0.25" />
          <path d="M50 14 C 30 60, 28 96, 50 110 C 72 96, 70 60, 50 14 Z" fill={fill} stroke={accent} strokeWidth="2" />
        </g>
      );
    case "shield":
      return (
        <g transform="translate(38 10)">
          <path d="M50 6 L96 22 L96 70 C96 98 76 116 50 122 C24 116 4 98 4 70 L4 22 Z" fill={accent} opacity="0.22" />
          <path d="M50 18 L84 30 L84 70 C84 92 70 104 50 110 C30 104 16 92 16 70 L16 30 Z" fill={fill} />
          <path d="M30 64 L46 80 L72 50" stroke={accent} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "consent":
      return (
        <g transform="translate(28 14)">
          <rect x="0" y="20" width="60" height="42" rx="14" fill={fill} stroke={accent} strokeOpacity="0.5" strokeWidth="2" />
          <rect x="44" y="58" width="60" height="42" rx="14" fill={accent} opacity="0.85" />
          <path d="M14 36 L26 36" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          <path d="M14 46 L40 46" stroke={accent} strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
          <path d="M58 76 L82 76" stroke={fill} strokeWidth="3" strokeLinecap="round" />
          <path d="M58 86 L92 86" stroke={fill} strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "airway":
      return (
        <g transform="translate(28 14)">
          <circle cx="50" cy="60" r="42" fill={accent} opacity="0.18" />
          <circle cx="50" cy="60" r="32" fill={fill} stroke={accent} strokeWidth="3" />
          <path d="M40 50 Q50 32 60 50" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M40 70 Q50 88 60 70" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="60" r="6" fill={accent} />
        </g>
      );
    case "lab":
      return (
        <g transform="translate(34 12)">
          <path d="M40 6 L80 6 L80 38 L96 90 C100 102 92 116 78 116 L42 116 C28 116 20 102 24 90 L40 38 Z" fill={fill} stroke={accent} strokeWidth="2" />
          <path d="M30 86 L90 86" stroke={accent} strokeOpacity="0.45" strokeWidth="3" />
          <circle cx="48" cy="98" r="4" fill={accent} />
          <circle cx="64" cy="104" r="3" fill={accent} opacity="0.7" />
          <rect x="36" y="0" width="48" height="10" rx="3" fill={accent} />
        </g>
      );
    case "vaccine":
      return (
        <g transform="translate(20 30)">
          <rect x="14" y="44" width="98" height="22" rx="6" fill={fill} stroke={accent} strokeWidth="2" />
          <rect x="14" y="50" width="74" height="10" rx="3" fill={accent} opacity="0.45" />
          <rect x="0" y="50" width="14" height="10" rx="2" fill={accent} />
          <rect x="112" y="48" width="14" height="14" rx="3" fill={accent} opacity="0.8" />
          <path d="M126 55 L138 49 L138 61 Z" fill={accent} />
          <path d="M58 88 Q66 76 74 88" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case "world":
      return (
        <g transform="translate(28 14)">
          <circle cx="50" cy="60" r="46" fill={accent} opacity="0.18" />
          <circle cx="50" cy="60" r="38" fill={fill} stroke={accent} strokeWidth="3" />
          <path d="M12 60 H88" stroke={accent} strokeOpacity="0.5" strokeWidth="2" />
          <path d="M50 22 V98" stroke={accent} strokeOpacity="0.5" strokeWidth="2" />
          <path d="M22 38 Q50 60 78 38" stroke={accent} strokeOpacity="0.5" strokeWidth="2" fill="none" />
          <path d="M22 82 Q50 60 78 82" stroke={accent} strokeOpacity="0.5" strokeWidth="2" fill="none" />
        </g>
      );
    case "myth":
      return (
        <g transform="translate(32 20)">
          <path d="M50 6 C24 6 8 26 8 50 C8 70 22 84 38 90 L42 110 L62 88 C82 84 92 68 92 50 C92 26 76 6 50 6 Z" fill={fill} stroke={accent} strokeWidth="2" />
          <text x="48" y="62" textAnchor="middle" fontSize="44" fontWeight="900" fill={accent} fontFamily="ui-sans-serif, system-ui, sans-serif">?</text>
        </g>
      );
    case "source":
      return (
        <g transform="translate(20 18)">
          <rect x="0" y="6" width="92" height="84" rx="12" fill={fill} stroke={accent} strokeWidth="2" />
          <rect x="14" y="22" width="50" height="6" rx="3" fill={accent} />
          <rect x="14" y="38" width="64" height="6" rx="3" fill="#0F172A" opacity="0.15" />
          <rect x="14" y="54" width="56" height="6" rx="3" fill="#0F172A" opacity="0.12" />
          <circle cx="92" cy="92" r="22" fill={fill} stroke={accent} strokeWidth="3" />
          <path d="M108 108 L122 122" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "capstone":
      return (
        <g transform="translate(28 14)">
          <path d="M50 6 L60 36 L92 38 L66 58 L74 90 L50 72 L26 90 L34 58 L8 38 L40 36 Z" fill={accent} opacity="0.85" />
          <path d="M50 16 L57 36 L78 37 L62 50 L67 70 L50 58 L33 70 L38 50 L22 37 L43 36 Z" fill={fill} />
        </g>
      );
    default:
      return null;
  }
}

function subjectLabel(subject: VisualTheme["subject"]): string {
  const labels: Record<VisualTheme["subject"], string> = {
    emergency: "Emergency response",
    care: "Bystander care",
    water: "Burns & cooling",
    shield: "Sexual health",
    consent: "Consent & boundaries",
    airway: "Airway response",
    lab: "Testing & treatment",
    vaccine: "Immunisation",
    world: "Global disease",
    aid: "First aid review",
    myth: "Myth-busting",
    source: "Source literacy",
    capstone: "Capstone mission",
  };
  return labels[subject];
}
