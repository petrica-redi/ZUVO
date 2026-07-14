/**
 * GET  /api/operations/notifications — List workspace notifications
 * POST /api/operations/notifications — Create notification (internal/admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { getClientIp } from "@/lib/api/validation";
import { NOTIFICATION_TYPES } from "@/lib/operations/constants";
import {
  createOperationNotification,
  listOperationNotifications,
} from "@/lib/operations/notification-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const createSchema = z.object({
  notificationType: z.enum(NOTIFICATION_TYPES),
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(2000),
  data: z.record(z.string(), z.unknown()).optional(),
  sendEmail: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-notifications-read",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const unreadOnly = req.nextUrl.searchParams.get("unread") === "true";
  const notifications = await listOperationNotifications(
    actor.workspaceId,
    unreadOnly,
  );

  return NextResponse.json({ success: true, data: notifications });
}

export async function POST(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-notifications-write",
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, createSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const notification = await createOperationNotification({
    workspaceId: actor.workspaceId,
    ...parsed.data,
  });

  if (!notification) {
    return NextResponse.json(
      { success: false, error: "Failed to create notification" },
      { status: 500 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.notification_sent",
    resourceType: "operation_notification",
    resourceId: notification.id,
    metadata: { type: notification.notificationType, emailSent: notification.emailSent },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: notification }, { status: 201 });
}
