"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { platformConfig } from "@/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim() || "petrica@redi-ngo.eu";
const ADMIN_PASS = process.env.ADMIN_PASSWORD?.trim() || "Welcome2REDI*";
const SESSION_COOKIE = "admin_session";

export async function loginAdmin(data: FormData) {
  const email = data.get("email");
  const password = data.get("password");

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Invalid credentials" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session || session.value !== "authenticated") {
    redirect("/admin/login");
  }
}

export async function getPlatformConfig() {
  const db = getDb();
  if (!db) return null;
  
  try {
    const config = await db.select().from(platformConfig).where(eq(platformConfig.id, "default")).limit(1);
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
    const existing = await db.select().from(platformConfig).where(eq(platformConfig.id, "default")).limit(1);
    if (existing.length > 0) {
      await db.update(platformConfig).set({ ...data, updatedAt: new Date() }).where(eq(platformConfig.id, "default"));
    } else {
      await db.insert(platformConfig).values({ id: "default", ...data });
    }
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : String(e) };
  }
}
