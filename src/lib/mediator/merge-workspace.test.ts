import { describe, expect, it } from "vitest";
import {
  isEmptyWorkspace,
  mergeWorkspace,
  parseWorkspacePayload,
} from "./merge-workspace";
import { EMPTY_WORKSPACE } from "./types";

describe("parseWorkspacePayload", () => {
  it("returns an empty workspace for null/undefined input", () => {
    expect(parseWorkspacePayload(null)).toEqual(EMPTY_WORKSPACE);
    expect(parseWorkspacePayload(undefined)).toEqual(EMPTY_WORKSPACE);
  });

  it("accepts a well-formed payload", () => {
    const payload = {
      version: 1 as const,
      cases: [
        {
          id: "a",
          name: "Familia X",
          category: "health" as const,
          status: "plan" as const,
          notes: "",
          nextVisit: "",
          createdAt: "2026-05-26T00:00:00.000Z",
          updatedAt: "2026-05-26T00:00:00.000Z",
        },
      ],
      visits: [],
      sessions: [],
    };
    expect(parseWorkspacePayload(payload).cases).toHaveLength(1);
  });

  it("drops malformed rows instead of throwing", () => {
    const out = parseWorkspacePayload({
      version: 1,
      cases: [{ id: 1 }, { id: "ok", category: "wrong" }],
      visits: "not an array",
      sessions: undefined,
    });
    expect(out.cases.length).toBeGreaterThanOrEqual(0);
    expect(out.visits).toEqual([]);
    expect(out.sessions).toEqual([]);
  });
});

describe("mergeWorkspace", () => {
  it("keeps the newer case when ids collide", () => {
    const older = parseWorkspacePayload({
      version: 1,
      cases: [
        {
          id: "a",
          name: "Old",
          category: "health",
          status: "plan",
          notes: "",
          nextVisit: "",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      visits: [],
      sessions: [],
    });
    const newer = parseWorkspacePayload({
      version: 1,
      cases: [
        {
          id: "a",
          name: "New",
          category: "health",
          status: "monitoring",
          notes: "updated",
          nextVisit: "",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-06-01T00:00:00.000Z",
        },
      ],
      visits: [],
      sessions: [],
    });
    const merged = mergeWorkspace(older, newer);
    expect(merged.cases).toHaveLength(1);
    expect(merged.cases[0]?.name).toBe("New");
    expect(merged.cases[0]?.status).toBe("monitoring");
  });

  it("dedupes visits and keeps the newest by visitDate", () => {
    const a = parseWorkspacePayload({
      version: 1,
      cases: [],
      visits: [
        { id: "v1", memberName: "A", notes: "", visitDate: "2026-02-01T00:00:00.000Z" },
      ],
      sessions: [],
    });
    const b = parseWorkspacePayload({
      version: 1,
      cases: [],
      visits: [
        { id: "v1", memberName: "A2", notes: "", visitDate: "2026-05-01T00:00:00.000Z" },
        { id: "v2", memberName: "B", notes: "", visitDate: "2026-04-01T00:00:00.000Z" },
      ],
      sessions: [],
    });
    const merged = mergeWorkspace(a, b);
    expect(merged.visits).toHaveLength(2);
    expect(merged.visits[0]?.memberName).toBe("A2");
  });

  it("isEmptyWorkspace returns true only when all collections are empty", () => {
    expect(isEmptyWorkspace(EMPTY_WORKSPACE)).toBe(true);
    expect(
      isEmptyWorkspace({
        version: 1,
        cases: [],
        visits: [
          { id: "v", memberName: "", notes: "", visitDate: "2026-01-01T00:00:00.000Z" },
        ],
        sessions: [],
      }),
    ).toBe(false);
  });
});
