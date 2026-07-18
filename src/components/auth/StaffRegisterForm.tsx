"use client";

import { useState, useTransition } from "react";
import { Link } from "@/navigation";
import { Loader2, Mail } from "lucide-react";
import { registerStaffAccount } from "@/lib/staff/actions";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { AuthFlowSteps } from "@/components/auth/AuthFlowSteps";

export function StaffRegisterForm({
  locale,
  labels,
  googleEnabled = true,
  preferNativeGoogle = false,
  inviteToken,
  inviteEmail,
  inviteName,
}: {
  locale: string;
  googleEnabled?: boolean;
  preferNativeGoogle?: boolean;
  inviteToken?: string;
  inviteEmail?: string;
  inviteName?: string;
  labels: {
    title: string;
    lead: string;
    name: string;
    email: string;
    password: string;
    submit: string;
    success: string;
    successNext: string;
    haveAccount: string;
    loginLink: string;
    google: string;
    orDivider: string;
    googleUnavailable?: string;
    stepRegister: string;
    stepVerify: string;
    stepPending: string;
    stepLogin: string;
  };
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="space-y-4">
        <AuthFlowSteps
          active="verify"
          labels={{
            register: labels.stepRegister,
            verify: labels.stepVerify,
            pending: labels.stepPending,
            login: labels.stepLogin,
          }}
        />
        <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-sm text-emerald-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
            <Mail className="h-5 w-5" />
          </div>
          <p className="font-bold">{labels.success}</p>
          <Link
            href="/auth/pending"
            className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--color-ink-900)] px-5 text-sm font-bold text-white"
          >
            {labels.successNext}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const form = new FormData(e.currentTarget);
        form.set("locale", locale);
        startTransition(async () => {
          const res = await registerStaffAccount(form);
          if (!res.success) {
            setError(res.error || "Registration failed");
            return;
          }
          setDone(true);
        });
      }}
    >
      <AuthFlowSteps
        active="register"
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

      {inviteToken ? (
        <input type="hidden" name="inviteToken" value={inviteToken} />
      ) : null}

      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        {labels.name}
        <input
          name="displayName"
          required
          minLength={2}
          defaultValue={inviteName ?? ""}
          className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-3 text-sm"
        />
      </label>
      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        {labels.email}
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={inviteEmail ?? ""}
          readOnly={Boolean(inviteEmail)}
          className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-3 text-sm"
        />
      </label>
      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        {labels.password}
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
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
        {labels.haveAccount}{" "}
        <Link href="/auth/login" className="font-bold text-[var(--color-brand-700)] underline">
          {labels.loginLink}
        </Link>
      </p>
    </form>
  );
}
