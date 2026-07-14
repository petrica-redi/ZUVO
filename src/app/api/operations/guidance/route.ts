/**
 * GET  /api/operations/guidance — List country-pair access guidance
 * POST /api/operations/guidance — Create guidance (admin only)
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody, getClientIp } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { isAdminApiAuthorized } from "@/lib/admin/api-auth";
import { listGuidance } from "@/lib/operations/guidance-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const querySchema = z.object({
  origin: z.string().trim().min(2).max(4),
  destination: z.string().trim().min(2).max(4),
});

const createSchema = z.object({
  originCountryCode: z.string().trim().min(2).max(4),
  destinationCountryCode: z.string().trim().min(2).max(4),
  topicSlug: z.string().trim().min(1).max(64),
  titleKey: z.string().trim().min(1).max(120),
  contentTemplate: z.string().trim().max(10000),
  sortOrder: z.number().int().min(0).max(999).optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-guidance-read",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "origin and destination country codes required" },
      { status: 400 },
    );
  }

  if (!getDb()) return databaseUnavailableResponse();

  const guidance = await listGuidance(
    parsed.data.origin.toUpperCase(),
    parsed.data.destination.toUpperCase(),
  );

  return NextResponse.json({ success: true, data: guidance });
}

export async function POST(req: NextRequest) {
  if (!isAdminApiAuthorized(req)) {
    return NextResponse.json(
      { success: false, error: "Admin access required" },
      { status: 403 },
    );
  }

  const parsed = await parseJsonBody(req, createSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const { countryAccessGuidance } = await import("@/db/schema");
  const now = new Date();
  const db = getDb()!;

  const [row] = await db
    .insert(countryAccessGuidance)
    .values({
      originCountryCode: parsed.data.originCountryCode.toUpperCase(),
      destinationCountryCode: parsed.data.destinationCountryCode.toUpperCase(),
      topicSlug: parsed.data.topicSlug,
      titleKey: parsed.data.titleKey,
      contentTemplate: parsed.data.contentTemplate,
      sortOrder: parsed.data.sortOrder ?? 99,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!row) {
    return NextResponse.json(
      { success: false, error: "Failed to create guidance" },
      { status: 500 },
    );
  }

  void auditLog({
    userId: "admin",
    action: "operations.guidance_updated",
    resourceType: "country_access_guidance",
    resourceId: row.id,
    metadata: { action: "created", topicSlug: row.topicSlug },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        id: row.id,
        originCountryCode: row.originCountryCode,
        destinationCountryCode: row.destinationCountryCode,
        topicSlug: row.topicSlug,
        titleKey: row.titleKey,
        contentTemplate: row.contentTemplate,
        sortOrder: row.sortOrder,
        isActive: row.isActive,
        createdAt: row.createdAt?.toISOString(),
        updatedAt: row.updatedAt?.toISOString(),
      },
    },
    { status: 201 },
  );
}
