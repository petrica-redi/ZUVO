/**
 * POST /api/health-log  — Create a health log entry (mood, water, activity, BP, etc.)
 * GET  /api/health-log   — Get health log history for the current user
 *
 * User resolution prefers an authenticated Supabase session and falls back
 * to a validated anonymous-id header.
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { healthLogs } from "@/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { z } from "zod";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { resolveUser } from "@/lib/auth/server-user";

const healthLogBodySchema = z.object({
  type: z.string().trim().min(1).max(60),
  value: z.number().finite(),
  unit: z.string().trim().max(40).optional(),
  note: z.string().trim().max(500).optional(),
  pillarId: z.string().trim().max(80).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const querySchema = z.object({
  type: z.string().trim().min(1).max(60).optional(),
  days: z.coerce.number().int().min(1).max(365).default(30),
});

export async function GET(req: NextRequest) {
  const db = getDb();
  const user = await resolveUser(req);
  if (!db || !user) {
    return NextResponse.json({ success: true, data: [] });
  }

  const url = new URL(req.url);
  const parsedQuery = querySchema.safeParse({
    type: url.searchParams.get("type") ?? undefined,
    days: url.searchParams.get("days") ?? undefined,
  });
  if (!parsedQuery.success) {
    return NextResponse.json(
      { success: false, error: "Invalid query parameters" },
      { status: 400 },
    );
  }

  const { type, days } = parsedQuery.data;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const conditions = [eq(healthLogs.userId, user.id), gte(healthLogs.loggedAt, since)];
  if (type) conditions.push(eq(healthLogs.type, type));

  const rows = await db
    .select()
    .from(healthLogs)
    .where(and(...conditions))
    .orderBy(desc(healthLogs.loggedAt))
    .limit(200);

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
    namespace: "health-log",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, healthLogBodySchema);
  if (!parsed.success) return parsed.response;

  const { type, value, unit, note, pillarId, metadata } = parsed.data;

  const [row] = await db
    .insert(healthLogs)
    .values({
      userId: user.id,
      type,
      value,
      unit: unit ?? null,
      note: note ?? null,
      pillarId: pillarId ?? null,
      metadata: metadata ?? null,
    })
    .returning();

  return NextResponse.json({ success: true, data: row }, { status: 201 });
}
