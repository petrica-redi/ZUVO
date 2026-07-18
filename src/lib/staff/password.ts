import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEYLEN = 64;

/** Hash a password with a random salt (scrypt). Stored as `salt:hash` hex. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const attempt = scryptSync(password, salt, KEYLEN);
  const expected = Buffer.from(hash, "hex");
  if (attempt.length !== expected.length) return false;
  return timingSafeEqual(attempt, expected);
}

export function generateVerificationToken(): string {
  return randomBytes(32).toString("base64url");
}

export function generateWorkspaceId(role: string, countyCode: string): string {
  const county = (countyCode || "RO").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "RO";
  const suffix = randomBytes(4).toString("hex");
  return `ws-${county.toLowerCase()}-${role.slice(0, 6)}-${suffix}`;
}
