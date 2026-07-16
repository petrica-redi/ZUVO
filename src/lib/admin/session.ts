import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 7; // 7 days
const TOKEN_VERSION = "v1";

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    "redi-dev-session-secret"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function encodePayload(email: string, exp: number, nonce: string): string {
  return Buffer.from(
    JSON.stringify({ v: TOKEN_VERSION, email, exp, nonce }),
    "utf8",
  ).toString("base64url");
}

function decodePayload(
  encoded: string,
): { email: string; exp: number; nonce: string } | null {
  try {
    const raw = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      v?: string;
      email?: string;
      exp?: number;
      nonce?: string;
    };
    if (raw.v !== TOKEN_VERSION) return null;
    if (!raw.email || !Number.isFinite(raw.exp) || !raw.nonce) return null;
    return { email: raw.email, exp: Number(raw.exp), nonce: raw.nonce };
  } catch {
    return null;
  }
}

/** Create a signed, expiring admin session token. */
export function createAdminSessionToken(email: string): string {
  const exp = Date.now() + SESSION_MAX_AGE_MS;
  const nonce = randomBytes(8).toString("base64url");
  const payload = encodePayload(email, exp, nonce);
  return `${payload}.${sign(payload)}`;
}

/** Validate a signed admin session token for the expected email. */
export function verifyAdminSessionToken(
  token: string | undefined,
  expectedEmail: string,
): boolean {
  if (!token) return false;

  // Legacy cookie from earlier deploys — reject (force re-login).
  if (token === "authenticated") return false;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payload || !sig) return false;

  const decoded = decodePayload(payload);
  if (!decoded) return false;
  if (decoded.email !== expectedEmail) return false;
  if (decoded.exp < Date.now()) return false;
  if (!safeEqual(sig, sign(payload))) return false;
  return true;
}

export async function setAdminSessionCookie(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createAdminSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_MS / 1000,
    path: "/",
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function readAdminSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export { SESSION_COOKIE };
