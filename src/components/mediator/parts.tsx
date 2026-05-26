"use client";

import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import { Check, ChevronRight } from "lucide-react";

export const fieldClass =
  "w-full rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-sage-500)] focus:ring-2 focus:ring-[var(--color-sage-200)]";

const toneStyles = {
  info: {
    card: "from-[var(--color-brand-50)] to-[var(--color-surface)] ring-[var(--color-brand-200)]",
    icon: "bg-[var(--color-brand-100)] text-[var(--color-brand-700)]",
    value: "text-[var(--color-brand-900)]",
  },
  success: {
    card: "from-[var(--color-sage-50)] to-[var(--color-surface)] ring-[var(--color-sage-200)]",
    icon: "bg-[var(--color-sage-100)] text-[var(--color-sage-700)]",
    value: "text-[var(--color-sage-900)]",
  },
  warning: {
    card: "from-[var(--color-ember-50)] to-[var(--color-surface)] ring-[var(--color-ember-200)]",
    icon: "bg-[var(--color-ember-100)] text-[var(--color-ember-700)]",
    value: "text-[var(--color-ember-900)]",
  },
};

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
  const styles = toneStyles[tone];

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br p-4 ring-1 ${styles.card} shadow-[0_16px_40px_-24px_rgba(15,23,42,0.28)]`}
    >
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${styles.icon}`}>
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <span className={`font-display text-3xl font-extrabold leading-none ${styles.value}`}>
        {value}
      </span>
      <span className="mt-1.5 block text-[11px] font-semibold leading-snug text-[var(--color-text-secondary)]">
        {label}
      </span>
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
      className="group flex items-center gap-3 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-left shadow-[0_12px_35px_-22px_rgba(15,23,42,0.25)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-sage-300)] active:scale-[0.99]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-sage-100)] text-[var(--color-sage-700)] transition-colors group-hover:bg-[var(--color-sage-200)]">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <span className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)]">
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
    </button>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-8 text-center text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
      {message}
    </div>
  );
}

export function FormCard({ children }: PropsWithChildren) {
  return (
    <div className="mb-6 rounded-3xl border border-[var(--color-sage-200)] bg-[var(--color-surface)] p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.3)]">
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
        {children}
      </h2>
      {action}
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
      className={`flex w-full items-center justify-center gap-2 rounded-2xl p-3.5 text-sm font-extrabold text-white transition-transform active:scale-[0.97] ${
        saved
          ? "bg-[var(--color-success-accent)]"
          : "bg-gradient-to-r from-[var(--color-sage-700)] to-[var(--color-sage-600)] shadow-[0_12px_28px_-14px_rgba(21,128,61,0.7)] disabled:from-[var(--color-border-strong)] disabled:to-[var(--color-border-strong)] disabled:shadow-none"
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
