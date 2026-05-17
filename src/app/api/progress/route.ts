/**
 * POST /api/progress — Upsert module progress (mark started / completed)
 * GET  /api/progress — Get all progress for the current user
 *
 * User resolution order:
 *   1. Authenticated Supabase session (cookie)
 *   2. Validated x-anonymous-id header (legacy)
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { progress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { resolveUser } from "@/lib/auth/server-user";

const progressSchema = z.object({
  pillarId: z.string().trim().min(1).max(80),
  moduleId: z.string().trim().min(1).max(120),
  status: z.enum(["in_progress", "completed"]),
});

export async function GET(req: NextRequest) {
  const db = getDb();
  const user = await resolveUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 },
    );
  }
  if (!db) {
    return NextResponse.json(
      { success: false, error: "Database unavailable" },
      { status: 503 },
    );
  }

  const rows = await db.select().from(progress).where(eq(progress.userId, user.id));
  return NextResponse.json({ success: true, data: rows });
}

export async function POST(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 },
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { success: false, error: "Database unavailable" },
      { status: 503 },
    );
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "progress-write",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, progressSchema);
  if (!parsed.success) return parsed.response;
  const { pillarId, moduleId, status } = parsed.data;

  try {
    const existing = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.userId, user.id),
          eq(progress.pillarId, pillarId),
          eq(progress.moduleId, moduleId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const updates: Record<string, unknown> = {
        status,
        lastAccessedAt: new Date(),
      };
      if (status === "completed") updates.completedAt = new Date();
      if (status === "in_progress" && !existing[0].startedAt) updates.startedAt = new Date();

      await db.update(progress).set(updates).where(eq(progress.id, existing[0].id));
      return NextResponse.json({ success: true, data: { ...existing[0], ...updates } });
    }

    const [row] = await db
      .insert(progress)
      .values({
        userId: user.id,
        pillarId,
        moduleId,
        status,
        startedAt: new Date(),
        completedAt: status === "completed" ? new Date() : null,
      })
      .returning();

    return NextResponse.json({ success: true, data: row }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Database operation failed" }, { status: 500 });
  }
}
