"use client";

/**
 * Lightweight PostHog wrapper.
 *
 * - No-ops when keys are absent.
 * - Honours `Do-Not-Track`.
 * - Lazy-imports posthog-js so it never bloats the SSR bundle.
 * - Typed event names so `track("foo")` can't drift.
 */

import { useEffect } from "react";

export type AcademyEvent =
  | "lesson_started"
  | "lesson_completed"
  | "quiz_started"
  | "quiz_attempted"
  | "quiz_passed"
  | "quiz_failed"
  | "ai_consult_started"
  | "ai_redflag_triggered"
  | "ai_response_failed"
  | "ai_budget_exceeded"
  | "streak_extended"
  | "streak_broken"
  | "level_up"
  | "field_lab_saved"
  | "data_export_requested"
  | "data_delete_requested";

type PostHog = {
  init: (key: string, opts: Record<string, unknown>) => void;
  capture: (event: string, props?: Record<string, unknown>) => void;
  identify?: (id: string, props?: Record<string, unknown>) => void;
  reset?: () => void;
  opt_out_capturing?: () => void;
  has_opted_out_capturing?: () => boolean;
};

let phPromise: Promise<PostHog | null> | null = null;

function isDoNotTrack(): boolean {
  if (typeof window === "undefined") return false;
  // Respect explicit DNT header in either string ("1") or value ("yes").
  const nav = navigator as Navigator & { msDoNotTrack?: string; doNotTrack?: string };
  const dnt = nav.doNotTrack ?? nav.msDoNotTrack;
  return dnt === "1" || dnt === "yes";
}

function getKeys() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim();
  if (!key) return null;
  return { key, host: host || "https://eu.i.posthog.com" };
}

async function loadPostHog(): Promise<PostHog | null> {
  if (typeof window === "undefined") return null;
  if (isDoNotTrack()) return null;
  const cfg = getKeys();
  if (!cfg) return null;

  if (!phPromise) {
    phPromise = (async () => {
      try {
        // posthog-js is an optional dependency — install only if analytics is enabled.
        const mod = (await import(
          /* webpackIgnore: true */ "posthog-js" as string
        ).catch(() => null)) as { default: PostHog } | null;
        if (!mod) return null;
        const ph = mod.default;
        ph.init(cfg.key, {
          api_host: cfg.host,
          capture_pageview: true,
          autocapture: false,
          persistence: "localStorage",
          disable_session_recording: true,
          respect_dnt: true,
          loaded: (instance: PostHog) => {
            if (instance.has_opted_out_capturing?.()) return;
          },
        });
        return ph;
      } catch {
        // Module not installed in this deployment — analytics is optional.
        return null;
      }
    })();
  }

  return phPromise;
}

export async function track(
  event: AcademyEvent,
  props?: Record<string, unknown>,
): Promise<void> {
  const ph = await loadPostHog();
  if (!ph) return;
  try {
    ph.capture(event, props);
  } catch {
    /* analytics never throws */
  }
}

export async function identifyUser(
  id: string,
  props?: Record<string, unknown>,
): Promise<void> {
  const ph = await loadPostHog();
  if (!ph || !ph.identify) return;
  try {
    ph.identify(id, props);
  } catch {
    /* swallow */
  }
}

export function useTrackOnce(event: AcademyEvent, props?: Record<string, unknown>) {
  useEffect(() => {
    void track(event, props);
    // We intentionally fire once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Server-side capture via PostHog ingestion API. Used in API routes for
 * security-relevant events (red flag triggered, budget exceeded). Same
 * DNT-respecting contract: only fires when keys are configured.
 */
export async function trackServer(
  event: string,
  distinctId: string,
  props?: Record<string, unknown>,
): Promise<void> {
  const cfg = getKeys();
  if (!cfg) return;
  try {
    await fetch(`${cfg.host}/i/v0/e/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: cfg.key,
        event,
        distinct_id: distinctId,
        properties: props ?? {},
      }),
      // Don't block route handlers if PostHog is slow.
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    /* analytics never throws */
  }
}
