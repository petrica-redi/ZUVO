import { describe, expect, it } from "vitest";
import { anonymousIdSchema } from "@/lib/api/validation";

describe("anonymousIdSchema", () => {
  it("accepts bounded URL-safe anonymous ids", () => {
    expect(anonymousIdSchema.parse("abcDEF_123-456")).toBe("abcDEF_123-456");
  });

  it("rejects short, oversized, or unsafe anonymous ids", () => {
    expect(anonymousIdSchema.safeParse("short").success).toBe(false);
    expect(anonymousIdSchema.safeParse("x".repeat(81)).success).toBe(false);
    expect(anonymousIdSchema.safeParse("abcDEF_123-456<script>").success).toBe(false);
  });
});
