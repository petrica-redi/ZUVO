/** Operational platform constants — case lifecycle, tasks, barriers. */

export const CASE_STATUSES = [
  "new",
  "consent_pending",
  "assessment",
  "action_required",
  "provider_search",
  "appointment_requested",
  "appointment_confirmed",
  "waiting_beneficiary",
  "waiting_provider",
  "referred",
  "follow_up",
  "completed",
  "closed_incomplete",
  "cancelled",
  "escalated",
] as const;

export type CaseStatus = (typeof CASE_STATUSES)[number];

export const CASE_URGENCIES = ["routine", "priority", "urgent", "emergency"] as const;
export type CaseUrgency = (typeof CASE_URGENCIES)[number];

export const CONSENT_STATUSES = ["pending", "granted", "withdrawn", "expired"] as const;
export type ConsentStatus = (typeof CONSENT_STATUSES)[number];

export const TASK_STATUSES = ["todo", "in_progress", "waiting", "blocked", "completed", "cancelled"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_TYPES = [
  "call_beneficiary",
  "obtain_consent",
  "check_entitlement",
  "find_provider",
  "call_clinic",
  "book_appointment",
  "send_reminder",
  "arrange_transport",
  "arrange_interpretation",
  "prepare_documents",
  "accompany_patient",
  "confirm_attendance",
  "obtain_referral_outcome",
  "schedule_followup",
  "close_case",
  "other",
] as const;

export type TaskType = (typeof TASK_TYPES)[number];

export const BARRIER_SLUGS = [
  "no_gp",
  "no_insurance",
  "missing_documents",
  "language",
  "digital_literacy",
  "transport",
  "childcare",
  "mobility",
  "financial",
  "discrimination",
  "fear_trust",
  "negative_experience",
  "missed_appointment",
  "unstable_housing",
  "cross_border",
  "no_phone_internet",
  "medication_understanding",
  "other",
] as const;

export type BarrierSlug = (typeof BARRIER_SLUGS)[number];

export const CATEGORY_SLUGS = [
  "gp_registration",
  "insurance_entitlement",
  "maternity",
  "child_health",
  "vaccination",
  "chronic_disease",
  "screening",
  "dental",
  "mental_health",
  "medication_access",
  "disability_support",
  "administrative_docs",
  "emergency_followup",
  "hospital_discharge",
  "cross_border",
  "other",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const INTAKE_HELP_TYPES = [
  "mediator_help",
  "callback",
  "book_appointment",
  "understand_result",
  "find_doctor",
  "insurance_help",
  "missed_appointment",
  "language_support",
] as const;

export type IntakeHelpType = (typeof INTAKE_HELP_TYPES)[number];

export const CASE_SOURCES = [
  "mediator_dashboard",
  "community_profile",
  "ai_assistant",
  "symptom_triage",
  "home_visit",
  "information_session",
  "external_referral",
  "intake_request",
] as const;

export type CaseSource = (typeof CASE_SOURCES)[number];

export const VERIFICATION_STATES = [
  "unverified",
  "pending",
  "verified",
  "expired",
  "suspended",
  "rejected",
] as const;

export type VerificationState = (typeof VERIFICATION_STATES)[number];

export const REFERRAL_STATUSES = [
  "draft",
  "sent",
  "acknowledged",
  "scheduled",
  "completed",
  "declined",
  "cancelled",
] as const;

export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];

export const APPOINTMENT_STATUSES = [
  "requested",
  "confirmed",
  "reminder_sent",
  "completed",
  "missed",
  "cancelled",
  "rescheduled",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const ATTENDANCE_OUTCOMES = [
  "attended",
  "missed",
  "partial",
  "rescheduled",
  "cancelled_provider",
  "cancelled_beneficiary",
  "no_show",
] as const;

export type AttendanceOutcome = (typeof ATTENDANCE_OUTCOMES)[number];

/** Maps case categories to preferred provider types for search ranking */
export const CATEGORY_PROVIDER_TYPES: Partial<Record<CategorySlug, string[]>> = {
  gp_registration: ["clinic", "mediator_office"],
  insurance_entitlement: ["mediator_office", "clinic"],
  maternity: ["maternity", "clinic", "hospital"],
  child_health: ["clinic", "hospital"],
  vaccination: ["clinic"],
  chronic_disease: ["clinic", "hospital"],
  screening: ["clinic", "hospital"],
  dental: ["dental", "clinic"],
  mental_health: ["mental_health", "clinic"],
  medication_access: ["pharmacy", "clinic"],
  disability_support: ["clinic", "hospital"],
  administrative_docs: ["mediator_office", "clinic"],
  emergency_followup: ["hospital", "emergency"],
  hospital_discharge: ["hospital", "clinic"],
  cross_border: ["mediator_office", "clinic"],
  other: ["clinic", "hospital", "mediator_office"],
};

export const STATUS_LABEL_KEYS: Record<CaseStatus, string> = {
  new: "operations.statusNew",
  consent_pending: "operations.statusConsentPending",
  assessment: "operations.statusAssessment",
  action_required: "operations.statusActionRequired",
  provider_search: "operations.statusProviderSearch",
  appointment_requested: "operations.statusApptRequested",
  appointment_confirmed: "operations.statusApptConfirmed",
  waiting_beneficiary: "operations.statusWaitingBeneficiary",
  waiting_provider: "operations.statusWaitingProvider",
  referred: "operations.statusReferred",
  follow_up: "operations.statusFollowUp",
  completed: "operations.statusCompleted",
  closed_incomplete: "operations.statusClosedIncomplete",
  cancelled: "operations.statusCancelled",
  escalated: "operations.statusEscalated",
};

export const URGENCY_LABEL_KEYS: Record<CaseUrgency, string> = {
  routine: "operations.urgencyRoutine",
  priority: "operations.urgencyPriority",
  urgent: "operations.urgencyUrgent",
  emergency: "operations.urgencyEmergency",
};

export const NOTIFICATION_TYPES = [
  "intake_routed",
  "intake_new",
  "missed_appointment",
  "escalation_created",
  "escalation_resolved",
  "task_assigned",
  "callback_due",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const ESCALATION_STATUSES = [
  "open",
  "acknowledged",
  "resolved",
  "dismissed",
] as const;

export type EscalationStatus = (typeof ESCALATION_STATUSES)[number];

export const INTAKE_STATUSES = [
  "new",
  "routed",
  "assigned",
  "converted",
  "closed",
] as const;

export type IntakeStatus = (typeof INTAKE_STATUSES)[number];

/** Structured case outcome types (Phase 4). */
export const OUTCOME_TYPES = [
  "gp_registered",
  "appointment_attended",
  "appointment_booked",
  "insurance_obtained",
  "vaccination_completed",
  "screening_completed",
  "referral_completed",
  "documents_obtained",
  "entitlement_confirmed",
  "other",
] as const;

export type OutcomeType = (typeof OUTCOME_TYPES)[number];

export const OUTCOME_STATUSES = ["pending", "achieved", "not_achieved", "unknown"] as const;
export type OutcomeStatus = (typeof OUTCOME_STATUSES)[number];

export const QUALITY_FLAG_TYPES = [
  "missing_outcome",
  "stale_case",
  "missing_consent",
  "duplicate_entry",
  "incomplete_barriers",
  "overdue_followup",
  "no_recent_contact",
] as const;

export type QualityFlagType = (typeof QUALITY_FLAG_TYPES)[number];

export const QUALITY_FLAG_STATUSES = ["open", "acknowledged", "resolved", "dismissed"] as const;
export type QualityFlagStatus = (typeof QUALITY_FLAG_STATUSES)[number];

export const QUALITY_SEVERITIES = ["info", "warning", "critical"] as const;
export type QualitySeverity = (typeof QUALITY_SEVERITIES)[number];

export const EXPORT_TYPES = [
  "outcomes_aggregate",
  "outcomes_workspace",
  "cases_workspace",
  "quality_report",
] as const;

export type ExportType = (typeof EXPORT_TYPES)[number];

export const EXPORT_SCOPES = ["workspace", "organisation", "national"] as const;
export type ExportScope = (typeof EXPORT_SCOPES)[number];

export const REPORTING_ROLES = [
  "admin",
  "supervisor",
  "mediator",
  "manager",
  "ministry_viewer",
] as const;

export type ReportingRole = (typeof REPORTING_ROLES)[number];

/** Programme indicators surfaced on the ministry impact dashboard. */
export const PROGRAMME_INDICATORS = [
  {
    slug: "gp_registered",
    outcomeType: "gp_registered" as OutcomeType,
    labelKey: "impact.indicatorGpRegistered",
    minThreshold: 5,
  },
  {
    slug: "appointment_attended",
    outcomeType: "appointment_attended" as OutcomeType,
    labelKey: "impact.indicatorAppointmentAttended",
    minThreshold: 5,
  },
  {
    slug: "insurance_obtained",
    outcomeType: "insurance_obtained" as OutcomeType,
    labelKey: "impact.indicatorInsuranceObtained",
    minThreshold: 5,
  },
  {
    slug: "vaccination_completed",
    outcomeType: "vaccination_completed" as OutcomeType,
    labelKey: "impact.indicatorVaccinationCompleted",
    minThreshold: 5,
  },
  {
    slug: "cases_completed",
    outcomeType: null,
    labelKey: "impact.indicatorCasesCompleted",
    minThreshold: 5,
  },
] as const;

export type ProgrammeIndicatorSlug = (typeof PROGRAMME_INDICATORS)[number]["slug"];

export const OUTCOME_LABEL_KEYS: Record<OutcomeType, string> = {
  gp_registered: "operations.outcomeGpRegistered",
  appointment_attended: "operations.outcomeAppointmentAttended",
  appointment_booked: "operations.outcomeAppointmentBooked",
  insurance_obtained: "operations.outcomeInsuranceObtained",
  vaccination_completed: "operations.outcomeVaccinationCompleted",
  screening_completed: "operations.outcomeScreeningCompleted",
  referral_completed: "operations.outcomeReferralCompleted",
  documents_obtained: "operations.outcomeDocumentsObtained",
  entitlement_confirmed: "operations.outcomeEntitlementConfirmed",
  other: "operations.outcomeOther",
};

export const QUALITY_FLAG_LABEL_KEYS: Record<QualityFlagType, string> = {
  missing_outcome: "operations.qualityMissingOutcome",
  stale_case: "operations.qualityStaleCase",
  missing_consent: "operations.qualityMissingConsent",
  duplicate_entry: "operations.qualityDuplicateEntry",
  incomplete_barriers: "operations.qualityIncompleteBarriers",
  overdue_followup: "operations.qualityOverdueFollowup",
  no_recent_contact: "operations.qualityNoRecentContact",
};
