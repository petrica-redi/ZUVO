"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";

export type StageMark = {
  stage: "local" | "regional" | "national";
  status: "complete" | "current" | "locked" | "unlocked";
  completion: number; // 0–100
};

/**
 * Editorial Journey Map — a curved SVG path joining the three stages with
 * milestone medallions, status chips, and a "you are here" marker.
 */
export function JourneyMap({ stages }: { stages: StageMark[] }) {
  const t = useTranslations("studentHealth.l8");

  // Layout points along the curve.
  const points = [
    { x: 90, y: 150 },
    { x: 400, y: 80 },
    { x: 710, y: 150 },
  ];

  return (
    <div
      className="relative w-full"
      role="group"
      aria-label={t("journeyTitle")}
    >
      <svg
        viewBox="0 0 800 220"
        className="h-auto w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="journey-path" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-ember-400)" />
            <stop offset="55%" stopColor="var(--color-brand-500)" />
            <stop offset="100%" stopColor="var(--color-sage-500)" />
          </linearGradient>
          <linearGradient id="journey-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(15,23,42,0.06)" />
            <stop offset="100%" stopColor="rgba(15,23,42,0)" />
          </linearGradient>
        </defs>

        {/* Soft drop shadow under path */}
        <path
          d="M 90 162 Q 245 92 400 92 Q 555 92 710 162"
          fill="none"
          stroke="url(#journey-shadow)"
          strokeWidth="22"
          strokeLinecap="round"
        />

        {/* Dotted "future" background path */}
        <path
          d="M 90 150 Q 245 80 400 80 Q 555 80 710 150"
          fill="none"
          stroke="rgba(14,128,116,0.18)"
          strokeWidth="3"
          strokeDasharray="2 8"
          strokeLinecap="round"
        />

        {/* Progress path (drawn up to the current stage) */}
        <ProgressPath stages={stages} />

        {/* Tiny accent confetti */}
        <g opacity="0.7">
          <circle cx="180" cy="38" r="3" fill="var(--color-ember-400)" />
          <circle cx="260" cy="22" r="2" fill="var(--color-brand-500)" />
          <circle cx="540" cy="22" r="2" fill="var(--color-sage-500)" />
          <circle cx="620" cy="38" r="3" fill="var(--color-brand-400)" />
        </g>

        {/* Milestones */}
        {points.map((p, i) => {
          const s = stages[i];
          return <Milestone key={s.stage} cx={p.x} cy={p.y} stage={s} index={i + 1} />;
        })}
      </svg>

      {/* Labels under each milestone */}
      <div className="mt-2 grid grid-cols-3 gap-2 px-2 sm:px-6">
        {stages.map((s) => (
          <div key={s.stage} className="text-center">
            <div className="font-display text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
              {t(`journeyMilestone${cap(s.stage)}`)}
            </div>
            <div className="mt-0.5 text-[11px] font-bold text-[var(--color-text-secondary)]">
              {s.completion}%
              {s.status === "current" && (
                <span className="ml-1 inline-flex items-center gap-0.5 rounded-full bg-[var(--color-brand-100)] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-[var(--color-brand-700)]">
                  <span className="h-1 w-1 rounded-full bg-[var(--color-brand-600)] animate-pulse" />
                  {t("journeyCurrent")}
                </span>
              )}
              {s.status === "complete" && (
                <span className="ml-1 inline-flex items-center gap-0.5 rounded-full bg-[var(--color-success-bg)] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-[var(--color-success-text)]">
                  {t("journeyComplete")}
                </span>
              )}
              {s.status === "locked" && (
                <span className="ml-1 inline-flex items-center gap-0.5 rounded-full bg-[var(--color-surface-subtle)] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
                  {t("journeyLocked")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ProgressPath({ stages }: { stages: StageMark[] }) {
  // How far along the path the user has progressed (0–1)
  const totalDone = stages.reduce((acc, s) => {
    if (s.status === "complete") return acc + 1;
    if (s.status === "current") return acc + s.completion / 100;
    return acc;
  }, 0);
  const t = Math.max(0.001, Math.min(1, totalDone / 3));

  // Approximate dashoffset trick: a long path with strokeDasharray=full length,
  // dashoffset = (1 - t) * length.
  const length = 720; // matches the curve approx.

  return (
    <path
      d="M 90 150 Q 245 80 400 80 Q 555 80 710 150"
      fill="none"
      stroke="url(#journey-path)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray={length}
      strokeDashoffset={length * (1 - t)}
      style={{ transition: "stroke-dashoffset 1s var(--ease-emphasized)" }}
    />
  );
}

function Milestone({
  cx,
  cy,
  stage,
  index,
}: {
  cx: number;
  cy: number;
  stage: StageMark;
  index: number;
}) {
  const colors = {
    local: "var(--color-ember-500)",
    regional: "var(--color-brand-500)",
    national: "var(--color-sage-500)",
  } as const;
  const color = colors[stage.stage];

  const isComplete = stage.status === "complete";
  const isCurrent = stage.status === "current";
  const isLocked = stage.status === "locked";

  return (
    <g>
      {isCurrent && (
        <>
          <circle cx={cx} cy={cy} r="36" fill={color} opacity="0.12">
            <animate attributeName="r" values="32;42;32" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      <circle cx={cx} cy={cy} r="26" fill="#FFFFFF" stroke={color} strokeWidth={isLocked ? 1.5 : 3} />
      <g transform={`translate(${cx - 12} ${cy - 12})`}>
        {isComplete ? (
          <foreignObject width="24" height="24">
            <CheckCircle2 className="h-6 w-6" style={{ color }} strokeWidth={2.2} />
          </foreignObject>
        ) : isLocked ? (
          <foreignObject width="24" height="24">
            <Lock className="h-6 w-6 text-[var(--color-text-muted)]" strokeWidth={1.85} />
          </foreignObject>
        ) : isCurrent ? (
          <foreignObject width="24" height="24">
            <Sparkles className="h-6 w-6" style={{ color }} strokeWidth={2.2} />
          </foreignObject>
        ) : (
          <text
            x="12"
            y="17"
            textAnchor="middle"
            fontSize="13"
            fontWeight="900"
            fill={color}
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            {index}
          </text>
        )}
      </g>
    </g>
  );
}
