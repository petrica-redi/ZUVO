"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import type { MediatorLabels } from "./labels";

const ACCESS_KEY = "sastipe_mediator_access";

export function AccessGate({
  labels,
  onUnlocked,
}: {
  labels: MediatorLabels;
  onUnlocked: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const submit = async () => {
    if (verifying || code.length < 4) return;
    setVerifying(true);
    setError(false);
    try {
      const res = await fetch("/api/mediator/pin-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        try {
          localStorage.setItem(ACCESS_KEY, "true");
        } catch {
          /* private mode */
        }
        onUnlocked();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-12">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-sage-50)]">
        <Lock className="h-8 w-8 text-[var(--color-sage-700)]" />
      </div>
      <h1 className="mb-1 text-xl font-bold text-[var(--color-text-primary)]">{labels.title}</h1>
      <p className="mb-2 max-w-sm text-center text-sm text-[var(--color-text-secondary)]">
        {labels.accessCodeHint}
      </p>
      <p className="mb-6 max-w-md text-center text-xs text-[var(--color-text-muted)]">
        {labels.ecHint}
      </p>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder={labels.accessCodePlaceholder}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") void submit();
          }}
          aria-label={labels.accessCodePlaceholder}
          className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface)] p-4 text-center text-2xl tracking-[0.5em] shadow-1 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
        />
        {error && (
          <p className="text-center text-sm text-[var(--color-danger-text)]">
            {labels.accessCodeError}
          </p>
        )}
        <button
          type="button"
          onClick={() => void submit()}
          disabled={code.length < 4 || verifying}
          className="rounded-xl bg-[var(--color-sage-700)] p-4 text-base font-semibold text-white shadow-lg transition-all active:scale-[0.97] disabled:bg-[var(--color-border-strong)]"
        >
          {labels.accessCodeSubmit}
        </button>
      </div>
    </div>
  );
}
