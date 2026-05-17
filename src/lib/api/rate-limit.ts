import { NextRequest, NextResponse } from "next/server";

/**
 * Production rate limiter with two backends:
 *
 *   1. **Upstash Redis** (durable, distributed) — used when
 *      `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set.
 *   2. **In-memory fallback** — single-process; safe only for local dev.
 *
 * Both backends implement a fixed-window counter. Upstash uses native atomic
 * INCR + EXPIRE so concurrent calls cannot race past the limit.
 */

type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  namespace: string;
  limit: number;
  windowMs: number;
};

type LegacyRateLimitOptions = {
  key?: string;
  bucket?: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult =
  | { allowed: true; headers: HeadersInit }
  | { allowed: false; response: NextResponse };

type CheckResult = {
  allowed: boolean;
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
  backend: "upstash" | "memory";
};

const globalBuckets = globalThis as typeof globalThis & {
  __sastipeRateLimitBuckets?: Map<string, Bucket>;
};

function buckets() {
  if (!globalBuckets.__sastipeRateLimitBuckets) {
    globalBuckets.__sastipeRateLimitBuckets = new Map();
  }
  return globalBuckets.__sastipeRateLimitBuckets;
}

function upstashConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

export function clientKey(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  const anonId = req.headers.get("x-anonymous-id")?.trim();
  return anonId || forwardedFor || realIp || "anonymous";
}

function checkBucket(
  key: string,
  { namespace, limit, windowMs }: RateLimitOptions,
  now = Date.now(),
): Omit<CheckResult, "ok" | "backend"> {
  const store = buckets();
  const bucketKey = `${namespace}:${key}`;
  const existing = store.get(bucketKey);
  const current =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + windowMs };

  current.count += 1;
  store.set(bucketKey, current);

  const remaining = Math.max(0, limit - current.count);
  const retryAfterSec = Math.max(1, Math.ceil((current.resetAt - now) / 1000));

  return {
    allowed: current.count <= limit,
    remaining,
    resetAt: current.resetAt,
    retryAfterSec,
  };
}

/**
 * Atomic Upstash check via REST. Pipelines INCR + EXPIRE in one round-trip.
 * Returns null on transport failure so the caller can fall back gracefully.
 */
async function checkUpstash(
  key: string,
  { namespace, limit, windowMs }: RateLimitOptions,
  now = Date.now(),
): Promise<Omit<CheckResult, "ok" | "backend"> | null> {
  const cfg = upstashConfig();
  if (!cfg) return null;

  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const bucketKey = `sastipe:rl:${namespace}:${key}`;

  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", bucketKey],
        ["EXPIRE", bucketKey, String(windowSec), "NX"],
        ["PTTL", bucketKey],
      ]),
      // Upstash REST is fast; cap at 1.5s to avoid blocking AI requests.
      signal: AbortSignal.timeout(1500),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as Array<{ result: number | string | null }>;
    const count = Number(data[0]?.result ?? 0);
    const pttl = Number(data[2]?.result ?? -1);
    const resetAt = pttl > 0 ? now + pttl : now + windowMs;
    const remaining = Math.max(0, limit - count);
    const retryAfterSec = Math.max(1, Math.ceil((resetAt - now) / 1000));

    return {
      allowed: count <= limit,
      remaining,
      resetAt,
      retryAfterSec,
    };
  } catch {
    return null;
  }
}

/**
 * Synchronous limit check. Uses in-memory bucket only (Upstash is async).
 * Routes that prefer durable limits should call `checkRateLimitAsync`.
 */
export function checkRateLimit(
  keyOrOptions: string | LegacyRateLimitOptions,
  options?: RateLimitOptions,
  now = Date.now(),
): CheckResult {
  if (typeof keyOrOptions === "string") {
    if (!options) throw new Error("Missing rate-limit options");
    const result = checkBucket(keyOrOptions, options, now);
    return { ...result, ok: result.allowed, backend: "memory" };
  }

  const namespace = keyOrOptions.bucket ?? keyOrOptions.key ?? "default";
  const key = keyOrOptions.key ?? namespace;
  const result = checkBucket(
    key,
    { namespace, limit: keyOrOptions.limit, windowMs: keyOrOptions.windowMs },
    now,
  );
  return { ...result, ok: result.allowed, backend: "memory" };
}

/**
 * Async limit check. Tries Upstash first, falls back to in-memory if
 * Upstash is unavailable. Use in route handlers for durable limiting.
 */
export async function checkRateLimitAsync(
  key: string,
  options: RateLimitOptions,
  now = Date.now(),
): Promise<CheckResult> {
  const upstash = await checkUpstash(key, options, now);
  if (upstash) return { ...upstash, ok: upstash.allowed, backend: "upstash" };
  const memory = checkBucket(key, options, now);
  return { ...memory, ok: memory.allowed, backend: "memory" };
}

export function rateLimitHeaders(result: {
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
  backend?: string;
}) {
  const headers: Record<string, string> = {
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    "Retry-After": String(result.retryAfterSec),
  };
  if (result.backend) headers["X-RateLimit-Backend"] = result.backend;
  return headers;
}

export function getClientIp(req: NextRequest): string {
  return clientKey(req);
}

export function rateLimitResponse(result: {
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
  backend?: string;
}): NextResponse {
  return NextResponse.json(
    { success: false, error: "Too many requests. Please try again shortly." },
    { status: 429, headers: rateLimitHeaders(result) },
  );
}

export const rateLimitExceeded = rateLimitResponse;

export function applyRateLimit(
  req: NextRequest,
  options: RateLimitOptions,
): RateLimitResult {
  const result = checkRateLimit(clientKey(req), options);
  if (!result.allowed) {
    return { allowed: false, response: rateLimitResponse(result) };
  }
  return { allowed: true, headers: rateLimitHeaders(result) };
}

/**
 * Legacy synchronous helper — kept for routes that haven't migrated.
 * Prefer `applyRateLimitAsync` for production.
 */
export function rateLimit(req: NextRequest, options: LegacyRateLimitOptions) {
  const result = checkRateLimit(clientKey(req), {
    namespace: options.bucket ?? options.key ?? "default",
    limit: options.limit,
    windowMs: options.windowMs,
  });
  if (!result.allowed) {
    return { ok: false as const, response: rateLimitResponse(result) };
  }
  return { ok: true as const, headers: rateLimitHeaders(result) };
}

/**
 * Production-grade async rate limit. Use in AI / write routes.
 */
export async function applyRateLimitAsync(
  req: NextRequest,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const result = await checkRateLimitAsync(clientKey(req), options);
  if (!result.allowed) {
    return { allowed: false, response: rateLimitResponse(result) };
  }
  return { allowed: true, headers: rateLimitHeaders(result) };
}

export function clearRateLimitBucketsForTest() {
  buckets().clear();
}
