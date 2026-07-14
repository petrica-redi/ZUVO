import { describe, expect, it } from "vitest";
import {
  generateCaseNumber,
  generateIntakeReference,
  _resetCaseSequenceForTests,
} from "./ids";

describe("operations ids", () => {
  it("generates sequential case numbers", () => {
    _resetCaseSequenceForTests();
    expect(generateCaseNumber("RO")).toMatch(/^REDI-RO-\d{4}-00001$/);
    expect(generateCaseNumber("RO")).toMatch(/^REDI-RO-\d{4}-00002$/);
  });

  it("generates unique intake references", () => {
    const a = generateIntakeReference();
    const b = generateIntakeReference();
    expect(a).toMatch(/^HELP-/);
    expect(b).toMatch(/^HELP-/);
    expect(a).not.toBe(b);
  });
});
