import { describe, expect, it } from "vitest";
import { generateReferralNumber, _resetCaseSequenceForTests } from "./ids";

describe("referral IDs", () => {
  it("generates sequential referral numbers", () => {
    _resetCaseSequenceForTests();
    expect(generateReferralNumber("RO")).toBe(
      `REF-RO-${new Date().getFullYear()}-00001`,
    );
    expect(generateReferralNumber("RO")).toBe(
      `REF-RO-${new Date().getFullYear()}-00002`,
    );
  });
});
