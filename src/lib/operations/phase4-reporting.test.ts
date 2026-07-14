import { describe, expect, it } from "vitest";
import {
  applyIndicatorThreshold,
  canExportScope,
  canReadAggregates,
  ministryCannotSeePseudonym,
} from "./permissions";
import {
  exportIncludesIdentifiable,
  isExportAllowed,
} from "./export-service";
import { redactOutcomeExportRow } from "./outcome-service";

describe("Phase 4 export restrictions", () => {
  it("denies identifiable workspace exports for ministry viewers", () => {
    expect(isExportAllowed("ministry_viewer", { exportType: "cases_workspace" })).toBe(
      false,
    );
    expect(isExportAllowed("manager", { exportType: "outcomes_workspace" })).toBe(
      false,
    );
  });

  it("allows aggregate exports for ministry and manager roles", () => {
    expect(
      isExportAllowed("ministry_viewer", { exportType: "outcomes_aggregate" }),
    ).toBe(true);
    expect(
      isExportAllowed("manager", { exportType: "outcomes_aggregate", scope: "national" }),
    ).toBe(true);
  });

  it("allows mediator identifiable workspace exports", () => {
    expect(
      isExportAllowed("mediator", {
        exportType: "outcomes_workspace",
        scope: "workspace",
      }),
    ).toBe(true);
    expect(exportIncludesIdentifiable("mediator", "outcomes_workspace")).toBe(true);
  });

  it("never includes identifiable fields for ministry exports", () => {
    expect(exportIncludesIdentifiable("ministry_viewer", "outcomes_workspace")).toBe(
      false,
    );
    const row = redactOutcomeExportRow("ministry_viewer", {
      caseNumber: "RO-2026-001",
      beneficiaryPseudonym: "Beneficiary A.",
      outcomeType: "gp_registered",
    });
    expect(row.beneficiaryPseudonym).toBeUndefined();
  });

  it("scopes national exports to aggregate-capable roles", () => {
    expect(canExportScope("mediator", "national")).toBe(false);
    expect(canExportScope("ministry_viewer", "national")).toBe(true);
    expect(canExportScope("supervisor", "workspace")).toBe(true);
  });
});

describe("Phase 4 aggregate permissions", () => {
  it("restricts aggregate reads to authorised roles", () => {
    expect(canReadAggregates("ministry_viewer")).toBe(true);
    expect(canReadAggregates("manager")).toBe(true);
    expect(canReadAggregates("mediator")).toBe(false);
  });

  it("hides pseudonyms from ministry and manager roles", () => {
    expect(ministryCannotSeePseudonym("ministry_viewer")).toBe(true);
    expect(ministryCannotSeePseudonym("manager")).toBe(true);
    expect(ministryCannotSeePseudonym("supervisor")).toBe(false);
  });

  it("suppresses small counts below privacy threshold", () => {
    expect(applyIndicatorThreshold(4, 5)).toBeNull();
    expect(applyIndicatorThreshold(5, 5)).toBe(5);
    expect(applyIndicatorThreshold(0, 5)).toBeNull();
  });
});
