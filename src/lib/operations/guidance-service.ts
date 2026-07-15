import { eq, and, asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { countryAccessGuidance } from "@/db/schema";
import type { CountryAccessGuidance } from "./guidance-shared";

export type { CountryAccessGuidance } from "./guidance-shared";
export { renderGuidanceTemplate } from "./guidance-shared";

export type UpdateGuidanceInput = {
  contentTemplate?: string;
  titleKey?: string;
  sortOrder?: number;
  isActive?: boolean;
};

function rowToGuidance(
  row: typeof countryAccessGuidance.$inferSelect,
): CountryAccessGuidance {
  return {
    id: row.id,
    originCountryCode: row.originCountryCode,
    destinationCountryCode: row.destinationCountryCode,
    topicSlug: row.topicSlug,
    titleKey: row.titleKey,
    contentTemplate: row.contentTemplate,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    organisationId: row.organisationId ?? undefined,
    updatedBy: row.updatedBy ?? undefined,
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function listGuidance(
  originCountryCode: string,
  destinationCountryCode: string,
  activeOnly = true,
): Promise<CountryAccessGuidance[]> {
  const db = getDb();
  if (!db) return [];

  const conditions = [
    eq(countryAccessGuidance.originCountryCode, originCountryCode),
    eq(countryAccessGuidance.destinationCountryCode, destinationCountryCode),
  ];

  if (activeOnly) {
    conditions.push(eq(countryAccessGuidance.isActive, true));
  }

  const rows = await db
    .select()
    .from(countryAccessGuidance)
    .where(and(...conditions))
    .orderBy(asc(countryAccessGuidance.sortOrder));

  return rows.map(rowToGuidance);
}

export async function getGuidance(id: string): Promise<CountryAccessGuidance | null> {
  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select()
    .from(countryAccessGuidance)
    .where(eq(countryAccessGuidance.id, id))
    .limit(1);

  return row ? rowToGuidance(row) : null;
}

export async function updateGuidance(
  id: string,
  input: UpdateGuidanceInput,
  updatedBy: string,
): Promise<CountryAccessGuidance | null> {
  const db = getDb();
  if (!db) return null;

  const now = new Date();
  const [row] = await db
    .update(countryAccessGuidance)
    .set({
      contentTemplate: input.contentTemplate,
      titleKey: input.titleKey,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
      updatedBy,
      updatedAt: now,
    })
    .where(eq(countryAccessGuidance.id, id))
    .returning();

  return row ? rowToGuidance(row) : null;
}
