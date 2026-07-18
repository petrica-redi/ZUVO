import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";
import type { FieldRole, FieldSessionPayload } from "./types";
import { isFieldRole } from "./types";

const SESSION_COOKIE = "field_session";
const SESSION_MAX_AGE_MS = 60 * 60 * 12; // 12 hours — field shift
const TOKEN_VERSION = "v1";

function sessionSecret(): string {
  const secret =
    process.env.FIELD_SESSION_SECRET?.trim() ||
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    "";

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "FIELD_SESSION_SECRET (or ADMIN_SESSION_SECRET) must be set in production",
      );
    }
    return "redi-dev-field-session-secret";
  }
  return secret;
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

function encodePayload(data: Omit<FieldSessionPayload, "exp" | "nonce"> & {
  exp: number;
  nonce: string;
}): string {
  return Buffer.from(
    JSON.stringify({ v: TOKEN_VERSION, ...data }),
    "utf8",
  ).toString("base64url");
}

function decodePayload(encoded: string): FieldSessionPayload | null {
  try {
    const raw = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      v?: string;
      email?: string;
      displayName?: string;
      role?: string;
      workspaceId?: string;
      countyCode?: string;
      countryCode?: string;
      staffRole?: string;
      exp?: number;
      nonce?: string;
    };
    if (raw.v !== TOKEN_VERSION) return null;
    if (
      !raw.email ||
      !raw.displayName ||
      !raw.role ||
      !isFieldRole(raw.role) ||
      !raw.workspaceId ||
      !Number.isFinite(raw.exp) ||
      !raw.nonce
    ) {
      return null;
    }
    return {
      email: raw.email,
      displayName: raw.displayName,
      role: raw.role as FieldRole,
      workspaceId: raw.workspaceId,
      countyCode: raw.countyCode ?? "",
      countryCode: raw.countryCode === "IT" || raw.countryCode === "RO" ? raw.countryCode : undefined,
      staffRole: raw.staffRole,
      exp: Number(raw.exp),
      nonce: raw.nonce,
    };
  } catch {
    return null;
  }
}

export function createFieldSessionToken(input: {
  email: string;
  displayName: string;
  role: FieldRole;
  workspaceId: string;
  countyCode: string;
  countryCode?: "RO" | "IT";
  staffRole?: string;
}): string {
  const exp = Date.now() + SESSION_MAX_AGE_MS;
  const nonce = randomBytes(8).toString("base64url");
  const payload = encodePayload({ ...input, exp, nonce });
  return `${payload}.${sign(payload)}`;
}

export function verifyFieldSessionToken(
  token: string | undefined,
): FieldSessionPayload | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payload || !sig) return null;
  if (!safeEqual(sig, sign(payload))) return null;
  const decoded = decodePayload(payload);
  if (!decoded) return null;
  if (decoded.exp < Date.now()) return null;
  return decoded;
}

export async function setFieldSessionCookie(input: {
  email: string;
  displayName: string;
  role: FieldRole;
  workspaceId: string;
  countyCode: string;
  countryCode?: "RO" | "IT";
  staffRole?: string;
}) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createFieldSessionToken(input), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_MS / 1000,
    path: "/",
  });
}

export async function clearFieldSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function readFieldSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function getFieldSession(): Promise<FieldSessionPayload | null> {
  const token = await readFieldSessionCookie();
  return verifyFieldSessionToken(token);
}

export { SESSION_COOKIE as FIELD_SESSION_COOKIE };
