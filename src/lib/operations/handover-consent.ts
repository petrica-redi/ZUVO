/**
 * Consent boundary for cross-border data sharing.
 * Minimum necessary navigation info is defined here — never clinical records.
 */

import type { HandoverConsentStatus } from "./handover-constants";
import type { NavigationCase } from "./types";

/** Fields safe to share after consent — navigation only, not clinical. */
export type NavigationSummary = {
  caseNumber: string;
  beneficiaryPseudonym: string;
  categorySlug: string;
  mainProblem: string;
  urgency: string;
  preferredLanguage: string;
  countryCode: string;
  municipalityCode?: string;
  barriers: string[];
  nextAction?: string;
  barrierNotes?: string;
};

/** Extended payload shared only when consent is granted and handover is active. */
export type SharedHandoverPayload = NavigationSummary & {
  contactMethod?: string;
  notesSummary?: string;
};

export type HandoverVisibilityInput = {
  consentStatus: HandoverConsentStatus;
  status: string;
  navigationSummary: NavigationSummary | Record<string, unknown>;
  sharedPayload?: SharedHandoverPayload | Record<string, unknown> | null;
  originWorkspaceId: string;
  destinationWorkspaceId?: string | null;
};

export type HandoverViewerRole = "origin" | "destination" | "admin";

export function buildNavigationSummary(navCase: NavigationCase): NavigationSummary {
  return {
    caseNumber: navCase.caseNumber,
    beneficiaryPseudonym: navCase.beneficiaryPseudonym,
    categorySlug: navCase.categorySlug,
    mainProblem: navCase.mainProblem,
    urgency: navCase.urgency,
    preferredLanguage: navCase.preferredLanguage,
    countryCode: navCase.countryCode,
    municipalityCode: navCase.municipalityCode,
    barriers: navCase.barriers,
    nextAction: navCase.nextAction,
    barrierNotes: navCase.barrierNotes,
  };
}

export function buildSharedPayload(navCase: NavigationCase): SharedHandoverPayload {
  return {
    ...buildNavigationSummary(navCase),
    contactMethod: navCase.contactMethod,
    notesSummary: navCase.notes?.slice(0, 500),
  };
}

export function isConsentGranted(consentStatus: HandoverConsentStatus): boolean {
  return consentStatus === "granted";
}

export function canRequestHandover(consentStatus: HandoverConsentStatus): boolean {
  return consentStatus === "granted";
}

export function canShareNavigationData(consentStatus: HandoverConsentStatus): boolean {
  return consentStatus === "granted";
}

export function canAccessSharedPayload(
  handover: HandoverVisibilityInput,
  viewerRole: HandoverViewerRole,
): boolean {
  if (viewerRole === "admin" || viewerRole === "origin") {
    return isConsentGranted(handover.consentStatus);
  }
  if (!isConsentGranted(handover.consentStatus)) return false;
  if (!handover.destinationWorkspaceId) return false;
  return ["requested", "accepted", "in_progress", "completed"].includes(handover.status);
}

export function redactHandoverForViewer<T extends HandoverVisibilityInput>(
  handover: T,
  viewerWorkspaceId: string,
  isAdmin: boolean,
): T & {
  navigationSummary: NavigationSummary | null;
  sharedPayload: SharedHandoverPayload | null;
  viewerRole: HandoverViewerRole;
} {
  const viewerRole: HandoverViewerRole = isAdmin
    ? "admin"
    : handover.originWorkspaceId === viewerWorkspaceId
      ? "origin"
      : handover.destinationWorkspaceId === viewerWorkspaceId
        ? "destination"
        : "destination";

  const consentOk = canShareNavigationData(handover.consentStatus);
  const payloadOk = canAccessSharedPayload(handover, viewerRole);

  const navigationSummary = consentOk
    ? (handover.navigationSummary as NavigationSummary)
    : null;

  const sharedPayload =
    payloadOk && handover.sharedPayload
      ? (handover.sharedPayload as SharedHandoverPayload)
      : null;

  return {
    ...handover,
    navigationSummary,
    sharedPayload,
    viewerRole,
  };
}
