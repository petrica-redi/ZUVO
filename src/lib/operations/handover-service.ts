import { eq, and, or, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  crossBorderHandovers,
  crossBorderHandoverEvents,
  navigationCases,
} from "@/db/schema";
import { auditLog } from "@/lib/audit";
import type { HandoverConsentStatus, HandoverEventType, HandoverStatus } from "./handover-constants";
import {
  buildNavigationSummary,
  buildSharedPayload,
  canRequestHandover,
  canShareNavigationData,
  redactHandoverForViewer,
  type NavigationSummary,
  type SharedHandoverPayload,
} from "./handover-consent";
import { assertWorkspaceAccess, type OperationActor } from "./permissions";
import type { NavigationCase } from "./types";

function navCaseFromRow(row: typeof navigationCases.$inferSelect): NavigationCase {
  return {
    id: row.id,
    caseNumber: row.caseNumber,
    beneficiaryPseudonym: row.beneficiaryPseudonym,
    responsibleMediatorId: row.responsibleMediatorId ?? undefined,
    countryCode: row.countryCode,
    municipalityCode: row.municipalityCode ?? undefined,
    preferredLanguage: row.preferredLanguage,
    contactMethod: row.contactMethod ?? undefined,
    consentStatus: row.consentStatus as NavigationCase["consentStatus"],
    source: row.source as NavigationCase["source"],
    categorySlug: row.categorySlug as NavigationCase["categorySlug"],
    mainProblem: row.mainProblem,
    urgency: row.urgency as NavigationCase["urgency"],
    status: row.status as NavigationCase["status"],
    nextAction: row.nextAction ?? undefined,
    targetDate: row.targetDate ?? undefined,
    notes: row.notes,
    barriers: (row.barriers as NavigationCase["barriers"]) ?? [],
    barrierNotes: row.barrierNotes ?? undefined,
    openedAt: row.openedAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
    closedAt: row.closedAt?.toISOString(),
  };
}

export type CrossBorderHandover = {
  id: string;
  caseId: string;
  caseNumber: string;
  originCountryCode: string;
  destinationCountryCode: string;
  originWorkspaceId: string;
  destinationWorkspaceId?: string;
  originTeamId?: string;
  destinationTeamId?: string;
  status: HandoverStatus;
  consentStatus: HandoverConsentStatus;
  consentGrantedAt?: string;
  consentRecordedBy?: string;
  reason: string;
  rejectionReason?: string;
  navigationSummary: NavigationSummary;
  sharedPayload?: SharedHandoverPayload;
  requestedBy?: string;
  acceptedBy?: string;
  completedBy?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  viewerRole?: "origin" | "destination" | "admin";
};

export type CreateHandoverInput = {
  caseId: string;
  destinationCountryCode: string;
  destinationWorkspaceId?: string;
  destinationTeamId?: string;
  reason?: string;
};

function rowToHandover(
  row: typeof crossBorderHandovers.$inferSelect,
): CrossBorderHandover {
  return {
    id: row.id,
    caseId: row.caseId,
    caseNumber: row.caseNumber,
    originCountryCode: row.originCountryCode,
    destinationCountryCode: row.destinationCountryCode,
    originWorkspaceId: row.originWorkspaceId,
    destinationWorkspaceId: row.destinationWorkspaceId ?? undefined,
    originTeamId: row.originTeamId ?? undefined,
    destinationTeamId: row.destinationTeamId ?? undefined,
    status: row.status as HandoverStatus,
    consentStatus: row.consentStatus as HandoverConsentStatus,
    consentGrantedAt: row.consentGrantedAt?.toISOString(),
    consentRecordedBy: row.consentRecordedBy ?? undefined,
    reason: row.reason,
    rejectionReason: row.rejectionReason ?? undefined,
    navigationSummary: (row.navigationSummary as NavigationSummary) ?? {},
    sharedPayload: row.sharedPayload
      ? (row.sharedPayload as SharedHandoverPayload)
      : undefined,
    requestedBy: row.requestedBy ?? undefined,
    acceptedBy: row.acceptedBy ?? undefined,
    completedBy: row.completedBy ?? undefined,
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
    completedAt: row.completedAt?.toISOString(),
  };
}

async function recordHandoverEvent(
  handoverId: string,
  eventType: HandoverEventType,
  actorWorkspaceId: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const db = getDb();
  if (!db) return;

  await db.insert(crossBorderHandoverEvents).values({
    handoverId,
    eventType,
    actorWorkspaceId,
    metadata: metadata ?? {},
  });

  const auditActionMap: Record<HandoverEventType, Parameters<typeof auditLog>[0]["action"]> = {
    created: "operations.handover_created",
    consent_recorded: "operations.handover_consent_recorded",
    consent_withdrawn: "operations.handover_consent_withdrawn",
    requested: "operations.handover_requested",
    accepted: "operations.handover_accepted",
    rejected: "operations.handover_rejected",
    data_shared: "operations.handover_data_shared",
    completed: "operations.handover_completed",
    cancelled: "operations.handover_cancelled",
  };

  void auditLog({
    userId: actorWorkspaceId,
    action: auditActionMap[eventType],
    resourceType: "cross_border_handover",
    resourceId: handoverId,
    metadata: { eventType, ...metadata },
  });
}

export async function listHandovers(
  actor: OperationActor,
): Promise<CrossBorderHandover[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(crossBorderHandovers)
    .where(
      or(
        eq(crossBorderHandovers.originWorkspaceId, actor.workspaceId),
        eq(crossBorderHandovers.destinationWorkspaceId, actor.workspaceId),
      ),
    )
    .orderBy(desc(crossBorderHandovers.updatedAt));

  return rows.map((row) => {
    const handover = rowToHandover(row);
    return redactHandoverForViewer(handover, actor.workspaceId, actor.isAdmin);
  });
}

export async function getHandover(
  actor: OperationActor,
  handoverId: string,
): Promise<CrossBorderHandover | null> {
  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select()
    .from(crossBorderHandovers)
    .where(eq(crossBorderHandovers.id, handoverId))
    .limit(1);

  if (!row) return null;

  const isParticipant =
    actor.isAdmin ||
    row.originWorkspaceId === actor.workspaceId ||
    row.destinationWorkspaceId === actor.workspaceId;

  if (!isParticipant) return null;

  return redactHandoverForViewer(rowToHandover(row), actor.workspaceId, actor.isAdmin);
}

export async function createHandover(
  actor: OperationActor,
  input: CreateHandoverInput,
): Promise<CrossBorderHandover | null> {
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

  const now = new Date();
  const navigationSummary = buildNavigationSummary(navCaseFromRow(navCase));

  const [row] = await db
    .insert(crossBorderHandovers)
    .values({
      caseId: navCase.id,
      caseNumber: navCase.caseNumber,
      originCountryCode: navCase.countryCode,
      destinationCountryCode: input.destinationCountryCode,
      originWorkspaceId: actor.workspaceId,
      destinationWorkspaceId: input.destinationWorkspaceId,
      destinationTeamId: input.destinationTeamId,
      status: "consent_pending",
      consentStatus: "pending",
      reason: input.reason ?? "",
      navigationSummary,
      requestedBy: actor.workspaceId,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!row) return null;

  await recordHandoverEvent(row.id, "created", actor.workspaceId, {
    destinationCountry: input.destinationCountryCode,
  });

  return redactHandoverForViewer(rowToHandover(row), actor.workspaceId, actor.isAdmin);
}

export async function recordHandoverConsent(
  actor: OperationActor,
  handoverId: string,
): Promise<CrossBorderHandover | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(crossBorderHandovers)
    .where(eq(crossBorderHandovers.id, handoverId))
    .limit(1);

  if (!existing || !assertWorkspaceAccess(actor, existing.originWorkspaceId)) {
    return null;
  }

  const now = new Date();

  const [navCase] = await db
    .select()
    .from(navigationCases)
    .where(eq(navigationCases.id, existing.caseId))
    .limit(1);

  const sharedPayload = navCase
    ? buildSharedPayload(navCaseFromRow(navCase))
    : undefined;

  const [row] = await db
    .update(crossBorderHandovers)
    .set({
      consentStatus: "granted",
      consentGrantedAt: now,
      consentRecordedBy: actor.workspaceId,
      sharedPayload: sharedPayload ?? existing.sharedPayload,
      updatedAt: now,
    })
    .where(eq(crossBorderHandovers.id, handoverId))
    .returning();

  if (!row) return null;

  await recordHandoverEvent(row.id, "consent_recorded", actor.workspaceId);
  await recordHandoverEvent(row.id, "data_shared", actor.workspaceId, {
    fields: ["navigation_summary", "shared_payload"],
  });

  return redactHandoverForViewer(rowToHandover(row), actor.workspaceId, actor.isAdmin);
}

export async function requestHandover(
  actor: OperationActor,
  handoverId: string,
): Promise<CrossBorderHandover | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(crossBorderHandovers)
    .where(eq(crossBorderHandovers.id, handoverId))
    .limit(1);

  if (!existing || !assertWorkspaceAccess(actor, existing.originWorkspaceId)) {
    return null;
  }

  if (!canRequestHandover(existing.consentStatus as HandoverConsentStatus)) {
    return null;
  }

  const now = new Date();
  const [row] = await db
    .update(crossBorderHandovers)
    .set({
      status: "requested",
      requestedBy: actor.workspaceId,
      updatedAt: now,
    })
    .where(eq(crossBorderHandovers.id, handoverId))
    .returning();

  if (!row) return null;

  await recordHandoverEvent(row.id, "requested", actor.workspaceId);

  return redactHandoverForViewer(rowToHandover(row), actor.workspaceId, actor.isAdmin);
}

export async function acceptHandover(
  actor: OperationActor,
  handoverId: string,
): Promise<CrossBorderHandover | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(crossBorderHandovers)
    .where(eq(crossBorderHandovers.id, handoverId))
    .limit(1);

  if (!existing) return null;

  const isDestination =
    actor.isAdmin || existing.destinationWorkspaceId === actor.workspaceId;

  if (!isDestination) return null;
  if (!canShareNavigationData(existing.consentStatus as HandoverConsentStatus)) {
    return null;
  }
  if (existing.status !== "requested") return null;

  const now = new Date();
  const [row] = await db
    .update(crossBorderHandovers)
    .set({
      status: "accepted",
      destinationWorkspaceId: existing.destinationWorkspaceId ?? actor.workspaceId,
      acceptedBy: actor.workspaceId,
      updatedAt: now,
    })
    .where(eq(crossBorderHandovers.id, handoverId))
    .returning();

  if (!row) return null;

  await recordHandoverEvent(row.id, "accepted", actor.workspaceId);

  return redactHandoverForViewer(rowToHandover(row), actor.workspaceId, actor.isAdmin);
}

export async function rejectHandover(
  actor: OperationActor,
  handoverId: string,
  rejectionReason?: string,
): Promise<CrossBorderHandover | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(crossBorderHandovers)
    .where(eq(crossBorderHandovers.id, handoverId))
    .limit(1);

  if (!existing) return null;

  const isDestination =
    actor.isAdmin || existing.destinationWorkspaceId === actor.workspaceId;

  if (!isDestination) return null;
  if (existing.status !== "requested") return null;

  const now = new Date();
  const [row] = await db
    .update(crossBorderHandovers)
    .set({
      status: "rejected",
      rejectionReason: rejectionReason ?? "",
      updatedAt: now,
    })
    .where(eq(crossBorderHandovers.id, handoverId))
    .returning();

  if (!row) return null;

  await recordHandoverEvent(row.id, "rejected", actor.workspaceId, {
    reason: rejectionReason,
  });

  return redactHandoverForViewer(rowToHandover(row), actor.workspaceId, actor.isAdmin);
}

export async function completeHandover(
  actor: OperationActor,
  handoverId: string,
): Promise<CrossBorderHandover | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(crossBorderHandovers)
    .where(eq(crossBorderHandovers.id, handoverId))
    .limit(1);

  if (!existing) return null;

  const isParticipant =
    actor.isAdmin ||
    existing.originWorkspaceId === actor.workspaceId ||
    existing.destinationWorkspaceId === actor.workspaceId;

  if (!isParticipant) return null;
  if (!["accepted", "in_progress"].includes(existing.status)) return null;

  const now = new Date();
  const [row] = await db
    .update(crossBorderHandovers)
    .set({
      status: "completed",
      completedBy: actor.workspaceId,
      completedAt: now,
      updatedAt: now,
    })
    .where(eq(crossBorderHandovers.id, handoverId))
    .returning();

  if (!row) return null;

  await recordHandoverEvent(row.id, "completed", actor.workspaceId);

  return redactHandoverForViewer(rowToHandover(row), actor.workspaceId, actor.isAdmin);
}

export async function cancelHandover(
  actor: OperationActor,
  handoverId: string,
): Promise<CrossBorderHandover | null> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(crossBorderHandovers)
    .where(eq(crossBorderHandovers.id, handoverId))
    .limit(1);

  if (!existing || !assertWorkspaceAccess(actor, existing.originWorkspaceId)) {
    return null;
  }

  if (["completed", "cancelled"].includes(existing.status)) return null;

  const now = new Date();
  const [row] = await db
    .update(crossBorderHandovers)
    .set({
      status: "cancelled",
      updatedAt: now,
    })
    .where(eq(crossBorderHandovers.id, handoverId))
    .returning();

  if (!row) return null;

  await recordHandoverEvent(row.id, "cancelled", actor.workspaceId);

  return redactHandoverForViewer(rowToHandover(row), actor.workspaceId, actor.isAdmin);
}
