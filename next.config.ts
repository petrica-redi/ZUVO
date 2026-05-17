import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Content Security Policy.
 *
 * Allows:
 *   - Self for scripts/styles/fonts/images.
 *   - Inline styles required by Next.js streaming and emotion-style components.
 *   - Specific third-party origins for AI, analytics, error tracking, and Supabase.
 *
 * Denies:
 *   - object/embed
 *   - frame ancestors
 *   - mixed content
 */
function buildCsp(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const posthogHost =
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ?? "https://eu.i.posthog.com";
  const sentryHost = "https://*.sentry.io";

  const supabaseOrigin = (() => {
    try {
      return supabaseUrl ? new URL(supabaseUrl).origin : "";
    } catch {
      return "";
    }
  })();

  // Capacitor / Cordova WebViews load the app from custom schemes; allowing them
  // here means the same CSP works on web and inside the native shells without
  // weakening browser-only deployments.
  const capacitorOrigins = [
    "capacitor://localhost",
    "ionic://localhost",
    "https://localhost",
  ];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'", ...capacitorOrigins],
    "script-src": [
      "'self'",
      // Next.js inlines a small bootstrap script and uses unsafe-eval in dev.
      "'unsafe-inline'",
      ...(process.env.NODE_ENV === "production" ? [] : ["'unsafe-eval'"]),
      sentryHost,
      ...capacitorOrigins,
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", ...capacitorOrigins],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
    "connect-src": [
      "'self'",
      "https://api.openai.com",
      "https://api.anthropic.com",
      "https://api.deepgram.com",
      "https://*.upstash.io",
      "https://*.langfuse.com",
      posthogHost,
      sentryHost,
      ...capacitorOrigins,
      ...(supabaseOrigin ? [supabaseOrigin, supabaseOrigin.replace("https://", "wss://")] : []),
    ],
    "frame-src": ["'self'"],
    "frame-ancestors": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "manifest-src": ["'self'"],
    "worker-src": ["'self'", "blob:"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([key, values]) =>
      values.length > 0 ? `${key} ${values.join(" ")}` : key,
    )
    .join("; ");
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const csp = buildCsp();
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), microphone=(self), geolocation=(self), interest-cohort=(), payment=(), usb=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
          {
            // Report-only in development so we can iterate without breaking dev tools.
            key:
              process.env.NODE_ENV === "production"
                ? "Content-Security-Policy"
                : "Content-Security-Policy-Report-Only",
            value: csp,
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
        ],
      },
      {
        // API routes: no caching, strict no-store.
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  tunnelRoute: "/monitoring",
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
  silent: !process.env.CI,
});
