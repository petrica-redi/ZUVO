import { NextRequest, NextResponse } from "next/server";

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
  | {
      allowed: true;
      headers: HeadersInit;
    }
  | {
      allowed: false;
      response: NextResponse;
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

export function clientKey(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  const anonId = req.headers.get("x-anonymous-id")?.trim();
  return anonId || forwardedFor || realIp || "anonymous";
}

function checkBucket(
  key: string,
  { namespace, limit, windowMs }: RateLimitOptions,
  now = Date.now()
): { allowed: boolean; remaining: number; resetAt: number; retryAfterSec: number } {
  const store = buckets();
  const bucketKey = `${namespace}:${key}`;
  const existing = store.get(bucketKey);
  const current =
    existing && existing.resetAt > now
      ? existing
      : {
          count: 0,
          resetAt: now + windowMs,
        };

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

export function checkRateLimit(
  keyOrOptions: string | LegacyRateLimitOptions,
  options?: RateLimitOptions,
  now = Date.now()
): { allowed: boolean; ok: boolean; remaining: number; resetAt: number; retryAfterSec: number } {
  if (typeof keyOrOptions === "string") {
    if (!options) throw new Error("Missing rate-limit options");
    const result = checkBucket(keyOrOptions, options, now);
    return { ...result, ok: result.allowed };
  }

  const namespace = keyOrOptions.bucket ?? keyOrOptions.key ?? "default";
  const key = keyOrOptions.key ?? namespace;
  const result = checkBucket(key, {
    namespace,
    limit: keyOrOptions.limit,
    windowMs: keyOrOptions.windowMs,
  }, now);
  return { ...result, ok: result.allowed };
}

export function rateLimitHeaders(result: {
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
}) {
  return {
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    "Retry-After": String(result.retryAfterSec),
  };
}

export function getClientIp(req: NextRequest): string {
  return clientKey(req);
}

export function rateLimitResponse(result: {
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
}): NextResponse {
  return NextResponse.json(
    { success: false, error: "Too many requests. Please try again shortly." },
    { status: 429, headers: rateLimitHeaders(result) }
  );
}

export const rateLimitExceeded = rateLimitResponse;

export function applyRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const result = checkRateLimit(clientKey(req), options);
  const headers = rateLimitHeaders(result);

  if (!result.allowed) {
    return {
      allowed: false,
      response: rateLimitResponse(result),
    };
  }

  return { allowed: true, headers };
}

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

export function clearRateLimitBucketsForTest() {
  buckets().clear();
}
