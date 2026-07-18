/**
 * Field staff roster for MoU pilot deployment.
 *
 * Production requires FIELD_STAFF_ROSTER (JSON array). Each entry:
 *   { email, password, displayName, role, workspaceId, countyCode }
 * Passwords are hashed in-memory at boot — never logged.
 *
 * Optional: FIELD_STAFF_PEPPER for hash salting (falls back to FIELD_SESSION_SECRET).
 */

import { createHash } from "crypto";
import {
  FIELD_ROLES,
  type FieldRole,
  type FieldStaffRecord,
  isFieldRole,
} from "./types";

function pepper(): string {
  return (
    process.env.FIELD_STAFF_PEPPER?.trim() ||
    process.env.FIELD_SESSION_SECRET?.trim() ||
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    ""
  );
}

export function hashFieldPassword(password: string): string {
  const p = pepper();
  if (!p && process.env.NODE_ENV === "production") {
    throw new Error("FIELD_STAFF_PEPPER or FIELD_SESSION_SECRET required in production");
  }
  return createHash("sha256")
    .update(`${p || "redi-dev-field-pepper"}:${password}`, "utf8")
    .digest("hex");
}

type RosterInput = {
  email?: string;
  password?: string;
  passwordHash?: string;
  displayName?: string;
  role?: string;
  workspaceId?: string;
  countyCode?: string;
};

function normalizeRecord(raw: RosterInput): FieldStaffRecord | null {
  const email = raw.email?.trim().toLowerCase();
  const displayName = raw.displayName?.trim();
  const workspaceId = raw.workspaceId?.trim();
  const countyCode = (raw.countyCode?.trim() || "").toUpperCase();
  const roleRaw = raw.role?.trim() || "mediator";
  if (!email || !displayName || !workspaceId) return null;
  if (!isFieldRole(roleRaw)) return null;

  let passwordHash = raw.passwordHash?.trim();
  if (!passwordHash && raw.password) {
    passwordHash = hashFieldPassword(raw.password);
  }
  if (!passwordHash) return null;

  return {
    email,
    passwordHash,
    displayName,
    role: roleRaw as FieldRole,
    workspaceId,
    countyCode,
  };
}

/** Parse FIELD_STAFF_ROSTER env JSON. Returns [] if unset/invalid. */
export function loadFieldRoster(): FieldStaffRecord[] {
  const raw = process.env.FIELD_STAFF_ROSTER?.trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => normalizeRecord(item as RosterInput))
      .filter((r): r is FieldStaffRecord => r !== null);
  } catch {
    return [];
  }
}

export function findFieldStaff(email: string): FieldStaffRecord | null {
  const target = email.trim().toLowerCase();
  return loadFieldRoster().find((r) => r.email === target) ?? null;
}

export function fieldRosterConfigured(): boolean {
  return loadFieldRoster().length > 0;
}

export function fieldRolesList(): readonly FieldRole[] {
  return FIELD_ROLES;
}
