/**
 * Single source of truth for every translation key consumed by the mediator
 * workspace UI. Keep this list in sync with `messages/*.json` `mediator.*`.
 */

import {
  HEALTH_FACILITATIONS,
  SESSION_THEMES,
  VULNERABILITY_TAGS,
} from "@/lib/mediator/types";

const STATIC_KEYS = [
  "title",
  "subtitle",
  "ecHint",
  "tabDashboard",
  "tabNavigation",
  "tabTasks",
  "tabCases",
  "tabSessions",
  "tabIndicators",
  "tabTraining",
  "tabTools",
  "communityMembers",
  "logsThisMonth",
  "openCases",
  "urgentCases",
  "tasksDueToday",
  "overdueTasks",
  "sessionsThisMonth",
  "quickActions",
  "logVisit",
  "newCase",
  "newSession",
  "recentActivity",
  "noActivity",
  "memberName",
  "visitDate",
  "notes",
  "saveVisit",
  "visitSaved",
  "casesTitle",
  "noCases",
  "caseName",
  "caseCategory",
  "caseStatus",
  "caseNotes",
  "nextVisit",
  "saveCase",
  "caseSaved",
  "categoryHealth",
  "categorySocial",
  "categoryEducation",
  "categoryRights",
  "statusIdentified",
  "statusAssessment",
  "statusPlan",
  "statusMonitoring",
  "statusClosed",
  "householdSize",
  "vulnerabilityLabel",
  "healthFacilitationLabel",
  "sessionsTitle",
  "noSessions",
  "sessionTitle",
  "sessionTopic",
  "sessionLocation",
  "sessionAttendees",
  "sessionNotes",
  "sessionThemeLabel",
  "saveSession",
  "sessionSaved",
  "toolsTitle",
  "toolsScan",
  "toolsVaccines",
  "toolsRights",
  "toolsExplain",
  "toolsChat",
  "contactSupport",
  "contactUjssGeneric",
  "resources",
  "downloadGuide",
  "countyLabel",
  "countyPlaceholder",
  "syncIdle",
  "syncSyncing",
  "syncSynced",
  "syncOffline",
  "exportPrint",
  "exportDownload",
  "exportCsv",
  "reportTitle",
  "reportGenerated",
  "indicatorsTitle",
  "indicatorsHint",
  "indicatorsCoverage",
  "indicatorsActivity",
  "indicatorsHealthFacilitation",
  "indicatorsSessionsByTheme",
  "indicatorsVulnerability",
  "indicatorsUniquePeople",
  "indicatorsHouseholds",
  "indicatorsClosedCases",
  "indicatorsVisitsThisYear",
  "indicatorsAttendeesThisYear",
  "trainingTitle",
  "trainingSubtitle",
  "trainingProgress",
  "trainingMinutes",
  "trainingCompleted",
  "trainingMarkComplete",
  "trainingMarkIncomplete",
  "trainingTierFoundations",
  "trainingTierHealth",
  "trainingTierSocial",
  "trainingTierFieldwork",
  "reportKpiSection",
] as const;

type StaticKey = (typeof STATIC_KEYS)[number];
type VulnerabilityKey = `vuln_${(typeof VULNERABILITY_TAGS)[number]}`;
type FacilitationKey = `facilitation_${(typeof HEALTH_FACILITATIONS)[number]}`;
type SessionThemeKey = `sessionTheme_${(typeof SESSION_THEMES)[number]}`;

export type MediatorLabelKey =
  | StaticKey
  | VulnerabilityKey
  | FacilitationKey
  | SessionThemeKey;

export const MEDIATOR_LABEL_KEYS: readonly MediatorLabelKey[] = [
  ...STATIC_KEYS,
  ...VULNERABILITY_TAGS.map((v) => `vuln_${v}` as VulnerabilityKey),
  ...HEALTH_FACILITATIONS.map((f) => `facilitation_${f}` as FacilitationKey),
  ...SESSION_THEMES.map((t) => `sessionTheme_${t}` as SessionThemeKey),
];

export type MediatorLabels = Record<MediatorLabelKey, string>;

export type CaseCategoryKey =
  | "categoryHealth"
  | "categorySocial"
  | "categoryEducation"
  | "categoryRights";

export type CaseStatusKey =
  | "statusIdentified"
  | "statusAssessment"
  | "statusPlan"
  | "statusMonitoring"
  | "statusClosed";

export const CATEGORY_LABEL_KEYS: Record<string, CaseCategoryKey> = {
  health: "categoryHealth",
  social: "categorySocial",
  education: "categoryEducation",
  rights: "categoryRights",
};

export const STATUS_LABEL_KEYS: Record<string, CaseStatusKey> = {
  identified: "statusIdentified",
  assessment: "statusAssessment",
  plan: "statusPlan",
  monitoring: "statusMonitoring",
  closed: "statusClosed",
};
