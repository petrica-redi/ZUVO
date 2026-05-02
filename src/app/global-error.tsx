"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Root-level error boundary. Renders before the locale layout's ErrorBoundary
 * and even when next-intl is not yet mounted, so all copy is plain English.
 *
 * Must include <html> and <body>. All styles inline so the page works even
 * when the app stylesheet is unavailable.
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
          background:
            "radial-gradient(ellipse at top, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(220,38,38,0.12) 0%, transparent 60%), linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)",
          fontFamily:
            "Geist, Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          color: "#F8FAFC",
          padding: "20px",
          WebkitFontSmoothing: "antialiased",
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
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 32px rgba(0,0,0,0.5)",
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
              boxShadow:
                "0 1px 2px rgba(220,38,38,0.10), 0 8px 24px rgba(220,38,38,0.30)",
            }}
            aria-hidden
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                stroke="white"
                strokeWidth="1.85"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              margin: "0 0 20px",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.78)",
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
                borderRadius: "10px",
                fontSize: "11px",
                color: "rgba(255,255,255,0.55)",
                marginBottom: "20px",
                wordBreak: "break-all",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
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
                  "linear-gradient(135deg, #4F46E5 0%, #6D28D9 100%)",
                color: "white",
                boxShadow:
                  "0 1px 2px rgba(79,70,229,0.10), 0 8px 24px rgba(79,70,229,0.30)",
                transition: "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
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
