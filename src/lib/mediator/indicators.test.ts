import { describe, expect, it } from "vitest";
import {
  computeIndicators,
  healthFacilitationCounts,
  sessionsByTheme,
  summarizeCases,
  vulnerabilityCounts,
} from "./indicators";
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

describe("summarizeCases", () => {
  it("counts open vs closed cases", () => {
    const payload = basePayload();
    payload.cases = [
      {
        id: "a",
        name: "A",
        category: "health",
        status: "plan",
        notes: "",
        nextVisit: "",
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "b",
        name: "B",
        category: "social",
        status: "closed",
        notes: "",
        nextVisit: "",
        createdAt: NOW,
        updatedAt: NOW,
      },
    ];
    const totals = summarizeCases(payload);
    expect(totals.total).toBe(2);
    expect(totals.open).toBe(1);
    expect(totals.closed).toBe(1);
    expect(totals.byStatus.plan).toBe(1);
    expect(totals.byCategory.health).toBe(1);
  });
});

describe("healthFacilitationCounts", () => {
  it("aggregates facilitation flags across cases", () => {
    const payload = basePayload();
    payload.cases = [
      {
        id: "a",
        name: "A",
        category: "health",
        status: "plan",
        notes: "",
        nextVisit: "",
        createdAt: NOW,
        updatedAt: NOW,
        healthFacilitations: ["vaccinationFacilitated", "screeningReferral"],
      },
      {
        id: "b",
        name: "B",
        category: "health",
        status: "monitoring",
        notes: "",
        nextVisit: "",
        createdAt: NOW,
        updatedAt: NOW,
        healthFacilitations: ["vaccinationFacilitated"],
      },
    ];
    const counts = healthFacilitationCounts(payload);
    expect(counts.vaccinationFacilitated).toBe(2);
    expect(counts.screeningReferral).toBe(1);
    expect(counts.gpEnrollment).toBe(0);
  });
});

describe("vulnerabilityCounts", () => {
  it("aggregates vulnerability tags", () => {
    const payload = basePayload();
    payload.cases = [
      {
        id: "a",
        name: "A",
        category: "social",
        status: "plan",
        notes: "",
        nextVisit: "",
        createdAt: NOW,
        updatedAt: NOW,
        vulnerabilities: ["pregnant", "noInsurance"],
      },
    ];
    expect(vulnerabilityCounts(payload).pregnant).toBe(1);
    expect(vulnerabilityCounts(payload).noInsurance).toBe(1);
    expect(vulnerabilityCounts(payload).elderly).toBe(0);
  });
});

describe("sessionsByTheme", () => {
  it("defaults missing theme to 'other'", () => {
    const payload = basePayload();
    payload.sessions = [
      {
        id: "s1",
        title: "Vaccinare",
        topic: "",
        location: "",
        attendees: "10",
        notes: "",
        sessionDate: NOW,
        theme: "vaccination",
      },
      {
        id: "s2",
        title: "Întâlnire generală",
        topic: "",
        location: "",
        attendees: "5",
        notes: "",
        sessionDate: NOW,
      },
    ];
    const themes = sessionsByTheme(payload);
    expect(themes.vaccination).toBe(1);
    expect(themes.other).toBe(1);
  });
});

describe("computeIndicators", () => {
  it("returns a consolidated snapshot", () => {
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
        householdSize: 4,
        healthFacilitations: ["vaccinationFacilitated"],
        vulnerabilities: ["pregnant"],
      },
    ];
    payload.visits = [
      { id: "v", memberName: "Familia X", notes: "", visitDate: NOW },
    ];
    payload.sessions = [
      {
        id: "s",
        title: "Sesiune",
        topic: "",
        location: "",
        attendees: "12",
        notes: "",
        sessionDate: NOW,
        theme: "vaccination",
      },
    ];

    const out = computeIndicators(payload);
    expect(out.uniquePeople).toBe(1);
    expect(out.households).toBe(4);
    expect(out.cases.open).toBe(1);
    expect(out.visitsThisMonth).toBe(1);
    expect(out.sessionsThisMonth).toBe(1);
    expect(out.sessionAttendeesThisYear).toBe(12);
    expect(out.facilitations.vaccinationFacilitated).toBe(1);
    expect(out.vulnerabilities.pregnant).toBe(1);
    expect(out.sessionsByTheme.vaccination).toBe(1);
  });
});
