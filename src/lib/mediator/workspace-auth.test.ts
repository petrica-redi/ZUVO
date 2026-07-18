import { describe, expect, it } from "vitest";
import {
  generateWorkspaceSecret,
  hashWorkspaceSecret,
  verifyWorkspaceSecret,
} from "./workspace-auth";

describe("workspace-auth", () => {
  it("generates secrets of consistent length", () => {
    const a = generateWorkspaceSecret();
    const b = generateWorkspaceSecret();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(20);
  });

  it("hashes secrets deterministically", () => {
    const secret = "test-secret-value";
    expect(hashWorkspaceSecret(secret)).toBe(hashWorkspaceSecret(secret));
    expect(hashWorkspaceSecret(secret)).not.toBe(secret);
  });

  it("allows legacy open workspaces only outside production", () => {
    // vitest runs with NODE_ENV=test → legacy open allowed
    expect(verifyWorkspaceSecret(undefined, undefined)).toBe(true);
    expect(verifyWorkspaceSecret("", null)).toBe(true);
  });

  it("rejects legacy open workspaces when NODE_ENV is production", () => {
    const desc = Object.getOwnPropertyDescriptor(process.env, "NODE_ENV");
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "production",
      configurable: true,
      writable: true,
      enumerable: true,
    });
    try {
      expect(verifyWorkspaceSecret(undefined, undefined)).toBe(false);
      expect(verifyWorkspaceSecret("any", null)).toBe(false);
    } finally {
      if (desc) Object.defineProperty(process.env, "NODE_ENV", desc);
      else delete (process.env as { NODE_ENV?: string }).NODE_ENV;
    }
  });

  it("rejects missing or wrong secret when hash is set", () => {
    const secret = generateWorkspaceSecret();
    const hash = hashWorkspaceSecret(secret);
    expect(verifyWorkspaceSecret(secret, hash)).toBe(true);
    expect(verifyWorkspaceSecret("wrong", hash)).toBe(false);
    expect(verifyWorkspaceSecret(undefined, hash)).toBe(false);
  });

  it("trims whitespace before verification", () => {
    const secret = generateWorkspaceSecret();
    const hash = hashWorkspaceSecret(secret);
    expect(verifyWorkspaceSecret(`  ${secret}  `, hash)).toBe(true);
  });
});
