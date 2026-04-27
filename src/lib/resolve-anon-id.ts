import { NextRequest } from "next/server";
import { ANON_ID_COOKIE, ANON_ID_RESOLVE_HEADER, isValidAnonId } from "./anon-cookie";

/**
 * Resolves the anonymous user id. HttpOnly cookie first, then the id injected
 * by middleware (same as Set-Cookie on first visit). Client `x-anonymous-id` is
 * not trusted to prevent forgery — same-origin requests include the cookie.
 */
export function getResolvedAnonymousId(req: NextRequest): string {
  const fromCookie = req.cookies.get(ANON_ID_COOKIE)?.value;
  if (isValidAnonId(fromCookie)) return fromCookie!;

  const fromMiddleware = req.headers.get(ANON_ID_RESOLVE_HEADER);
  if (isValidAnonId(fromMiddleware)) return fromMiddleware!.trim();

  return globalThis.crypto.randomUUID();
}
