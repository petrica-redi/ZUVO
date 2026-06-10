/**
 * Mediator field workspace sync.
 *
 *   GET /api/mediator/workspace
 *   PUT /api/mediator/workspace
 *
 * Headers:
 *   x-workspace-id     — durable client UUID (required)
 *   x-workspace-secret — sync secret (required once secret_hash is set)
 */
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { mediatorWorkspaces } from "@/db/schema";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { resolveUser } from "@/lib/auth/server-user";
import { auditLog } from "@/lib/audit";
import { parseWorkspacePayload } from "@/lib/mediator/merge-workspace";
import {
  generateWorkspaceSecret,
  hashWorkspaceSecret,
  verifyWorkspaceSecret,
} from "@/lib/mediator/workspace-auth";

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

function readWorkspaceSecret(req: NextRequest): string | null {
  return req.headers.get("x-workspace-secret")?.trim() ?? null;
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

  const secret = readWorkspaceSecret(req);
  if (!verifyWorkspaceSecret(secret, row.secretHash)) {
    return NextResponse.json(
      { success: false, error: "Invalid or missing workspace secret" },
      { status: 403 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      countyCode: row.countyCode,
      payload: parseWorkspacePayload(row.payload),
      updatedAt: row.updatedAt?.toISOString() ?? null,
      hasSecret: Boolean(row.secretHash),
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
  const secret = readWorkspaceSecret(req);

  const user = await resolveUser(req).catch(() => null);
  const userId = user?.kind === "authenticated" ? user.id : null;

  const [existing] = await db
    .select()
    .from(mediatorWorkspaces)
    .where(eq(mediatorWorkspaces.workspaceId, workspaceId))
    .limit(1);

  if (existing && !verifyWorkspaceSecret(secret, existing.secretHash)) {
    return NextResponse.json(
      { success: false, error: "Invalid or missing workspace secret" },
      { status: 403 },
    );
  }

  let workspaceSecret: string | undefined;
  let secretHash = existing?.secretHash ?? null;

  if (!secretHash) {
    workspaceSecret = generateWorkspaceSecret();
    secretHash = hashWorkspaceSecret(workspaceSecret);
  }

  if (existing) {
    await db
      .update(mediatorWorkspaces)
      .set({ payload, countyCode, updatedAt, userId, secretHash })
      .where(eq(mediatorWorkspaces.workspaceId, workspaceId));
  } else {
    await db.insert(mediatorWorkspaces).values({
      workspaceId,
      userId,
      countyCode,
      secretHash,
      payload,
      updatedAt,
    });
  }

  if (userId) {
    void auditLog({
      userId,
      action: "mediator.accessed_record",
      resourceType: "mediator_workspace",
      resourceId: workspaceId,
      metadata: { countyCode, caseCount: payload.cases.length },
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      countyCode,
      payload,
      updatedAt: updatedAt.toISOString(),
      ...(workspaceSecret ? { workspaceSecret } : {}),
    },
  });
}
