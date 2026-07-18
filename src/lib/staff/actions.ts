"use server";

import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { staffAccounts, staffInvites } from "@/db/schema";
import { verifyAdmin, getAdminLoginEmail } from "@/lib/admin/actions";
import {
  generateVerificationToken,
  generateWorkspaceId,
  hashPassword,
  verifyPassword,
} from "@/lib/staff/password";
import {
  sendAccountApprovedEmail,
  sendAdminNewRegistrationEmail,
  sendPendingApprovalEmail,
  sendVerificationEmail,
} from "@/lib/staff/emails";
import {
  STAFF_ROLES,
  canAccessFieldWorkspace,
  isStaffRole,
  staffRoleToFieldRole,
  type StaffRole,
} from "@/lib/staff/types";
import { setFieldSessionCookie } from "@/lib/field/session";
import { setAdminSessionCookie } from "@/lib/admin/session";
import { auditLog } from "@/lib/audit";

async function maybeSetAdminCmsSession(email: string, role: StaffRole) {
  if (role !== "administrator") return;
  try {
    const adminEmail = (await getAdminLoginEmail()).toLowerCase();
    if (adminEmail && email.toLowerCase() === adminEmail) {
      await setAdminSessionCookie(email);
    }
  } catch {
    // Admin env not configured — skip CMS session.
  }
}

async function isBootstrapAdminEmail(email: string): Promise<boolean> {
  try {
    const adminEmail = (await getAdminLoginEmail()).toLowerCase();
    return Boolean(adminEmail) && email.trim().toLowerCase() === adminEmail;
  } catch {
    return false;
  }
}

async function activateApprovedStaff(row: {
  id: string;
  email: string;
  displayName: string;
  role: string | null;
  workspaceId: string | null;
  countyCode: string | null;
  countryCode?: string | null;
  regionCode?: string | null;
}): Promise<{ status: "approved"; redirectTo: string }> {
  if (!isStaffRole(row.role)) {
    return { status: "approved", redirectTo: "/auth/pending" };
  }

  const db = getDb();
  const region = (row.regionCode || row.countyCode || "").toUpperCase();
  const country =
    row.countryCode === "IT" || row.countryCode === "RO"
      ? row.countryCode
      : region && ["LAZ", "CAM", "LOM", "PIE", "VEN", "EMR", "TOS", "PUG", "SIC", "SAR"].includes(region)
        ? "IT"
        : "RO";
  const workspaceId =
    row.workspaceId || generateWorkspaceId(row.role, region || country);

  if (db) {
    if (!row.workspaceId) {
      await db
        .update(staffAccounts)
        .set({ workspaceId, updatedAt: new Date() })
        .where(eq(staffAccounts.id, row.id));
    }
    await db
      .update(staffAccounts)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(staffAccounts.id, row.id));
  }

  if (canAccessFieldWorkspace(row.role)) {
    await setFieldSessionCookie({
      email: row.email,
      displayName: row.displayName,
      role: staffRoleToFieldRole(row.role),
      workspaceId,
      countyCode: region,
      countryCode: country,
      staffRole: row.role,
    });
  }

  await maybeSetAdminCmsSession(row.email, row.role);

  if (row.role === "administrator") {
    return { status: "approved", redirectTo: "/admin/dashboard" };
  }
  if (row.role === "professor") {
    return { status: "approved", redirectTo: "/students" };
  }
  return { status: "approved", redirectTo: "/mediator" };
}

/** Site owner (ADMIN_EMAIL) skips the approval queue. */
async function bootstrapApproveAdmin(input: {
  id: string;
  email: string;
  displayName: string;
}): Promise<{ status: "approved"; redirectTo: string } | null> {
  if (!(await isBootstrapAdminEmail(input.email))) return null;
  const db = getDb();
  if (!db) return null;

  const workspaceId = generateWorkspaceId("administrator", "RO");
  const [updated] = await db
    .update(staffAccounts)
    .set({
      status: "approved",
      role: "administrator",
      workspaceId,
      countyCode: "RO",
      approvedAt: new Date(),
      approvedBy: "system-bootstrap",
      rejectionReason: null,
      emailVerifiedAt: new Date(),
      verificationToken: null,
      verificationExpiresAt: null,
      updatedAt: new Date(),
    })
    .where(eq(staffAccounts.id, input.id))
    .returning();

  if (!updated) return null;

  void auditLog({
    userId: updated.id,
    action: "staff.approved",
    resourceType: "staff_account",
    resourceId: updated.id,
    metadata: { email: updated.email, bootstrap: true, role: "administrator" },
  });

  return activateApprovedStaff(updated);
}

async function notifyPendingApproval(input: {
  email: string;
  displayName: string;
  provider: string;
}) {
  if (await isBootstrapAdminEmail(input.email)) return;
  void sendAdminNewRegistrationEmail({
    applicantEmail: input.email,
    displayName: input.displayName,
    provider: input.provider,
  });
  void sendPendingApprovalEmail({
    to: input.email,
    displayName: input.displayName,
  });
}

const registerSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(200),
  displayName: z.string().trim().min(2).max(120),
  locale: z.string().trim().max(8).optional(),
  inviteToken: z.string().trim().max(120).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(200),
});

function dbUnavailable() {
  return { success: false as const, error: "Database unavailable. Try again later." };
}

export async function registerStaffAccount(data: FormData): Promise<{
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}> {
  const db = getDb();
  if (!db) return dbUnavailable();

  const parsed = registerSchema.safeParse({
    email: String(data.get("email") ?? ""),
    password: String(data.get("password") ?? ""),
    displayName: String(data.get("displayName") ?? ""),
    locale: String(data.get("locale") ?? "ro"),
    inviteToken: String(data.get("inviteToken") ?? "") || undefined,
  });
  if (!parsed.success) {
    return { success: false, error: "Completează corect numele, emailul și o parolă de minim 8 caractere." };
  }

  const email = parsed.data.email.toLowerCase();
  const [existing] = await db
    .select({ id: staffAccounts.id, status: staffAccounts.status })
    .from(staffAccounts)
    .where(eq(staffAccounts.email, email))
    .limit(1);

  if (existing) {
    return {
      success: false,
      error: "Există deja un cont cu acest email. Încearcă autentificarea.",
    };
  }

  let invite: Awaited<ReturnType<typeof import("@/lib/staff/invite").getInviteByToken>> = null;
  if (parsed.data.inviteToken) {
    const { getInviteByToken } = await import("@/lib/staff/invite");
    invite = await getInviteByToken(parsed.data.inviteToken);
    if (invite && invite.email.toLowerCase() !== email) {
      return { success: false, error: "Invitația este pentru un alt email." };
    }
  }

  const token = generateVerificationToken();
  const expires = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const [row] = await db
    .insert(staffAccounts)
    .values({
      email,
      passwordHash: hashPassword(parsed.data.password),
      displayName: parsed.data.displayName || invite?.displayName || email,
      authProvider: "email",
      status: "pending_verification",
      verificationToken: token,
      verificationExpiresAt: expires,
      organisationId: invite?.organisationId ?? null,
      countryCode: invite?.countryCode === "IT" ? "IT" : "RO",
      regionCode: invite?.regionCode ?? null,
      countyCode: invite?.regionCode ?? null,
      role: invite && isStaffRole(invite.role) ? invite.role : null,
      invitedBy: invite?.invitedBy ?? null,
      updatedAt: new Date(),
    })
    .returning({ id: staffAccounts.id });

  if (invite) {
    await db
      .update(staffInvites)
      .set({ acceptedAt: new Date() })
      .where(eq(staffInvites.id, invite.id));
    void auditLog({
      userId: row?.id ?? email,
      action: "staff.invite_accepted",
      resourceType: "staff_invite",
      resourceId: invite.id,
      metadata: { email, role: invite.role },
    });
  }

  const sent = await sendVerificationEmail({
    to: email,
    displayName: parsed.data.displayName,
    token,
    locale: parsed.data.locale,
  });

  if (!sent) {
    // Account created but email failed — still ask user to contact admin / retry
    void auditLog({
      userId: row?.id ?? email,
      action: "staff.register_email_failed",
      resourceType: "staff_account",
      resourceId: row?.id,
      metadata: { email },
    });
    return {
      success: false,
      error:
        "Contul a fost creat, dar emailul de verificare nu a putut fi trimis. Contactează administratorul sau încearcă din nou mai târziu.",
    };
  }

  void auditLog({
    userId: row?.id ?? email,
    action: "staff.registered",
    resourceType: "staff_account",
    resourceId: row?.id,
    metadata: { email },
  });

  return { success: true, needsVerification: true };
}

export async function verifyStaffEmail(token: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const db = getDb();
  if (!db) return dbUnavailable();
  if (!token.trim()) return { success: false, error: "Link invalid." };

  const [row] = await db
    .select()
    .from(staffAccounts)
    .where(eq(staffAccounts.verificationToken, token.trim()))
    .limit(1);

  if (!row) return { success: false, error: "Link invalid sau deja folosit." };
  if (
    row.verificationExpiresAt &&
    row.verificationExpiresAt.getTime() < Date.now()
  ) {
    return { success: false, error: "Linkul a expirat. Înregistrează-te din nou sau cere un email nou." };
  }

  if (row.status === "pending_verification") {
    const bootstrapped = await bootstrapApproveAdmin({
      id: row.id,
      email: row.email,
      displayName: row.displayName,
    });
    if (bootstrapped) {
      return { success: true };
    }

    await db
      .update(staffAccounts)
      .set({
        status: "pending_approval",
        emailVerifiedAt: new Date(),
        verificationToken: null,
        verificationExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(staffAccounts.id, row.id));

    await notifyPendingApproval({
      email: row.email,
      displayName: row.displayName,
      provider: row.authProvider,
    });
  }

  return { success: true };
}

export async function loginStaffAccount(data: FormData): Promise<{
  success: boolean;
  error?: string;
  redirectTo?: string;
}> {
  const db = getDb();
  if (!db) return dbUnavailable();

  const parsed = loginSchema.safeParse({
    email: String(data.get("email") ?? ""),
    password: String(data.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { success: false, error: "Email sau parolă invalidă." };
  }

  const email = parsed.data.email.toLowerCase();
  const [row] = await db
    .select()
    .from(staffAccounts)
    .where(eq(staffAccounts.email, email))
    .limit(1);

  if (!row || !row.passwordHash || !verifyPassword(parsed.data.password, row.passwordHash)) {
    return { success: false, error: "Email sau parolă invalidă." };
  }

  if (row.status === "pending_verification") {
    return { success: false, error: "Verifică mai întâi emailul (linkul din inbox)." };
  }
  if (row.status === "pending_approval") {
    return {
      success: false,
      error: "Contul așteaptă aprobarea administratorului.",
      redirectTo: "/auth/pending",
    };
  }
  if (row.status === "rejected") {
    return {
      success: false,
      error: row.rejectionReason || "Contul a fost respins. Contactează administratorul.",
    };
  }
  if (row.status !== "approved" || !isStaffRole(row.role)) {
    return { success: false, error: "Contul nu este activ." };
  }

  await db
    .update(staffAccounts)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(staffAccounts.id, row.id));

  const workspaceId =
    row.workspaceId || generateWorkspaceId(row.role, row.countyCode || "RO");

  if (!row.workspaceId) {
    await db
      .update(staffAccounts)
      .set({ workspaceId, updatedAt: new Date() })
      .where(eq(staffAccounts.id, row.id));
  }

  if (canAccessFieldWorkspace(row.role)) {
    await setFieldSessionCookie({
      email: row.email,
      displayName: row.displayName,
      role: staffRoleToFieldRole(row.role),
      workspaceId,
      countyCode: (row.countyCode || "").toUpperCase(),
    });
  }

  await maybeSetAdminCmsSession(row.email, row.role);

  void auditLog({
    userId: row.id,
    action: "staff.login",
    resourceType: "staff_account",
    resourceId: row.id,
    metadata: { role: row.role },
  });

  if (row.role === "administrator") {
    return { success: true, redirectTo: "/admin/dashboard" };
  }
  if (row.role === "professor") {
    return { success: true, redirectTo: "/students" };
  }
  if (canAccessFieldWorkspace(row.role)) {
    return { success: true, redirectTo: "/mediator" };
  }
  return { success: true, redirectTo: "/" };
}

/** Upsert Google/OAuth identity into staff_accounts after Supabase callback. */
export async function upsertOAuthStaffAccount(input: {
  email: string;
  displayName: string;
  supabaseAuthId: string;
  provider: "google";
}): Promise<{ status: string; redirectTo: string }> {
  const db = getDb();
  if (!db) return { status: "error", redirectTo: "/auth/login?error=db" };

  const email = input.email.trim().toLowerCase();
  const [existing] = await db
    .select()
    .from(staffAccounts)
    .where(eq(staffAccounts.email, email))
    .limit(1);

  if (!existing) {
    const [created] = await db
      .insert(staffAccounts)
      .values({
        email,
        displayName: input.displayName || email.split("@")[0] || "User",
        authProvider: input.provider,
        supabaseAuthId: input.supabaseAuthId,
        emailVerifiedAt: new Date(),
        status: "pending_approval",
        updatedAt: new Date(),
      })
      .returning();

    const bootstrapped = await bootstrapApproveAdmin({
      id: created.id,
      email: created.email,
      displayName: created.displayName,
    });
    if (bootstrapped) return bootstrapped;

    await notifyPendingApproval({
      email,
      displayName: created.displayName,
      provider: input.provider,
    });

    return { status: "pending_approval", redirectTo: "/auth/pending" };
  }

  await db
    .update(staffAccounts)
    .set({
      supabaseAuthId: input.supabaseAuthId,
      authProvider: input.provider,
      emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
      displayName: existing.displayName || input.displayName,
      updatedAt: new Date(),
    })
    .where(eq(staffAccounts.id, existing.id));

  if (
    existing.status === "pending_verification" ||
    existing.status === "pending_approval"
  ) {
    const bootstrapped = await bootstrapApproveAdmin({
      id: existing.id,
      email: existing.email,
      displayName: existing.displayName || input.displayName,
    });
    if (bootstrapped) return bootstrapped;
  }

  if (existing.status === "pending_verification") {
    await db
      .update(staffAccounts)
      .set({
        status: "pending_approval",
        emailVerifiedAt: new Date(),
        verificationToken: null,
        updatedAt: new Date(),
      })
      .where(eq(staffAccounts.id, existing.id));
    await notifyPendingApproval({
      email,
      displayName: existing.displayName || input.displayName,
      provider: input.provider,
    });
    return { status: "pending_approval", redirectTo: "/auth/pending" };
  }

  if (existing.status === "pending_approval") {
    return { status: "pending_approval", redirectTo: "/auth/pending" };
  }
  if (existing.status === "rejected") {
    return { status: "rejected", redirectTo: "/auth/login?error=rejected" };
  }

  if (existing.status === "approved" && isStaffRole(existing.role)) {
    return activateApprovedStaff(existing);
  }

  return { status: "pending_approval", redirectTo: "/auth/pending" };
}

// ── Admin approval actions ─────────────────────────────────────────────────

export type StaffAccountRow = {
  id: string;
  email: string;
  displayName: string;
  authProvider: string;
  status: string;
  role: string | null;
  workspaceId: string | null;
  countyCode: string | null;
  rejectionReason: string | null;
  createdAt: string;
  emailVerifiedAt: string | null;
  approvedAt: string | null;
};

export async function listStaffAccounts(): Promise<StaffAccountRow[]> {
  await verifyAdmin();
  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(staffAccounts)
    .orderBy(desc(staffAccounts.createdAt))
    .limit(200);

  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    displayName: r.displayName,
    authProvider: r.authProvider,
    status: r.status,
    role: r.role,
    workspaceId: r.workspaceId,
    countyCode: r.countyCode,
    rejectionReason: r.rejectionReason,
    createdAt: r.createdAt?.toISOString() ?? "",
    emailVerifiedAt: r.emailVerifiedAt?.toISOString() ?? null,
    approvedAt: r.approvedAt?.toISOString() ?? null,
  }));
}

const approveSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(STAFF_ROLES),
  countyCode: z.string().trim().max(12).optional(),
  countryCode: z.enum(["RO", "IT"]).optional(),
  regionCode: z.string().trim().max(12).optional(),
  workspaceId: z.string().trim().max(80).optional(),
  canApprove: z.boolean().optional(),
});

export async function approveStaffAccount(data: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  await verifyAdmin();
  const db = getDb();
  if (!db) return dbUnavailable();

  const parsed = approveSchema.safeParse({
    id: String(data.get("id") ?? ""),
    role: String(data.get("role") ?? ""),
    countyCode: String(data.get("countyCode") ?? "") || undefined,
    countryCode: String(data.get("countryCode") ?? "") || undefined,
    regionCode: String(data.get("regionCode") ?? "") || undefined,
    workspaceId: String(data.get("workspaceId") ?? "") || undefined,
    canApprove: String(data.get("canApprove") ?? "") === "true",
  });
  if (!parsed.success) {
    return { success: false, error: "Selectează un rol valid." };
  }

  const adminEmail = await getAdminLoginEmail();
  const region =
    parsed.data.regionCode?.toUpperCase() ||
    parsed.data.countyCode?.toUpperCase() ||
    "RO";
  const country = parsed.data.countryCode || (region.length === 3 ? "IT" : "RO");
  const workspaceId =
    parsed.data.workspaceId || generateWorkspaceId(parsed.data.role, region);
  const canApprove =
    parsed.data.canApprove ||
    parsed.data.role === "manager" ||
    parsed.data.role === "administrator";

  const [updated] = await db
    .update(staffAccounts)
    .set({
      status: "approved",
      role: parsed.data.role,
      countyCode: region,
      regionCode: region,
      countryCode: country,
      canApprove,
      workspaceId,
      approvedAt: new Date(),
      approvedBy: adminEmail || "admin",
      rejectionReason: null,
      updatedAt: new Date(),
    })
    .where(eq(staffAccounts.id, parsed.data.id))
    .returning();

  if (!updated) return { success: false, error: "Cont negăsit." };

  void sendAccountApprovedEmail({
    to: updated.email,
    displayName: updated.displayName,
    role: parsed.data.role,
  });

  void auditLog({
    userId: adminEmail || "admin",
    action: "staff.approved",
    resourceType: "staff_account",
    resourceId: updated.id,
    metadata: { role: parsed.data.role, email: updated.email },
  });

  return { success: true };
}

export async function rejectStaffAccount(data: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  await verifyAdmin();
  const db = getDb();
  if (!db) return dbUnavailable();

  const id = String(data.get("id") ?? "");
  const reason = String(data.get("reason") ?? "").trim().slice(0, 500);
  if (!id) return { success: false, error: "Missing id" };

  await db
    .update(staffAccounts)
    .set({
      status: "rejected",
      rejectionReason: reason || "Respins de administrator",
      updatedAt: new Date(),
    })
    .where(eq(staffAccounts.id, id));

  return { success: true };
}

export async function updateStaffRole(data: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  await verifyAdmin();
  const db = getDb();
  if (!db) return dbUnavailable();

  const id = String(data.get("id") ?? "");
  const role = String(data.get("role") ?? "") as StaffRole;
  if (!id || !isStaffRole(role)) {
    return { success: false, error: "Rol invalid." };
  }

  await db
    .update(staffAccounts)
    .set({ role, status: "approved", updatedAt: new Date() })
    .where(eq(staffAccounts.id, id));

  return { success: true };
}

export async function resendStaffVerification(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const db = getDb();
  if (!db) return dbUnavailable();
  const normalized = email.trim().toLowerCase();
  const [row] = await db
    .select()
    .from(staffAccounts)
    .where(eq(staffAccounts.email, normalized))
    .limit(1);
  if (!row) return { success: false, error: "Cont negăsit." };
  if (row.status !== "pending_verification") {
    return { success: false, error: "Emailul este deja verificat." };
  }

  const token = generateVerificationToken();
  await db
    .update(staffAccounts)
    .set({
      verificationToken: token,
      verificationExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      updatedAt: new Date(),
    })
    .where(eq(staffAccounts.id, row.id));

  const sent = await sendVerificationEmail({
    to: row.email,
    displayName: row.displayName,
    token,
  });
  if (!sent) return { success: false, error: "Nu am putut trimite emailul." };
  return { success: true };
}

export { redirect };
