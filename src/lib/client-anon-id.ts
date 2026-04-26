const STORAGE_KEY = "sastipe_anon_id";

/**
 * For client-side API calls: send the same id the server issued (mirrors HttpOnly cookie
 * for dev tools / cross-subdomain; server trusts cookie + `x-sastipe-resolve-id` from middleware).
 */
export function getOrCreateClientAnonId(): string {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, id);
  return id;
}
