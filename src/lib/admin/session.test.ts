import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/admin/session";

describe("admin session tokens", () => {
  const prev = { ...process.env };

  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = "test-admin-session-secret-32chars!";
  });

  afterEach(() => {
    process.env.ADMIN_SESSION_SECRET = prev.ADMIN_SESSION_SECRET;
  });

  it("accepts a freshly signed token for the expected email", () => {
    const email = "admin@redi.healthcare";
    const token = createAdminSessionToken(email);
    expect(verifyAdminSessionToken(token, email)).toBe(true);
  });

  it("rejects the legacy plaintext cookie value", () => {
    expect(verifyAdminSessionToken("authenticated", "admin@redi.healthcare")).toBe(
      false,
    );
  });

  it("rejects a token for a different email", () => {
    const token = createAdminSessionToken("admin@redi.healthcare");
    expect(verifyAdminSessionToken(token, "other@example.com")).toBe(false);
  });

  it("rejects a tampered signature", () => {
    const token = createAdminSessionToken("admin@redi.healthcare");
    const [payload] = token.split(".");
    expect(verifyAdminSessionToken(`${payload}.deadbeef`, "admin@redi.healthcare")).toBe(
      false,
    );
  });
});
