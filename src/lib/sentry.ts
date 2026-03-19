import * as Sentry from "@sentry/nextjs";
import { getSentryConfig } from "./env";

let initialized = false;

function ensureInitialized(): boolean {
  if (initialized) return true;

  const cfg = getSentryConfig();
  if (!cfg) return false;

  Sentry.init({
    dsn: cfg.dsn,
    // Keep sampling aggressive for dev; you can tune later by environment.
    tracesSampleRate: 1.0,
    // Session replay is intentionally omitted for now.
  });

  initialized = true;
  return true;
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!ensureInitialized()) return;

  if (context) {
    Sentry.setContext("app", context);
  }

  Sentry.captureException(error);
}

