import type { NextRequest } from "next/server";

/**
 * Validates ministry / cron API access via shared secret header.
 * Set ADMIN_API_KEY in production; falls back to CRON_SECRET for Vercel crons.
 */
export function isAdminApiAuthorized(req: NextRequest): boolean {
  const key =
    process.env.ADMIN_API_KEY?.trim() ||
    process.env.CRON_SECRET?.trim();
  if (!key) return process.env.NODE_ENV !== "production";

  const header =
    req.headers.get("x-admin-key") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return header === key;
}
