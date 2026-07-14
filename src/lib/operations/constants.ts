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
