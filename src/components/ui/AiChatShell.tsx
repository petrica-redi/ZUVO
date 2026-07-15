"use client";

import type { ReactNode } from "react";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export type AiChatLabels = {
  label: string;
  badge?: string;
  verified?: string;
  trustFooter?: string;
};

export function AiChatChrome({
  label,
  badge,
}: {
  label: string;
  badge?: string;
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-danger-accent)]/40" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-warning-accent)]/40" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success-accent)]/40" aria-hidden />
        <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
          {label}
        </span>
      </div>
      {badge && (
        <div
          className="absolute -right-1 -top-1 rounded-2xl border border-[var(--color-ember-200)] bg-[var(--color-ember-50)] px-3 py-2 shadow-2 md:-right-3 md:-top-3"
          aria-hidden
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-ember-600)]" strokeWidth={2} />
            <span className="text-[11px] font-extrabold text-[var(--color-ember-800)]">{badge}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function AiChatBubble({
  role,
  children,
  showVerified,
  verifiedLabel = "Verified",
}: {
  role: "user" | "assistant";
  children: ReactNode;
  showVerified?: boolean;
  verifiedLabel?: string;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[var(--color-text-primary)] px-4 py-3 text-sm leading-relaxed text-[var(--color-bg-canvas)]">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text-primary)]">
        {showVerified && (
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-[var(--color-success-bg)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-success-text)]">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2.2} aria-hidden />
            {verifiedLabel}
          </span>
        )}
        <div className={showVerified ? "mt-1" : undefined}>{children}</div>
      </div>
    </div>
  );
}

export function AiChatThinking({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[var(--color-text-muted)]">
      <div className="flex h-5 items-center gap-1" aria-hidden>
        <span
          className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-success-accent)]/70"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-warning-accent)]/70"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-danger-accent)]/50"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-secondary)]">
        {label}
      </span>
    </div>
  );
}

export function AiChatTrustBar({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 border-t border-[var(--color-border-subtle)] pt-4 text-xs text-[var(--color-text-muted)]">
      <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-success-accent)]" strokeWidth={2} aria-hidden />
      {text}
    </div>
  );
}

export function AiChatShell({
  labels,
  children,
  footer,
  showTrustBar = true,
  className = "",
}: {
  labels: AiChatLabels;
  children: ReactNode;
  footer?: ReactNode;
  showTrustBar?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-4 md:rounded-[32px] md:p-7">
        <AiChatChrome label={labels.label} badge={labels.badge} />
        <div className="mt-5 space-y-4">{children}</div>
        {showTrustBar && labels.trustFooter && (
          <div className="mt-6">
            <AiChatTrustBar text={labels.trustFooter} />
          </div>
        )}
      </div>
      {footer}
    </div>
  );
}
