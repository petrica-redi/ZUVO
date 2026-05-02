import type { ReactNode } from "react";
import { cn } from "./cn";

type Props = {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: "neutral" | "amber" | "indigo" | "emerald" | "rose";
  className?: string;
};

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  neutral:
    "bg-[var(--color-surface)] ring-[var(--color-border-subtle)]",
  amber:
    "bg-gradient-to-br from-[var(--color-ember-50)] to-[var(--color-ember-100)] ring-[var(--color-ember-200)]",
  indigo:
    "bg-gradient-to-br from-[var(--color-brand-50)] to-[var(--color-brand-100)] ring-[var(--color-brand-200)]",
  emerald:
    "bg-gradient-to-br from-emerald-50 to-emerald-100 ring-emerald-200",
  rose:
    "bg-gradient-to-br from-rose-50 to-pink-50 ring-rose-200",
};

export function Stat({ label, value, hint, icon, tone = "neutral", className }: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl p-3 shadow-1 ring-1",
        TONE[tone],
        className,
      )}
    >
      {icon && (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/80 ring-1 ring-black/5">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
          {label}
        </div>
        <div className="font-display text-lg font-extrabold leading-tight text-[var(--color-text-primary)]">
          {value}
        </div>
        {hint && (
          <div className="text-[11px] font-medium text-[var(--color-text-muted)]">{hint}</div>
        )}
      </div>
    </div>
  );
}
