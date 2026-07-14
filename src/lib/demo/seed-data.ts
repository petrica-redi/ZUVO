import type { MediatorWorkspacePayload } from "@/lib/mediator/types";

/**
 * Anonymized demo workspace for stakeholder presentations.
 * Names are pseudonyms — no real beneficiary identifiers.
 */
export const DEMO_MEDIATOR_WORKSPACE: MediatorWorkspacePayload = {
  version: 1,
  cases: [
    {
      id: "demo-case-1",
      name: "Beneficiary A.",
      category: "health",
      status: "monitoring",
      notes: "Vaccination catch-up facilitated. Household of 4 in rural commune.",
      nextVisit: "2026-07-28",
      createdAt: "2026-06-01T10:00:00.000Z",
      updatedAt: "2026-07-10T14:30:00.000Z",
      householdSize: 4,
      vulnerabilities: ["romaCommunity", "noInsurance", "child"],
      healthFacilitations: ["vaccinationFacilitated", "gpEnrollment"],
    },
    {
      id: "demo-case-2",
      name: "Beneficiary B.",
      category: "social",
      status: "plan",
      notes: "STP/ENI pathway guidance for Italy relocation. Documents pending.",
      nextVisit: "2026-08-05",
      createdAt: "2026-05-15T09:00:00.000Z",
      updatedAt: "2026-07-12T11:00:00.000Z",
      householdSize: 2,
      vulnerabilities: ["noDocuments", "singleParent"],
      healthFacilitations: ["insuranceEnrollment"],
    },
    {
      id: "demo-case-3",
      name: "Beneficiary C.",
      category: "education",
      status: "assessment",
      notes: "School enrollment support. MMR vaccination myth debunked in session.",
      nextVisit: "2026-07-20",
      createdAt: "2026-07-01T08:00:00.000Z",
      updatedAt: "2026-07-13T16:00:00.000Z",
      householdSize: 5,
      vulnerabilities: ["schoolDropoutRisk", "romaCommunity"],
      healthFacilitations: ["screeningReferral"],
    },
  ],
  visits: [
    {
      id: "demo-visit-1",
      memberName: "A.F.",
      notes: "Home visit — prenatal care referral completed.",
      visitDate: "2026-07-08",
    },
    {
      id: "demo-visit-2",
      memberName: "M.K.",
      notes: "Community session follow-up. Insurance enrollment started.",
      visitDate: "2026-07-11",
    },
  ],
  sessions: [
    {
      id: "demo-session-1",
      title: "Vaccination myths workshop",
      topic: "vaccination",
      location: "Community centre — Sector 4",
      attendees: "24",
      notes: "Debunked autism myth. 6 families scheduled catch-up vaccines.",
      sessionDate: "2026-07-05",
      theme: "vaccination",
    },
    {
      id: "demo-session-2",
      title: "Rights & access briefing",
      topic: "rights",
      location: "Rural outreach — Teleorman",
      attendees: "18",
      notes: "Explained GP enrollment without full documentation.",
      sessionDate: "2026-06-28",
      theme: "rights",
    },
  ],
  training: [
    { moduleId: "poids-basics", completedAt: "2026-05-01T12:00:00.000Z" },
    { moduleId: "gdpr-field", completedAt: "2026-06-15T12:00:00.000Z" },
  ],
};

export const DEMO_COUNTY = "B";

/** Pseudonymised tele-health queue for clinician persona (Dawa tele-health model). */
export const DEMO_DOCTOR_QUEUE = [
  {
    id: "ref-1",
    ref: "Case #A-1042",
    summary: "Fever 38.5°C · child · rural Teleorman",
    severity: "amber" as const,
  },
  {
    id: "ref-2",
    ref: "Case #B-0887",
    summary: "Prenatal referral · no insurance · Bucharest",
    severity: "green" as const,
  },
  {
    id: "ref-3",
    ref: "Case #C-1203",
    summary: "Chest pain + breathlessness · red-flag triage",
    severity: "red" as const,
  },
];
