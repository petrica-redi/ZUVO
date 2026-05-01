/**
 * POST /api/health-log  — Create a health log entry (mood, water, activity, BP, etc.)
 * GET  /api/health-log   — Get health log history for a user
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { healthLogs } from "@/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { z } from "zod";
import { parseJsonBody } from "@/lib/api/validation";

function userId(req: NextRequest): string | null {
  return req.headers.get("x-anonymous-id");
}

const healthLogBodySchema = z.object({
  type: z.string().trim().min(1).max(60),
  value: z.number().finite(),
  unit: z.string().trim().max(40).optional(),
  note: z.string().trim().max(500).optional(),
  pillarId: z.string().trim().max(80).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(req: NextRequest) {
  const db = getDb();
  const uid = userId(req);
  if (!db || !uid) {
    return NextResponse.json({ success: true, data: [] });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const parsedDays = parseInt(url.searchParams.get("days") ?? "30", 10);
  const days = Number.isFinite(parsedDays) ? Math.min(Math.max(parsedDays, 1), 365) : 30;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const conditions = [eq(healthLogs.userId, uid), gte(healthLogs.loggedAt, since)];
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
  const db = getDb();
  const uid = userId(req);
  if (!db || !uid) {
    return NextResponse.json({ success: false, error: "No database or user" }, { status: 400 });
  }

  const parsed = await parseJsonBody(req, healthLogBodySchema);
  if (!parsed.success) return parsed.response;

  const { type, value, unit, note, pillarId, metadata } = parsed.data;

  const [row] = await db
    .insert(healthLogs)
    .values({
      userId: uid,
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
