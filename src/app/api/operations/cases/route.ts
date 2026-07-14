/**
 * GET  /api/operations/cases — List navigation cases for workspace
 * POST /api/operations/cases — Create a new navigation case
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody, getClientIp } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import {
  BARRIER_SLUGS,
  CASE_SOURCES,
  CASE_STATUSES,
  CASE_URGENCIES,
  CATEGORY_SLUGS,
  CONSENT_STATUSES,
} from "@/lib/operations/constants";
import {
  createCase,
  listCases,
} from "@/lib/operations/case-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const createCaseSchema = z.object({
  beneficiaryPseudonym: z.string().trim().min(1).max(160),
  countryCode: z.string().trim().max(4).optional(),
  municipalityCode: z.string().trim().max(32).optional(),
  preferredLanguage: z.string().trim().max(8).optional(),
  contactMethod: z.string().trim().max(40).optional(),
  consentStatus: z.enum(CONSENT_STATUSES).optional(),
  source: z.enum(CASE_SOURCES).optional(),
  categorySlug: z.enum(CATEGORY_SLUGS),
  mainProblem: z.string().trim().min(1).max(500),
  urgency: z.enum(CASE_URGENCIES).optional(),
  status: z.enum(CASE_STATUSES).optional(),
  nextAction: z.string().trim().max(200).optional(),
  targetDate: z.string().trim().max(20).optional(),
  notes: z.string().trim().max(4000).optional(),
  barriers: z.array(z.enum(BARRIER_SLUGS)).optional(),
  barrierNotes: z.string().trim().max(2000).optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-cases-read",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const cases = await listCases(actor.workspaceId);
  return NextResponse.json({ success: true, data: cases });
}

export async function POST(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-cases-write",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, createCaseSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const navCase = await createCase(actor, parsed.data);
  if (!navCase) {
    return NextResponse.json(
      { success: false, error: "Failed to create case" },
      { status: 500 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.case_created",
    resourceType: "navigation_case",
    resourceId: navCase.id,
    metadata: { caseNumber: navCase.caseNumber, urgency: navCase.urgency },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: navCase }, { status: 201 });
}
