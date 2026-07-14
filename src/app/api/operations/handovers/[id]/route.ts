/**
 * PATCH /api/operations/handovers/[id] — Handover workflow actions
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import {
  acceptHandover,
  cancelHandover,
  completeHandover,
  getHandover,
  recordHandoverConsent,
  rejectHandover,
  requestHandover,
} from "@/lib/operations/handover-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const patchSchema = z.object({
  action: z.enum([
    "record_consent",
    "request",
    "accept",
    "reject",
    "complete",
    "cancel",
  ]),
  rejectionReason: z.string().trim().max(2000).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  if (!getDb()) return databaseUnavailableResponse();

  const { id } = await context.params;
  const handover = await getHandover(actor, id);
  if (!handover) {
    return NextResponse.json(
      { success: false, error: "Handover not found or access denied" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: handover });
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-handovers-patch",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, patchSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const { id } = await context.params;
  const { action, rejectionReason } = parsed.data;

  let handover = null;
  switch (action) {
    case "record_consent":
      handover = await recordHandoverConsent(actor, id);
      break;
    case "request":
      handover = await requestHandover(actor, id);
      break;
    case "accept":
      handover = await acceptHandover(actor, id);
      break;
    case "reject":
      handover = await rejectHandover(actor, id, rejectionReason);
      break;
    case "complete":
      handover = await completeHandover(actor, id);
      break;
    case "cancel":
      handover = await cancelHandover(actor, id);
      break;
  }

  if (!handover) {
    const messages: Record<string, string> = {
      record_consent: "Consent must be recorded by origin team before data is shared",
      request: "Consent required before requesting handover",
      accept: "Handover cannot be accepted (consent or status invalid)",
      reject: "Handover cannot be rejected",
      complete: "Handover cannot be completed",
      cancel: "Handover cannot be cancelled",
    };
    return NextResponse.json(
      { success: false, error: messages[action] ?? "Action failed" },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true, data: handover });
}
