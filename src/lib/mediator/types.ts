/**
 * Domain types for the mediator field workspace.
 *
 * Aligned with POIDS / SCI 2000 (Servicii Comunitare Integrate) reporting
 * requirements as set out by Ministerul Sănătății, ANPIS and UJSS:
 *
 *   - Case categories cover health, social, education, and rights so the
 *     same record can be reported by AMC, AS, or consilier școlar.
 *   - Health facilitation flags map directly to POIDS indicators
 *     (vaccination, prenatal care, screenings, chronic disease management).
 *   - Vulnerability tags map to POIDS target groups.
 *   - Session themes map to POIDS health-promotion priorities.
 *
 * Schema evolves additively: every new field is optional, so older devices
 * continue to sync without a server-side migration.
 */

import { z } from "zod";

export const CASE_CATEGORIES = ["health", "social", "education", "rights"] as const;
export const CASE_STATUSES = [
  "identified",
  "assessment",
  "plan",
  "monitoring",
  "closed",
] as const;

export type CaseCategory = (typeof CASE_CATEGORIES)[number];
export type CaseStatus = (typeof CASE_STATUSES)[number];

/** POIDS target-group tags that may apply to a beneficiary. */
export const VULNERABILITY_TAGS = [
  "child",
  "schoolDropoutRisk",
  "pregnant",
  "singleParent",
  "minVeniturGarantat",
  "elderly",
  "disability",
  "romaCommunity",
  "noInsurance",
  "noDocuments",
  "domesticViolence",
] as const;
export type VulnerabilityTag = (typeof VULNERABILITY_TAGS)[number];

/**
 * Health facilitation flags — counted as POIDS health indicators when the
 * mediator records that they helped a beneficiary access or comply with the
 * relevant service.
 */
export const HEALTH_FACILITATIONS = [
  "vaccinationFacilitated",
  "prenatalFacilitated",
  "screeningReferral",
  "chronicMonitoring",
  "tbCommunicableScreening",
  "gpEnrollment",
  "insuranceEnrollment",
] as const;
export type HealthFacilitation = (typeof HEALTH_FACILITATIONS)[number];

/** Themes used by information sessions, aligned with Min. Sănătății priorities. */
export const SESSION_THEMES = [
  "vaccination",
  "maternalChild",
  "nutrition",
  "hygiene",
  "tbCommunicable",
  "chronicDisease",
  "screening",
  "mentalHealth",
  "addiction",
  "rights",
  "prevention",
  "other",
] as const;
export type SessionTheme = (typeof SESSION_THEMES)[number];

export type MediatorVisit = {
  id: string;
  memberName: string;
  notes: string;
  visitDate: string;
};

export type MediatorCase = {
  id: string;
  name: string;
  category: CaseCategory;
  status: CaseStatus;
  notes: string;
  nextVisit: string;
  createdAt: string;
  updatedAt: string;
  /** Optional household size (POIDS reporting). */
  householdSize?: number;
  /** Vulnerability tags applicable to the case. */
  vulnerabilities?: VulnerabilityTag[];
  /** Health facilitation flags recorded for this case. */
  healthFacilitations?: HealthFacilitation[];
};

export type MediatorSession = {
  id: string;
  title: string;
  topic: string;
  location: string;
  attendees: string;
  notes: string;
  sessionDate: string;
  /** Theme tag for POIDS reporting. Falls back to `"other"` when absent. */
  theme?: SessionTheme;
};

/** Marks a training module as completed by the mediator. */
export type TrainingProgress = {
  moduleId: string;
  completedAt: string;
};

export type MediatorWorkspacePayload = {
  version: 1;
  cases: MediatorCase[];
  visits: MediatorVisit[];
  sessions: MediatorSession[];
  training?: TrainingProgress[];
};

export const EMPTY_WORKSPACE: MediatorWorkspacePayload = {
  version: 1,
  cases: [],
  visits: [],
  sessions: [],
  training: [],
};

// ── Zod schemas (used by the workspace API) ────────────────────────────────

const isoDate = z.string().min(1);

const caseCategorySchema = z.enum(CASE_CATEGORIES);
const caseStatusSchema = z.enum(CASE_STATUSES);
const vulnerabilitySchema = z.enum(VULNERABILITY_TAGS);
const healthFacilitationSchema = z.enum(HEALTH_FACILITATIONS);
const sessionThemeSchema = z.enum(SESSION_THEMES);

export const mediatorVisitSchema: z.ZodType<MediatorVisit> = z.object({
  id: z.string().min(1).max(64),
  memberName: z.string().max(160).default(""),
  notes: z.string().max(4000).default(""),
  visitDate: isoDate,
});

export const mediatorCaseSchema: z.ZodType<MediatorCase> = z.object({
  id: z.string().min(1).max(64),
  name: z.string().max(160).default(""),
  category: caseCategorySchema,
  status: caseStatusSchema,
  notes: z.string().max(4000).default(""),
  nextVisit: z.string().max(40).default(""),
  createdAt: isoDate,
  updatedAt: isoDate,
  householdSize: z.number().int().min(0).max(50).optional(),
  vulnerabilities: z.array(vulnerabilitySchema).optional(),
  healthFacilitations: z.array(healthFacilitationSchema).optional(),
});

export const mediatorSessionSchema: z.ZodType<MediatorSession> = z.object({
  id: z.string().min(1).max(64),
  title: z.string().max(160).default(""),
  topic: z.string().max(160).default(""),
  location: z.string().max(200).default(""),
  attendees: z.string().max(40).default(""),
  notes: z.string().max(4000).default(""),
  sessionDate: isoDate,
  theme: sessionThemeSchema.optional(),
});

export const trainingProgressSchema: z.ZodType<TrainingProgress> = z.object({
  moduleId: z.string().min(1).max(80),
  completedAt: isoDate,
});

export const mediatorWorkspacePayloadSchema: z.ZodType<MediatorWorkspacePayload> =
  z.object({
    version: z.literal(1),
    cases: z.array(mediatorCaseSchema).default([]),
    visits: z.array(mediatorVisitSchema).default([]),
    sessions: z.array(mediatorSessionSchema).default([]),
    training: z.array(trainingProgressSchema).optional(),
  });
