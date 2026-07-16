/**
 * Platform impact statistics from the database.
 * Falls back to an explicitly labelled illustrative stakeholder dataset.
 * Live queries are time-bounded so /impact cannot hang the platform.
 */

import { count, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  healthLogs,
  mediatorWorkspaces,
  navigationCases,
  progress,
} from "@/db/schema";
import { ROMANIA_ECI_COUNTIES } from "@/data/romania-eci-contacts";
import { aggregateNational } from "@/lib/mediator/aggregate";
import { LOCALES } from "@/i18n/routing";
import { DEMO_COUNTY_SNAPSHOTS, DEMO_IMPACT_STATS } from "@/lib/demo/seed-data";
import type { ProgrammeIndicatorValue } from "@/lib/operations/types";
import { getProgrammeIndicators } from "@/lib/operations/outcome-service";

export type CountySnapshot = {
  county: string;
  mediators: number;
  visits: number;
  referrals: number;
  trend: number | null;
};

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
  openOpsCases: number;
  programmeIndicators: ProgrammeIndicatorValue[];
  countySnapshots: CountySnapshot[];
};

const COUNTY_NAMES = new Map(ROMANIA_ECI_COUNTIES.map((c) => [c.code, c.name]));
const QUERY_BUDGET_MS = 4500;

function countyName(code: string): string {
  return COUNTY_NAMES.get(code) ?? code;
}

function referralCount(facilitations: Record<string, number>): number {
  return (
    (facilitations.screeningReferral ?? 0) +
    (facilitations.gpEnrollment ?? 0) +
    (facilitations.prenatalFacilitated ?? 0)
  );
}

function toCountySnapshots(
  national: ReturnType<typeof aggregateNational>,
): CountySnapshot[] {
  return national
    .map((row) => ({
      county: countyName(row.countyCode),
      mediators: row.workspaceCount,
      visits: row.visitsThisYear,
      referrals: referralCount(row.facilitations),
      trend: null,
    }))
    .sort((a, b) => b.visits - a.visits);
}

async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function illustrativeBase(): ImpactStats {
  const illustrativeIndicators: ProgrammeIndicatorValue[] = [
    { slug: "gp_registered", labelKey: "impact.indicatorGpRegistered", count: 186, suppressed: false },
    { slug: "appointment_attended", labelKey: "impact.indicatorAppointmentAttended", count: 142, suppressed: false },
    { slug: "insurance_obtained", labelKey: "impact.indicatorInsuranceObtained", count: 97, suppressed: false },
    { slug: "vaccination_completed", labelKey: "impact.indicatorVaccinationCompleted", count: 64, suppressed: false },
    { slug: "cases_completed", labelKey: "impact.indicatorCasesCompleted", count: 218, suppressed: false },
  ];

  return {
    source: "illustrative",
    languages: LOCALES.length,
    ...DEMO_IMPACT_STATS,
    openOpsCases: 0,
    programmeIndicators: illustrativeIndicators,
    countySnapshots: DEMO_COUNTY_SNAPSHOTS.map((row) => ({
      ...row,
      trend: row.trend,
    })),
  };
}

export async function getImpactStats(): Promise<ImpactStats> {
  const base = illustrativeBase();
  const db = getDb();
  if (!db) return base;

  try {
    const live = await withTimeout(
      (async (): Promise<ImpactStats> => {
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

        const [openOpsRow] = await db
          .select({ n: count() })
          .from(navigationCases)
          .where(sql`${navigationCases.status} NOT IN ('closed', 'completed', 'cancelled')`);

        const workspaceRows = await db
          .select({
            workspaceId: mediatorWorkspaces.workspaceId,
            countyCode: mediatorWorkspaces.countyCode,
            payload: mediatorWorkspaces.payload,
            updatedAt: mediatorWorkspaces.updatedAt,
          })
          .from(mediatorWorkspaces);

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

        const programmeIndicators = await withTimeout(
          getProgrammeIndicators("ministry_viewer"),
          2000,
          base.programmeIndicators,
        );

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
          openOpsCases: openOpsRow?.n ?? 0,
          programmeIndicators,
          countySnapshots:
            national.length > 0 ? toCountySnapshots(national) : base.countySnapshots,
        };
      })(),
      QUERY_BUDGET_MS,
      base,
    );

    return live;
  } catch {
    return base;
  }
}

/** Format large numbers for display (e.g. 12400 → "12.4k"). */
export function formatImpactNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}
