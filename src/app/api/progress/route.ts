/**
 * POST /api/progress  — Upsert module progress (mark started / completed)
 * GET  /api/progress  — Get all progress for a user (by anonymous_id header)
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { progress } from "@/db/schema";
import { eq, and } from "drizzle-orm";

function userId(req: NextRequest): string | null {
  return req.headers.get("x-anonymous-id");
}

export async function GET(req: NextRequest) {
  const db = getDb();
  const uid = userId(req);
  if (!db || !uid) {
    return NextResponse.json({ success: true, data: [] });
  }

  const rows = await db
    .select()
    .from(progress)
    .where(eq(progress.userId, uid));

  return NextResponse.json({ success: true, data: rows });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const uid = userId(req);
  if (!db || !uid) {
    return NextResponse.json({ success: false, error: "No database or user" }, { status: 400 });
  }

  const body = await req.json();
  const { pillarId, moduleId, status } = body as {
    pillarId: string;
    moduleId: string;
    status: "in_progress" | "completed";
  };

  if (!pillarId || !moduleId || !status) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  // Check if record exists
  const existing = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, uid), eq(progress.moduleId, moduleId)))
    .limit(1);

  if (existing.length > 0) {
    // Update
    const updates: Record<string, unknown> = {
      status,
      lastAccessedAt: new Date(),
    };
    if (status === "completed") updates.completedAt = new Date();
    if (status === "in_progress" && !existing[0].startedAt) updates.startedAt = new Date();

    await db
      .update(progress)
      .set(updates)
      .where(eq(progress.id, existing[0].id));

    return NextResponse.json({ success: true, data: { ...existing[0], ...updates } });
  }

  // Insert new
  const [row] = await db
    .insert(progress)
    .values({
      userId: uid,
      pillarId,
      moduleId,
      status,
      startedAt: new Date(),
      completedAt: status === "completed" ? new Date() : null,
    })
    .returning();

  return NextResponse.json({ success: true, data: row }, { status: 201 });
}
