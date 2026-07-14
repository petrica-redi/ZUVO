import { eq, and, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  navigationCases,
  caseStatusHistory,
  operationTasks,
  intakeRequests,
} from "@/db/schema";
import { generateCaseNumber, generateIntakeReference } from "./ids";
import { suggestNextAction, suggestTasksForBarriers } from "./barrier-suggestions";
import type {
  CreateCaseInput,
  CreateIntakeInput,
  CreateTaskInput,
  NavigationCase,
  OperationTask,
  IntakeRequest,
} from "./types";
import type { CaseStatus } from "./constants";
import { assertWorkspaceAccess, type OperationActor } from "./permissions";

function rowToCase(row: typeof navigationCases.$inferSelect): NavigationCase {
  return {
    id: row.id,
    caseNumber: row.caseNumber,
    beneficiaryPseudonym: row.beneficiaryPseudonym,
    responsibleMediatorId: row.responsibleMediatorId ?? undefined,
    countryCode: row.countryCode,
    municipalityCode: row.municipalityCode ?? undefined,
    preferredLanguage: row.preferredLanguage,
    contactMethod: row.contactMethod ?? undefined,
    consentStatus: row.consentStatus as NavigationCase["consentStatus"],
    source: row.source as NavigationCase["source"],
    categorySlug: row.categorySlug as NavigationCase["categorySlug"],
    mainProblem: row.mainProblem,
    urgency: row.urgency as NavigationCase["urgency"],
    status: row.status as NavigationCase["status"],
    nextAction: row.nextAction ?? undefined,
    targetDate: row.targetDate ?? undefined,
    notes: row.notes,
    barriers: (row.barriers as NavigationCase["barriers"]) ?? [],
    barrierNotes: row.barrierNotes ?? undefined,
    openedAt: row.openedAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
    closedAt: row.closedAt?.toISOString(),
  };
}

export async function listCases(workspaceId: string): Promise<NavigationCase[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(navigationCases)
    .where(eq(navigationCases.workspaceId, workspaceId))
    .orderBy(desc(navigationCases.updatedAt));
  return rows.map(rowToCase);
}

export async function createCase(
  actor: OperationActor,
  input: CreateCaseInput,
): Promise<NavigationCase | null> {
  const db = getDb();
  if (!db) return null;

  const now = new Date();
  const barriers = input.barriers ?? [];
  const nextAction =
    input.nextAction ??
    (barriers.length ? suggestNextAction(barriers) : "operations.nextActionAssess");

  const [row] = await db
    .insert(navigationCases)
    .values({
      caseNumber: generateCaseNumber(input.countryCode ?? "RO"),
      workspaceId: actor.workspaceId,
      beneficiaryPseudonym: input.beneficiaryPseudonym,
      responsibleMediatorId: actor.workspaceId,
      countryCode: input.countryCode ?? "RO",
      municipalityCode: input.municipalityCode,
      preferredLanguage: input.preferredLanguage ?? "ro",
      contactMethod: input.contactMethod,
      consentStatus: input.consentStatus ?? "pending",
      source: input.source ?? "mediator_dashboard",
      categorySlug: input.categorySlug,
      mainProblem: input.mainProblem,
      urgency: input.urgency ?? "routine",
      status: input.status ?? "new",
      nextAction,
      targetDate: input.targetDate,
      notes: input.notes ?? "",
      barriers,
      barrierNotes: input.barrierNotes,
      openedAt: now,
      updatedAt: now,
    })
    .returning();

  if (!row) return null;

  await db.insert(caseStatusHistory).values({
    caseId: row.id,
    fromStatus: null,
    toStatus: row.status,
    changedBy: actor.workspaceId,
    notes: "Case opened",
  });

  const suggested = suggestTasksForBarriers(barriers);
  for (const taskType of suggested.slice(0, 2)) {
    await db.insert(operationTasks).values({
      caseId: row.id,
      workspaceId: actor.workspaceId,
      title: `operations.taskType_${taskType}`,
      taskType,
      priority: row.urgency === "emergency" ? "urgent" : row.urgency,
      assignee: actor.workspaceId,
      createdBy: actor.workspaceId,
      dueDate: input.targetDate,
    });
  }

  return rowToCase(row);
}

export async function updateCaseStatus(
  actor: OperationActor,
  caseId: string,
  toStatus: CaseStatus,
  notes?: string,
): Promise<NavigationCase | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(navigationCases)
    .where(eq(navigationCases.id, caseId))
    .limit(1);

  if (!existing || !assertWorkspaceAccess(actor, existing.workspaceId)) return null;

  const now = new Date();
  const [row] = await db
    .update(navigationCases)
    .set({
      status: toStatus,
      updatedAt: now,
      closedAt: ["completed", "closed_incomplete", "cancelled"].includes(toStatus)
        ? now
        : existing.closedAt,
    })
    .where(eq(navigationCases.id, caseId))
    .returning();

  if (!row) return null;

  await db.insert(caseStatusHistory).values({
    caseId: row.id,
    fromStatus: existing.status,
    toStatus,
    changedBy: actor.workspaceId,
    notes,
  });

  return rowToCase(row);
}

export async function listTasks(workspaceId: string): Promise<OperationTask[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(operationTasks)
    .where(eq(operationTasks.workspaceId, workspaceId))
    .orderBy(desc(operationTasks.updatedAt));
  return rows.map((r) => ({
    id: r.id,
    caseId: r.caseId ?? undefined,
    title: r.title,
    description: r.description,
    taskType: r.taskType as OperationTask["taskType"],
    status: r.status as OperationTask["status"],
    priority: r.priority as OperationTask["priority"],
    assignee: r.assignee ?? undefined,
    createdBy: r.createdBy ?? undefined,
    dueDate: r.dueDate ?? undefined,
    reminderDate: r.reminderDate ?? undefined,
    completionEvidence: r.completionEvidence ?? undefined,
    completedAt: r.completedAt?.toISOString(),
    createdAt: r.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: r.updatedAt?.toISOString() ?? new Date().toISOString(),
  }));
}

export async function createTask(
  actor: OperationActor,
  input: CreateTaskInput,
): Promise<OperationTask | null> {
  const db = getDb();
  if (!db) return null;

  if (input.caseId) {
    const [c] = await db
      .select()
      .from(navigationCases)
      .where(
        and(
          eq(navigationCases.id, input.caseId),
          eq(navigationCases.workspaceId, actor.workspaceId),
        ),
      )
      .limit(1);
    if (!c) return null;
  }

  const now = new Date();
  const [row] = await db
    .insert(operationTasks)
    .values({
      caseId: input.caseId,
      workspaceId: actor.workspaceId,
      title: input.title,
      description: input.description ?? "",
      taskType: input.taskType ?? "other",
      priority: input.priority ?? "routine",
      assignee: input.assignee ?? actor.workspaceId,
      createdBy: actor.workspaceId,
      dueDate: input.dueDate,
      reminderDate: input.reminderDate,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!row) return null;

  return {
    id: row.id,
    caseId: row.caseId ?? undefined,
    title: row.title,
    description: row.description,
    taskType: row.taskType as OperationTask["taskType"],
    status: row.status as OperationTask["status"],
    priority: row.priority as OperationTask["priority"],
    assignee: row.assignee ?? undefined,
    createdBy: row.createdBy ?? undefined,
    dueDate: row.dueDate ?? undefined,
    reminderDate: row.reminderDate ?? undefined,
    createdAt: row.createdAt?.toISOString() ?? now.toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? now.toISOString(),
  };
}

export async function createIntake(input: CreateIntakeInput): Promise<IntakeRequest | null> {
  const db = getDb();
  if (!db) return null;

  const now = new Date();
  const [row] = await db
    .insert(intakeRequests)
    .values({
      referenceCode: generateIntakeReference(),
      preferredLanguage: input.preferredLanguage ?? "ro",
      contactMethod: input.contactMethod,
      contactValue: input.contactValue,
      countryCode: input.countryCode ?? "RO",
      municipalityCode: input.municipalityCode,
      helpType: input.helpType,
      consentGranted: input.consentGranted,
      notes: input.notes ?? "",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!row) return null;

  return {
    id: row.id,
    referenceCode: row.referenceCode,
    preferredLanguage: row.preferredLanguage,
    contactMethod: row.contactMethod,
    contactValue: row.contactValue ?? undefined,
    countryCode: row.countryCode,
    municipalityCode: row.municipalityCode ?? undefined,
    helpType: row.helpType as IntakeRequest["helpType"],
    consentGranted: row.consentGranted,
    status: row.status as IntakeRequest["status"],
    notes: row.notes,
    createdAt: row.createdAt?.toISOString() ?? now.toISOString(),
  };
}

export async function listIntakes(status?: string): Promise<IntakeRequest[]> {
  const db = getDb();
  if (!db) return [];

  const base = db.select().from(intakeRequests).orderBy(desc(intakeRequests.createdAt)).limit(100);
  const rows = status
    ? await base.where(eq(intakeRequests.status, status))
    : await base;

  return rows.map((row) => ({
    id: row.id,
    referenceCode: row.referenceCode,
    preferredLanguage: row.preferredLanguage,
    contactMethod: row.contactMethod,
    contactValue: row.contactValue ?? undefined,
    countryCode: row.countryCode,
    municipalityCode: row.municipalityCode ?? undefined,
    helpType: row.helpType as IntakeRequest["helpType"],
    consentGranted: row.consentGranted,
    status: row.status as IntakeRequest["status"],
    notes: row.notes,
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
  }));
}

export async function updateTaskStatus(
  actor: OperationActor,
  taskId: string,
  status: OperationTask["status"],
  evidence?: string,
): Promise<OperationTask | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(operationTasks)
    .where(eq(operationTasks.id, taskId))
    .limit(1);

  if (!existing || !assertWorkspaceAccess(actor, existing.workspaceId)) return null;

  const now = new Date();
  const [row] = await db
    .update(operationTasks)
    .set({
      status,
      completionEvidence: evidence ?? existing.completionEvidence,
      completedAt: status === "completed" ? now : existing.completedAt,
      updatedAt: now,
    })
    .where(eq(operationTasks.id, taskId))
    .returning();

  if (!row) return null;

  return {
    id: row.id,
    caseId: row.caseId ?? undefined,
    title: row.title,
    description: row.description,
    taskType: row.taskType as OperationTask["taskType"],
    status: row.status as OperationTask["status"],
    priority: row.priority as OperationTask["priority"],
    assignee: row.assignee ?? undefined,
    createdBy: row.createdBy ?? undefined,
    dueDate: row.dueDate ?? undefined,
    reminderDate: row.reminderDate ?? undefined,
    completionEvidence: row.completionEvidence ?? undefined,
    completedAt: row.completedAt?.toISOString(),
    createdAt: row.createdAt?.toISOString() ?? now.toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? now.toISOString(),
  };
}

export async function convertIntakeToCase(
  actor: OperationActor,
  intakeId: string,
  pseudonym: string,
): Promise<NavigationCase | null> {
  const db = getDb();
  if (!db) return null;

  const [intake] = await db
    .select()
    .from(intakeRequests)
    .where(eq(intakeRequests.id, intakeId))
    .limit(1);
  if (!intake) return null;

  const navCase = await createCase(actor, {
    beneficiaryPseudonym: pseudonym,
    countryCode: intake.countryCode,
    municipalityCode: intake.municipalityCode ?? undefined,
    preferredLanguage: intake.preferredLanguage,
    contactMethod: intake.contactMethod,
    source: "intake_request",
    categorySlug: "other",
    mainProblem: intake.helpType,
    notes: intake.notes,
    consentStatus: intake.consentGranted ? "granted" : "pending",
  });

  if (!navCase) return null;

  await db
    .update(intakeRequests)
    .set({
      status: "converted",
      convertedCaseId: navCase.id,
      updatedAt: new Date(),
    })
    .where(eq(intakeRequests.id, intakeId));

  return navCase;
}
