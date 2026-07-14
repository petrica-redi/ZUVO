/**
 * GET  /api/operations/intake — List intake requests (mediator workspace)
 * POST /api/operations/intake — Public help request submission
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { getClientIp } from "@/lib/api/validation";
import { INTAKE_HELP_TYPES } from "@/lib/operations/constants";
import { createIntake, listIntakes } from "@/lib/operations/case-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const intakeSchema = z.object({
  preferredLanguage: z.string().trim().max(8).optional(),
  contactMethod: z.enum(["phone", "sms", "email", "whatsapp", "in_person"]),
  contactValue: z.string().trim().max(120).optional(),
  countryCode: z.string().trim().max(4).optional(),
  municipalityCode: z.string().trim().max(32).optional(),
  helpType: z.enum(INTAKE_HELP_TYPES),
  consentGranted: z.literal(true),
  notes: z.string().trim().max(1000).optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-intake-read",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  const intakes = await listIntakes(status);
  return NextResponse.json({ success: true, data: intakes });
}

export async function POST(req: NextRequest) {
  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-intake-public",
    limit: 10,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, intakeSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) {
    return NextResponse.json(
      {
        success: false,
        error: "Service temporarily unavailable. Please call 112 in an emergency.",
        offline: true,
      },
      { status: 503 },
    );
  }

  const intake = await createIntake(parsed.data);
  if (!intake) {
    return NextResponse.json(
      { success: false, error: "Failed to submit request" },
      { status: 500 },
    );
  }

  void auditLog({
    userId: "public",
    action: "operations.intake_created",
    resourceType: "intake_request",
    resourceId: intake.id,
    metadata: {
      referenceCode: intake.referenceCode,
      helpType: intake.helpType,
      countryCode: intake.countryCode,
    },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        referenceCode: intake.referenceCode,
        id: intake.id,
      },
    },
    { status: 201 },
  );
}
