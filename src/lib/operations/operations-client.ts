/**
 * Client-side operations sync — offline-first with optional cloud persistence.
 */

import type { NavigationCase, OperationTask } from "./types";
import type {
  CreateCaseInput,
  CreateTaskInput,
  CreateReferralInput,
  CreateAppointmentInput,
  OperationalProvider,
  Referral,
  Appointment,
} from "./types";
import {
  createLocalCase,
  createLocalTask,
  completeLocalTask,
  listLocalCases,
  listLocalTasks,
  updateLocalCaseStatus,
} from "./local-store";
import type { AttendanceOutcome } from "./constants";
import {
  getOrCreateWorkspaceId,
  readLocalWorkspace,
} from "@/lib/mediator/workspace-client";

function workspaceHeaders(): Record<string, string> {
  const workspaceId = getOrCreateWorkspaceId();
  const headers: Record<string, string> = { "x-workspace-id": workspaceId };
  if (typeof window !== "undefined") {
    const secret = localStorage.getItem("redi_mediator_workspace_secret");
    if (secret) headers["x-workspace-secret"] = secret;
  }
  return headers;
}

export type OperationsSyncStatus = "idle" | "syncing" | "synced" | "offline";

async function fetchRemoteCases(): Promise<NavigationCase[] | null> {
  try {
    const res = await fetch("/api/operations/cases", { headers: workspaceHeaders() });
    if (!res.ok) return null;
    const json = (await res.json()) as { success?: boolean; data?: NavigationCase[] };
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
  }
}

async function fetchRemoteTasks(): Promise<OperationTask[] | null> {
  try {
    const res = await fetch("/api/operations/tasks", { headers: workspaceHeaders() });
    if (!res.ok) return null;
    const json = (await res.json()) as { success?: boolean; data?: OperationTask[] };
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
  }
}

function mergeById<T extends { id: string; updatedAt: string }>(
  local: T[],
  remote: T[],
): T[] {
  const map = new Map<string, T>();
  for (const row of [...local, ...remote]) {
    const existing = map.get(row.id);
    if (!existing || row.updatedAt > existing.updatedAt) map.set(row.id, row);
  }
  return [...map.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function syncOperations(): Promise<{
  cases: NavigationCase[];
  tasks: OperationTask[];
  status: OperationsSyncStatus;
}> {
  const localCases = listLocalCases();
  const localTasks = listLocalTasks();

  const [remoteCases, remoteTasks] = await Promise.all([
    fetchRemoteCases(),
    fetchRemoteTasks(),
  ]);

  if (!remoteCases && !remoteTasks) {
    return { cases: localCases, tasks: localTasks, status: "offline" };
  }

  const cases = remoteCases ? mergeById(localCases, remoteCases) : localCases;
  const tasks = remoteTasks ? mergeById(localTasks, remoteTasks) : localTasks;

  return { cases, tasks, status: "synced" };
}

export async function pushCase(input: CreateCaseInput): Promise<NavigationCase> {
  const local = createLocalCase(input);

  try {
    const res = await fetch("/api/operations/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const json = (await res.json()) as { data?: NavigationCase };
      if (json.data) return json.data;
    }
  } catch {
    /* offline */
  }

  return local;
}

export async function pushTask(input: CreateTaskInput): Promise<OperationTask> {
  const local = createLocalTask(input);

  try {
    const res = await fetch("/api/operations/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const json = (await res.json()) as { data?: OperationTask };
      if (json.data) return json.data;
    }
  } catch {
    /* offline */
  }

  return local;
}

export async function patchCaseStatus(
  caseId: string,
  status: NavigationCase["status"],
): Promise<NavigationCase | null> {
  const local = updateLocalCaseStatus(caseId, status);

  try {
    const res = await fetch(`/api/operations/cases/${caseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const json = (await res.json()) as { data?: NavigationCase };
      if (json.data) return json.data;
    }
  } catch {
    /* offline */
  }

  return local;
}

export async function patchTaskComplete(
  taskId: string,
  evidence?: string,
): Promise<OperationTask | null> {
  const local = completeLocalTask(taskId, evidence);

  try {
    const res = await fetch(`/api/operations/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify({ status: "completed", completionEvidence: evidence }),
    });
    if (res.ok) {
      const json = (await res.json()) as { data?: OperationTask };
      if (json.data) return json.data;
    }
  } catch {
    /* offline */
  }

  return local;
}

/** County code from mediator workspace for default geography */
export function getDefaultMunicipality(): string | undefined {
  const { countyCode } = readLocalWorkspace();
  return countyCode || undefined;
}

export async function searchProvidersForCase(
  categorySlug: string,
  language: string,
  municipalityCode?: string,
  countryCode = "RO",
): Promise<OperationalProvider[]> {
  try {
    const params = new URLSearchParams({
      categorySlug,
      language,
      countryCode,
    });
    if (municipalityCode) params.set("municipalityCode", municipalityCode);

    const res = await fetch(`/api/operations/providers?${params}`, {
      headers: workspaceHeaders(),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success?: boolean; data?: OperationalProvider[] };
    return json.success && json.data ? json.data : [];
  } catch {
    return [];
  }
}

export async function fetchReferrals(caseId?: string): Promise<Referral[]> {
  try {
    const qs = caseId ? `?caseId=${caseId}` : "";
    const res = await fetch(`/api/operations/referrals${qs}`, {
      headers: workspaceHeaders(),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success?: boolean; data?: Referral[] };
    return json.success && json.data ? json.data : [];
  } catch {
    return [];
  }
}

export async function pushReferral(input: CreateReferralInput): Promise<Referral | null> {
  try {
    const res = await fetch("/api/operations/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const json = (await res.json()) as { data?: Referral };
      return json.data ?? null;
    }
  } catch {
    /* offline */
  }
  return null;
}

export async function fetchAppointments(caseId?: string): Promise<Appointment[]> {
  try {
    const qs = caseId ? `?caseId=${caseId}` : "";
    const res = await fetch(`/api/operations/appointments${qs}`, {
      headers: workspaceHeaders(),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success?: boolean; data?: Appointment[] };
    return json.success && json.data ? json.data : [];
  } catch {
    return [];
  }
}

export async function pushAppointment(
  input: CreateAppointmentInput,
): Promise<Appointment | null> {
  try {
    const res = await fetch("/api/operations/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const json = (await res.json()) as { data?: Appointment };
      return json.data ?? null;
    }
  } catch {
    /* offline */
  }
  return null;
}

export async function patchAppointmentConfirm(appointmentId: string): Promise<void> {
  try {
    await fetch(`/api/operations/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify({ status: "confirmed" }),
    });
  } catch {
    /* offline */
  }
}

export async function pushAttendance(
  appointmentId: string,
  outcome: AttendanceOutcome,
  followUpRequired: boolean,
  notes?: string,
): Promise<void> {
  try {
    await fetch(`/api/operations/appointments/${appointmentId}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify({ outcome, followUpRequired, notes }),
    });
  } catch {
    /* offline */
  }
}
