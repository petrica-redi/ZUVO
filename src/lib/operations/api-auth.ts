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
import { getFieldSession } from "@/lib/field/session";
import { fieldRoleToReportingRole } from "@/lib/field/types";
import { REPORTING_ROLES, type ReportingRole } from "./constants";
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

  // Named field session always wins for its bound workspace.
  const field = await getFieldSession().catch(() => null);
  if (field) {
    if (field.workspaceId !== workspaceId) return null;
    return { workspaceId: field.workspaceId, isAdmin: false };
  }

  const db = getDb();
  if (db) {
    const [row] = await db
      .select({ secretHash: mediatorWorkspaces.secretHash })
      .from(mediatorWorkspaces)
      .where(eq(mediatorWorkspaces.workspaceId, workspaceId))
      .limit(1);

    const secret = readWorkspaceSecret(req);

    // Production: workspace must exist and present a valid secret.
    if (process.env.NODE_ENV === "production") {
      if (!row) return null;
      if (!verifyWorkspaceSecret(secret, row.secretHash)) return null;
    } else if (row && !verifyWorkspaceSecret(secret, row.secretHash)) {
      return null;
    }
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

export type ReportingActor = OperationActor & {
  role: ReportingRole | string;
};

/**
 * Reporting role is NEVER taken from client headers in production.
 * Client-supplied `x-operations-role` is ignored (privilege-escalation fix).
 */
export function readReportingRole(_req?: NextRequest): string {
  return "mediator";
}

async function resolveTrustedReportingRole(
  req: NextRequest,
  actor: OperationActor,
): Promise<string> {
  // Admin API key → full admin reporting (server-proven).
  if (isAdminApiAuthorized(req) || actor.isAdmin) return "admin";

  // Field staff session cookie (MoU named login).
  const field = await getFieldSession().catch(() => null);
  if (field && field.workspaceId === actor.workspaceId) {
    return fieldRoleToReportingRole(field.role);
  }

  // Supabase authenticated user role from DB.
  const db = getDb();
  if (db) {
    const user = await resolveUser(req).catch(() => null);
    if (user?.kind === "authenticated") {
      const [u] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      if (u?.role === "admin") return "admin";
      if (u?.role === "mediator") return "mediator";
      if (u?.role === "content_manager") return "supervisor";
    }
  }

  return "mediator";
}

export async function resolveReportingActor(
  req: NextRequest,
): Promise<ReportingActor | null> {
  if (isAdminApiAuthorized(req)) {
    const workspaceId = readWorkspaceId(req) ?? "system";
    return {
      workspaceId,
      isAdmin: true,
      role: "admin",
    };
  }

  const actor = await resolveOperationActor(req);
  if (!actor) return null;

  const role = await resolveTrustedReportingRole(req, actor);
  if (!(REPORTING_ROLES as readonly string[]).includes(role) && role !== "admin") {
    return { ...actor, role: "mediator" };
  }

  return { ...actor, role };
}

export function reportingUnauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: "Reporting access required" },
    { status: 403 },
  );
}
