/**
 * POST /api/operations/intake/[id]/convert — Convert intake to navigation case
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { getClientIp } from "@/lib/api/validation";
import { convertIntakeToCase } from "@/lib/operations/case-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const convertSchema = z.object({
  beneficiaryPseudonym: z.string().trim().min(1).max(160),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, context: RouteContext) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-intake-convert",
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, convertSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const { id } = await context.params;
  const navCase = await convertIntakeToCase(
    actor,
    id,
    parsed.data.beneficiaryPseudonym,
  );

  if (!navCase) {
    return NextResponse.json(
      { success: false, error: "Intake not found or conversion failed" },
      { status: 404 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.intake_converted",
    resourceType: "intake_request",
    resourceId: id,
    metadata: { caseId: navCase.id, caseNumber: navCase.caseNumber },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: navCase }, { status: 201 });
}
