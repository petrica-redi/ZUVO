/**
 * Workspace-scoped authentication for operational API routes.
 * Reuses the mediator workspace ID + secret pattern.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { mediatorWorkspaces, users } from "@/db/schema";
import { isAdminApiAuthorized } from "@/lib/admin/api-auth";
import { resolveUser } from "@/lib/auth/server-user";
import { verifyWorkspaceSecret } from "@/lib/mediator/workspace-auth";
import type { OperationActor } from "./permissions";

const workspaceIdSchema = z
  .string()
  .trim()
  .min(8)
  .max(80)
  .regex(/^[A-Za-z0-9_-]+$/);

export function readWorkspaceId(req: NextRequest): string | null {
  const parsed = workspaceIdSchema.safeParse(req.headers.get("x-workspace-id"));
  return parsed.success ? parsed.data : null;
}

export function readWorkspaceSecret(req: NextRequest): string | null {
  return req.headers.get("x-workspace-secret")?.trim() ?? null;
}

export async function resolveOperationActor(
  req: NextRequest,
): Promise<OperationActor | null> {
  const workspaceId = readWorkspaceId(req);
  if (!workspaceId) return null;

  const db = getDb();
  if (db) {
    const [row] = await db
      .select({ secretHash: mediatorWorkspaces.secretHash })
      .from(mediatorWorkspaces)
      .where(eq(mediatorWorkspaces.workspaceId, workspaceId))
      .limit(1);

    const secret = readWorkspaceSecret(req);
    if (row && !verifyWorkspaceSecret(secret, row.secretHash)) return null;
  }

  let isAdmin = isAdminApiAuthorized(req);
  if (!isAdmin && db) {
    const user = await resolveUser(req).catch(() => null);
    if (user?.kind === "authenticated") {
      const [u] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      isAdmin = u?.role === "admin";
    }
  }

  return { workspaceId, isAdmin };
}

export function workspaceUnauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: "Workspace access required" },
    { status: 403 },
  );
}

export function workspaceMissingResponse() {
  return NextResponse.json(
    { success: false, error: "Missing or invalid x-workspace-id" },
    { status: 400 },
  );
}

export function databaseUnavailableResponse() {
  return NextResponse.json(
    { success: false, error: "Database unavailable", offline: true },
    { status: 503 },
  );
}
