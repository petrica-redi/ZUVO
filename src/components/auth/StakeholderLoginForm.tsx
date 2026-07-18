"use client";

import { useState } from "react";
import { Link, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { loginAdmin } from "@/lib/admin/actions";
import { Eye, EyeOff, LogIn, Lock, Mail } from "lucide-react";

type StakeholderLoginFormProps = {
  defaultEmail?: string;
  variant?: "embedded" | "page";
  redirectTo?: string;
};

export function StakeholderLoginForm({
  defaultEmail = "",
  variant = "embedded",
  redirectTo = "/admin/dashboard",
}: StakeholderLoginFormProps) {
  const t = useTranslations("auth");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await loginAdmin(formData);

    if (res.success) {
      router.push(redirectTo);
    } else {
      setError(res.error || t("errorGeneric"));
      setLoading(false);
    }
  }

  const shellClass =
    variant === "page"
      ? "stakeholder-login-panel w-full max-w-[420px]"
      : "stakeholder-login-panel w-full";

  return (
    <div className={shellClass}>
      <div className="stakeholder-login-panel__glow" aria-hidden />

      <div
        className="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/90 shadow-4 backdrop-blur-2xl [color-scheme:light]"
        style={
          {
            "--color-text-primary": "#0E1916",
            "--color-text-secondary": "#425851",
            "--color-text-muted": "#5A736C",
            "--color-surface-hover": "#E5EEEC",
          } as React.CSSProperties
        }
      >
        <div className="h-1 bg-gradient-to-r from-[var(--color-ink-900)] via-[#2A1A48] to-[#7C3AED]" />

        <div className="p-7 md:p-8">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-ink-900)] text-white shadow-2">
              <Lock className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-headline text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                {t("formTitle")}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {t("formLead")}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="stakeholder-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                {t("emailLabel")}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="stakeholder-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  defaultValue={defaultEmail}
                  className="glass-input w-full rounded-2xl py-3.5 pl-10 pr-4 text-sm font-medium"
                  placeholder={t("emailPlaceholder")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="stakeholder-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                {t("passwordLabel")}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="stakeholder-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  className="glass-input w-full rounded-2xl py-3.5 pl-10 pr-12 text-sm font-medium"
                  placeholder={t("passwordPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] px-4 py-3 text-sm font-semibold text-[var(--color-danger-text)] animate-fade-in-up">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="glass-btn glass-btn-accent inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
              ) : (
                <LogIn className="h-4 w-4" strokeWidth={2.2} />
              )}
              {loading ? t("signingIn") : t("signIn")}
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-[var(--color-text-muted)]">
            {t("privacyNote")}
          </p>

          {variant === "embedded" ? (
            <p className="mt-4 text-center text-xs text-[var(--color-text-secondary)]">
              <Link href="/demo" className="font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
                {t("exploreDemo")}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
