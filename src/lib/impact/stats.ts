/**
 * Platform impact statistics from the database.
 * Falls back to an explicitly labelled illustrative stakeholder dataset.
 *
 * Critical: never hold the request open on heavy workspace payload scans.
 * Live path uses COUNT queries only; county detail falls back to demo rows
 * unless the workspace set is small enough to aggregate safely.
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
const LIGHT_AGGREGATE_LIMIT = 40;

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

async function safeCount(
  run: () => Promise<{ n: number }[]>,
): Promise<number> {
  try {
    const [row] = await run();
    return row?.n ?? 0;
  } catch {
    return 0;
  }
}

async function getImpactStatsLive(): Promise<ImpactStats> {
  const base = illustrativeBase();
  const db = getDb();
  if (!db) return base;

  try {
    const lessonsCompleted = await safeCount(() =>
      db
        .select({ n: count() })
        .from(progress)
        .where(sql`${progress.status} = 'completed'`),
    );
    const mythsChecked = await safeCount(() =>
      db
        .select({ n: count() })
        .from(healthLogs)
        .where(sql`${healthLogs.type} = 'scan'`),
    );
    const emergenciesEscalated = await safeCount(() =>
      db
        .select({ n: count() })
        .from(healthLogs)
        .where(sql`${healthLogs.metadata}->>'severity' = 'red'`),
    );
    const activeMediators = await safeCount(() =>
      db.select({ n: count() }).from(mediatorWorkspaces),
    );
    const openOpsCases = await safeCount(() =>
      db
        .select({ n: count() })
        .from(navigationCases)
        .where(sql`${navigationCases.status} NOT IN ('closed', 'completed', 'cancelled')`),
    );

    // Never mix illustrative county/visit figures into a "live" response.
    let visitsThisYear = 0;
    let gpEnrollmentsFacilitated = 0;
    let countiesReporting = 0;
    let countySnapshots: CountySnapshot[] = base.countySnapshots.map((c) => ({
      ...c,
      mediators: 0,
      visits: 0,
      referrals: 0,
      trend: null,
    }));
    let aggregatesAreLive = false;

    if (activeMediators > 0 && activeMediators <= LIGHT_AGGREGATE_LIMIT) {
      try {
        const workspaceRows = await db
          .select({
            workspaceId: mediatorWorkspaces.workspaceId,
            countyCode: mediatorWorkspaces.countyCode,
            payload: mediatorWorkspaces.payload,
            updatedAt: mediatorWorkspaces.updatedAt,
          })
          .from(mediatorWorkspaces)
          .limit(LIGHT_AGGREGATE_LIMIT);

        const national = aggregateNational(
          workspaceRows.map((w) => ({
            workspaceId: w.workspaceId,
            countyCode: w.countyCode,
            payload: w.payload,
            updatedAt: w.updatedAt,
          })),
        );

        if (national.length > 0) {
          visitsThisYear = 0;
          gpEnrollmentsFacilitated = 0;
          for (const county of national) {
            visitsThisYear += county.visitsThisYear;
            gpEnrollmentsFacilitated += county.facilitations.gpEnrollment ?? 0;
          }
          countiesReporting = national.length;
          countySnapshots = toCountySnapshots(national);
          aggregatesAreLive = true;
        }
      } catch {
        // Leave zeros — do not fall back to demo numbers under a live badge.
      }
    }

    let programmeIndicators = base.programmeIndicators;
    let programmeLive = false;
    try {
      programmeIndicators = await getProgrammeIndicators("ministry_viewer");
      programmeLive = true;
    } catch {
      // keep illustrative indicators only when nothing else is live
    }

    const hasLiveSignal =
      activeMediators > 0 ||
      mythsChecked > 0 ||
      lessonsCompleted > 0 ||
      emergenciesEscalated > 0 ||
      openOpsCases > 0;

    return {
      source: hasLiveSignal ? "live" : "illustrative",
      languages: LOCALES.length,
      activeMediators,
      mythsChecked,
      emergenciesEscalated,
      lessonsCompleted,
      visitsThisYear: aggregatesAreLive
        ? visitsThisYear
        : hasLiveSignal
          ? 0
          : base.visitsThisYear,
      gpEnrollmentsFacilitated: aggregatesAreLive
        ? gpEnrollmentsFacilitated
        : hasLiveSignal
          ? 0
          : base.gpEnrollmentsFacilitated,
      countiesReporting: aggregatesAreLive
        ? countiesReporting
        : hasLiveSignal
          ? 0
          : base.countiesReporting,
      openOpsCases,
      programmeIndicators: programmeLive || !hasLiveSignal
        ? programmeIndicators
        : base.programmeIndicators.map((p) => ({ ...p, value: 0 })),
      countySnapshots: aggregatesAreLive
        ? countySnapshots
        : hasLiveSignal
          ? countySnapshots
          : base.countySnapshots,
    };
  } catch {
    return base;
  }
}

/** Bound DB wait so static locale builds cannot hang the deploy. */
export async function getImpactStats(): Promise<ImpactStats> {
  const base = illustrativeBase();
  try {
    return await Promise.race([
      getImpactStatsLive(),
      new Promise<ImpactStats>((resolve) => {
        setTimeout(() => resolve(base), 4000);
      }),
    ]);
  } catch {
    return base;
  }
}

/** Format large numbers for display (e.g. 12400 → "12.4k"). */
export function formatImpactNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}
