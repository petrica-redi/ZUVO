import { eq, and, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  referrals,
  navigationCases,
  providers,
  operationTasks,
} from "@/db/schema";
import { generateReferralNumber } from "./ids";
import { updateCaseStatus } from "./case-service";
import type {
  CreateReferralInput,
  Referral,
} from "./types";
import type { ReferralStatus } from "./constants";
import { assertWorkspaceAccess, type OperationActor } from "./permissions";

function rowToReferral(
  row: typeof referrals.$inferSelect,
  providerName?: string,
): Referral {
  return {
    id: row.id,
    referralNumber: row.referralNumber,
    caseId: row.caseId,
    providerId: row.providerId,
    providerName,
    status: row.status,
    purpose: row.purpose,
    notes: row.notes,
    initiatedBy: row.initiatedBy ?? undefined,
    scheduledFollowUp: row.scheduledFollowUp ?? undefined,
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function listReferrals(
  workspaceId: string,
  caseId?: string,
): Promise<Referral[]> {
  const db = getDb();
  if (!db) return [];

  const conditions = [eq(referrals.workspaceId, workspaceId)];
  if (caseId) conditions.push(eq(referrals.caseId, caseId));

  const rows = await db
    .select({
      referral: referrals,
      providerName: providers.name,
    })
    .from(referrals)
    .leftJoin(providers, eq(referrals.providerId, providers.id))
    .where(and(...conditions))
    .orderBy(desc(referrals.updatedAt));

  return rows.map((r) => rowToReferral(r.referral, r.providerName ?? undefined));
}

export async function createReferral(
  actor: OperationActor,
  input: CreateReferralInput,
): Promise<Referral | null> {
  const db = getDb();
  if (!db) return null;

  const [navCase] = await db
    .select()
    .from(navigationCases)
    .where(
      and(
        eq(navigationCases.id, input.caseId),
        eq(navigationCases.workspaceId, actor.workspaceId),
      ),
    )
    .limit(1);

  if (!navCase) return null;

  const [provider] = await db
    .select()
    .from(providers)
    .where(eq(providers.id, input.providerId))
    .limit(1);

  if (!provider) return null;

  const now = new Date();
  const [row] = await db
    .insert(referrals)
    .values({
      referralNumber: generateReferralNumber(navCase.countryCode),
      workspaceId: actor.workspaceId,
      caseId: input.caseId,
      providerId: input.providerId,
      status: "sent",
      purpose: input.purpose ?? navCase.mainProblem,
      notes: input.notes ?? "",
      initiatedBy: actor.workspaceId,
      scheduledFollowUp: input.scheduledFollowUp,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!row) return null;

  await updateCaseStatus(actor, input.caseId, "referred", "Referral created");

  await db.insert(operationTasks).values({
    caseId: input.caseId,
    workspaceId: actor.workspaceId,
    title: "operations.taskType_obtain_referral_outcome",
    taskType: "obtain_referral_outcome",
    priority: navCase.urgency === "emergency" ? "urgent" : navCase.urgency,
    assignee: actor.workspaceId,
    createdBy: actor.workspaceId,
    dueDate: input.scheduledFollowUp,
  });

  return rowToReferral(row, provider.name);
}

export async function updateReferralStatus(
  actor: OperationActor,
  referralId: string,
  status: ReferralStatus,
): Promise<Referral | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(referrals)
    .where(eq(referrals.id, referralId))
    .limit(1);

  if (!existing || !assertWorkspaceAccess(actor, existing.workspaceId)) return null;

  const now = new Date();
  const [row] = await db
    .update(referrals)
    .set({ status, updatedAt: now })
    .where(eq(referrals.id, referralId))
    .returning();

  if (!row) return null;

  const [provider] = await db
    .select({ name: providers.name })
    .from(providers)
    .where(eq(providers.id, row.providerId))
    .limit(1);

  return rowToReferral(row, provider?.name);
}
