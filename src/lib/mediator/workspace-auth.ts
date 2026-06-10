/**
 * Workspace sync secret — prevents unauthorised read/write of mediator
 * field data when only the workspace UUID is known.
 */

import { createHash, randomBytes } from "crypto";

const SECRET_BYTES = 24;

export function generateWorkspaceSecret(): string {
  return randomBytes(SECRET_BYTES).toString("base64url");
}

export function hashWorkspaceSecret(secret: string): string {
  return createHash("sha256").update(secret, "utf8").digest("hex");
}

export function verifyWorkspaceSecret(
  secret: string | null | undefined,
  storedHash: string | null | undefined,
): boolean {
  if (!storedHash) return true; // legacy workspace — open until first secret rotation
  if (!secret?.trim()) return false;
  return hashWorkspaceSecret(secret.trim()) === storedHash;
}
