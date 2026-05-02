"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { AlertTriangle, Home, RotateCw } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui";

/**
 * Per-locale error boundary. Translated, branded, and reachable via the
 * locale's URL prefix. next-intl is available here.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl gradient-emergency grain-overlay shadow-danger">
            <AlertTriangle className="lucide h-8 w-8 text-white" strokeWidth={1.85} />
          </div>
          <h1
            className="font-display text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-3xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            {t("genericTitle")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {t("genericBody")}
          </p>
          {error.digest && (
            <code className="mt-4 inline-block rounded-lg bg-[var(--color-surface-subtle)] px-3 py-1.5 font-mono text-[11px] text-[var(--color-text-muted)]">
              {t("reference")}: {error.digest}
            </code>
          )}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="primary" size="lg" fullWidth onClick={reset}>
              <RotateCw className="lucide h-4 w-4" strokeWidth={1.85} />
              {t("tryAgain")}
            </Button>
            <Link
              href="/"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-[var(--color-border-default)] bg-[var(--color-surface)] px-5 text-sm font-extrabold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-strong)] active:scale-[0.97]"
            >
              <Home className="lucide h-4 w-4" strokeWidth={1.85} />
              {t("goHome")}
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
