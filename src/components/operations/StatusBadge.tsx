import type { ReactNode } from "react";
import type { CaseStatus, CaseUrgency, TaskStatus } from "@/lib/operations/constants";

export type BadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "muted";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral:
    "border-[var(--color-sage-200)] bg-[var(--color-sage-100)] text-[var(--color-sage-800)]",
  info: "border-[var(--color-info-border)] bg-[var(--color-info-bg)] text-[var(--color-info-text)]",
  success:
    "border-[var(--color-success-accent)] bg-[var(--color-success-bg)] text-[var(--color-success-text)]",
  warning:
    "border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]",
  danger:
    "border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]",
  muted:
    "border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]",
};

export function urgencyTone(urgency: CaseUrgency): BadgeTone {
  if (urgency === "emergency") return "danger";
  if (urgency === "urgent") return "warning";
  if (urgency === "priority") return "info";
  return "neutral";
}

export function caseStatusTone(status: CaseStatus): BadgeTone {
  if (status === "completed") return "success";
  if (status === "escalated") return "danger";
  if (status === "cancelled" || status === "closed_incomplete") return "muted";
  if (
    status === "action_required" ||
    status === "consent_pending" ||
    status === "waiting_beneficiary" ||
    status === "waiting_provider"
  ) {
    return "warning";
  }
  if (
    status === "assessment" ||
    status === "provider_search" ||
    status === "appointment_requested" ||
    status === "appointment_confirmed" ||
    status === "referred" ||
    status === "follow_up"
  ) {
    return "info";
  }
  return "neutral";
}

export function taskStatusTone(status: TaskStatus, overdue?: boolean): BadgeTone {
  if (overdue) return "danger";
  if (status === "completed") return "success";
  if (status === "cancelled") return "muted";
  if (status === "blocked") return "danger";
  if (status === "waiting") return "warning";
  if (status === "in_progress") return "info";
  return "neutral";
}

export function StatusBadge({
  label,
  tone = "neutral",
  size = "md",
  icon,
  className = "",
}: {
  label: string;
  tone?: BadgeTone;
  size?: "sm" | "md";
  icon?: ReactNode;
  className?: string;
}) {
  const sizeClass =
    size === "sm"
      ? "min-h-[24px] px-2 py-0.5 text-[10px]"
      : "min-h-[28px] px-2.5 py-1 text-[11px]";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border font-extrabold uppercase tracking-wide ${sizeClass} ${TONE_CLASSES[tone]} ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}
