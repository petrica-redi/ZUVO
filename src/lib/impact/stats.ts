/**
 * Live platform impact statistics from the database.
 * Falls back to zero when DB is unavailable — never fabricates numbers.
 */

import { count, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { healthLogs, mediatorWorkspaces, progress } from "@/db/schema";
import { aggregateNational } from "@/lib/mediator/aggregate";
import { LOCALES } from "@/i18n/routing";

export type ImpactStats = {
  source: "live" | "unavailable";
  languages: number;
  activeMediators: number;
  mythsChecked: number;
  emergenciesEscalated: number;
  lessonsCompleted: number;
  visitsThisYear: number;
  gpEnrollmentsFacilitated: number;
  countiesReporting: number;
};

export async function getImpactStats(): Promise<ImpactStats> {
  const base: ImpactStats = {
    source: "unavailable",
    languages: LOCALES.length,
    activeMediators: 0,
    mythsChecked: 0,
    emergenciesEscalated: 0,
    lessonsCompleted: 0,
    visitsThisYear: 0,
    gpEnrollmentsFacilitated: 0,
    countiesReporting: 0,
  };

  const db = getDb();
  if (!db) return base;

  try {
    const [progressRow] = await db
      .select({ n: count() })
      .from(progress)
      .where(sql`${progress.status} = 'completed'`);

    const [scanRow] = await db
      .select({ n: count() })
      .from(healthLogs)
      .where(sql`${healthLogs.type} = 'scan'`);

    const [emergencyRow] = await db
      .select({ n: count() })
      .from(healthLogs)
      .where(sql`${healthLogs.metadata}->>'severity' = 'red'`);

    const workspaceRows = await db.select().from(mediatorWorkspaces);
    const national = aggregateNational(
      workspaceRows.map((w) => ({
        workspaceId: w.workspaceId,
        countyCode: w.countyCode,
        payload: w.payload,
        updatedAt: w.updatedAt,
      })),
    );

    let gpEnrollments = 0;
    let visitsYear = 0;
    for (const county of national) {
      visitsYear += county.visitsThisYear;
      gpEnrollments += county.facilitations.gpEnrollment ?? 0;
    }

    return {
      source: "live",
      languages: LOCALES.length,
      activeMediators: workspaceRows.length,
      mythsChecked: scanRow?.n ?? 0,
      emergenciesEscalated: emergencyRow?.n ?? 0,
      lessonsCompleted: progressRow?.n ?? 0,
      visitsThisYear: visitsYear,
      gpEnrollmentsFacilitated: gpEnrollments,
      countiesReporting: national.length,
    };
  } catch {
    return base;
  }
}

/** Format large numbers for display (e.g. 12400 → "12.4k"). */
export function formatImpactNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}
