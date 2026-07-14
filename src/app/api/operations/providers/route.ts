/**
 * GET /api/operations/providers — Search verified providers for case matching
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { CATEGORY_SLUGS, VERIFICATION_STATES } from "@/lib/operations/constants";
import { searchProviders, searchProvidersForCase } from "@/lib/operations/provider-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const searchSchema = z.object({
  categorySlug: z.enum(CATEGORY_SLUGS).optional(),
  language: z.string().trim().max(8).optional(),
  municipalityCode: z.string().trim().max(32).optional(),
  countryCode: z.string().trim().max(4).optional(),
  verificationState: z.enum(VERIFICATION_STATES).optional(),
  caseId: z.string().uuid().optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-providers-read",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = searchSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid search parameters" },
      { status: 400 },
    );
  }

  const { categorySlug, language, municipalityCode, countryCode, verificationState } =
    parsed.data;

  const results =
    categorySlug && language
      ? await searchProvidersForCase(
          categorySlug,
          language,
          municipalityCode,
          countryCode ?? "RO",
        )
      : await searchProviders({
          categorySlug,
          language,
          municipalityCode,
          countryCode,
          verificationState,
        });

  return NextResponse.json({ success: true, data: results });
}
