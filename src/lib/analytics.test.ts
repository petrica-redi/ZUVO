/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("track (no-op when keys absent)", () => {
  it("does not throw when PostHog key is unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    const { track } = await import("./analytics");
    await expect(track("lesson_completed", { stage: "local" })).resolves.toBeUndefined();
  });

  it("does not throw when in DNT mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
    Object.defineProperty(navigator, "doNotTrack", {
      configurable: true,
      get: () => "1",
    });
    const { track } = await import("./analytics");
    await expect(track("lesson_completed")).resolves.toBeUndefined();
  });
});

describe("trackServer (no-op when keys absent)", () => {
  it("does not throw when keys are unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    const { trackServer } = await import("./analytics");
    await expect(
      trackServer("test_event", "user-1", { foo: "bar" }),
    ).resolves.toBeUndefined();
  });
});

describe("identifyUser & useTrackOnce", () => {
  it("identifyUser is a no-op without keys", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    const { identifyUser } = await import("./analytics");
    await expect(identifyUser("user-1", { plan: "free" })).resolves.toBeUndefined();
  });
});
