/** HttpOnly + Secure cookie for anonymous user id (set by server; clients cannot forge). */

export const ANON_ID_COOKIE = "sastipe_anon_id";
/** Legacy client header; prefer cookie. */
export const ANON_ID_HEADER = "x-anonymous-id";
/**
 * Set only by server middleware: canonical id for this request (matches Set-Cookie on first visit).
 * Incoming client values are stripped in middleware to prevent forgery.
 */
export const ANON_ID_RESOLVE_HEADER = "x-sastipe-resolve-id";
export const ANON_ID_MAX_AGE = 60 * 60 * 24 * 400; // ~400 days

export function isValidAnonId(value: string | null | undefined): boolean {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}
