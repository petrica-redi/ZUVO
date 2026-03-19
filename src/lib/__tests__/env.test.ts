import { describe, it, expect } from "vitest";
import {
  getAppConfig,
  getSentryConfig,
  getResendConfig,
  getLangfuseConfig,
  getSupabaseConfig,
  getAnthropicConfig,
  getTriggerSecretKey,
} from "../env";

describe("getAppConfig", () => {
  it("returns safe defaults when env vars are absent", () => {
    const cfg = getAppConfig();
    expect(cfg.appName).toBe("Sastipe");
    expect(cfg.defaultLocale).toBe("sq");
    expect(cfg.supportedLocales).toEqual(["sq", "rom", "en"]);
    expect(cfg.appUrl).toBeNull();
  });
});

describe("optional service configs", () => {
  it("getSentryConfig returns null when DSN is absent", () => {
    expect(getSentryConfig()).toBeNull();
  });

  it("getResendConfig returns null when API key is absent", () => {
    expect(getResendConfig()).toBeNull();
  });

  it("getLangfuseConfig returns null when keys are absent", () => {
    expect(getLangfuseConfig()).toBeNull();
  });

  it("getSupabaseConfig returns null when URL is absent", () => {
    expect(getSupabaseConfig()).toBeNull();
  });

  it("getAnthropicConfig returns null when key is absent", () => {
    expect(getAnthropicConfig()).toBeNull();
  });

  it("getTriggerSecretKey returns null when key is absent", () => {
    expect(getTriggerSecretKey()).toBeNull();
  });
});
