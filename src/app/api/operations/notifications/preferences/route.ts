/**
 * GET  /api/operations/notifications/preferences — Workspace notification prefs
 * PATCH /api/operations/notifications/preferences — Update prefs
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import {
  getNotificationPreferences,
  upsertNotificationPreferences,
} from "@/lib/operations/notification-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const prefsSchema = z.object({
  emailEnabled: z.boolean().optional(),
  inAppEnabled: z.boolean().optional(),
  notifyEmail: z.string().email().max(200).optional().or(z.literal("")),
  preferredLocale: z.enum(["en", "ro"]).optional(),
  intakeAlerts: z.boolean().optional(),
  escalationAlerts: z.boolean().optional(),
  missedAppointmentAlerts: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-notif-prefs-read",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const prefs = await getNotificationPreferences(actor.workspaceId);
  return NextResponse.json({ success: true, data: prefs });
}

export async function PATCH(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-notif-prefs-write",
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, prefsSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const patch = {
    ...parsed.data,
    notifyEmail: parsed.data.notifyEmail === "" ? undefined : parsed.data.notifyEmail,
  };

  const prefs = await upsertNotificationPreferences(actor.workspaceId, patch);
  return NextResponse.json({ success: true, data: prefs });
}
