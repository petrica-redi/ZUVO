"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  MediatorCase,
  MediatorSession,
  MediatorVisit,
} from "@/lib/mediator/types";
import { EMPTY_WORKSPACE } from "@/lib/mediator/types";
import {
  persistWorkspace,
  readLocalWorkspace,
  syncMediatorWorkspace,
  type SyncStatus,
} from "@/lib/mediator/workspace-client";

type Snapshot = {
  visits: MediatorVisit[];
  cases: MediatorCase[];
  sessions: MediatorSession[];
  countyCode: string;
};

export type MediatorWorkspaceState = Snapshot & {
  syncStatus: SyncStatus;
  /** Replace one or more collections (or county) and persist + schedule sync. */
  update: (patch: {
    visits?: MediatorVisit[];
    cases?: MediatorCase[];
    sessions?: MediatorSession[];
    countyCode?: string;
  }) => void;
};

function initialSnapshot(): Snapshot {
  // SSR-safe: `readLocalWorkspace` returns empty defaults when `window` is
  // undefined, so this lazy initializer is safe to run during render.
  const local = readLocalWorkspace();
  return {
    visits: local.payload.visits,
    cases: local.payload.cases,
    sessions: local.payload.sessions,
    countyCode: local.countyCode,
  };
}

/**
 * Loads and syncs the mediator workspace.
 *
 *   1. Lazy initial state hydrates from `localStorage` (offline-friendly).
 *   2. On mount: best-effort cloud sync, merge results back into state.
 *   3. Writes: persist locally immediately, debounce remote push.
 */
export function useMediatorWorkspace(enabled: boolean): MediatorWorkspaceState {
  const [snapshot, setSnapshot] = useState<Snapshot>(
    enabled ? initialSnapshot : () => initialEmptySnapshot(),
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    void syncMediatorWorkspace().then((result) => {
      if (cancelled) return;
      setSnapshot({
        visits: result.payload.visits,
        cases: result.payload.cases,
        sessions: result.payload.sessions,
        countyCode: result.countyCode,
      });
      setSyncStatus(result.status);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const update = useCallback(
    (patch: {
      visits?: MediatorVisit[];
      cases?: MediatorCase[];
      sessions?: MediatorSession[];
      countyCode?: string;
    }) => {
      setSyncStatus("syncing");
      setSnapshot((prev) => {
        const next: Snapshot = {
          visits: patch.visits ?? prev.visits,
          cases: patch.cases ?? prev.cases,
          sessions: patch.sessions ?? prev.sessions,
          countyCode:
            typeof patch.countyCode === "string"
              ? patch.countyCode
              : prev.countyCode,
        };
        persistWorkspace(
          {
            version: 1,
            visits: next.visits,
            cases: next.cases,
            sessions: next.sessions,
          },
          next.countyCode,
          (status) => setSyncStatus(status),
        );
        return next;
      });
    },
    [],
  );

  return {
    ...snapshot,
    syncStatus,
    update,
  };
}

function initialEmptySnapshot(): Snapshot {
  return {
    visits: [...EMPTY_WORKSPACE.visits],
    cases: [...EMPTY_WORKSPACE.cases],
    sessions: [...EMPTY_WORKSPACE.sessions],
    countyCode: "",
  };
}
