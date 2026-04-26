/**
 * POST /api/mediator/visits  — Log a mediator field visit
 * GET  /api/mediator/visits   — Get visit history for a mediator
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { mediatorVisits } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getResolvedAnonymousId } from "@/lib/resolve-anon-id";
import { auditLog } from "@/lib/audit";

function userId(req: NextRequest): string {
  return getResolvedAnonymousId(req);
}

export async function GET(req: NextRequest) {
  const db = getDb();
  const uid = userId(req);
  if (!db) {
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
  if (!db) {
    return NextResponse.json({ success: false, error: "No database" }, { status: 400 });
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

  void auditLog({
    userId: uid,
    action: "mediator.accessed_record",
    resourceType: "mediator_visit",
    resourceId: row.id,
  });

  return NextResponse.json({ success: true, data: row }, { status: 201 });
}
