"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Root-level error boundary. Catches errors that escape the locale layout's
 * ErrorBoundary, including errors that happen before next-intl is ready.
 *
 * IMPORTANT: must include <html> and <body>.
 * Cannot rely on translations because next-intl provider may not be mounted.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          color: "white",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "440px",
            width: "100%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "28px",
            padding: "28px",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              boxShadow: "0 10px 30px rgba(220,38,38,0.4)",
            }}
            aria-hidden
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "22px",
              fontWeight: 900,
              letterSpacing: "-0.01em",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              margin: "0 0 20px",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            We hit an unexpected error. Your saved progress is safe on this
            device. Try reloading or come back in a moment.
          </p>
          {error.digest && (
            <code
              style={{
                display: "block",
                background: "rgba(0,0,0,0.3)",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "11px",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "20px",
                wordBreak: "break-all",
              }}
            >
              ref: {error.digest}
            </code>
          )}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                flex: "1 1 140px",
                padding: "12px 16px",
                borderRadius: "16px",
                border: "none",
                fontSize: "14px",
                fontWeight: 800,
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                color: "white",
                boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
              }}
            >
              Try again
            </button>
            {/* Intentional plain anchor: this boundary may render before Next.js client runtime is ready. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                flex: "1 1 140px",
                padding: "12px 16px",
                borderRadius: "16px",
                fontSize: "14px",
                fontWeight: 800,
                textDecoration: "none",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
