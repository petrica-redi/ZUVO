/**
 * Platform impact statistics from the database.
 * Falls back to an explicitly labelled illustrative stakeholder dataset.
 */

import { count, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { healthLogs, mediatorWorkspaces, progress } from "@/db/schema";
import { aggregateNational } from "@/lib/mediator/aggregate";
import { LOCALES } from "@/i18n/routing";
import { DEMO_IMPACT_STATS } from "@/lib/demo/seed-data";
import type { ProgrammeIndicatorValue } from "@/lib/operations/types";
import { getProgrammeIndicators } from "@/lib/operations/outcome-service";

export type ImpactStats = {
  source: "live" | "illustrative";
  languages: number;
  activeMediators: number;
  mythsChecked: number;
  emergenciesEscalated: number;
  lessonsCompleted: number;
  visitsThisYear: number;
  gpEnrollmentsFacilitated: number;
  countiesReporting: number;
  programmeIndicators: ProgrammeIndicatorValue[];
};

export async function getImpactStats(): Promise<ImpactStats> {
  const illustrativeIndicators: ProgrammeIndicatorValue[] = [
    { slug: "gp_registered", labelKey: "impact.indicatorGpRegistered", count: 186, suppressed: false },
    { slug: "appointment_attended", labelKey: "impact.indicatorAppointmentAttended", count: 142, suppressed: false },
    { slug: "insurance_obtained", labelKey: "impact.indicatorInsuranceObtained", count: 97, suppressed: false },
    { slug: "vaccination_completed", labelKey: "impact.indicatorVaccinationCompleted", count: 64, suppressed: false },
    { slug: "cases_completed", labelKey: "impact.indicatorCasesCompleted", count: 218, suppressed: false },
  ];

  const base: ImpactStats = {
    source: "illustrative",
    languages: LOCALES.length,
    ...DEMO_IMPACT_STATS,
    programmeIndicators: illustrativeIndicators,
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
      programmeIndicators: await getProgrammeIndicators("ministry_viewer"),
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
