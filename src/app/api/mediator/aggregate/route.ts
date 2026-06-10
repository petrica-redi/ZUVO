/**
 * GET /api/mediator/aggregate
 *
 * County-level POIDS indicator roll-up for ministry dashboards.
 * Requires `x-admin-key` header (ADMIN_API_KEY or CRON_SECRET).
 *
 * Query params:
 *   county — optional ISO 3166-2:RO code (e.g. BN). Omit for national summary.
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { mediatorWorkspaces } from "@/db/schema";
import { isAdminApiAuthorized } from "@/lib/admin/api-auth";
import { aggregateByCounty, aggregateNational } from "@/lib/mediator/aggregate";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";

export async function GET(req: NextRequest) {
  if (!isAdminApiAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "mediator-aggregate",
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { success: false, error: "Database unavailable" },
      { status: 503 },
    );
  }

  const rows = await db.select().from(mediatorWorkspaces);
  const mapped = rows.map((w) => ({
    workspaceId: w.workspaceId,
    countyCode: w.countyCode,
    payload: w.payload,
    updatedAt: w.updatedAt,
  }));

  const county = req.nextUrl.searchParams.get("county")?.trim().toUpperCase();
  const data = county
    ? aggregateByCounty(mapped, county)
    : { counties: aggregateNational(mapped), totalWorkspaces: rows.length };

  return NextResponse.json({
    success: true,
    data,
    generatedAt: new Date().toISOString(),
  });
}
