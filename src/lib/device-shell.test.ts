import { describe, expect, it } from "vitest";
import { inferShellModeFromUserAgent } from "./device-shell";

describe("inferShellModeFromUserAgent", () => {
  it("defaults desktop on empty UA", () => {
    expect(inferShellModeFromUserAgent(null)).toBe("desktop");
    expect(inferShellModeFromUserAgent("")).toBe("desktop");
  });

  it("detects common desktop browsers", () => {
    expect(
      inferShellModeFromUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ),
    ).toBe("desktop");
    expect(
      inferShellModeFromUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
      ),
    ).toBe("desktop");
  });

  it("detects phones", () => {
    expect(
      inferShellModeFromUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
      ),
    ).toBe("mobile");
    expect(
      inferShellModeFromUserAgent(
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36",
      ),
    ).toBe("mobile");
  });

  it("detects tablets", () => {
    expect(
      inferShellModeFromUserAgent(
        "Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
      ),
    ).toBe("mobile");
  });
});
