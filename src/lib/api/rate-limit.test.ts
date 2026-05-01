import { describe, expect, it, beforeEach } from "vitest";
import {
  checkRateLimit,
  clearRateLimitBucketsForTest,
  rateLimitHeaders,
} from "@/lib/api/rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    clearRateLimitBucketsForTest();
  });

  it("allows requests up to the configured limit", () => {
    const options = { namespace: "test", limit: 2, windowMs: 1000 };

    const first = checkRateLimit("client-a", options, 1000);
    const second = checkRateLimit("client-a", options, 1100);

    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(1);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(0);
  });

  it("blocks requests over the limit until the window resets", () => {
    const options = { namespace: "test", limit: 1, windowMs: 1000 };

    expect(checkRateLimit("client-a", options, 1000).allowed).toBe(true);
    expect(checkRateLimit("client-a", options, 1100).allowed).toBe(false);
    expect(checkRateLimit("client-a", options, 2101).allowed).toBe(true);
  });

  it("generates standard rate-limit headers", () => {
    const headers = rateLimitHeaders({
      remaining: 0,
      resetAt: 2500,
      retryAfterSec: 2,
    });

    expect(headers).toMatchObject({
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": "3",
      "Retry-After": "2",
    });
  });
});
