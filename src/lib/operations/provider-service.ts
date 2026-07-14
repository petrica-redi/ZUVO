import { eq, and } from "drizzle-orm";
import { getDb } from "@/db/client";
import { providers } from "@/db/schema";
import { ensureProviderSeed } from "@/lib/providers/seed";
import {
  CATEGORY_PROVIDER_TYPES,
  type CategorySlug,
  type VerificationState,
} from "./constants";
import type { OperationalProvider, ProviderSearchParams } from "./types";

function rowToProvider(
  row: typeof providers.$inferSelect,
  matchScore?: number,
  matchReasons?: string[],
): OperationalProvider {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    address: row.address,
    phone: row.phone ?? undefined,
    website: row.website ?? undefined,
    region: row.region ?? undefined,
    countryCode: row.countryCode ?? undefined,
    municipalityCode: row.municipalityCode ?? undefined,
    verificationState: row.verificationState,
    categorySlugs: (row.categorySlugs as string[]) ?? [],
    isRomaFriendly: row.isRomaFriendly,
    isFreeClinic: row.isFreeClinic,
    hasInterpreter: row.hasInterpreter,
    languages: (row.languages as string[]) ?? [],
    matchScore,
    matchReasons,
  };
}

export function scoreProviderMatch(
  row: typeof providers.$inferSelect,
  params: ProviderSearchParams,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (row.verificationState === "verified") {
    score += 30;
    reasons.push("verified");
  } else if (row.verificationState === "pending") {
    score += 10;
  }

  if (params.categorySlug) {
    const slugs = (row.categorySlugs as string[]) ?? [];
    if (slugs.includes(params.categorySlug)) {
      score += 25;
      reasons.push("category_match");
    }
    const preferredTypes = CATEGORY_PROVIDER_TYPES[params.categorySlug as CategorySlug];
    if (preferredTypes?.includes(row.type)) {
      score += 15;
      reasons.push("type_match");
    }
  }

  if (params.language) {
    const langs = (row.languages as string[]) ?? [];
    if (langs.includes(params.language)) {
      score += 20;
      reasons.push("language_match");
    }
    if (row.hasInterpreter) {
      score += 5;
      reasons.push("interpreter_available");
    }
  }

  if (params.municipalityCode && row.municipalityCode === params.municipalityCode) {
    score += 20;
    reasons.push("municipality_match");
  }

  if (row.isRomaFriendly) {
    score += 5;
    reasons.push("roma_friendly");
  }

  if (row.isFreeClinic) {
    score += 3;
    reasons.push("free_clinic");
  }

  return { score, reasons };
}

export async function searchProviders(
  params: ProviderSearchParams,
): Promise<OperationalProvider[]> {
  const db = getDb();
  if (!db) return [];

  await ensureProviderSeed(db);

  const verificationFilter = params.verificationState ?? "verified";
  const conditions = [eq(providers.verificationState, verificationFilter)];

  if (params.countryCode) {
    conditions.push(eq(providers.countryCode, params.countryCode));
  }

  const rows = await db
    .select()
    .from(providers)
    .where(and(...conditions))
    .limit(100);

  const scored = rows.map((row) => {
    const { score, reasons } = scoreProviderMatch(row, params);
    return { row, score, reasons };
  });

  scored.sort((a, b) => b.score - a.score);

  const minScore = params.categorySlug || params.language ? 10 : 0;
  return scored
    .filter(({ score }) => score >= minScore)
    .slice(0, 20)
    .map(({ row, score, reasons }) => rowToProvider(row, score, reasons));
}

export async function searchProvidersForCase(
  categorySlug: string,
  preferredLanguage: string,
  municipalityCode?: string,
  countryCode = "RO",
): Promise<OperationalProvider[]> {
  const primary = await searchProviders({
    categorySlug,
    language: preferredLanguage,
    municipalityCode,
    countryCode,
    verificationState: "verified",
  });

  if (primary.length >= 3) return primary;

  const relaxed = await searchProviders({
    categorySlug,
    countryCode,
    verificationState: "verified",
  });

  const seen = new Set(primary.map((p) => p.id));
  const merged = [...primary];
  for (const p of relaxed) {
    if (!seen.has(p.id)) {
      merged.push(p);
      seen.add(p.id);
    }
  }

  return merged.slice(0, 20);
}

export async function getProviderById(
  providerId: string,
): Promise<OperationalProvider | null> {
  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select()
    .from(providers)
    .where(eq(providers.id, providerId))
    .limit(1);

  return row ? rowToProvider(row) : null;
}

export async function listProvidersByVerification(
  state: VerificationState,
): Promise<OperationalProvider[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(providers)
    .where(eq(providers.verificationState, state))
    .limit(100);

  return rows.map((row) => rowToProvider(row));
}
