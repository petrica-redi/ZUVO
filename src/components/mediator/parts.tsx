"use client";

import type { ComponentType, PropsWithChildren } from "react";
import { Check } from "lucide-react";

export function StatCard({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  value: string;
  label: string;
  tone: "info" | "success" | "warning";
}) {
  const iconClass =
    tone === "info"
      ? "text-[var(--color-info-accent)]"
      : tone === "success"
        ? "text-[var(--color-success-accent)]"
        : "text-[var(--color-warning-accent)]";

  return (
    <div className="flex flex-col items-center rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
      <Icon className={`mb-1 h-5 w-5 ${iconClass}`} strokeWidth={1.85} />
      <span className="font-display text-xl font-extrabold text-[var(--color-text-primary)]">
        {value}
      </span>
      <span className="text-center text-[10px] text-[var(--color-text-muted)]">{label}</span>
    </div>
  );
}

export function ActionRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-4 shadow-1 transition-transform active:scale-[0.99]"
    >
      <Icon className="h-5 w-5 text-[var(--color-sage-700)]" />
      <span className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)]">
        {label}
      </span>
    </button>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-text-muted)] shadow-1">
      {message}
    </div>
  );
}

export function FormCard({ children }: PropsWithChildren) {
  return (
    <div className="mb-6 rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-surface)] p-5 shadow-1">
      {children}
    </div>
  );
}

export function SaveButton({
  saved,
  savedLabel,
  saveLabel,
  disabled,
  onClick,
}: {
  saved: boolean;
  savedLabel: string;
  saveLabel: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-xl p-3 text-sm font-semibold text-white transition-transform active:scale-[0.97] ${
        saved
          ? "bg-[var(--color-success-accent)]"
          : "bg-[var(--color-sage-700)] disabled:bg-[var(--color-border-strong)]"
      }`}
    >
      {saved ? (
        <>
          <Check className="h-4 w-4" />
          {savedLabel}
        </>
      ) : (
        saveLabel
      )}
    </button>
  );
}
