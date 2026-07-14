/**
 * Workspace notifications — in-app + email via Resend.
 */

import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { notificationPreferences, operationNotifications } from "@/db/schema";
import { sendEmail } from "@/lib/resend";
import type { NotificationType } from "./constants";
import type { NotificationPreferences, OperationNotification } from "./types";

const DEFAULT_PREFS: Omit<NotificationPreferences, "workspaceId"> = {
  emailEnabled: true,
  inAppEnabled: true,
  preferredLocale: "ro",
  intakeAlerts: true,
  escalationAlerts: true,
  missedAppointmentAlerts: true,
};

function rowToNotification(
  row: typeof operationNotifications.$inferSelect,
): OperationNotification {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    notificationType: row.notificationType as NotificationType,
    title: row.title,
    body: row.body,
    data: (row.data as Record<string, unknown>) ?? {},
    isRead: row.isRead,
    emailSent: row.emailSent,
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function getNotificationPreferences(
  workspaceId: string,
): Promise<NotificationPreferences> {
  const db = getDb();
  if (!db) return { workspaceId, ...DEFAULT_PREFS };

  const [row] = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.workspaceId, workspaceId))
    .limit(1);

  if (!row) return { workspaceId, ...DEFAULT_PREFS };

  return {
    workspaceId: row.workspaceId,
    emailEnabled: row.emailEnabled,
    inAppEnabled: row.inAppEnabled,
    notifyEmail: row.notifyEmail ?? undefined,
    preferredLocale: row.preferredLocale,
    intakeAlerts: row.intakeAlerts,
    escalationAlerts: row.escalationAlerts,
    missedAppointmentAlerts: row.missedAppointmentAlerts,
  };
}

export async function upsertNotificationPreferences(
  workspaceId: string,
  patch: Partial<Omit<NotificationPreferences, "workspaceId">>,
): Promise<NotificationPreferences> {
  const db = getDb();
  if (!db) return { workspaceId, ...DEFAULT_PREFS, ...patch };

  const now = new Date();
  const existing = await getNotificationPreferences(workspaceId);

  const [row] = await db
    .insert(notificationPreferences)
    .values({
      workspaceId,
      emailEnabled: patch.emailEnabled ?? existing.emailEnabled,
      inAppEnabled: patch.inAppEnabled ?? existing.inAppEnabled,
      notifyEmail: patch.notifyEmail ?? existing.notifyEmail ?? null,
      preferredLocale: patch.preferredLocale ?? existing.preferredLocale,
      intakeAlerts: patch.intakeAlerts ?? existing.intakeAlerts,
      escalationAlerts: patch.escalationAlerts ?? existing.escalationAlerts,
      missedAppointmentAlerts:
        patch.missedAppointmentAlerts ?? existing.missedAppointmentAlerts,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: notificationPreferences.workspaceId,
      set: {
        emailEnabled: patch.emailEnabled ?? existing.emailEnabled,
        inAppEnabled: patch.inAppEnabled ?? existing.inAppEnabled,
        notifyEmail: patch.notifyEmail ?? existing.notifyEmail ?? null,
        preferredLocale: patch.preferredLocale ?? existing.preferredLocale,
        intakeAlerts: patch.intakeAlerts ?? existing.intakeAlerts,
        escalationAlerts: patch.escalationAlerts ?? existing.escalationAlerts,
        missedAppointmentAlerts:
          patch.missedAppointmentAlerts ?? existing.missedAppointmentAlerts,
        updatedAt: now,
      },
    })
    .returning();

  return {
    workspaceId: row.workspaceId,
    emailEnabled: row.emailEnabled,
    inAppEnabled: row.inAppEnabled,
    notifyEmail: row.notifyEmail ?? undefined,
    preferredLocale: row.preferredLocale,
    intakeAlerts: row.intakeAlerts,
    escalationAlerts: row.escalationAlerts,
    missedAppointmentAlerts: row.missedAppointmentAlerts,
  };
}

function shouldSendForType(
  prefs: NotificationPreferences,
  type: NotificationType,
): boolean {
  if (!prefs.inAppEnabled) return false;
  if (type === "intake_routed" || type === "intake_new" || type === "callback_due") {
    return prefs.intakeAlerts;
  }
  if (type === "escalation_created" || type === "escalation_resolved") {
    return prefs.escalationAlerts;
  }
  if (type === "missed_appointment") return prefs.missedAppointmentAlerts;
  return true;
}

export type CreateNotificationInput = {
  workspaceId: string;
  notificationType: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sendEmail?: boolean;
};

export async function createOperationNotification(
  input: CreateNotificationInput,
): Promise<OperationNotification | null> {
  const db = getDb();
  if (!db) return null;

  const prefs = await getNotificationPreferences(input.workspaceId);
  if (!shouldSendForType(prefs, input.notificationType)) return null;

  const now = new Date();
  const [row] = await db
    .insert(operationNotifications)
    .values({
      workspaceId: input.workspaceId,
      notificationType: input.notificationType,
      title: input.title,
      body: input.body,
      data: input.data ?? {},
      createdAt: now,
    })
    .returning();

  if (!row) return null;

  let emailSent = false;
  if (
    input.sendEmail !== false &&
    prefs.emailEnabled &&
    prefs.notifyEmail?.includes("@")
  ) {
    const result = await sendEmail({
      to: prefs.notifyEmail,
      subject: input.title,
      html: `<p>${input.body}</p>`,
      text: input.body,
      tags: [
        { name: "type", value: input.notificationType },
        { name: "workspace", value: input.workspaceId },
      ],
    });
    if (result) {
      emailSent = true;
      await db
        .update(operationNotifications)
        .set({ emailSent: true, emailSentAt: now })
        .where(eq(operationNotifications.id, row.id));
    }
  }

  return {
    ...rowToNotification(row),
    emailSent,
  };
}

export async function listOperationNotifications(
  workspaceId: string,
  unreadOnly = false,
): Promise<OperationNotification[]> {
  const db = getDb();
  if (!db) return [];

  const conditions = unreadOnly
    ? and(
        eq(operationNotifications.workspaceId, workspaceId),
        eq(operationNotifications.isRead, false),
      )
    : eq(operationNotifications.workspaceId, workspaceId);

  const rows = await db
    .select()
    .from(operationNotifications)
    .where(conditions)
    .orderBy(desc(operationNotifications.createdAt))
    .limit(100);

  return rows.map(rowToNotification);
}

export async function markNotificationRead(
  workspaceId: string,
  notificationId: string,
): Promise<OperationNotification | null> {
  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .update(operationNotifications)
    .set({ isRead: true })
    .where(
      and(
        eq(operationNotifications.id, notificationId),
        eq(operationNotifications.workspaceId, workspaceId),
      ),
    )
    .returning();

  return row ? rowToNotification(row) : null;
}

export async function countUnreadNotifications(workspaceId: string): Promise<number> {
  const rows = await listOperationNotifications(workspaceId, true);
  return rows.length;
}
