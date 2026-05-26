/**
 * Single source of truth for every translation key consumed by the mediator
 * workspace UI. Keep this list in sync with `messages/*.json` `mediator.*`.
 */

export const MEDIATOR_LABEL_KEYS = [
  "title",
  "subtitle",
  "ecHint",
  "accessCodePlaceholder",
  "accessCodeHint",
  "accessCodeError",
  "accessCodeSubmit",
  "tabDashboard",
  "tabCases",
  "tabSessions",
  "tabTools",
  "communityMembers",
  "logsThisMonth",
  "openCases",
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
  "sessionsTitle",
  "noSessions",
  "sessionTitle",
  "sessionTopic",
  "sessionLocation",
  "sessionAttendees",
  "sessionNotes",
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
  "reportTitle",
  "reportGenerated",
] as const;

export type MediatorLabelKey = (typeof MEDIATOR_LABEL_KEYS)[number];
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
