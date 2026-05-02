#!/usr/bin/env node
/**
 * Environment validation for Sastipe builds.
 *
 * Runs as `prebuild` in package.json. Refuses to continue when production-required
 * variables are missing. Detects environment from VERCEL_ENV, NODE_ENV, or CI.
 *
 * Skips strict checks for `development` and `test`. Allows previews to run with
 * a relaxed set so feature branches still deploy.
 */

const env = process.env;

function detectEnv() {
  if (env.SASTIPE_FORCE_ENV) return env.SASTIPE_FORCE_ENV;
  if (env.VERCEL_ENV) return env.VERCEL_ENV; // production | preview | development
  if (env.NODE_ENV === "production") {
    return env.CI ? "production" : "production";
  }
  if (env.CI) return "ci";
  return "development";
}

const PROFILES = {
  production: {
    required: [
      "NEXT_PUBLIC_APP_URL",
      "NEXT_PUBLIC_APP_NAME",
      "NEXT_PUBLIC_DEFAULT_LOCALE",
      "NEXT_PUBLIC_SUPPORTED_LOCALES",
      "DATABASE_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "OPENAI_API_KEY",
      "NEXT_PUBLIC_SENTRY_DSN",
    ],
    recommended: [
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
      "RESEND_API_KEY",
      "RESEND_FROM_EMAIL",
      "AI_DAILY_BUDGET_EUR",
      "NEXT_PUBLIC_POSTHOG_KEY",
    ],
  },
  preview: {
    // Preview deployments (Vercel feature branches, Netlify previews, etc.) must
    // be able to build with no backing services configured. Runtime code is
    // defensive — every service wrapper returns null when its env vars are
    // missing, so the UI renders and unconfigured features simply 503 / no-op.
    required: [],
    recommended: [
      "NEXT_PUBLIC_APP_URL",
      "DATABASE_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "OPENAI_API_KEY",
      "NEXT_PUBLIC_SENTRY_DSN",
    ],
  },
  ci: {
    required: [],
    recommended: ["NEXT_PUBLIC_APP_URL", "DATABASE_URL"],
  },
  development: {
    required: [],
    recommended: [],
  },
};

const FORMATS = {
  NEXT_PUBLIC_APP_URL: /^https?:\/\/[^\s/]+/,
  NEXT_PUBLIC_DEFAULT_LOCALE: /^[a-z]{2,3}(-[A-Z]{2})?$/,
  NEXT_PUBLIC_SUPPORTED_LOCALES: /^[a-z]{2,3}(,[a-z]{2,3})*$/,
  DATABASE_URL: /^postgres(ql)?:\/\//,
  AI_DAILY_BUDGET_EUR: /^\d+$/,
  AI_USER_DAILY_CAP: /^\d+$/,
};

const COLOR = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

function isPresent(name) {
  const value = env[name];
  if (typeof value !== "string") return false;
  return value.trim().length > 0;
}

function validateFormats(names) {
  const issues = [];
  for (const name of names) {
    const value = env[name]?.trim();
    if (!value) continue;
    const regex = FORMATS[name];
    if (regex && !regex.test(value)) {
      issues.push(`${name} has unexpected format`);
    }
  }
  return issues;
}

function main() {
  const target = detectEnv();
  const profile = PROFILES[target] ?? PROFILES.development;
  const allRelevant = [...profile.required, ...profile.recommended];

  const missing = profile.required.filter((name) => !isPresent(name));
  const missingRecommended = profile.recommended.filter((name) => !isPresent(name));
  const formatIssues = validateFormats(allRelevant);

  console.log(COLOR.dim(`[env] target: ${target}`));

  if (missing.length === 0 && formatIssues.length === 0) {
    console.log(COLOR.green(`[env] ✓ all required variables present`));
  }

  if (missingRecommended.length > 0) {
    console.warn(
      COLOR.yellow(
        `[env] ⚠ missing recommended: ${missingRecommended.join(", ")}`,
      ),
    );
  }

  if (formatIssues.length > 0) {
    console.warn(
      COLOR.yellow(`[env] ⚠ format warnings:\n  - ${formatIssues.join("\n  - ")}`),
    );
  }

  if (missing.length > 0) {
    console.error(COLOR.red(COLOR.bold(`\n[env] ✗ build refused`)));
    console.error(
      COLOR.red(
        `Missing required variables for ${target}:\n  - ${missing.join("\n  - ")}\n`,
      ),
    );
    console.error(
      COLOR.dim(
        `See .env.example for documentation. To bypass for non-deployment builds, set SASTIPE_FORCE_ENV=development.`,
      ),
    );
    process.exit(1);
  }
}

main();
