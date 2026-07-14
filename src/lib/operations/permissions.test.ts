import { describe, expect, it } from "vitest";
import {
  assertWorkspaceAccess,
  canExportIdentifiable,
  canReadAggregates,
  ministryCannotSeePseudonym,
} from "./permissions";

describe("operations permissions", () => {
  it("allows workspace owner access", () => {
    const actor = { workspaceId: "ws-1", isAdmin: false };
    expect(assertWorkspaceAccess(actor, "ws-1")).toBe(true);
    expect(assertWorkspaceAccess(actor, "ws-2")).toBe(false);
  });

  it("allows admin cross-workspace access", () => {
    const actor = { workspaceId: "ws-1", isAdmin: true };
    expect(assertWorkspaceAccess(actor, "ws-99")).toBe(true);
  });

  it("restricts aggregate reads to authorised roles", () => {
    expect(canReadAggregates("manager")).toBe(true);
    expect(canReadAggregates("ministry_viewer")).toBe(true);
    expect(canReadAggregates("mediator")).toBe(false);
  });

  it("restricts identifiable exports", () => {
    expect(canExportIdentifiable("mediator")).toBe(true);
    expect(canExportIdentifiable("manager")).toBe(false);
    expect(canExportIdentifiable("ministry_viewer")).toBe(false);
  });

  it("hides pseudonyms from ministry viewers", () => {
    expect(ministryCannotSeePseudonym("manager")).toBe(true);
    expect(ministryCannotSeePseudonym("mediator")).toBe(false);
  });
});
