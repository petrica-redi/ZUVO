import { describe, expect, it } from "vitest";
import {
  generateVerificationToken,
  generateWorkspaceId,
  hashPassword,
  verifyPassword,
} from "./password";

describe("staff password helpers", () => {
  it("hashes and verifies passwords", () => {
    const hash = hashPassword("Welcome2REDI*");
    expect(hash).toContain(":");
    expect(verifyPassword("Welcome2REDI*", hash)).toBe(true);
    expect(verifyPassword("wrong", hash)).toBe(false);
  });

  it("generates opaque verification tokens", () => {
    const a = generateVerificationToken();
    const b = generateVerificationToken();
    expect(a.length).toBeGreaterThan(20);
    expect(a).not.toBe(b);
  });

  it("builds workspace ids from role and county", () => {
    const id = generateWorkspaceId("mediator", "B");
    expect(id.startsWith("ws-b-mediat")).toBe(true);
  });
});
