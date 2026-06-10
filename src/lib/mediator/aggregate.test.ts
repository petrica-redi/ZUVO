import { describe, expect, it } from "vitest";
import { aggregateByCounty, aggregateNational } from "./aggregate";
import type { WorkspaceRow } from "./aggregate";

const NOW = new Date().toISOString();

function row(
  workspaceId: string,
  countyCode: string,
  cases: Parameters<typeof makePayload>[0] = [],
): WorkspaceRow {
  return {
    workspaceId,
    countyCode,
    payload: makePayload(cases),
    updatedAt: new Date(NOW),
  };
}

function makePayload(
  cases: {
    householdSize?: number;
    healthFacilitations?: ("vaccinationFacilitated" | "aslEnrollment")[];
  }[] = [],
) {
  return {
    version: 1 as const,
    cases: cases.map((c, i) => ({
      id: `c${i}`,
      name: `Case ${i}`,
      category: "health" as const,
      status: "monitoring" as const,
      notes: "",
      nextVisit: "",
      createdAt: NOW,
      updatedAt: NOW,
      householdSize: c.householdSize,
      healthFacilitations: c.healthFacilitations,
    })),
    visits: [],
    sessions: [],
    training: [],
  };
}

describe("aggregateByCounty", () => {
  it("sums indicators for a single county", () => {
    const rows = [
      row("w1", "B", [{ householdSize: 2, healthFacilitations: ["vaccinationFacilitated"] }]),
      row("w2", "B", [{ householdSize: 4, healthFacilitations: ["aslEnrollment"] }]),
      row("w3", "CJ", [{ householdSize: 1 }]),
    ];

    const agg = aggregateByCounty(rows, "b");
    expect(agg.countyCode).toBe("B");
    expect(agg.workspaceCount).toBe(2);
    expect(agg.uniquePeopleEstimate).toBe(2);
    expect(agg.households).toBe(6);
    expect(agg.facilitations.vaccinationFacilitated).toBe(1);
    expect(agg.facilitations.aslEnrollment).toBe(1);
  });
});

describe("aggregateNational", () => {
  it("returns one aggregate per county code present", () => {
    const rows = [
      row("w1", "B", [{ householdSize: 2 }]),
      row("w2", "CJ", [{ householdSize: 3 }]),
      row("w3", "cj", [{ householdSize: 1 }]),
    ];

    const national = aggregateNational(rows);
    expect(national).toHaveLength(2);
    expect(national.map((a) => a.countyCode).sort()).toEqual(["B", "CJ"]);
    const cj = national.find((a) => a.countyCode === "CJ");
    expect(cj?.workspaceCount).toBe(2);
    expect(cj?.households).toBe(4);
  });
});
