"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

export function AsyncLoading({ label }: { label: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-surface)] p-8 text-sm text-[var(--color-text-muted)] shadow-1"
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      {label}
    </div>
  );
}

export function AsyncError({
  message,
  onRetry,
  retryLabel,
}: {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] p-4 text-sm text-[var(--color-danger-text)]"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="flex-1">
          <p>{message}</p>
          {onRetry && retryLabel && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 font-bold underline underline-offset-2"
            >
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
