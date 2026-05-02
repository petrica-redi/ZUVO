"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { AlertTriangle, Home, RotateCw } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

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
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-[#F5F5F7] via-white to-[#F5F5F7]">
      <Header />
      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/30">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 md:text-3xl">
            {t("genericTitle")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {t("genericBody")}
          </p>
          {error.digest && (
            <code className="mt-4 inline-block rounded-lg bg-gray-100 px-3 py-1.5 text-[11px] font-mono text-gray-500">
              {t("reference")}: {error.digest}
            </code>
          )}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition active:scale-[0.97]"
            >
              <RotateCw className="h-4 w-4" />
              {t("tryAgain")}
            </button>
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-gray-300 active:scale-[0.97]"
            >
              <Home className="h-4 w-4" />
              {t("goHome")}
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
