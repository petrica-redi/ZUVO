/** Assignable staff roles after admin approval (MoU / institutional access). */

export const STAFF_ROLES = [
  "professor",
  "mediator",
  "nurse",
  "doctor",
  "manager",
  "administrator",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const STAFF_STATUSES = [
  "pending_verification",
  "pending_approval",
  "approved",
  "rejected",
] as const;

export type StaffStatus = (typeof STAFF_STATUSES)[number];

export const STAFF_AUTH_PROVIDERS = ["email", "google"] as const;
export type StaffAuthProvider = (typeof STAFF_AUTH_PROVIDERS)[number];

export function isStaffRole(value: string | null | undefined): value is StaffRole {
  return !!value && (STAFF_ROLES as readonly string[]).includes(value);
}

export function isStaffStatus(value: string): value is StaffStatus {
  return (STAFF_STATUSES as readonly string[]).includes(value);
}

/** Roles that may enter the mediator / field workspace. */
export function canAccessFieldWorkspace(role: StaffRole | null | undefined): boolean {
  return (
    role === "mediator" ||
    role === "nurse" ||
    role === "doctor" ||
    role === "manager" ||
    role === "administrator"
  );
}

/** Map approved staff role → field session role used by ops APIs. */
export function staffRoleToFieldRole(
  role: StaffRole,
): "mediator" | "nurse" | "case_manager" | "supervisor" {
  if (role === "nurse") return "nurse";
  if (role === "manager") return "case_manager";
  if (role === "administrator") return "supervisor";
  return "mediator";
}

export function staffRoleToReportingRole(role: StaffRole): string {
  if (role === "administrator") return "admin";
  if (role === "manager") return "manager";
  if (role === "doctor" || role === "professor") return "mediator";
  return "mediator";
}
