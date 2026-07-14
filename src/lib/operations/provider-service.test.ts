import { describe, expect, it } from "vitest";
import { scoreProviderMatch } from "./provider-service";
import type { providers } from "@/db/schema";

type ProviderRow = typeof providers.$inferSelect;

function mockProvider(overrides: Partial<ProviderRow> = {}): ProviderRow {
  return {
    id: "p-1",
    name: "Test Clinic",
    type: "clinic",
    latitude: 44.4,
    longitude: 26.1,
    address: "Test address",
    phone: null,
    website: null,
    region: "romania",
    countryCode: "RO",
    municipalityCode: "B",
    verificationState: "verified",
    categorySlugs: ["gp_registration", "vaccination"],
    email: null,
    contactPerson: null,
    description: null,
    accessibilityNotes: null,
    organisationId: null,
    isRomaFriendly: true,
    isFreeClinic: true,
    hasInterpreter: true,
    languages: ["ro", "rom"],
    operatingHours: null,
    verifiedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("provider match scoring", () => {
  it("ranks verified providers with category and language matches highest", () => {
    const row = mockProvider();
    const { score, reasons } = scoreProviderMatch(row, {
      categorySlug: "gp_registration",
      language: "rom",
      municipalityCode: "B",
      countryCode: "RO",
    });

    expect(score).toBeGreaterThan(50);
    expect(reasons).toContain("verified");
    expect(reasons).toContain("category_match");
    expect(reasons).toContain("language_match");
    expect(reasons).toContain("municipality_match");
  });

  it("scores lower for unverified providers", () => {
    const verified = scoreProviderMatch(mockProvider(), {
      categorySlug: "gp_registration",
      language: "ro",
    });
    const unverified = scoreProviderMatch(
      mockProvider({ verificationState: "unverified" }),
      { categorySlug: "gp_registration", language: "ro" },
    );

    expect(verified.score).toBeGreaterThan(unverified.score);
  });

  it("adds interpreter bonus when language not in list but interpreter available", () => {
    const { reasons, score } = scoreProviderMatch(
      mockProvider({ languages: ["ro"], hasInterpreter: true }),
      { language: "hu" },
    );

    expect(reasons).toContain("interpreter_available");
    expect(score).toBeGreaterThan(0);
  });
});
