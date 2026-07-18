/** Field staff roles for MoU deployment (nurses, mediators, case managers). */

export const FIELD_ROLES = [
  "mediator",
  "nurse",
  "case_manager",
  "supervisor",
] as const;

export type FieldRole = (typeof FIELD_ROLES)[number];

export type FieldStaffRecord = {
  email: string;
  /** SHA-256 hex of `${pepper}:${password}` — never store plaintext. */
  passwordHash: string;
  displayName: string;
  role: FieldRole;
  workspaceId: string;
  countyCode: string;
};

export type FieldSessionPayload = {
  email: string;
  displayName: string;
  role: FieldRole;
  workspaceId: string;
  /** RO județ or IT ASL region code. */
  countyCode: string;
  /** Programme country — RO or IT. */
  countryCode?: "RO" | "IT";
  /** Original staff role when known (doctor, nurse, …). */
  staffRole?: string;
  exp: number;
  nonce: string;
};

export function isFieldRole(value: string): value is FieldRole {
  return (FIELD_ROLES as readonly string[]).includes(value);
}

/** Map field role → operations reporting role (server-side only). */
export function fieldRoleToReportingRole(role: FieldRole): string {
  if (role === "supervisor" || role === "case_manager") return "supervisor";
  return "mediator";
}
