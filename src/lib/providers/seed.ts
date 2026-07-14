import { count } from "drizzle-orm";
import type { Database } from "@/db/client";
import { providers } from "@/db/schema";
import { PROVIDER_SEED } from "@/data/providers-seed";

function categorySlugsForType(type: string): string[] {
  const map: Record<string, string[]> = {
    clinic: ["gp_registration", "vaccination", "child_health"],
    hospital: ["emergency_followup", "hospital_discharge", "chronic_disease"],
    maternity: ["maternity"],
    mental_health: ["mental_health"],
    dental: ["dental"],
    mediator_office: ["administrative_docs", "insurance_entitlement"],
    pharmacy: ["medication_access"],
  };
  return map[type] ?? ["other"];
}

export async function ensureProviderSeed(db: Database): Promise<number> {
  const [row] = await db.select({ n: count() }).from(providers);
  if ((row?.n ?? 0) > 0) return 0;

  await db.insert(providers).values(
    PROVIDER_SEED.map((p) => ({
      name: p.name,
      type: p.type,
      latitude: p.latitude,
      longitude: p.longitude,
      address: p.address,
      phone: p.phone ?? null,
      website: p.website ?? null,
      region: p.region,
      countryCode: "RO",
      verificationState: "verified",
      categorySlugs: categorySlugsForType(p.type),
      isRomaFriendly: p.isRomaFriendly,
      isFreeClinic: p.isFreeClinic,
      hasInterpreter: p.hasInterpreter,
      languages: p.languages,
      verifiedAt: new Date(),
    })),
  );

  return PROVIDER_SEED.length;
}
