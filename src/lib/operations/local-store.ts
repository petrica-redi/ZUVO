/**
 * Client-side operational store — offline-first, syncs to API when online.
 */

import type { NavigationCase, OperationTask } from "./types";
import type { CreateCaseInput, CreateTaskInput } from "./types";
import { generateCaseNumber } from "./ids";
import { suggestNextAction, suggestTasksForBarriers } from "./barrier-suggestions";
import type { TaskType } from "./constants";

const CASES_KEY = "redi_operational_cases";
const TASKS_KEY = "redi_operational_tasks";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function listLocalCases(): NavigationCase[] {
  return read<NavigationCase>(CASES_KEY);
}

export function listLocalTasks(): OperationTask[] {
  return read<OperationTask>(TASKS_KEY);
}

export function createLocalCase(input: CreateCaseInput): NavigationCase {
  const now = new Date().toISOString();
  const barriers = input.barriers ?? [];
  const navCase: NavigationCase = {
    id: crypto.randomUUID(),
    caseNumber: generateCaseNumber(input.countryCode ?? "RO"),
    beneficiaryPseudonym: input.beneficiaryPseudonym,
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
    nextAction:
      input.nextAction ??
      (barriers.length ? suggestNextAction(barriers) : "operations.nextActionAssess"),
    targetDate: input.targetDate,
    notes: input.notes ?? "",
    barriers,
    barrierNotes: input.barrierNotes,
    openedAt: now,
    updatedAt: now,
  };

  const cases = listLocalCases();
  cases.unshift(navCase);
  write(CASES_KEY, cases);

  const suggested = suggestTasksForBarriers(barriers);
  for (const taskType of suggested.slice(0, 2)) {
    createLocalTask({
      caseId: navCase.id,
      title: `operations.taskType_${taskType}`,
      taskType,
      priority: navCase.urgency === "emergency" ? "urgent" : navCase.urgency,
      dueDate: input.targetDate,
    });
  }

  return navCase;
}

export function updateLocalCaseStatus(
  caseId: string,
  status: NavigationCase["status"],
): NavigationCase | null {
  const cases = listLocalCases();
  const idx = cases.findIndex((c) => c.id === caseId);
  if (idx < 0) return null;
  const now = new Date().toISOString();
  cases[idx] = {
    ...cases[idx]!,
    status,
    updatedAt: now,
    closedAt: ["completed", "closed_incomplete", "cancelled"].includes(status)
      ? now
      : cases[idx]!.closedAt,
  };
  write(CASES_KEY, cases);
  return cases[idx]!;
}

export function createLocalTask(input: CreateTaskInput): OperationTask {
  const now = new Date().toISOString();
  const task: OperationTask = {
    id: crypto.randomUUID(),
    caseId: input.caseId,
    title: input.title,
    description: input.description ?? "",
    taskType: input.taskType ?? "other",
    status: "todo",
    priority: input.priority ?? "routine",
    assignee: input.assignee,
    dueDate: input.dueDate,
    reminderDate: input.reminderDate,
    createdAt: now,
    updatedAt: now,
  };
  const tasks = listLocalTasks();
  tasks.unshift(task);
  write(TASKS_KEY, tasks);
  return task;
}

export function completeLocalTask(taskId: string, evidence?: string): OperationTask | null {
  const tasks = listLocalTasks();
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx < 0) return null;
  const now = new Date().toISOString();
  tasks[idx] = {
    ...tasks[idx]!,
    status: "completed",
    completionEvidence: evidence,
    completedAt: now,
    updatedAt: now,
  };
  write(TASKS_KEY, tasks);
  return tasks[idx]!;
}

export function getOverdueTasks(): OperationTask[] {
  const today = new Date().toISOString().slice(0, 10);
  return listLocalTasks().filter(
    (t) =>
      t.dueDate &&
      t.dueDate < today &&
      !["completed", "cancelled"].includes(t.status),
  );
}

export function getTasksDueToday(): OperationTask[] {
  const today = new Date().toISOString().slice(0, 10);
  return listLocalTasks().filter(
    (t) => t.dueDate === today && !["completed", "cancelled"].includes(t.status),
  );
}

export function getUrgentCases(): NavigationCase[] {
  return listLocalCases().filter(
    (c) =>
      ["urgent", "emergency"].includes(c.urgency) &&
      !["completed", "closed_incomplete", "cancelled"].includes(c.status),
  );
}

/** Map task type to i18n title key for auto-created tasks */
export function taskTypeTitleKey(taskType: TaskType): string {
  return `operations.taskType_${taskType}`;
}
