/**
 * Missed-appointment recovery — auto-creates follow-up tasks and notifications.
 * Standalone hook (Phase 2 appointment-service not present).
 */

import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { intakeRequests, navigationCases } from "@/db/schema";
import { createTask } from "./case-service";
import { createEscalation } from "./escalation-service";
import { createOperationNotification } from "./notification-service";
import type { CaseUrgency } from "./constants";
import type { MissedAppointmentInput, NavigationCase, OperationTask } from "./types";
import { assertWorkspaceAccess, type OperationActor } from "./permissions";

function dueInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export type MissedAppointmentResult = {
  tasks: OperationTask[];
  case?: NavigationCase;
  escalated: boolean;
  notificationSent: boolean;
};

export async function handleMissedAppointment(
  actor: OperationActor,
  input: MissedAppointmentInput,
): Promise<MissedAppointmentResult | null> {
  const db = getDb();
  if (!db) return null;

  let caseId = input.caseId;
  let beneficiaryPseudonym = input.beneficiaryPseudonym;
  let urgency: "routine" | "priority" | "urgent" = "priority";

  if (input.intakeId) {
    const [intake] = await db
      .select()
      .from(intakeRequests)
      .where(eq(intakeRequests.id, input.intakeId))
      .limit(1);
    if (!intake) return null;
    beneficiaryPseudonym = beneficiaryPseudonym ?? intake.referenceCode;
  }

  if (caseId) {
    const [navCase] = await db
      .select()
      .from(navigationCases)
      .where(eq(navigationCases.id, caseId))
      .limit(1);
    if (!navCase || !assertWorkspaceAccess(actor, navCase.workspaceId)) return null;
    beneficiaryPseudonym = beneficiaryPseudonym ?? navCase.beneficiaryPseudonym;
    if (navCase.urgency === "urgent" || navCase.urgency === "emergency") {
      urgency = "urgent";
    }
  }

  const tasks: OperationTask[] = [];
  const recoveryTasks: Array<{
    title: string;
    taskType: "call_beneficiary" | "book_appointment" | "schedule_followup";
    dueDate: string;
    priority: CaseUrgency;
  }> = [
    {
      title: "operations.taskMissedApptCall",
      taskType: "call_beneficiary",
      dueDate: dueInDays(1),
      priority: urgency,
    },
    {
      title: "operations.taskMissedApptRebook",
      taskType: "book_appointment",
      dueDate: dueInDays(3),
      priority: urgency,
    },
    {
      title: "operations.taskMissedApptFollowup",
      taskType: "schedule_followup",
      dueDate: dueInDays(7),
      priority: "routine",
    },
  ];

  for (const spec of recoveryTasks) {
    const task = await createTask(actor, {
      caseId,
      title: spec.title,
      description: input.notes ?? "",
      taskType: spec.taskType,
      priority: spec.priority,
      dueDate: spec.dueDate,
    });
    if (task) tasks.push(task);
  }

  const notif = await createOperationNotification({
    workspaceId: actor.workspaceId,
    notificationType: "missed_appointment",
    title: "operations.notifMissedApptTitle",
    body: "operations.notifMissedApptBody",
    data: {
      caseId,
      intakeId: input.intakeId,
      beneficiaryPseudonym,
      taskIds: tasks.map((t) => t.id),
    },
    sendEmail: true,
  });

  let escalated = false;
  if (urgency === "urgent" && caseId) {
    const escalation = await createEscalation(actor, {
      caseId,
      reason: "operations.escalationMissedApptUrgent",
      priority: "urgent",
    });
    escalated = !!escalation;
  }

  return {
    tasks,
    escalated,
    notificationSent: !!notif,
  };
}

/** Public intake path — uses system workspace for routing notifications. */
export async function handleMissedAppointmentFromIntake(
  intakeId: string,
  notifyWorkspaceId?: string,
): Promise<MissedAppointmentResult | null> {
  const workspaceId = notifyWorkspaceId ?? "intake-queue";
  const actor: OperationActor = { workspaceId, isAdmin: true };
  return handleMissedAppointment(actor, { intakeId });
}
