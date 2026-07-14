/**
 * GET  /api/operations/routing — List active routing rules
 * POST /api/operations/routing — Route an intake or assign team
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { getClientIp } from "@/lib/api/validation";
import {
  assignIntakeToTeam,
  listRoutingRules,
  routeIntake,
} from "@/lib/operations/routing-service";
import { createOperationNotification } from "@/lib/operations/notification-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const routeSchema = z.object({
  intakeId: z.string().uuid(),
  teamId: z.string().uuid().optional(),
  auto: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-routing-read",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const rules = await listRoutingRules();
  return NextResponse.json({ success: true, data: rules });
}

export async function POST(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-routing-write",
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, routeSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const intake =
    parsed.data.teamId && !parsed.data.auto
      ? await assignIntakeToTeam(parsed.data.intakeId, parsed.data.teamId)
      : await routeIntake(parsed.data.intakeId);

  if (!intake) {
    return NextResponse.json(
      { success: false, error: "Intake not found or routing failed" },
      { status: 404 },
    );
  }

  void createOperationNotification({
    workspaceId: actor.workspaceId,
    notificationType: "intake_routed",
    title: "operations.notifIntakeRoutedTitle",
    body: "operations.notifIntakeRoutedBody",
    data: {
      intakeId: intake.id,
      referenceCode: intake.referenceCode,
      teamId: intake.routedTeamId,
      teamName: intake.routedTeamName,
    },
    sendEmail: true,
  });

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.intake_routed",
    resourceType: "intake_request",
    resourceId: intake.id,
    metadata: {
      teamId: intake.routedTeamId,
      referenceCode: intake.referenceCode,
    },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: intake });
}
