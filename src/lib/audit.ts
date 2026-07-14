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
  | "mediator.exported_data"
  | "user.data_exported"
  | "operations.case_created"
  | "operations.case_status_changed"
  | "operations.task_created"
  | "operations.task_completed"
  | "operations.intake_created"
  | "operations.intake_converted"
  | "operations.intake_routed"
  | "operations.referral_created"
  | "operations.referral_status_changed"
  | "operations.appointment_created"
  | "operations.appointment_status_changed"
  | "operations.attendance_recorded"
  | "operations.notification_sent"
  | "operations.escalation_created"
  | "operations.escalation_resolved"
  | "operations.missed_appointment_recovery"
  | "operations.attendance_recorded"
  | "operations.appointment_created"
  | "operations.appointment_status_changed"
  | "operations.referral_created"
  | "operations.referral_status_changed"
  | "operations.data_exported"
  | "operations.handover_created"
  | "operations.handover_consent_recorded"
  | "operations.handover_consent_withdrawn"
  | "operations.handover_requested"
  | "operations.handover_accepted"
  | "operations.handover_rejected"
  | "operations.handover_data_shared"
  | "operations.handover_completed"
  | "operations.handover_cancelled"
  | "operations.guidance_updated";

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
    const { getDb } = await import("@/db/client");
    const db = getDb();
    if (db) {
      const { auditLog: auditTable } = await import("@/db/schema");
      await db.insert(auditTable).values({
        userId: params.userId,
        action: params.action,
        resourceType: params.resourceType ?? null,
        resourceId: params.resourceId ?? null,
        metadata: params.metadata ?? {},
        ipAddress: params.ipAddress ?? null,
      });
      return;
    }

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
    if (error) console.error("[audit] insert failed:", error.message);
  } catch (err) {
    console.error("[audit] unexpected error:", err);
  }
}
