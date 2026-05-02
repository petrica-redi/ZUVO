/**
 * AI cost & abuse controls.
 *
 * Three layers:
 *   1. Per-IP / per-anon rate limit (rate-limit.ts).
 *   2. Per-user daily call cap (this module).
 *   3. Org-wide daily EUR budget (this module).
 *
 * All three use Upstash when configured. When unset, daily counters degrade
 * to in-memory (single-instance only). The org budget always returns
 * `withinBudget: true` if Upstash is unavailable, because we cannot safely
 * track shared state without it — but a warning is logged.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type BudgetCheck = {
  allowed: boolean;
  reason?: "user-cap" | "org-budget";
  remainingUserCalls: number;
  spentToday: number;
  budgetEur: number;
  capacityKnown: boolean;
};

const ORG_BUDGET_KEY = "sastipe:budget:org";
const USER_CAP_KEY_PREFIX = "sastipe:budget:user";

const DEFAULT_USER_DAILY_CAP = 40;
const DEFAULT_DAILY_BUDGET_EUR = 50;

// Approximate cost per call in EUR (gpt-4o ~ $0.005 input + $0.015 output / 1k).
// Conservative estimate per call so the budget triggers before a real overrun.
const APPROX_COST_PER_CALL_EUR = 0.04;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function upstash() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

async function redisIncr(
  key: string,
  ttlSec: number,
): Promise<number | null> {
  const cfg = upstash();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(ttlSec), "NX"],
      ]),
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ result: number | null }>;
    return Number(data[0]?.result ?? 0);
  } catch {
    return null;
  }
}

async function redisGet(key: string): Promise<number | null> {
  const cfg = upstash();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result: string | null };
    if (data.result === null) return null;
    const n = Number(data.result);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

const memoryCounters = new Map<string, { count: number; expiresAt: number }>();

function memoryIncr(key: string, ttlSec: number): number {
  const now = Date.now();
  const existing = memoryCounters.get(key);
  if (!existing || existing.expiresAt < now) {
    memoryCounters.set(key, { count: 1, expiresAt: now + ttlSec * 1000 });
    return 1;
  }
  existing.count += 1;
  return existing.count;
}

function memoryGet(key: string): number {
  const now = Date.now();
  const existing = memoryCounters.get(key);
  if (!existing || existing.expiresAt < now) return 0;
  return existing.count;
}

function getUserCap(): number {
  const raw = process.env.AI_USER_DAILY_CAP?.trim();
  const n = raw ? Number(raw) : DEFAULT_USER_DAILY_CAP;
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_USER_DAILY_CAP;
}

function getDailyBudget(): number {
  const raw = process.env.AI_DAILY_BUDGET_EUR?.trim();
  const n = raw ? Number(raw) : DEFAULT_DAILY_BUDGET_EUR;
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_DAILY_BUDGET_EUR;
}

export function getClientId(req: NextRequest): string {
  const anon = req.headers.get("x-anonymous-id")?.trim();
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = req.headers.get("x-real-ip")?.trim();
  return anon || fwd || real || "anonymous";
}

/**
 * Check whether this AI call is allowed under user cap and org budget.
 * Increments both counters when allowed.
 */
export async function checkAiBudget(req: NextRequest): Promise<BudgetCheck> {
  const userId = getClientId(req);
  const day = todayKey();
  const userKey = `${USER_CAP_KEY_PREFIX}:${day}:${userId}`;
  const orgKey = `${ORG_BUDGET_KEY}:${day}`;

  const userCap = getUserCap();
  const budgetEur = getDailyBudget();
  const usingUpstash = upstash() !== null;

  const userCount =
    (await redisIncr(userKey, 86400)) ?? memoryIncr(userKey, 86400);

  if (userCount > userCap) {
    return {
      allowed: false,
      reason: "user-cap",
      remainingUserCalls: 0,
      spentToday: 0,
      budgetEur,
      capacityKnown: usingUpstash,
    };
  }

  const orgCount =
    (await redisIncr(orgKey, 86400)) ?? memoryIncr(orgKey, 86400);
  const spentEur = orgCount * APPROX_COST_PER_CALL_EUR;

  if (spentEur > budgetEur) {
    return {
      allowed: false,
      reason: "org-budget",
      remainingUserCalls: Math.max(0, userCap - userCount),
      spentToday: spentEur,
      budgetEur,
      capacityKnown: usingUpstash,
    };
  }

  return {
    allowed: true,
    remainingUserCalls: Math.max(0, userCap - userCount),
    spentToday: spentEur,
    budgetEur,
    capacityKnown: usingUpstash,
  };
}

export async function getAiBudgetStatus(): Promise<{
  spentEur: number;
  budgetEur: number;
  pctSpent: number;
  capacityKnown: boolean;
}> {
  const day = todayKey();
  const orgKey = `${ORG_BUDGET_KEY}:${day}`;
  const usingUpstash = upstash() !== null;
  const orgCount = usingUpstash
    ? (await redisGet(orgKey)) ?? 0
    : memoryGet(orgKey);
  const budgetEur = getDailyBudget();
  const spentEur = orgCount * APPROX_COST_PER_CALL_EUR;
  return {
    spentEur,
    budgetEur,
    pctSpent: budgetEur > 0 ? Math.round((spentEur / budgetEur) * 100) : 0,
    capacityKnown: usingUpstash,
  };
}

export function aiBudgetExceededResponse(reason: BudgetCheck): NextResponse {
  const message =
    reason.reason === "user-cap"
      ? "Daily AI usage cap reached. Try again tomorrow or contact support."
      : "Service temporarily paused — daily AI budget reached. Please try again tomorrow.";
  return NextResponse.json(
    {
      success: false,
      error: "service_paused",
      message,
    },
    {
      status: 503,
      headers: {
        "X-Sastipe-Budget":
          reason.reason === "user-cap" ? "user-cap" : "org-budget",
        "Retry-After": "3600",
      },
    },
  );
}

/**
 * Scrub obvious PII patterns from text before sending to AI providers.
 * Defense-in-depth — does not replace careful prompt design.
 */
export function scrubPii(input: string): string {
  return input
    // Email addresses
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, "[email]")
    // International phone numbers
    .replace(/\+?\d{1,3}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}/g, (m) =>
      m.replace(/\d/g, "•"),
    )
    // National-ID-like long numbers (12+ digits)
    .replace(/\b\d{12,}\b/g, "[id]")
    // Credit-card-ish (16-19 digits with optional spaces/dashes)
    .replace(/\b(?:\d[\s-]?){13,19}\b/g, "[card]")
    // IBAN-like
    .replace(/\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/g, "[iban]");
}

/**
 * Strip prompt-injection attempts from user input.
 * Defensive only — removing trigger phrases. Does not catch all attacks.
 */
export function stripInjectionPatterns(input: string): string {
  return input
    .replace(/(^|\n)\s*(system|assistant)\s*:\s*/gi, "$1")
    .replace(/ignore (all )?(previous|prior|above) instructions/gi, "[redacted]")
    .replace(/disregard (all )?(previous|prior|above) instructions/gi, "[redacted]")
    .replace(/you are now /gi, "[redacted] ");
}

/**
 * Sanitize user-facing AI input. Combines scrub + injection guard.
 */
export function sanitizeAiInput(input: string): string {
  return stripInjectionPatterns(scrubPii(input));
}
