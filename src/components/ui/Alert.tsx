import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "info" | "success" | "warning" | "danger" | "neutral";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  icon?: ReactNode;
};

const VARIANT: Record<Variant, string> = {
  info:
    "border-[var(--color-info-border)] bg-[var(--color-info-bg)] text-[var(--color-info-text)]",
  success:
    "border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success-text)]",
  warning:
    "border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]",
  danger:
    "border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]",
  neutral:
    "border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)]",
};

export function Alert({ variant = "info", icon, className, children, ...rest }: Props) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4 text-sm",
        VARIANT[variant],
        className,
      )}
      {...rest}
    >
      {icon && <span aria-hidden className="mt-0.5 flex-shrink-0">{icon}</span>}
      <div className="flex-1 leading-relaxed">{children}</div>
    </div>
  );
}

export function AlertTitle({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-0.5 font-extrabold", className)} {...rest} />;
}

export function AlertDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-relaxed opacity-90", className)} {...rest} />;
}
