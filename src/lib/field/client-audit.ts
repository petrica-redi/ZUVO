/** Lightweight client-side audit breadcrumb (console + optional beacon). */
export function auditClientEvent(
  action: string,
  metadata: Record<string, string | number | boolean | undefined> = {},
) {
  try {
    const payload = {
      action,
      metadata,
      at: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      const key = "redi_field_audit";
      const prev = JSON.parse(window.sessionStorage.getItem(key) || "[]") as unknown[];
      const next = [payload, ...prev].slice(0, 40);
      window.sessionStorage.setItem(key, JSON.stringify(next));
    }
  } catch {
    // non-blocking
  }
}
