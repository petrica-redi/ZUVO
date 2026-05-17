import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "premium"
  | "muted"
  | "brand";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: "sm" | "md";
};

const VARIANT: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] ring-[var(--color-border-default)]",
  success:
    "bg-[var(--color-success-bg)] text-[var(--color-success-text)] ring-[var(--color-success-border)]",
  warning:
    "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] ring-[var(--color-warning-border)]",
  danger:
    "bg-[var(--color-danger-bg)] text-[var(--color-danger-text)] ring-[var(--color-danger-border)]",
  info:
    "bg-[var(--color-info-bg)] text-[var(--color-info-text)] ring-[var(--color-info-border)]",
  brand:
    "bg-[var(--color-accent-soft)] text-[var(--color-accent-text)] ring-[var(--color-brand-200)]",
  premium:
    "bg-gradient-to-r from-[var(--color-ember-100)] via-[var(--color-ember-50)] to-[var(--color-ember-100)] text-[var(--color-ember-800)] ring-[var(--color-ember-200)]",
  muted:
    "bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] ring-[var(--color-border-subtle)]",
};

export function Badge({ variant = "default", size = "md", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider ring-1",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]",
        VARIANT[variant],
        className,
      )}
      {...rest}
    />
  );
}
