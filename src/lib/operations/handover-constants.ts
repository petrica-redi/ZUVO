/** Cross-border handover workflow constants. */

export const HANDOVER_STATUSES = [
  "consent_pending",
  "requested",
  "accepted",
  "rejected",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type HandoverStatus = (typeof HANDOVER_STATUSES)[number];

export const HANDOVER_CONSENT_STATUSES = ["pending", "granted", "withdrawn"] as const;

export type HandoverConsentStatus = (typeof HANDOVER_CONSENT_STATUSES)[number];

export const HANDOVER_EVENT_TYPES = [
  "created",
  "consent_recorded",
  "consent_withdrawn",
  "requested",
  "accepted",
  "rejected",
  "data_shared",
  "completed",
  "cancelled",
] as const;

export type HandoverEventType = (typeof HANDOVER_EVENT_TYPES)[number];

export const HANDOVER_STATUS_LABEL_KEYS: Record<HandoverStatus, string> = {
  consent_pending: "operations.handoverStatusConsentPending",
  requested: "operations.handoverStatusRequested",
  accepted: "operations.handoverStatusAccepted",
  rejected: "operations.handoverStatusRejected",
  in_progress: "operations.handoverStatusInProgress",
  completed: "operations.handoverStatusCompleted",
  cancelled: "operations.handoverStatusCancelled",
};

export const GUIDANCE_TOPIC_SLUGS = [
  "insurance_entitlement",
  "gp_registration",
  "emergency_access",
  "documents",
  "language_support",
  "cross_border_handover",
] as const;

export type GuidanceTopicSlug = (typeof GUIDANCE_TOPIC_SLUGS)[number];
