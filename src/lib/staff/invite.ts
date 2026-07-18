"use server";

import { and, desc, eq, isNull } from "drizzle-orm";
import { randomBytes } from "crypto";
import { z } from "zod";
import { getDb } from "@/db/client";
import { organisations, staffInvites } from "@/db/schema";
import { verifyAdmin } from "@/lib/admin/actions";
import { isStaffRole, type StaffRole } from "@/lib/staff/types";
import { sendStaffInviteEmail } from "@/lib/staff/emails";
import { auditLog } from "@/lib/audit";
import { isFieldCountry } from "@/lib/field/geography";

const InviteRowSchema = z.object({
  email: z.string().email(),
  displayName: z.string().max(120).optional().default(""),
  role: z.string().optional().default("mediator"),
  countryCode: z.string().optional().default("RO"),
  regionCode: z.string().optional(),
});

export type InvitePreview = {
  email: string;
  displayName: string;
  role: StaffRole;
  countryCode: "RO" | "IT";
  regionCode?: string;
};

function parseCsv(text: string): InvitePreview[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^email\b/i.test(l));

  const out: InvitePreview[] = [];
  for (const line of lines) {
    const parts = line.split(/[,;]/).map((p) => p.trim());
    const [email, displayName = "", role = "mediator", countryCode = "RO", regionCode] =
      parts;
    const parsed = InviteRowSchema.safeParse({
      email,
      displayName,
      role,
      countryCode,
      regionCode,
    });
    if (!parsed.success) continue;
    if (!isStaffRole(parsed.data.role)) continue;
    if (!isFieldCountry(parsed.data.countryCode)) continue;
    out.push({
      email: parsed.data.email.toLowerCase(),
      displayName: parsed.data.displayName || parsed.data.email.split("@")[0] || "",
      role: parsed.data.role,
      countryCode: parsed.data.countryCode,
      regionCode: parsed.data.regionCode || undefined,
    });
  }
  return out;
}

export async function previewStaffInvites(csv: string): Promise<{
  success: boolean;
  rows?: InvitePreview[];
  error?: string;
}> {
  await verifyAdmin();
  const rows = parseCsv(csv);
  if (rows.length === 0) {
    return { success: false, error: "No valid rows. Use: email,name,role,country,region" };
  }
  if (rows.length > 500) {
    return { success: false, error: "Max 500 invites per batch." };
  }
  return { success: true, rows };
}

export async function sendStaffInvites(csv: string): Promise<{
  success: boolean;
  sent?: number;
  error?: string;
}> {
  await verifyAdmin();
  const db = getDb();
  if (!db) return { success: false, error: "Database unavailable" };

  const rows = parseCsv(csv);
  if (rows.length === 0) {
    return { success: false, error: "No valid rows." };
  }

  const orgs = await db.select().from(organisations).limit(20);
  const orgRo = orgs.find((o) => o.countryCode === "RO");
  const orgIt = orgs.find((o) => o.countryCode === "IT");

  let sent = 0;
  const invitedBy = process.env.ADMIN_EMAIL?.trim() || "admin";

  for (const row of rows) {
    const token = randomBytes(24).toString("base64url");
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const organisationId =
      row.countryCode === "IT" ? orgIt?.id ?? null : orgRo?.id ?? null;

    await db.insert(staffInvites).values({
      email: row.email,
      displayName: row.displayName,
      role: row.role,
      organisationId,
      countryCode: row.countryCode,
      regionCode: row.regionCode,
      token,
      invitedBy,
      expiresAt,
    });

    await sendStaffInviteEmail({
      to: row.email,
      displayName: row.displayName,
      role: row.role,
      token,
      countryCode: row.countryCode,
    });
    sent += 1;
  }

  void auditLog({
    userId: invitedBy,
    action: "staff.bulk_invite",
    resourceType: "staff_invite",
    metadata: { sent, invitedBy },
  });

  return { success: true, sent };
}

export async function listRecentInvites(): Promise<
  {
    id: string;
    email: string;
    displayName: string;
    role: string;
    countryCode: string;
    regionCode: string | null;
    acceptedAt: string | null;
    expiresAt: string;
    createdAt: string;
  }[]
> {
  await verifyAdmin();
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(staffInvites)
    .orderBy(desc(staffInvites.createdAt))
    .limit(100);
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    displayName: r.displayName,
    role: r.role,
    countryCode: r.countryCode,
    regionCode: r.regionCode,
    acceptedAt: r.acceptedAt?.toISOString() ?? null,
    expiresAt: r.expiresAt.toISOString(),
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getInviteByToken(token: string) {
  const db = getDb();
  if (!db || !token) return null;
  const [row] = await db
    .select()
    .from(staffInvites)
    .where(and(eq(staffInvites.token, token), isNull(staffInvites.acceptedAt)))
    .limit(1);
  if (!row) return null;
  if (row.expiresAt.getTime() < Date.now()) return null;
  return row;
}
