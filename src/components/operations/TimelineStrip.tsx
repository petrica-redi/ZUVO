import type { CaseStatus } from "@/lib/operations/constants";

export type TimelinePhaseId =
  | "intake"
  | "assess"
  | "access"
  | "coordination"
  | "resolved";

const PHASE_ORDER: TimelinePhaseId[] = [
  "intake",
  "assess",
  "access",
  "coordination",
  "resolved",
];

const STATUS_PHASE: Record<CaseStatus, TimelinePhaseId> = {
  new: "intake",
  consent_pending: "intake",
  assessment: "assess",
  action_required: "assess",
  provider_search: "access",
  appointment_requested: "access",
  appointment_confirmed: "access",
  waiting_beneficiary: "coordination",
  waiting_provider: "coordination",
  referred: "coordination",
  follow_up: "coordination",
  completed: "resolved",
  closed_incomplete: "resolved",
  cancelled: "resolved",
  escalated: "resolved",
};

const TERMINAL_STATUSES: CaseStatus[] = [
  "completed",
  "closed_incomplete",
  "cancelled",
  "escalated",
];

export function getTimelinePhase(status: CaseStatus): TimelinePhaseId {
  return STATUS_PHASE[status];
}

export function TimelineStrip({
  status,
  phaseLabels,
  ariaLabel,
  className = "",
}: {
  status: CaseStatus;
  phaseLabels: Record<TimelinePhaseId, string>;
  ariaLabel: string;
  className?: string;
}) {
  const currentIndex = PHASE_ORDER.indexOf(getTimelinePhase(status));
  const isTerminal = TERMINAL_STATUSES.includes(status);
  const isNegativeTerminal =
    status === "cancelled" ||
    status === "closed_incomplete" ||
    status === "escalated";

  return (
    <div
      className={`w-full ${className}`}
      role="list"
      aria-label={ariaLabel}
    >
      <div className="flex items-center gap-0.5">
        {PHASE_ORDER.map((phase, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex && !isTerminal;
          const isResolved =
            phase === "resolved" && isTerminal && !isNegativeTerminal;
          const isNegative =
            phase === "resolved" && isTerminal && isNegativeTerminal;

          let dotClass =
            "bg-[var(--color-surface-subtle)] border-[var(--color-border-default)]";
          let lineClass = "bg-[var(--color-border-subtle)]";

          if (isPast || isResolved) {
            dotClass =
              "bg-[var(--color-sage-600)] border-[var(--color-sage-600)]";
            lineClass = "bg-[var(--color-sage-400)]";
          } else if (isCurrent) {
            dotClass =
              "bg-[var(--color-sage-700)] border-[var(--color-sage-700)] ring-2 ring-[var(--color-sage-200)]";
          } else if (isNegative) {
            dotClass =
              "bg-[var(--color-danger-accent)] border-[var(--color-danger-accent)]";
          }

          return (
            <div
              key={phase}
              role="listitem"
              className="flex min-w-0 flex-1 flex-col items-center gap-1"
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={`h-0.5 flex-1 ${index <= currentIndex ? lineClass : "bg-[var(--color-border-subtle)]"}`}
                  />
                )}
                <div
                  className={`h-2.5 w-2.5 shrink-0 rounded-full border-2 ${dotClass}`}
                  title={phaseLabels[phase]}
                />
                {index < PHASE_ORDER.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${index < currentIndex ? lineClass : "bg-[var(--color-border-subtle)]"}`}
                  />
                )}
              </div>
              <span
                className={`hidden w-full truncate text-center text-[9px] font-bold uppercase tracking-wide sm:block ${
                  isCurrent
                    ? "text-[var(--color-sage-800)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {phaseLabels[phase]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
