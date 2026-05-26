/**
 * Mediator field workspace sync.
 *
 *   GET /api/mediator/workspace
 *   PUT /api/mediator/workspace
 *
 * Authentication model
 * ----------------------
 * The workspace is keyed by a durable, client-generated identifier sent via
 * the `x-workspace-id` request header. This lets a mediator keep working
 * across browser reloads / anon-id rotations.
 *
 * Optional Supabase session: if the request is from a signed-in user, we also
 * record `user_id` so future authenticated lookups can find a workspace
 * across devices.
 *
 * If the database is unavailable, the endpoint returns `offline: true` so the
 * client falls back to its local copy gracefully.
 */
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { mediatorWorkspaces } from "@/db/schema";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { resolveUser } from "@/lib/auth/server-user";
import { parseWorkspacePayload } from "@/lib/mediator/merge-workspace";

const workspaceIdSchema = z
  .string()
  .trim()
  .min(8)
  .max(80)
  .regex(/^[A-Za-z0-9_-]+$/);

const bodySchema = z.object({
  countyCode: z.string().trim().max(8).optional().nullable(),
  payload: z.record(z.string(), z.unknown()),
  updatedAt: z.string().datetime().optional(),
});

function readWorkspaceId(req: NextRequest): string | null {
  const raw = req.headers.get("x-workspace-id");
  const parsed = workspaceIdSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export async function GET(req: NextRequest) {
  const workspaceId = readWorkspaceId(req);
  if (!workspaceId) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid x-workspace-id" },
      { status: 400 },
    );
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "mediator-workspace-read",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const db = getDb();
  if (!db) {
    return NextResponse.json({ success: true, data: null, offline: true });
  }

  const [row] = await db
    .select()
    .from(mediatorWorkspaces)
    .where(eq(mediatorWorkspaces.workspaceId, workspaceId))
    .limit(1);

  if (!row) return NextResponse.json({ success: true, data: null });

  return NextResponse.json({
    success: true,
    data: {
      countyCode: row.countyCode,
      payload: parseWorkspacePayload(row.payload),
      updatedAt: row.updatedAt?.toISOString() ?? null,
    },
  });
}

export async function PUT(req: NextRequest) {
  const workspaceId = readWorkspaceId(req);
  if (!workspaceId) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid x-workspace-id" },
      { status: 400 },
    );
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "mediator-workspace-write",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, bodySchema);
  if (!parsed.success) return parsed.response;

  const db = getDb();
  if (!db) {
    return NextResponse.json({ success: true, offline: true });
  }

  const payload = parseWorkspacePayload(parsed.data.payload);
  const countyCode = parsed.data.countyCode ?? null;
  const updatedAt = parsed.data.updatedAt
    ? new Date(parsed.data.updatedAt)
    : new Date();

  // Optional Supabase identity (best effort).
  const user = await resolveUser(req).catch(() => null);
  const userId = user?.kind === "authenticated" ? user.id : null;

  const [existing] = await db
    .select({ workspaceId: mediatorWorkspaces.workspaceId })
    .from(mediatorWorkspaces)
    .where(eq(mediatorWorkspaces.workspaceId, workspaceId))
    .limit(1);

  if (existing) {
    await db
      .update(mediatorWorkspaces)
      .set({ payload, countyCode, updatedAt, userId })
      .where(eq(mediatorWorkspaces.workspaceId, workspaceId));
  } else {
    await db.insert(mediatorWorkspaces).values({
      workspaceId,
      userId,
      countyCode,
      payload,
      updatedAt,
    });
  }

  return NextResponse.json({
    success: true,
    data: { countyCode, payload, updatedAt: updatedAt.toISOString() },
  });
}
