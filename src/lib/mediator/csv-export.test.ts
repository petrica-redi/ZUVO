import { describe, expect, it } from "vitest";
import { buildPoidsCsv } from "./csv-export";
import type { MediatorWorkspacePayload } from "./types";

const NOW = new Date().toISOString();

function basePayload(): MediatorWorkspacePayload {
  return {
    version: 1,
    cases: [],
    visits: [],
    sessions: [],
    training: [],
  };
}

describe("buildPoidsCsv", () => {
  it("includes KPI metrics and facilitation rows", () => {
    const payload = basePayload();
    payload.cases = [
      {
        id: "a",
        name: "Familia X",
        category: "health",
        status: "monitoring",
        notes: "",
        nextVisit: "",
        createdAt: NOW,
        updatedAt: NOW,
        householdSize: 3,
        healthFacilitations: ["vaccinationFacilitated", "aslEnrollment"],
        vulnerabilities: ["noDocuments"],
      },
    ];
    payload.visits = [
      { id: "v", memberName: "Familia X", notes: "", visitDate: NOW },
    ];

    const csv = buildPoidsCsv(payload, {
      countyCode: "B",
      workspaceId: "ws-123",
      generatedAt: "2026-06-10T12:00:00.000Z",
      mediatorLabel: "AMC Test",
    });

    expect(csv).toContain("county_code,B");
    expect(csv).toContain("workspace_id,ws-123");
    expect(csv).toContain("unique_people,1");
    expect(csv).toContain("households,3");
    expect(csv).toContain("vaccinationFacilitated,1");
    expect(csv).toContain("aslEnrollment,1");
    expect(csv).toContain("noDocuments,1");
  });

  it("escapes commas in metadata", () => {
    const csv = buildPoidsCsv(basePayload(), {
      countyCode: "CJ",
      workspaceId: "ws-1",
      generatedAt: "2026-06-10T12:00:00.000Z",
      mediatorLabel: 'Mediator, "field"',
    });

    expect(csv).toContain('"Mediator, ""field"""');
  });
});
