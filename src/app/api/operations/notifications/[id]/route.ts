/**
 * PATCH /api/operations/notifications/[id] — Mark notification as read
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { markNotificationRead } from "@/lib/operations/notification-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-notifications-patch",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const { id } = await context.params;
  const notification = await markNotificationRead(actor.workspaceId, id);

  if (!notification) {
    return NextResponse.json(
      { success: false, error: "Notification not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: notification });
}
