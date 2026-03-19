/**
 * GDPR-compliant audit logging via Supabase `audit_log` table.
 *
 * Rules:
 * - Never throw — audit failures must never crash a user request.
 * - Always log who did what, to which resource, and when.
 * - Sensitive field values must be excluded; only resource IDs are stored.
 */

export type AuditAction =
  | "user.created"
  | "user.login"
  | "user.logout"
  | "user.deleted"
  | "health_log.created"
  | "health_log.updated"
  | "health_log.deleted"
  | "module.started"
  | "module.completed"
  | "mediator.accessed_record"
  | "mediator.exported_data";

export type AuditParams = {
  userId: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  /** Non-sensitive contextual metadata only. */
  metadata?: Record<string, unknown>;
  ipAddress?: string;
};

/**
 * Append an entry to the `audit_log` table.
 * Safe to fire-and-forget — failures are swallowed after logging to stderr.
 */
export async function auditLog(params: AuditParams): Promise<void> {
  try {
    // Import server client lazily to avoid bundling it into the browser.
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { error } = await supabase.from("audit_log").insert({
      user_id: params.userId,
      action: params.action,
      resource_type: params.resourceType ?? null,
      resource_id: params.resourceId ?? null,
      metadata: params.metadata ?? {},
      ip_address: params.ipAddress ?? null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[audit] insert failed:", error.message);
    }
  } catch (err) {
    console.error("[audit] unexpected error:", err);
  }
}
