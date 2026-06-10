/**
 * GET /api/me/export — GDPR Article 15 / 20 data export.
 *
 * Returns every record tied to the current user as a downloadable JSON bundle.
 * Authenticated users get DB-backed records. Anonymous-header users get a
 * minimal bundle since no server-side records exist for them.
 */
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  auditLog as auditLogTable,
  healthLogs,
  notifications,
  progress,
  users,
} from "@/db/schema";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { resolveUser } from "@/lib/auth/server-user";

export async function GET(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user || user.kind !== "authenticated") {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 },
    );
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "me-export",
    limit: 5,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { success: false, error: "Database unavailable" },
      { status: 503 },
    );
  }

  // Authenticated path: pull all user-owned tables.
  const [userRow] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  const [healthRows, progressRows, auditRows, notificationRows] = await Promise.all([
    db.select().from(healthLogs).where(eq(healthLogs.userId, user.id)).limit(5001),
    db.select().from(progress).where(eq(progress.userId, user.id)).limit(2001),
    db.select().from(auditLogTable).where(eq(auditLogTable.userId, user.id)).limit(2001),
    db.select().from(notifications).where(eq(notifications.userId, user.id)).limit(501),
  ]);

  const bundle = {
    exportedAt: new Date().toISOString(),
    schemaVersion: 1,
    identity: {
      kind: user.kind,
      id: user.id,
      anonId: user.anonId,
      email: user.email,
    },
    note:
      "Includes all server-side records tied to your account. Field Lab notes, XP, badges, and streaks remain on your device only.",
    warnings: {
      truncated:
        healthRows.length > 5000 ||
        progressRows.length > 2000 ||
        auditRows.length > 2000 ||
        notificationRows.length > 500,
    },
    records: {
      profile: userRow ?? null,
      healthLogs: healthRows.slice(0, 5000),
      progress: progressRows.slice(0, 2000),
      auditLog: auditRows.slice(0, 2000),
      notifications: notificationRows.slice(0, 500),
    },
  };

  void auditLog({
    userId: user.id,
    action: "user.data_exported",
    resourceType: "user",
    resourceId: user.id,
  });

  const filename = `sastipe-data-export-${user.id.slice(0, 8)}-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(bundle, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
