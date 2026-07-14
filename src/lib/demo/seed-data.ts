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

export const DEMO_IMPACT_STATS = {
  activeMediators: 42,
  mythsChecked: 1284,
  emergenciesEscalated: 37,
  lessonsCompleted: 3180,
  visitsThisYear: 1205,
  gpEnrollmentsFacilitated: 186,
  countiesReporting: 6,
} as const;

export const DEMO_COUNTY_SNAPSHOTS = [
  { county: "București", mediators: 14, visits: 438, referrals: 82, trend: 12 },
  { county: "Teleorman", mediators: 8, visits: 246, referrals: 51, trend: 18 },
  { county: "Dolj", mediators: 7, visits: 196, referrals: 43, trend: 9 },
  { county: "Cluj", mediators: 5, visits: 128, referrals: 28, trend: 15 },
  { county: "Iași", mediators: 4, visits: 104, referrals: 22, trend: 7 },
  { county: "Timiș", mediators: 4, visits: 93, referrals: 19, trend: 11 },
] as const;

/** Pseudonymised tele-health queue for clinician persona. */
export const DEMO_DOCTOR_QUEUE = [
  {
    id: "ref-1",
    ref: "Case #A-1042",
    summary: "Fever 38.5°C · child · rural Teleorman",
    severity: "amber" as const,
    age: "7 years",
    received: "12 min ago",
    source: "Roma health mediator",
    context: "Fever for 24 hours, drinking fluids, no breathing difficulty. Paracetamol given once.",
    action: "Same-day clinical review. Continue fluids and monitor temperature.",
  },
  {
    id: "ref-2",
    ref: "Case #B-0887",
    summary: "Prenatal referral · no insurance · Bucharest",
    severity: "green" as const,
    age: "29 years",
    received: "34 min ago",
    source: "Mobile outreach team",
    context: "Estimated 18 weeks pregnant. No current warning signs. Needs prenatal registration pathway.",
    action: "Route to partner maternity clinic and insurance navigation support.",
  },
  {
    id: "ref-3",
    ref: "Case #C-1203",
    summary: "Chest pain + breathlessness · red-flag triage",
    severity: "red" as const,
    age: "58 years",
    received: "Escalated 3 min ago",
    source: "Community companion",
    context: "Sudden chest pressure and shortness of breath. Deterministic red-flag rules activated.",
    action: "112 escalation initiated. Clinician follow-up after emergency handover.",
  },
];
