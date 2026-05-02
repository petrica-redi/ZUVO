import { describe, expect, it, vi, afterEach } from "vitest";
import { isAuthenticated } from "./server-user";

describe("isAuthenticated", () => {
  it("returns false for null", () => {
    expect(isAuthenticated(null)).toBe(false);
  });

  it("returns false for anonymous header users", () => {
    expect(
      isAuthenticated({
        kind: "anonymous",
        id: "abc12345-anon-1234",
        anonId: "abc12345-anon-1234",
        email: null,
        isAnonymous: true,
      }),
    ).toBe(false);
  });

  it("returns true for authenticated Supabase users", () => {
    expect(
      isAuthenticated({
        kind: "authenticated",
        id: "user-uuid",
        anonId: null,
        email: "user@example.com",
        isAnonymous: false,
      }),
    ).toBe(true);
  });
});

describe("resolveUser fallback flow", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns null when neither auth nor anonymous header is present", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    const { resolveUser } = await import("./server-user");
    const req = new Request("https://x.test", { headers: {} }) as unknown as Parameters<typeof resolveUser>[0];
    const result = await resolveUser(req);
    expect(result).toBeNull();
  });

  it("falls back to anonymous header when supabase is unconfigured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    const { resolveUser } = await import("./server-user");
    const req = new Request("https://x.test", {
      headers: { "x-anonymous-id": "validanonid12345" },
    }) as unknown as Parameters<typeof resolveUser>[0];
    const result = await resolveUser(req);
    expect(result?.kind).toBe("anonymous");
    expect(result?.id).toBe("validanonid12345");
  });

  it("rejects malformed anonymous IDs", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    const { resolveUser } = await import("./server-user");
    const req = new Request("https://x.test", {
      headers: { "x-anonymous-id": "abc" },
    }) as unknown as Parameters<typeof resolveUser>[0];
    const result = await resolveUser(req);
    expect(result).toBeNull();
  });
});
