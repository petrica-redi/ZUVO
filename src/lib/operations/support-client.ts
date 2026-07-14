/**
 * Client helpers for Phase 3 — intakes, notifications, escalations, routing.
 */

import type {
  EscalationRecord,
  IntakeRequest,
  OperationNotification,
  RoutingRule,
} from "./types";
import {
  getOrCreateWorkspaceId,
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

export async function fetchIntakes(status?: string): Promise<IntakeRequest[]> {
  try {
    const qs = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await fetch(`/api/operations/intake${qs}`, {
      headers: workspaceHeaders(),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success?: boolean; data?: IntakeRequest[] };
    return json.success && json.data ? json.data : [];
  } catch {
    return [];
  }
}

export async function routeIntakeRequest(
  intakeId: string,
  teamId?: string,
): Promise<IntakeRequest | null> {
  try {
    const res = await fetch("/api/operations/routing", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify({ intakeId, teamId, auto: !teamId }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: IntakeRequest };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function convertIntake(
  intakeId: string,
  beneficiaryPseudonym: string,
): Promise<boolean> {
  try {
    const res = await fetch(`/api/operations/intake/${intakeId}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify({ beneficiaryPseudonym }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchEscalations(): Promise<EscalationRecord[]> {
  try {
    const res = await fetch("/api/operations/escalations", {
      headers: workspaceHeaders(),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success?: boolean; data?: EscalationRecord[] };
    return json.success && json.data ? json.data : [];
  } catch {
    return [];
  }
}

export async function updateEscalation(
  escalationId: string,
  status: EscalationRecord["status"],
  resolutionNotes?: string,
): Promise<EscalationRecord | null> {
  try {
    const res = await fetch(`/api/operations/escalations/${escalationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify({ status, resolutionNotes }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: EscalationRecord };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function createEscalation(input: {
  caseId?: string;
  intakeId?: string;
  reason: string;
  priority?: EscalationRecord["priority"];
}): Promise<EscalationRecord | null> {
  try {
    const res = await fetch("/api/operations/escalations", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: EscalationRecord };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchNotifications(
  unreadOnly = false,
): Promise<OperationNotification[]> {
  try {
    const qs = unreadOnly ? "?unread=true" : "";
    const res = await fetch(`/api/operations/notifications${qs}`, {
      headers: workspaceHeaders(),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      success?: boolean;
      data?: OperationNotification[];
    };
    return json.success && json.data ? json.data : [];
  } catch {
    return [];
  }
}

export async function markNotificationRead(
  notificationId: string,
): Promise<boolean> {
  try {
    const res = await fetch(`/api/operations/notifications/${notificationId}`, {
      method: "PATCH",
      headers: workspaceHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchRoutingRules(): Promise<RoutingRule[]> {
  try {
    const res = await fetch("/api/operations/routing", {
      headers: workspaceHeaders(),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success?: boolean; data?: RoutingRule[] };
    return json.success && json.data ? json.data : [];
  } catch {
    return [];
  }
}

export async function triggerMissedAppointmentRecovery(input: {
  caseId?: string;
  intakeId?: string;
  notes?: string;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/operations/missed-appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify(input),
    });
    return res.ok;
  } catch {
    return false;
  }
}
