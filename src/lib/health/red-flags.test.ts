import { describe, expect, it } from "vitest";
import {
  buildEmergencyConsultSummary,
  buildEmergencySummary,
  detectEmergencyRedFlag,
  detectRedFlag,
  EMERGENCY_REDFLAGS,
  redFlagSymptomResult,
} from "./red-flags";

describe("Red flag detection", () => {
  it("detects chest pain emergencies", () => {
    expect(detectRedFlag("I have chest pain")?.id).toBe("chest_pain");
    expect(detectRedFlag("There is pressure in my chest")?.id).toBe("chest_pain");
    expect(detectRedFlag("I feel pain in the chest")?.id).toBe("chest_pain");
  });

  it("detects breathing emergencies", () => {
    expect(detectRedFlag("I cannot breathe")?.id).toBe("breathing");
    expect(detectRedFlag("I can't breathe properly")?.id).toBe("breathing");
    expect(detectRedFlag("having difficulty breathing")?.id).toBe("breathing");
  });

  it("detects heavy bleeding", () => {
    expect(detectRedFlag("there is heavy bleeding")?.id).toBe("heavy_bleeding");
    expect(detectRedFlag("blood is pouring out")?.id).toBe("heavy_bleeding");
    expect(detectRedFlag("the wound won't stop bleeding")?.id).toBe("heavy_bleeding");
  });

  it("detects stroke signs", () => {
    expect(detectRedFlag("his face droop is worrying")?.id).toBe("stroke");
    expect(detectRedFlag("she has slurred speech")?.id).toBe("stroke");
    expect(detectRedFlag("possible stroke")?.id).toBe("stroke");
  });

  it("detects suicidal ideation", () => {
    expect(detectRedFlag("I want to kill myself")?.id).toBe("suicide");
    expect(detectRedFlag("I want to die")?.id).toBe("suicide");
    expect(detectRedFlag("end my life")?.id).toBe("suicide");
    expect(detectRedFlag("I want to hurt myself")?.id).toBe("suicide");
  });

  it("detects severe allergic reactions", () => {
    expect(detectRedFlag("anaphylaxis")?.id).toBe("severe_allergy");
    expect(detectRedFlag("throat swelling")?.id).toBe("severe_allergy");
    expect(detectRedFlag("tongue swelling rapidly")?.id).toBe("severe_allergy");
  });

  it("detects unconscious person", () => {
    expect(detectRedFlag("she is unconscious")?.id).toBe("unconscious");
    expect(detectRedFlag("he passed out and won't wake")?.id).toBe("unconscious");
    expect(detectRedFlag("not responding at all")?.id).toBe("unconscious");
  });

  it("detects child breathing emergencies", () => {
    expect(detectRedFlag("baby is not breathing")?.id).toBe("child_not_breathing");
    expect(detectRedFlag("my child has blue lips and turning blue")?.id).toBe("child_not_breathing");
  });

  it("returns null for non-emergency text", () => {
    expect(detectRedFlag("I have a mild headache")).toBeNull();
    expect(detectRedFlag("My throat is a bit sore")).toBeNull();
    expect(detectRedFlag("")).toBeNull();
  });

  it("is case-insensitive", () => {
    expect(detectRedFlag("CHEST PAIN")?.id).toBe("chest_pain");
    expect(detectRedFlag("Chest Pain")?.id).toBe("chest_pain");
  });

  it("normalizes whitespace", () => {
    expect(detectRedFlag("  chest    pain  ")?.id).toBe("chest_pain");
    expect(detectRedFlag("chest\tpain")?.id).toBe("chest_pain");
  });

  it("detectEmergencyRedFlag is alias for detectRedFlag", () => {
    expect(detectEmergencyRedFlag("chest pain")?.id).toBe(
      detectRedFlag("chest pain")?.id,
    );
  });

  it("every red flag has required metadata", () => {
    EMERGENCY_REDFLAGS.forEach((flag) => {
      expect(flag.id).toBeTruthy();
      expect(flag.title.length).toBeGreaterThan(0);
      expect(flag.instruction.length).toBeGreaterThan(0);
      expect(flag.pattern).toBeInstanceOf(RegExp);
    });
  });
});

describe("Result builders", () => {
  const flag = EMERGENCY_REDFLAGS[0];

  it("buildEmergencySummary returns red severity", () => {
    const summary = buildEmergencySummary(flag);
    expect(summary.severity).toBe("red");
    expect(summary.title).toBe(flag.title);
    expect(summary.immediateAction).toBe(flag.instruction);
  });

  it("redFlagSymptomResult preserves symptom-check shape", () => {
    const result = redFlagSymptomResult(flag);
    expect(result.severity).toBe("red");
    expect(Array.isArray(result.homeCare)).toBe(true);
    expect(Array.isArray(result.warningSignsToEscalate)).toBe(true);
    expect(result.warningSignsToEscalate.length).toBeGreaterThan(0);
  });

  it("buildEmergencyConsultSummary returns summary stage", () => {
    const consult = buildEmergencyConsultSummary(flag);
    expect(consult.stage).toBe("summary");
    expect(consult.severity).toBe("red");
    expect(consult.doctorVisitSummary).toContain(flag.title);
  });
});
