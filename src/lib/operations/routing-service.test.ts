import { describe, expect, it } from "vitest";
import { pickBestRule, scoreRoutingRule } from "./routing-service";

describe("routing-service", () => {
  const rules = [
    {
      id: "1",
      countryCode: "RO",
      municipalityCode: undefined,
      preferredLanguage: undefined,
      helpType: undefined,
      teamId: "team-default",
      priority: 0,
      isActive: true,
    },
    {
      id: "2",
      countryCode: "RO",
      municipalityCode: "B",
      preferredLanguage: undefined,
      helpType: undefined,
      teamId: "team-bucharest",
      priority: 10,
      isActive: true,
    },
    {
      id: "3",
      countryCode: "RO",
      municipalityCode: undefined,
      preferredLanguage: "en",
      helpType: "language_support" as const,
      teamId: "team-lang",
      priority: 20,
      isActive: true,
    },
  ];

  it("prefers municipality-specific rules", () => {
    const best = pickBestRule(rules, {
      countryCode: "RO",
      municipalityCode: "B",
      preferredLanguage: "ro",
      helpType: "callback",
    });
    expect(best?.teamId).toBe("team-bucharest");
  });

  it("prefers language + help type rules when they match", () => {
    const best = pickBestRule(rules, {
      countryCode: "RO",
      municipalityCode: "CJ",
      preferredLanguage: "en",
      helpType: "language_support",
    });
    expect(best?.teamId).toBe("team-lang");
  });

  it("falls back to country default", () => {
    const best = pickBestRule(rules, {
      countryCode: "RO",
      municipalityCode: "TM",
      preferredLanguage: "ro",
      helpType: "find_doctor",
    });
    expect(best?.teamId).toBe("team-default");
  });

  it("returns -1 for non-matching country", () => {
    const score = scoreRoutingRule(
      { countryCode: "RO", priority: 0 },
      { countryCode: "HU" },
    );
    expect(score).toBe(-1);
  });
});
