import { describe, expect, it } from "vitest";
import {
  buildNavigationSummary,
  buildSharedPayload,
  canAccessSharedPayload,
  canRequestHandover,
  canShareNavigationData,
  redactHandoverForViewer,
} from "./handover-consent";
import type { NavigationCase } from "./types";

const sampleCase: NavigationCase = {
  id: "case-1",
  caseNumber: "RO-2026-0001",
  beneficiaryPseudonym: "B-42",
  countryCode: "RO",
  municipalityCode: "B",
  preferredLanguage: "ro",
  contactMethod: "phone",
  consentStatus: "granted",
  source: "mediator_dashboard",
  categorySlug: "cross_border",
  mainProblem: "Needs GP registration in Italy",
  urgency: "priority",
  status: "action_required",
  nextAction: "operations.nextActionFindProvider",
  notes: "Beneficiary moving to Milan next month",
  barriers: ["cross_border", "language"],
  openedAt: "2026-07-01T10:00:00.000Z",
  updatedAt: "2026-07-14T10:00:00.000Z",
};

describe("handover consent boundary", () => {
  it("blocks navigation data share without consent", () => {
    expect(canShareNavigationData("pending")).toBe(false);
    expect(canShareNavigationData("withdrawn")).toBe(false);
    expect(canShareNavigationData("granted")).toBe(true);
  });

  it("blocks handover request without consent", () => {
    expect(canRequestHandover("pending")).toBe(false);
    expect(canRequestHandover("granted")).toBe(true);
  });

  it("builds minimum necessary navigation summary without contact details", () => {
    const summary = buildNavigationSummary(sampleCase);
    expect(summary.beneficiaryPseudonym).toBe("B-42");
    expect(summary.categorySlug).toBe("cross_border");
    expect(summary.barriers).toContain("cross_border");
    expect("contactMethod" in summary).toBe(false);
    expect("notesSummary" in summary).toBe(false);
  });

  it("includes contact in shared payload only after consent path", () => {
    const payload = buildSharedPayload(sampleCase);
    expect(payload.contactMethod).toBe("phone");
    expect(payload.notesSummary).toContain("Milan");
  });

  it("redacts navigation data for destination viewer when consent pending", () => {
    const redacted = redactHandoverForViewer(
      {
        consentStatus: "pending",
        status: "consent_pending",
        navigationSummary: buildNavigationSummary(sampleCase),
        sharedPayload: buildSharedPayload(sampleCase),
        originWorkspaceId: "ws-origin",
        destinationWorkspaceId: "ws-dest",
      },
      "ws-dest",
      false,
    );

    expect(redacted.navigationSummary).toBeNull();
    expect(redacted.sharedPayload).toBeNull();
    expect(redacted.viewerRole).toBe("destination");
  });

  it("allows origin team to see data after consent recorded", () => {
    const redacted = redactHandoverForViewer(
      {
        consentStatus: "granted",
        status: "requested",
        navigationSummary: buildNavigationSummary(sampleCase),
        sharedPayload: buildSharedPayload(sampleCase),
        originWorkspaceId: "ws-origin",
        destinationWorkspaceId: "ws-dest",
      },
      "ws-origin",
      false,
    );

    expect(redacted.navigationSummary?.beneficiaryPseudonym).toBe("B-42");
    expect(redacted.sharedPayload?.contactMethod).toBe("phone");
  });

  it("allows destination shared payload only after consent and requested status", () => {
    expect(
      canAccessSharedPayload(
        {
          consentStatus: "granted",
          status: "requested",
          navigationSummary: {},
          sharedPayload: buildSharedPayload(sampleCase),
          originWorkspaceId: "ws-origin",
          destinationWorkspaceId: "ws-dest",
        },
        "destination",
      ),
    ).toBe(true);

    expect(
      canAccessSharedPayload(
        {
          consentStatus: "pending",
          status: "requested",
          navigationSummary: {},
          sharedPayload: buildSharedPayload(sampleCase),
          originWorkspaceId: "ws-origin",
          destinationWorkspaceId: "ws-dest",
        },
        "destination",
      ),
    ).toBe(false);

    expect(
      canAccessSharedPayload(
        {
          consentStatus: "granted",
          status: "consent_pending",
          navigationSummary: {},
          sharedPayload: buildSharedPayload(sampleCase),
          originWorkspaceId: "ws-origin",
          destinationWorkspaceId: "ws-dest",
        },
        "destination",
      ),
    ).toBe(false);
  });
});
