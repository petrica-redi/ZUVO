import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  applyRateLimitAsync,
  checkRateLimit,
  checkRateLimitAsync,
  clearRateLimitBucketsForTest,
  clientKey,
  rateLimitHeaders,
  rateLimitResponse,
} from "./rate-limit";

function makeReq(headers: Record<string, string> = {}) {
  return new Request("https://test/", { headers }) as unknown as import("next/server").NextRequest;
}

beforeEach(() => {
  clearRateLimitBucketsForTest();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("clientKey", () => {
  it("prefers x-anonymous-id when present", () => {
    const req = makeReq({
      "x-anonymous-id": "anon-12345678-abcd",
      "x-forwarded-for": "1.2.3.4",
    });
    expect(clientKey(req)).toBe("anon-12345678-abcd");
  });

  it("falls back to x-forwarded-for", () => {
    const req = makeReq({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(clientKey(req)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip", () => {
    const req = makeReq({ "x-real-ip": "9.9.9.9" });
    expect(clientKey(req)).toBe("9.9.9.9");
  });

  it("returns 'anonymous' when no headers present", () => {
    const req = makeReq({});
    expect(clientKey(req)).toBe("anonymous");
  });
});

describe("checkRateLimit (in-memory)", () => {
  it("allows under the limit", () => {
    const result = checkRateLimit("user-1", {
      namespace: "test",
      limit: 5,
      windowMs: 60_000,
    });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.backend).toBe("memory");
  });

  it("blocks at the limit", () => {
    const opts = { namespace: "block", limit: 2, windowMs: 60_000 };
    expect(checkRateLimit("u", opts).allowed).toBe(true);
    expect(checkRateLimit("u", opts).allowed).toBe(true);
    expect(checkRateLimit("u", opts).allowed).toBe(false);
  });

  it("isolates buckets by namespace", () => {
    const a = checkRateLimit("u", { namespace: "ns-a", limit: 1, windowMs: 60_000 });
    const b = checkRateLimit("u", { namespace: "ns-b", limit: 1, windowMs: 60_000 });
    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
  });

  it("isolates buckets by client key", () => {
    const opts = { namespace: "iso", limit: 1, windowMs: 60_000 };
    expect(checkRateLimit("user-a", opts).allowed).toBe(true);
    expect(checkRateLimit("user-b", opts).allowed).toBe(true);
  });

  it("computes retryAfter and reset", () => {
    const result = checkRateLimit("u", {
      namespace: "ttl",
      limit: 5,
      windowMs: 30_000,
    });
    expect(result.retryAfterSec).toBeGreaterThanOrEqual(1);
    expect(result.retryAfterSec).toBeLessThanOrEqual(30);
    expect(result.resetAt).toBeGreaterThan(Date.now());
  });
});

describe("checkRateLimitAsync (no Upstash)", () => {
  it("falls back to memory backend cleanly", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    const result = await checkRateLimitAsync("user-async", {
      namespace: "async",
      limit: 5,
      windowMs: 60_000,
    });
    expect(result.allowed).toBe(true);
    expect(result.backend).toBe("memory");
  });
});

describe("applyRateLimitAsync", () => {
  it("returns response when blocked", async () => {
    const opts = { namespace: "blocked", limit: 1, windowMs: 60_000 };
    const req = makeReq({ "x-forwarded-for": "1.1.1.1" });
    const first = await applyRateLimitAsync(req, opts);
    expect(first.allowed).toBe(true);
    const second = await applyRateLimitAsync(req, opts);
    expect(second.allowed).toBe(false);
    if (!second.allowed) {
      expect(second.response.status).toBe(429);
      expect(second.response.headers.get("Retry-After")).toBeTruthy();
    }
  });
});

describe("rateLimitHeaders & rateLimitResponse", () => {
  it("returns ratelimit headers", () => {
    const headers = rateLimitHeaders({
      remaining: 3,
      resetAt: Date.now() + 60_000,
      retryAfterSec: 60,
    });
    expect(headers["X-RateLimit-Remaining"]).toBe("3");
    expect(headers["Retry-After"]).toBe("60");
  });

  it("returns 429 response", () => {
    const res = rateLimitResponse({
      remaining: 0,
      resetAt: Date.now() + 60_000,
      retryAfterSec: 60,
    });
    expect(res.status).toBe(429);
  });
});
