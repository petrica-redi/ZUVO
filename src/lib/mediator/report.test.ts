import { describe, expect, it } from "vitest";
import { buildMediatorReportHtml, type MediatorReportLabels } from "./report";
import type { MediatorWorkspacePayload } from "./types";

const LABELS: MediatorReportLabels = {
  title: "Raport mediator",
  generatedAt: "Generat la",
  county: "Județ",
  casesSection: "Cazuri",
  visitsSection: "Vizite",
  sessionsSection: "Sesiuni",
  noCases: "Niciun caz",
  noVisits: "Nicio vizită",
  noSessions: "Nicio sesiune",
  beneficiary: "Beneficiar",
  status: "Stadiu",
  category: "Domeniu",
  notes: "Notițe",
  date: "Data",
  topic: "Temă",
  location: "Loc",
  attendees: "Participanți",
};

function emptyPayload(): MediatorWorkspacePayload {
  return { version: 1, cases: [], visits: [], sessions: [] };
}

describe("buildMediatorReportHtml", () => {
  it("renders empty-state messages when there is no data", () => {
    const html = buildMediatorReportHtml(emptyPayload(), LABELS, "Bistrița-Năsăud", "ro");
    expect(html).toContain("Niciun caz");
    expect(html).toContain("Nicio vizită");
    expect(html).toContain("Nicio sesiune");
    expect(html).toContain("Bistrița-Năsăud");
  });

  it("escapes HTML in user data", () => {
    const payload: MediatorWorkspacePayload = {
      version: 1,
      cases: [
        {
          id: "c1",
          name: "<script>alert('x')</script>",
          category: "health",
          status: "plan",
          notes: "a & b",
          nextVisit: "",
          createdAt: "2026-05-26T00:00:00.000Z",
          updatedAt: "2026-05-26T00:00:00.000Z",
        },
      ],
      visits: [],
      sessions: [],
    };
    const html = buildMediatorReportHtml(payload, LABELS, "Cluj", "ro");
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("a &amp; b");
  });

  it("renders rows for each section", () => {
    const payload: MediatorWorkspacePayload = {
      version: 1,
      cases: [
        {
          id: "c",
          name: "Familia X",
          category: "health",
          status: "monitoring",
          notes: "n",
          nextVisit: "",
          createdAt: "2026-05-26T00:00:00.000Z",
          updatedAt: "2026-05-26T00:00:00.000Z",
        },
      ],
      visits: [
        { id: "v", memberName: "Y", notes: "z", visitDate: "2026-05-26T00:00:00.000Z" },
      ],
      sessions: [
        {
          id: "s",
          title: "Vaccinuri",
          topic: "imunizare",
          location: "școală",
          attendees: "12",
          notes: "",
          sessionDate: "2026-05-26T00:00:00.000Z",
        },
      ],
    };
    const html = buildMediatorReportHtml(payload, LABELS, "Bistrița-Năsăud", "ro");
    expect(html).toContain("Familia X");
    expect(html).toContain("Vaccinuri");
    expect(html).toContain("imunizare");
    expect(html).toContain("școală");
  });
});
