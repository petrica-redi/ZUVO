/**
 * Client-side persistence + sync for the mediator field workspace.
 *
 * Storage layers:
 *  - `localStorage` for offline-first reads and writes.
 *  - `/api/mediator/workspace` (PUT) for optional cloud sync.
 *
 * The cloud copy is identified by a durable workspace UUID so that clearing
 * the app's anonymous session id does not orphan a mediator's case load.
 */

import {
  EMPTY_WORKSPACE,
  type MediatorWorkspacePayload,
} from "./types";
import { mergeWorkspace, parseWorkspacePayload } from "./merge-workspace";

const STORAGE = {
  workspaceId: "redi_mediator_workspace_id",
  workspaceSecret: "redi_mediator_workspace_secret",
  cases: "sastipe_mediator_cases",
  visits: "sastipe_mediator_visits",
  sessions: "sastipe_mediator_sessions",
  county: "sastipe_mediator_county",
  updatedAt: "sastipe_mediator_updated_at",
} as const;

function workspaceHeaders(workspaceId: string): Record<string, string> {
  const headers: Record<string, string> = { "x-workspace-id": workspaceId };
  if (typeof window !== "undefined") {
    const secret = localStorage.getItem(STORAGE.workspaceSecret);
    if (secret) headers["x-workspace-secret"] = secret;
  }
  return headers;
}

function storeWorkspaceSecret(secret: string | undefined): void {
  if (secret && typeof window !== "undefined") {
    localStorage.setItem(STORAGE.workspaceSecret, secret);
  }
}

export type SyncStatus = "idle" | "syncing" | "synced" | "offline" | "error";

export type LocalWorkspaceSnapshot = {
  workspaceId: string;
  payload: MediatorWorkspacePayload;
  countyCode: string;
  updatedAt: string;
};

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getOrCreateWorkspaceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(STORAGE.workspaceId);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE.workspaceId, id);
  }
  return id;
}

/**
 * Bind the browser workspace to a named field-staff assignment.
 * Called after MoU field login so ops/API calls use the roster workspace id.
 */
export function bindFieldWorkspace(workspaceId: string, countyCode?: string): void {
  if (typeof window === "undefined" || !workspaceId.trim()) return;
  localStorage.setItem(STORAGE.workspaceId, workspaceId.trim());
  if (countyCode?.trim()) {
    localStorage.setItem(STORAGE.county, countyCode.trim().toUpperCase());
  }
}

export function readLocalWorkspace(): LocalWorkspaceSnapshot {
  if (typeof window === "undefined") {
    return {
      workspaceId: "",
      payload: { ...EMPTY_WORKSPACE },
      countyCode: "",
      updatedAt: new Date(0).toISOString(),
    };
  }
  const payload: MediatorWorkspacePayload = {
    version: 1,
    cases: safeReadJson(STORAGE.cases, []),
    visits: safeReadJson(STORAGE.visits, []),
    sessions: safeReadJson(STORAGE.sessions, []),
  };
  return {
    workspaceId: getOrCreateWorkspaceId(),
    payload: parseWorkspacePayload(payload),
    countyCode: localStorage.getItem(STORAGE.county) ?? "",
    updatedAt:
      localStorage.getItem(STORAGE.updatedAt) ?? new Date(0).toISOString(),
  };
}

export function writeLocalWorkspace(
  payload: MediatorWorkspacePayload,
  countyCode: string,
  updatedAt: string,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE.cases, JSON.stringify(payload.cases));
  localStorage.setItem(STORAGE.visits, JSON.stringify(payload.visits));
  localStorage.setItem(STORAGE.sessions, JSON.stringify(payload.sessions));
  localStorage.setItem(STORAGE.county, countyCode);
  localStorage.setItem(STORAGE.updatedAt, updatedAt);
}

type RemoteResponse = {
  success?: boolean;
  data?: {
    countyCode?: string | null;
    payload?: unknown;
    updatedAt?: string | null;
  } | null;
  offline?: boolean;
};

export async function fetchRemoteWorkspace(
  workspaceId: string,
): Promise<{ payload: MediatorWorkspacePayload; countyCode: string; updatedAt: string } | null> {
  if (!workspaceId) return null;
  try {
    const res = await fetch("/api/mediator/workspace", {
      headers: workspaceHeaders(workspaceId),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as RemoteResponse;
    if (!json.success || !json.data) return null;
    return {
      payload: parseWorkspacePayload(json.data.payload),
      countyCode: json.data.countyCode ?? "",
      updatedAt: json.data.updatedAt ?? new Date(0).toISOString(),
    };
  } catch {
    return null;
  }
}

export async function pushRemoteWorkspace(
  workspaceId: string,
  payload: MediatorWorkspacePayload,
  countyCode: string,
  updatedAt: string,
): Promise<boolean> {
  if (!workspaceId) return false;
  try {
    const res = await fetch("/api/mediator/workspace", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...workspaceHeaders(workspaceId),
      },
      body: JSON.stringify({
        countyCode: countyCode || null,
        payload,
        updatedAt,
      }),
    });
    if (res.ok) {
      try {
        const json = (await res.json()) as { data?: { workspaceSecret?: string } };
        storeWorkspaceSecret(json.data?.workspaceSecret);
      } catch {
        /* ignore */
      }
    }
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * One-shot sync: load local + remote, reconcile by timestamp, write merged
 * result locally, and push when the local copy is newer or merged.
 */
export async function syncMediatorWorkspace(): Promise<{
  workspaceId: string;
  payload: MediatorWorkspacePayload;
  countyCode: string;
  updatedAt: string;
  status: SyncStatus;
}> {
  const local = readLocalWorkspace();
  const remote = await fetchRemoteWorkspace(local.workspaceId);

  if (!remote) {
    return { ...local, status: "offline" };
  }

  const localT = Date.parse(local.updatedAt);
  const remoteT = Date.parse(remote.updatedAt);

  // Remote is newer -> trust remote.
  if (remoteT > localT) {
    const countyCode = remote.countyCode || local.countyCode;
    writeLocalWorkspace(remote.payload, countyCode, remote.updatedAt);
    return {
      workspaceId: local.workspaceId,
      payload: remote.payload,
      countyCode,
      updatedAt: remote.updatedAt,
      status: "synced",
    };
  }

  // Local newer or equal -> merge then push.
  const merged = mergeWorkspace(local.payload, remote.payload);
  const updatedAt = new Date().toISOString();
  writeLocalWorkspace(merged, local.countyCode, updatedAt);
  const ok = await pushRemoteWorkspace(
    local.workspaceId,
    merged,
    local.countyCode,
    updatedAt,
  );
  return {
    workspaceId: local.workspaceId,
    payload: merged,
    countyCode: local.countyCode,
    updatedAt,
    status: ok ? "synced" : "offline",
  };
}

// ── Debounced background save ──────────────────────────────────────────────

let pendingTimer: ReturnType<typeof setTimeout> | undefined;

export function persistWorkspace(
  payload: MediatorWorkspacePayload,
  countyCode: string,
  onSyncResult?: (status: SyncStatus) => void,
): string {
  const updatedAt = new Date().toISOString();
  writeLocalWorkspace(payload, countyCode, updatedAt);

  if (typeof window === "undefined") return updatedAt;

  if (pendingTimer) clearTimeout(pendingTimer);
  pendingTimer = setTimeout(() => {
    const workspaceId = getOrCreateWorkspaceId();
    void pushRemoteWorkspace(workspaceId, payload, countyCode, updatedAt).then(
      (ok) => onSyncResult?.(ok ? "synced" : "offline"),
    );
  }, 800);

  return updatedAt;
}
