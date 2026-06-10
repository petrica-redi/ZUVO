/**
 * GET /api/providers?region=romania|italy
 *
 * Public provider directory — seeds on first request when DB is empty.
 */
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { providers } from "@/db/schema";
import { ensureProviderSeed } from "@/lib/providers/seed";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";

export async function GET(req: NextRequest) {
  const rate = await applyRateLimitAsync(req, {
    namespace: "providers-read",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const db = getDb();
  if (!db) {
    return NextResponse.json({ success: true, data: [], offline: true });
  }

  await ensureProviderSeed(db);

  const region = req.nextUrl.searchParams.get("region")?.trim().toLowerCase();
  const rows = region
    ? await db.select().from(providers).where(eq(providers.region, region))
    : await db.select().from(providers);

  return NextResponse.json({
    success: true,
    data: rows.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      latitude: p.latitude,
      longitude: p.longitude,
      address: p.address,
      phone: p.phone,
      website: p.website,
      region: p.region,
      isRomaFriendly: p.isRomaFriendly,
      isFreeClinic: p.isFreeClinic,
      hasInterpreter: p.hasInterpreter,
      languages: p.languages,
    })),
  });
}
