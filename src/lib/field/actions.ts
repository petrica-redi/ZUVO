"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { timingSafeEqual } from "crypto";
import {
  clearFieldSessionCookie,
  getFieldSession as readFieldSession,
  setFieldSessionCookie,
} from "./session";
import { findFieldStaff, fieldRosterConfigured, hashFieldPassword } from "./roster";
import type { FieldSessionPayload } from "./types";

export async function getFieldSession(): Promise<FieldSessionPayload | null> {
  return readFieldSession();
}

const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(200),
});

function safeHashEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function isFieldRosterReady(): Promise<boolean> {
  return fieldRosterConfigured();
}

export async function loginFieldStaff(data: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!fieldRosterConfigured()) {
    return {
      success: false,
      error: "Field staff roster is not configured. Contact your administrator.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: String(data.get("email") ?? "").trim(),
    password: String(data.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid credentials" };
  }

  const staff = findFieldStaff(parsed.data.email);
  if (!staff) {
    // Constant-time-ish dummy hash to reduce timing oracle on missing email
    hashFieldPassword(parsed.data.password);
    return { success: false, error: "Invalid credentials" };
  }

  const attempt = hashFieldPassword(parsed.data.password);
  if (!safeHashEqual(attempt, staff.passwordHash)) {
    return { success: false, error: "Invalid credentials" };
  }

  await setFieldSessionCookie({
    email: staff.email,
    displayName: staff.displayName,
    role: staff.role,
    workspaceId: staff.workspaceId,
    countyCode: staff.countyCode,
  });

  return { success: true };
}

export async function logoutFieldStaff() {
  await clearFieldSessionCookie();
  redirect("/mediator/login");
}

/** Require an active field session (or throw redirect). */
export async function requireFieldSession(): Promise<FieldSessionPayload> {
  const session = await readFieldSession();
  if (!session) {
    redirect("/mediator/login");
  }
  return session;
}
