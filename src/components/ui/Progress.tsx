import { cn } from "./cn";

type Props = {
  value: number;
  max?: number;
  label?: string;
  hint?: string;
  variant?: "default" | "success" | "amber" | "rainbow";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const FILL: Record<Required<Props>["variant"], string> = {
  default:
    "bg-gradient-to-r from-[var(--color-brand-500)] via-[var(--color-brand-600)] to-[var(--color-brand-700)]",
  success:
    "bg-gradient-to-r from-[var(--color-success-accent)] to-emerald-600",
  amber:
    "bg-gradient-to-r from-[var(--color-ember-400)] to-[var(--color-ember-600)]",
  rainbow:
    "bg-gradient-to-r from-rose-500 via-[var(--color-accent)] to-sky-500",
};

const SIZE: Record<Required<Props>["size"], string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

export function Progress({
  value,
  max = 100,
  label,
  hint,
  variant = "default",
  size = "md",
  className,
}: Props) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className={cn("w-full", className)}>
      {(label || hint) && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-[var(--color-text-secondary)]">
          {label && <span>{label}</span>}
          {hint && <span className="text-[var(--color-text-muted)]">{hint}</span>}
        </div>
      )}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-[var(--color-surface-subtle)] hairline",
          SIZE[size],
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-700", FILL[variant])}
          style={{
            width: `${pct}%`,
            transitionTimingFunction: "var(--ease-emphasized)",
          }}
        />
      </div>
    </div>
  );
}
