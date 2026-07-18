"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { loginFieldStaff } from "@/lib/field/actions";

export function FieldLoginForm({
  labels,
}: {
  labels: {
    title: string;
    lead: string;
    email: string;
    password: string;
    submit: string;
    rosterMissing: string;
    errorGeneric: string;
  };
  rosterReady?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          const result = await loginFieldStaff(form);
          if (!result.success) {
            setError(result.error || labels.errorGeneric);
            return;
          }
          router.replace("/mediator");
          router.refresh();
        });
      }}
    >
      <div className="mb-2 flex items-center gap-2 text-[var(--color-brand-700)]">
        <ShieldCheck className="h-5 w-5" strokeWidth={2} />
        <h1 className="font-headline text-xl font-extrabold text-[var(--color-text-primary)]">
          {labels.title}
        </h1>
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {labels.lead}
      </p>

      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        {labels.email}
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-3 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-200)]"
        />
      </label>

      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        {labels.password}
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-3 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-200)]"
        />
      </label>

      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-ink-900)] px-4 text-sm font-extrabold text-white shadow-2 transition active:scale-[0.99] disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {labels.submit}
      </button>
    </form>
  );
}
