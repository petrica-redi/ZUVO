import { describe, expect, it } from "vitest";
import {
  buildEmergencyConsultSummary,
  detectEmergencyRedFlag,
  detectRedFlag,
  redFlagSymptomResult,
} from "./red-flags";

describe("red flag detection", () => {
  it("detects chest pain emergencies", () => {
    const flag = detectRedFlag("I have chest pain and shortness of breath");
    expect(flag?.id).toBe("chest_pain");
  });

  it("detects child breathing emergencies", () => {
    const flag = detectEmergencyRedFlag("My baby has blue lips and is not breathing");
    expect(flag?.id).toBe("child_not_breathing");
  });

  it("builds a red symptom result", () => {
    const flag = detectRedFlag("I cannot breathe");
    expect(flag).not.toBeNull();
    const result = redFlagSymptomResult(flag!);
    expect(result.severity).toBe("red");
    expect(result.immediateAction).toContain("112");
  });

  it("builds a red consult summary", () => {
    const flag = detectRedFlag("I want to kill myself");
    expect(flag).not.toBeNull();
    const result = buildEmergencyConsultSummary(flag!);
    expect(result.stage).toBe("summary");
    expect(result.severity).toBe("red");
    expect(result.whatToDo).toContain("emergency");
  });
});
