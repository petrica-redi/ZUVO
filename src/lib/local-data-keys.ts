/**
 * Single registry of every localStorage key the app persists to.
 *
 * Use `clearAllLocalAppData()` for GDPR "delete my data" flows so we don't
 * forget to wipe a key when new ones are added. Component-local data
 * (drafts, etc.) should use the `LOCAL_KEY_PREFIXES` list and be wiped via
 * `clearAllLocalAppData()` instead of being inlined into each handler.
 */

/** Exact-match localStorage keys. */
export const LOCAL_KEYS = [
  "sastipe_progress",
  "sastipe_checkin",
  "sastipe_student_health",
  "sastipe_anon_id",
  "sastipe_install_dismissed",
  "sastipe_mediator_visits",
  "sastipe_mediator_cases",
  "sastipe_mediator_sessions",
  "sastipe_mediator_county",
  "sastipe_mediator_updated_at",
  "redi_mediator_workspace_id",
  "sastipe_theme",
  "zuvo_family",
  "zuvo_health_logs",
] as const;

/**
 * Prefix-match localStorage keys (anything starting with these strings).
 * Used for per-module drafts like Field Lab notes.
 */
export const LOCAL_KEY_PREFIXES = [
  "sastipe_student_field_lab:",
] as const;

/** Current schema version of the device-local export bundle. */
export const LOCAL_EXPORT_SCHEMA_VERSION = 1;

/** Structured bundle of every app-owned localStorage entry. */
export type LocalDataExport = {
  exportedAt: string;
  schemaVersion: number;
  source: "device";
  note: string;
  data: Record<string, unknown>;
};

/**
 * Reads a single localStorage value, parsing JSON when possible and falling
 * back to the raw string otherwise. Returns `undefined` when the key is absent
 * or unreadable (e.g. private mode).
 */
function readLocalValue(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return undefined;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch {
    return undefined;
  }
}

/**
 * Builds a complete, structured snapshot of every app-owned localStorage entry
 * — exact-match keys in `LOCAL_KEYS` plus anything matching `LOCAL_KEY_PREFIXES`
 * (e.g. Field Lab notes). This is the device-local counterpart to the
 * server-side `GET /api/me/export` and is used for GDPR Article 15/20 exports
 * for anonymous/guest sessions. Safe to call in private mode.
 */
export function exportLocalAppData(): LocalDataExport {
  const data: Record<string, unknown> = {};

  if (typeof window !== "undefined") {
    for (const key of LOCAL_KEYS) {
      const value = readLocalValue(key);
      if (value !== undefined) data[key] = value;
    }
    try {
      for (const key of Object.keys(localStorage)) {
        if (LOCAL_KEY_PREFIXES.some((p) => key.startsWith(p))) {
          const value = readLocalValue(key);
          if (value !== undefined) data[key] = value;
        }
      }
    } catch {
      /* iteration may fail in private mode — skip */
    }
  }

  return {
    exportedAt: new Date().toISOString(),
    schemaVersion: LOCAL_EXPORT_SCHEMA_VERSION,
    source: "device",
    note: "All data Redi Health stores on this device, including learning progress, check-ins, family profiles, health logs, and Field Lab notes.",
    data,
  };
}

/**
 * Wipes every app-owned localStorage entry. Safe to call in private mode.
 * Returns the number of keys removed.
 */
export function clearAllLocalAppData(): number {
  if (typeof window === "undefined") return 0;
  let removed = 0;
  for (const key of LOCAL_KEYS) {
    try {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        removed += 1;
      }
    } catch {
      /* private mode — skip */
    }
  }
  try {
    const all = Object.keys(localStorage);
    for (const key of all) {
      if (LOCAL_KEY_PREFIXES.some((p) => key.startsWith(p))) {
        try {
          localStorage.removeItem(key);
          removed += 1;
        } catch {
          /* private mode — skip */
        }
      }
    }
  } catch {
    /* iteration may fail in private mode — skip */
  }
  return removed;
}
