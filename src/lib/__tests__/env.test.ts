import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getAppConfig,
  getSentryConfig,
  getResendConfig,
  getLangfuseConfig,
  getSupabaseConfig,
  getAnthropicConfig,
  getTriggerSecretKey,
  isPapposhopDeployment,
  resolveResendFromEmail,
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

describe("Resend from address (Papposhop)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("treats papposhop.org URL as Papposhop deployment", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://papposhop.org");
    expect(isPapposhopDeployment()).toBe(true);
  });

  it("treats app name containing Papposhop as deployment", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_NAME", "Papposhop");
    expect(isPapposhopDeployment()).toBe(true);
  });

  it("falls back to Papposhop sender when shared from is @redi-ngo.eu", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://papposhop.org");
    vi.stubEnv("RESEND_FROM_EMAIL", "petrica@redi-ngo.eu");
    expect(resolveResendFromEmail()).toBe("orders@papposhop.org");
  });

  it("uses RESEND_FROM_EMAIL on Papposhop when it is a verified-domain address", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://papposhop.org");
    vi.stubEnv("RESEND_FROM_EMAIL", "orders@papposhop.org");
    expect(resolveResendFromEmail()).toBe("orders@papposhop.org");
  });

  it("prefers RESEND_FROM_EMAIL_PAPPOSHOP on Papposhop", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://papposhop.org");
    vi.stubEnv("RESEND_FROM_EMAIL", "orders@papposhop.org");
    vi.stubEnv("RESEND_FROM_EMAIL_PAPPOSHOP", "noreply@papposhop.org");
    expect(resolveResendFromEmail()).toBe("noreply@papposhop.org");
  });

  it("ignores RESEND_FROM_EMAIL_PAPPOSHOP if it is still @redi-ngo.eu", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://papposhop.org");
    vi.stubEnv("RESEND_FROM_EMAIL", "orders@papposhop.org");
    vi.stubEnv("RESEND_FROM_EMAIL_PAPPOSHOP", "petrica@redi-ngo.eu");
    expect(resolveResendFromEmail()).toBe("orders@papposhop.org");
  });

  it("getResendConfig uses Papposhop sender when only sandbox from is set", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://papposhop.org");
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("RESEND_FROM_EMAIL", "petrica@redi-ngo.eu");
    expect(getResendConfig()).toEqual({ apiKey: "re_test_key", fromEmail: "orders@papposhop.org" });
  });

  it("getResendConfig works on Papposhop with verified-domain from", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://papposhop.org");
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("RESEND_FROM_EMAIL", "orders@papposhop.org");
    expect(getResendConfig()).toEqual({ apiKey: "re_test_key", fromEmail: "orders@papposhop.org" });
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
