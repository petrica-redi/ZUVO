"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { platformConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import { loginSchema } from "@/lib/admin/validations";
import {
  clearAdminSessionCookie,
  readAdminSessionCookie,
  setAdminSessionCookie,
  verifyAdminSessionToken,
} from "@/lib/admin/session";

function requireAdminEnv(): { email: string; password: string } {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (process.env.NODE_ENV === "production") {
    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in production");
    }
    if (!process.env.ADMIN_SESSION_SECRET?.trim()) {
      throw new Error("ADMIN_SESSION_SECRET must be set in production");
    }
    return { email, password };
  }

  // Development-only fallbacks — never ship these as production defaults.
  return {
    email: email || "dev-admin@localhost",
    password: password || "dev-admin-password",
  };
}

export async function getAdminLoginEmail() {
  try {
    return requireAdminEnv().email;
  } catch {
    return "";
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const { email } = requireAdminEnv();
    const token = await readAdminSessionCookie();
    return verifyAdminSessionToken(token, email);
  } catch {
    return false;
  }
}

export async function loginAdmin(data: FormData) {
  let admin: { email: string; password: string };
  try {
    admin = requireAdminEnv();
  } catch {
    return {
      success: false,
      error: "Admin credentials are not configured for this environment.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: String(data.get("email") ?? "").trim(),
    password: String(data.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid credentials" };
  }

  const { email, password } = parsed.data;

  if (email === admin.email && password === admin.password) {
    await setAdminSessionCookie(email);
    return { success: true };
  }
  return { success: false, error: "Invalid credentials" };
}

export async function logoutAdmin() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

export async function verifyAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function getPlatformConfig() {
  const db = getDb();
  if (!db) return null;

  try {
    const config = await db
      .select()
      .from(platformConfig)
      .where(eq(platformConfig.id, "default"))
      .limit(1);
    return config[0] || null;
  } catch (e) {
    console.error("Failed to fetch platform config:", e);
    return null;
  }
}

export async function savePlatformConfig(data: Record<string, unknown>) {
  await verifyAdmin();
  const db = getDb();
  if (!db) throw new Error("Database not connected");

  try {
    const existing = await db
      .select()
      .from(platformConfig)
      .where(eq(platformConfig.id, "default"))
      .limit(1);
    if (existing.length > 0) {
      await db
        .update(platformConfig)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(platformConfig.id, "default"));
    } else {
      await db.insert(platformConfig).values({ id: "default", ...data });
    }
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : String(e) };
  }
}
