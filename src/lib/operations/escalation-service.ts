/**
 * Supervisor escalation queue for operational cases and intakes.
 */

import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db/client";
import { escalationRecords } from "@/db/schema";
import { createOperationNotification } from "./notification-service";
import type { EscalationStatus } from "./constants";
import type { CreateEscalationInput, EscalationRecord } from "./types";
import { assertWorkspaceAccess, type OperationActor } from "./permissions";

function rowToEscalation(row: typeof escalationRecords.$inferSelect): EscalationRecord {
  return {
    id: row.id,
    caseId: row.caseId ?? undefined,
    intakeId: row.intakeId ?? undefined,
    workspaceId: row.workspaceId,
    escalatedBy: row.escalatedBy,
    assignedSupervisor: row.assignedSupervisor ?? undefined,
    reason: row.reason,
    status: row.status as EscalationStatus,
    priority: row.priority as EscalationRecord["priority"],
    resolutionNotes: row.resolutionNotes ?? undefined,
    resolvedAt: row.resolvedAt?.toISOString(),
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function createEscalation(
  actor: OperationActor,
  input: CreateEscalationInput,
): Promise<EscalationRecord | null> {
  const db = getDb();
  if (!db) return null;

  if (!input.caseId && !input.intakeId) return null;

  const now = new Date();
  const [row] = await db
    .insert(escalationRecords)
    .values({
      caseId: input.caseId,
      intakeId: input.intakeId,
      workspaceId: actor.workspaceId,
      escalatedBy: actor.workspaceId,
      assignedSupervisor: input.assignedSupervisor,
      reason: input.reason,
      priority: input.priority ?? "priority",
      status: "open",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!row) return null;

  const escalation = rowToEscalation(row);

  void createOperationNotification({
    workspaceId: actor.workspaceId,
    notificationType: "escalation_created",
    title: "operations.notifEscalationTitle",
    body: "operations.notifEscalationBody",
    data: {
      escalationId: escalation.id,
      caseId: escalation.caseId,
      intakeId: escalation.intakeId,
      reason: input.reason,
    },
    sendEmail: true,
  });

  return escalation;
}

export async function listEscalations(
  actor: OperationActor,
  status?: EscalationStatus | EscalationStatus[],
): Promise<EscalationRecord[]> {
  const db = getDb();
  if (!db) return [];

  const statuses = status
    ? Array.isArray(status)
      ? status
      : [status]
    : (["open", "acknowledged"] as EscalationStatus[]);

  const rows = await db
    .select()
    .from(escalationRecords)
    .where(
      actor.isAdmin
        ? inArray(escalationRecords.status, statuses)
        : and(
            eq(escalationRecords.workspaceId, actor.workspaceId),
            inArray(escalationRecords.status, statuses),
          ),
    )
    .orderBy(desc(escalationRecords.createdAt))
    .limit(100);

  return rows.map(rowToEscalation);
}

export async function updateEscalationStatus(
  actor: OperationActor,
  escalationId: string,
  status: EscalationStatus,
  resolutionNotes?: string,
): Promise<EscalationRecord | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(escalationRecords)
    .where(eq(escalationRecords.id, escalationId))
    .limit(1);

  if (!existing || !assertWorkspaceAccess(actor, existing.workspaceId)) return null;

  const now = new Date();
  const [row] = await db
    .update(escalationRecords)
    .set({
      status,
      resolutionNotes: resolutionNotes ?? existing.resolutionNotes,
      resolvedAt: ["resolved", "dismissed"].includes(status) ? now : existing.resolvedAt,
      updatedAt: now,
    })
    .where(eq(escalationRecords.id, escalationId))
    .returning();

  if (!row) return null;

  if (status === "resolved") {
    void createOperationNotification({
      workspaceId: existing.workspaceId,
      notificationType: "escalation_resolved",
      title: "operations.notifEscalationResolvedTitle",
      body: "operations.notifEscalationResolvedBody",
      data: { escalationId: row.id },
      sendEmail: true,
    });
  }

  return rowToEscalation(row);
}

export async function acknowledgeEscalation(
  actor: OperationActor,
  escalationId: string,
  supervisorId?: string,
): Promise<EscalationRecord | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(escalationRecords)
    .where(eq(escalationRecords.id, escalationId))
    .limit(1);

  if (!existing || !assertWorkspaceAccess(actor, existing.workspaceId)) return null;

  const now = new Date();
  const [row] = await db
    .update(escalationRecords)
    .set({
      status: "acknowledged",
      assignedSupervisor: supervisorId ?? actor.workspaceId,
      updatedAt: now,
    })
    .where(eq(escalationRecords.id, escalationId))
    .returning();

  return row ? rowToEscalation(row) : null;
}
