/**
 * Client-side cross-border API — offline-aware.
 */

import type { CountryAccessGuidance } from "./guidance-service";
import type { CrossBorderHandover } from "./handover-service";
import type { CreateHandoverInput } from "./handover-service";
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

export async function fetchHandovers(): Promise<CrossBorderHandover[]> {
  try {
    const res = await fetch("/api/operations/handovers", {
      headers: workspaceHeaders(),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success?: boolean; data?: CrossBorderHandover[] };
    return json.success && json.data ? json.data : [];
  } catch {
    return [];
  }
}

export async function createHandoverRequest(
  input: CreateHandoverInput,
): Promise<CrossBorderHandover | null> {
  try {
    const res = await fetch("/api/operations/handovers", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: CrossBorderHandover };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function patchHandover(
  handoverId: string,
  action: "record_consent" | "request" | "accept" | "reject" | "complete" | "cancel",
  rejectionReason?: string,
): Promise<CrossBorderHandover | null> {
  try {
    const res = await fetch(`/api/operations/handovers/${handoverId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify({ action, rejectionReason }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: CrossBorderHandover };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchGuidance(
  origin: string,
  destination: string,
): Promise<CountryAccessGuidance[]> {
  try {
    const params = new URLSearchParams({ origin, destination });
    const res = await fetch(`/api/operations/guidance?${params}`, {
      headers: workspaceHeaders(),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success?: boolean; data?: CountryAccessGuidance[] };
    return json.success && json.data ? json.data : [];
  } catch {
    return [];
  }
}
