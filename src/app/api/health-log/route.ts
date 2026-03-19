/**
 * POST /api/health-log  — Create a health log entry (mood, water, activity, BP, etc.)
 * GET  /api/health-log   — Get health log history for a user
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { healthLogs } from "@/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";

function userId(req: NextRequest): string | null {
  return req.headers.get("x-anonymous-id");
}

export async function GET(req: NextRequest) {
  const db = getDb();
  const uid = userId(req);
  if (!db || !uid) {
    return NextResponse.json({ success: true, data: [] });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const days = parseInt(url.searchParams.get("days") ?? "30", 10);

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

  const body = await req.json();
  const { type, value, unit, note, pillarId, metadata } = body as {
    type: string;
    value: number;
    unit?: string;
    note?: string;
    pillarId?: string;
    metadata?: Record<string, unknown>;
  };

  if (!type || value === undefined) {
    return NextResponse.json({ success: false, error: "Missing type or value" }, { status: 400 });
  }

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
