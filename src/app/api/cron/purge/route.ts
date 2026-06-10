/**
 * GET /api/cron/purge — GDPR hard-delete queue processor.
 *
 * Invoked daily by Vercel Cron. Removes audit_log rows marked for hard delete
 * older than 30 days. Requires CRON_SECRET via Authorization header.
 */
import { NextRequest, NextResponse } from "next/server";
import { and, eq, lt, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { auditLog, users } from "@/db/schema";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (secret && auth !== secret) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ success: false, error: "Database unavailable" }, { status: 503 });
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const pending = await db
    .select()
    .from(auditLog)
    .where(
      and(
        eq(auditLog.action, "user.deleted"),
        lt(auditLog.createdAt, cutoff),
        sql`${auditLog.metadata}->>'hardDeletePending' = 'true'`,
      ),
    )
    .limit(100);

  let purged = 0;
  for (const row of pending) {
    if (!row.userId) continue;
    await db.delete(users).where(eq(users.id, row.userId));
    purged += 1;
  }

  return NextResponse.json({
    success: true,
    purged,
    checkedAt: new Date().toISOString(),
  });
}
