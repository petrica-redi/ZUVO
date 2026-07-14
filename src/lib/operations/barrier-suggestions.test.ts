import { describe, expect, it } from "vitest";
import {
  suggestNextAction,
  suggestTasksForBarriers,
} from "./barrier-suggestions";

describe("barrier suggestions", () => {
  it("suggests provider search when no GP", () => {
    const tasks = suggestTasksForBarriers(["no_gp"]);
    expect(tasks).toContain("find_provider");
    expect(suggestNextAction(["no_gp"])).toBe("operations.nextActionFindProvider");
  });

  it("suggests entitlement check for insurance barrier", () => {
    expect(suggestNextAction(["no_insurance"])).toBe(
      "operations.nextActionCheckEntitlement",
    );
  });

  it("deduplicates tasks across multiple barriers", () => {
    const tasks = suggestTasksForBarriers(["language", "fear_trust"]);
    expect(tasks).toContain("call_beneficiary");
    expect(tasks).toContain("arrange_interpretation");
    expect(tasks).toContain("obtain_consent");
    expect(new Set(tasks).size).toBe(tasks.length);
  });
});
