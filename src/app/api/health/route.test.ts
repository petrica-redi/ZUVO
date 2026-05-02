import { describe, expect, it, vi, afterEach } from "vitest";

describe("/api/health", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns JSON with services map", async () => {
    vi.stubEnv("NODE_ENV", "test");
    const { GET } = await import("./route");
    const res = await GET();
    expect(res.headers.get("Content-Type")).toContain("application/json");
    const body = await res.json();
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("services");
    for (const key of [
      "database",
      "redis",
      "ai",
      "sentry",
      "email",
      "analytics",
    ]) {
      expect(body.services).toHaveProperty(key);
    }
  });

  it("flags unconfigured services correctly", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("OPENAI_API_KEY", "");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.resetModules();
    const { GET } = await import("./route");
    const res = await GET();
    const body = await res.json();
    expect(body.services.ai).toBe("unconfigured");
    expect(body.services.redis).toBe("unconfigured");
  });
});
