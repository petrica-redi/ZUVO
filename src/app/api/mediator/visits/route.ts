/**
 * POST /api/mediator/visits  — Log a mediator field visit
 * GET  /api/mediator/visits   — Get visit history for a mediator
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { mediatorVisits, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { resolveUser } from "@/lib/auth/server-user";

const visitSchema = z.object({
  communityId: z.string().uuid().optional().nullable(),
  memberName: z.string().trim().max(120).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
  visitDate: z.string().datetime().optional().nullable(),
});

async function requireMediator(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user || user.kind !== "authenticated") {
    return { ok: false as const, response: NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 }) };
  }

  const db = getDb();
  if (!db) {
    return { ok: false as const, response: NextResponse.json({ success: false, error: "Database unavailable" }, { status: 503 }) };
  }

  const [row] = await db.select({ role: users.role }).from(users).where(eq(users.id, user.id)).limit(1);
  if (!row || !["mediator", "admin"].includes(row.role)) {
    return { ok: false as const, response: NextResponse.json({ success: false, error: "Mediator access required" }, { status: 403 }) };
  }

  return { ok: true as const, db, user };
}

export async function GET(req: NextRequest) {
  const auth = await requireMediator(req);
  if (!auth.ok) return auth.response;

  const rate = await applyRateLimitAsync(req, {
    namespace: "mediator-visits-read",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const rows = await auth.db
    .select()
    .from(mediatorVisits)
    .where(eq(mediatorVisits.mediatorId, auth.user.id))
    .orderBy(desc(mediatorVisits.visitDate))
    .limit(50);

  return NextResponse.json({ success: true, data: rows });
}

export async function POST(req: NextRequest) {
  const auth = await requireMediator(req);
  if (!auth.ok) return auth.response;

  const rate = await applyRateLimitAsync(req, {
    namespace: "mediator-visits-write",
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, visitSchema);
  if (!parsed.success) return parsed.response;
  const { communityId, memberName, notes, visitDate } = parsed.data;

  const [row] = await auth.db
    .insert(mediatorVisits)
    .values({
      mediatorId: auth.user.id,
      communityId: communityId ?? null,
      memberName: memberName ?? null,
      notes: notes ?? null,
      visitDate: visitDate ? new Date(visitDate) : new Date(),
    })
    .returning();

  return NextResponse.json({ success: true, data: row }, { status: 201 });
}
