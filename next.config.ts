import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
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
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Route error reports through a tunnel to avoid ad-blocker interference.
  tunnelRoute: "/monitoring",
  // Upload source maps to Sentry and remove them from the production bundle.
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
  // Suppress verbose Sentry CLI output unless running in CI.
  silent: !process.env.CI,
  // Tree-shake Sentry debug logging from production builds.
  // `disableLogger` is deprecated; webpack.treeshake is the new API but
  // not yet supported with Turbopack, so we omit it until stable.
});
