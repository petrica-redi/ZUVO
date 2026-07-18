"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import { Loader2 } from "lucide-react";
import { loginStaffAccount } from "@/lib/staff/actions";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { AuthFlowSteps } from "@/components/auth/AuthFlowSteps";

export function StaffLoginForm({
  locale,
  labels,
  googleEnabled = true,
  preferNativeGoogle = false,
}: {
  locale: string;
  googleEnabled?: boolean;
  preferNativeGoogle?: boolean;
  labels: {
    title: string;
    lead: string;
    email: string;
    password: string;
    submit: string;
    noAccount: string;
    registerLink: string;
    google: string;
    orDivider: string;
    googleUnavailable?: string;
    stepRegister: string;
    stepVerify: string;
    stepPending: string;
    stepLogin: string;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await loginStaffAccount(form);
          if (!res.success) {
            setError(res.error || "Login failed");
            if (res.redirectTo) router.push(res.redirectTo);
            return;
          }
          router.replace(res.redirectTo || "/mediator");
          router.refresh();
        });
      }}
    >
      <AuthFlowSteps
        active="login"
        labels={{
          register: labels.stepRegister,
          verify: labels.stepVerify,
          pending: labels.stepPending,
          login: labels.stepLogin,
        }}
      />

      <div>
        <h1 className="font-headline text-2xl font-extrabold text-[var(--color-text-primary)]">
          {labels.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {labels.lead}
        </p>
      </div>

      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        {labels.email}
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-3 text-sm"
        />
      </label>
      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        {labels.password}
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-3 text-sm"
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
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-ink-900)] px-4 text-sm font-extrabold text-white disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {labels.submit}
      </button>

      <OAuthButtons
        locale={locale}
        googleEnabled={googleEnabled}
        preferNativeGoogle={preferNativeGoogle}
        labels={{
          google: labels.google,
          orDivider: labels.orDivider,
          googleUnavailable: labels.googleUnavailable,
        }}
      />

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        {labels.noAccount}{" "}
        <Link href="/auth/register" className="font-bold text-[var(--color-brand-700)] underline">
          {labels.registerLink}
        </Link>
      </p>
    </form>
  );
}
