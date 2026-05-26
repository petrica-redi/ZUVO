/**
 * Last-write-wins merge for mediator workspace records.
 *
 * - Records are deduplicated by `id`.
 * - When the same id exists in both sides, the one with the latest timestamp
 *   field wins (cases use `updatedAt`, visits use `visitDate`, sessions use
 *   `sessionDate`).
 */

import type {
  MediatorCase,
  MediatorSession,
  MediatorVisit,
  MediatorWorkspacePayload,
} from "./types";
import {
  EMPTY_WORKSPACE,
  mediatorWorkspacePayloadSchema,
} from "./types";

function safeTime(value: string | undefined): number {
  if (!value) return 0;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : 0;
}

function mergeBy<T extends { id: string }>(
  local: T[],
  remote: T[],
  getTime: (row: T) => number,
): T[] {
  const map = new Map<string, T>();
  for (const row of [...local, ...remote]) {
    const existing = map.get(row.id);
    if (!existing || getTime(row) > getTime(existing)) {
      map.set(row.id, row);
    }
  }
  return [...map.values()].sort((a, b) => getTime(b) - getTime(a));
}

/**
 * Parses an arbitrary value into a `MediatorWorkspacePayload`. Invalid fields
 * are dropped (not thrown) so a single corrupted row never blocks a sync.
 */
export function parseWorkspacePayload(raw: unknown): MediatorWorkspacePayload {
  const result = mediatorWorkspacePayloadSchema.safeParse(raw);
  if (result.success) return result.data;

  if (!raw || typeof raw !== "object") return { ...EMPTY_WORKSPACE };
  const o = raw as Record<string, unknown>;

  const cases = Array.isArray(o.cases) ? (o.cases as MediatorCase[]) : [];
  const visits = Array.isArray(o.visits) ? (o.visits as MediatorVisit[]) : [];
  const sessions = Array.isArray(o.sessions) ? (o.sessions as MediatorSession[]) : [];

  return {
    version: 1,
    cases: cases.filter((c) => c && typeof c.id === "string"),
    visits: visits.filter((v) => v && typeof v.id === "string"),
    sessions: sessions.filter((s) => s && typeof s.id === "string"),
  };
}

export function mergeWorkspace(
  local: MediatorWorkspacePayload,
  remote: MediatorWorkspacePayload,
): MediatorWorkspacePayload {
  return {
    version: 1,
    cases: mergeBy(local.cases, remote.cases, (c) => safeTime(c.updatedAt)),
    visits: mergeBy(local.visits, remote.visits, (v) => safeTime(v.visitDate)),
    sessions: mergeBy(
      local.sessions,
      remote.sessions,
      (s) => safeTime(s.sessionDate),
    ),
  };
}

export function isEmptyWorkspace(payload: MediatorWorkspacePayload): boolean {
  return (
    payload.cases.length === 0 &&
    payload.visits.length === 0 &&
    payload.sessions.length === 0
  );
}
