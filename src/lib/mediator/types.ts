/**
 * Domain types for the mediator field workspace.
 *
 * The shape is intentionally permissive at the storage layer so we can evolve
 * the payload (add fields, optional metadata) without forcing migrations on
 * offline devices. UI code should narrow to these types when reading.
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
};

export type MediatorSession = {
  id: string;
  title: string;
  topic: string;
  location: string;
  attendees: string;
  notes: string;
  sessionDate: string;
};

export type MediatorWorkspacePayload = {
  version: 1;
  cases: MediatorCase[];
  visits: MediatorVisit[];
  sessions: MediatorSession[];
};

export const EMPTY_WORKSPACE: MediatorWorkspacePayload = {
  version: 1,
  cases: [],
  visits: [],
  sessions: [],
};

// ── Zod schemas (used by the workspace API) ────────────────────────────────

const isoDate = z.string().min(1);

const caseCategorySchema = z.enum(CASE_CATEGORIES);
const caseStatusSchema = z.enum(CASE_STATUSES);

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
});

export const mediatorSessionSchema: z.ZodType<MediatorSession> = z.object({
  id: z.string().min(1).max(64),
  title: z.string().max(160).default(""),
  topic: z.string().max(160).default(""),
  location: z.string().max(200).default(""),
  attendees: z.string().max(40).default(""),
  notes: z.string().max(4000).default(""),
  sessionDate: isoDate,
});

export const mediatorWorkspacePayloadSchema: z.ZodType<MediatorWorkspacePayload> =
  z.object({
    version: z.literal(1),
    cases: z.array(mediatorCaseSchema).default([]),
    visits: z.array(mediatorVisitSchema).default([]),
    sessions: z.array(mediatorSessionSchema).default([]),
  });
