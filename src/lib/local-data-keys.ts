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
  "sastipe_mediator_access",
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
