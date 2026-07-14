import { eq, and, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  appointments,
  attendanceOutcomes,
  navigationCases,
  providers,
  operationTasks,
  referrals,
} from "@/db/schema";
import { updateCaseStatus } from "./case-service";
import type {
  Appointment,
  AttendanceRecord,
  CreateAppointmentInput,
  RecordAttendanceInput,
} from "./types";
import type { AppointmentStatus, AttendanceOutcome } from "./constants";
import { assertWorkspaceAccess, type OperationActor } from "./permissions";

function rowToAppointment(
  row: typeof appointments.$inferSelect,
  providerName?: string,
): Appointment {
  return {
    id: row.id,
    caseId: row.caseId,
    providerId: row.providerId,
    providerName,
    referralId: row.referralId ?? undefined,
    status: row.status,
    appointmentDate: row.appointmentDate,
    appointmentTime: row.appointmentTime ?? undefined,
    location: row.location ?? undefined,
    accompanimentRequired: row.accompanimentRequired,
    interpretationRequired: row.interpretationRequired,
    notes: row.notes,
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

function rowToAttendance(row: typeof attendanceOutcomes.$inferSelect): AttendanceRecord {
  return {
    id: row.id,
    appointmentId: row.appointmentId,
    outcome: row.outcome,
    followUpRequired: row.followUpRequired,
    followUpAction: row.followUpAction ?? undefined,
    notes: row.notes,
    recordedAt: row.recordedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function listAppointments(
  workspaceId: string,
  caseId?: string,
): Promise<Appointment[]> {
  const db = getDb();
  if (!db) return [];

  const conditions = [eq(appointments.workspaceId, workspaceId)];
  if (caseId) conditions.push(eq(appointments.caseId, caseId));

  const rows = await db
    .select({
      appointment: appointments,
      providerName: providers.name,
    })
    .from(appointments)
    .leftJoin(providers, eq(appointments.providerId, providers.id))
    .where(and(...conditions))
    .orderBy(desc(appointments.appointmentDate));

  return rows.map((r) =>
    rowToAppointment(r.appointment, r.providerName ?? undefined),
  );
}

export async function createAppointment(
  actor: OperationActor,
  input: CreateAppointmentInput,
): Promise<Appointment | null> {
  const db = getDb();
  if (!db) return null;

  const [navCase] = await db
    .select()
    .from(navigationCases)
    .where(
      and(
        eq(navigationCases.id, input.caseId),
        eq(navigationCases.workspaceId, actor.workspaceId),
      ),
    )
    .limit(1);

  if (!navCase) return null;

  const [provider] = await db
    .select()
    .from(providers)
    .where(eq(providers.id, input.providerId))
    .limit(1);

  if (!provider) return null;

  const now = new Date();
  const [row] = await db
    .insert(appointments)
    .values({
      workspaceId: actor.workspaceId,
      caseId: input.caseId,
      providerId: input.providerId,
      referralId: input.referralId,
      status: "requested",
      appointmentDate: input.appointmentDate,
      appointmentTime: input.appointmentTime,
      location: input.location ?? provider.address,
      accompanimentRequired: input.accompanimentRequired ?? false,
      interpretationRequired: input.interpretationRequired ?? false,
      notes: input.notes ?? "",
      createdBy: actor.workspaceId,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!row) return null;

  await updateCaseStatus(actor, input.caseId, "appointment_requested", "Appointment scheduled");

  if (input.referralId) {
    await db
      .update(referrals)
      .set({ status: "scheduled", updatedAt: now })
      .where(eq(referrals.id, input.referralId));
  }

  await db.insert(operationTasks).values({
    caseId: input.caseId,
    workspaceId: actor.workspaceId,
    title: "operations.taskType_send_reminder",
    taskType: "send_reminder",
    priority: navCase.urgency === "emergency" ? "urgent" : navCase.urgency,
    assignee: actor.workspaceId,
    createdBy: actor.workspaceId,
    dueDate: input.appointmentDate,
    reminderDate: input.appointmentDate,
  });

  return rowToAppointment(row, provider.name);
}

export async function updateAppointmentStatus(
  actor: OperationActor,
  appointmentId: string,
  status: AppointmentStatus,
): Promise<Appointment | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, appointmentId))
    .limit(1);

  if (!existing || !assertWorkspaceAccess(actor, existing.workspaceId)) return null;

  const now = new Date();
  const updates: Partial<typeof appointments.$inferInsert> = {
    status,
    updatedAt: now,
  };

  if (status === "confirmed") {
    await updateCaseStatus(actor, existing.caseId, "appointment_confirmed");
  }

  const [row] = await db
    .update(appointments)
    .set(updates)
    .where(eq(appointments.id, appointmentId))
    .returning();

  if (!row) return null;

  const [provider] = await db
    .select({ name: providers.name })
    .from(providers)
    .where(eq(providers.id, row.providerId))
    .limit(1);

  return rowToAppointment(row, provider?.name);
}

export async function recordAttendance(
  actor: OperationActor,
  appointmentId: string,
  input: RecordAttendanceInput,
): Promise<{ attendance: AttendanceRecord; appointment: Appointment } | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, appointmentId))
    .limit(1);

  if (!existing || !assertWorkspaceAccess(actor, existing.workspaceId)) return null;

  const now = new Date();
  const outcome = input.outcome as AttendanceOutcome;

  const [attendanceRow] = await db
    .insert(attendanceOutcomes)
    .values({
      appointmentId,
      outcome,
      followUpRequired: input.followUpRequired ?? false,
      followUpAction: input.followUpAction,
      notes: input.notes ?? "",
      recordedBy: actor.workspaceId,
      recordedAt: now,
    })
    .returning();

  if (!attendanceRow) return null;

  const appointmentStatus: AppointmentStatus =
    outcome === "attended" || outcome === "partial"
      ? "completed"
      : outcome === "missed" || outcome === "no_show"
        ? "missed"
        : "cancelled";

  const [appointmentRow] = await db
    .update(appointments)
    .set({ status: appointmentStatus, updatedAt: now })
    .where(eq(appointments.id, appointmentId))
    .returning();

  if (!appointmentRow) return null;

  const [navCase] = await db
    .select()
    .from(navigationCases)
    .where(eq(navigationCases.id, existing.caseId))
    .limit(1);

  if (outcome === "attended" || outcome === "partial") {
    await updateCaseStatus(actor, existing.caseId, "follow_up", "Attendance confirmed");
  } else if (outcome === "missed" || outcome === "no_show") {
    await updateCaseStatus(actor, existing.caseId, "action_required", "Missed appointment");
    const { handleMissedAppointment } = await import("./missed-appointment-service");
    void handleMissedAppointment(actor, {
      caseId: existing.caseId,
      notes: input.notes,
    });
  }

  if (input.followUpRequired) {
    await db.insert(operationTasks).values({
      caseId: existing.caseId,
      workspaceId: actor.workspaceId,
      title: "operations.taskType_schedule_followup",
      taskType: "schedule_followup",
      priority: navCase?.urgency === "emergency" ? "urgent" : navCase?.urgency ?? "routine",
      assignee: actor.workspaceId,
      createdBy: actor.workspaceId,
      description: input.followUpAction ?? "",
    });
  }

  const [provider] = await db
    .select({ name: providers.name })
    .from(providers)
    .where(eq(providers.id, appointmentRow.providerId))
    .limit(1);

  return {
    attendance: rowToAttendance(attendanceRow),
    appointment: rowToAppointment(appointmentRow, provider?.name),
  };
}

export async function listAttendanceForAppointment(
  appointmentId: string,
): Promise<AttendanceRecord[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(attendanceOutcomes)
    .where(eq(attendanceOutcomes.appointmentId, appointmentId))
    .orderBy(desc(attendanceOutcomes.recordedAt));

  return rows.map(rowToAttendance);
}
