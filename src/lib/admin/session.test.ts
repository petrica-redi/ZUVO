import { describe, expect, it } from "vitest";
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/admin/session";

describe("admin session tokens", () => {
  it("accepts a freshly signed token for the expected email", () => {
    const email = "petrica@redi-ngo.eu";
    const token = createAdminSessionToken(email);
    expect(verifyAdminSessionToken(token, email)).toBe(true);
  });

  it("rejects the legacy plaintext cookie value", () => {
    expect(verifyAdminSessionToken("authenticated", "petrica@redi-ngo.eu")).toBe(
      false,
    );
  });

  it("rejects a token for a different email", () => {
    const token = createAdminSessionToken("petrica@redi-ngo.eu");
    expect(verifyAdminSessionToken(token, "other@example.com")).toBe(false);
  });

  it("rejects a tampered signature", () => {
    const token = createAdminSessionToken("petrica@redi-ngo.eu");
    const [payload] = token.split(".");
    expect(verifyAdminSessionToken(`${payload}.deadbeef`, "petrica@redi-ngo.eu")).toBe(
      false,
    );
  });
});
