/**
 * POST /api/mediator/visits  — Log a mediator field visit
 * GET  /api/mediator/visits   — Get visit history for a mediator
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { mediatorVisits } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

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
    .from(mediatorVisits)
    .where(eq(mediatorVisits.mediatorId, uid))
    .orderBy(desc(mediatorVisits.visitDate))
    .limit(50);

  return NextResponse.json({ success: true, data: rows });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const uid = userId(req);
  if (!db || !uid) {
    return NextResponse.json({ success: false, error: "No database or user" }, { status: 400 });
  }

  const body = await req.json();
  const { communityId, memberName, notes, visitDate } = body as {
    communityId?: string;
    memberName?: string;
    notes?: string;
    visitDate?: string;
  };

  const [row] = await db
    .insert(mediatorVisits)
    .values({
      mediatorId: uid,
      communityId: communityId ?? null,
      memberName: memberName ?? null,
      notes: notes ?? null,
      visitDate: visitDate ? new Date(visitDate) : new Date(),
    })
    .returning();

  return NextResponse.json({ success: true, data: row }, { status: 201 });
}
