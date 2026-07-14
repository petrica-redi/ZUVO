/**
 * GET  /api/operations/outcomes — List outcomes for workspace or aggregates
 * POST /api/operations/outcomes — Record a structured case outcome
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody, getClientIp } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { OUTCOME_STATUSES, OUTCOME_TYPES } from "@/lib/operations/constants";
import {
  databaseUnavailableResponse,
  resolveReportingActor,
  reportingUnauthorizedResponse,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";
import {
  getProgrammeIndicators,
  listOutcomesForCase,
  listOutcomesForWorkspace,
  recordOutcome,
} from "@/lib/operations/outcome-service";
import { canReadAggregates } from "@/lib/operations/permissions";

const recordOutcomeSchema = z.object({
  caseId: z.string().uuid(),
  outcomeType: z.enum(OUTCOME_TYPES),
  status: z.enum(OUTCOME_STATUSES),
  achievedAt: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(2000).optional(),
  evidenceRef: z.string().trim().max(200).optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveReportingActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-outcomes-read",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const caseId = req.nextUrl.searchParams.get("caseId")?.trim();
  const aggregate = req.nextUrl.searchParams.get("aggregate") === "true";

  if (aggregate) {
    if (!canReadAggregates(actor.role)) return reportingUnauthorizedResponse();
    const indicators = await getProgrammeIndicators(actor.role);
    return NextResponse.json({
      success: true,
      data: { indicators },
      source: "live",
    });
  }

  if (caseId) {
    const outcomes = await listOutcomesForCase(actor, caseId);
    return NextResponse.json({ success: true, data: outcomes });
  }

  const outcomes = await listOutcomesForWorkspace(actor.workspaceId);
  return NextResponse.json({ success: true, data: outcomes });
}

export async function POST(req: NextRequest) {
  const actor = await resolveReportingActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-outcomes-write",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, recordOutcomeSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const outcome = await recordOutcome(actor, parsed.data);
  if (!outcome) {
    return NextResponse.json(
      { success: false, error: "Failed to record outcome" },
      { status: 500 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.case_status_changed",
    resourceType: "case_outcome",
    resourceId: outcome.id,
    metadata: {
      caseId: outcome.caseId,
      outcomeType: outcome.outcomeType,
      status: outcome.status,
    },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: outcome }, { status: 201 });
}
