import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseAiJson } from "@/lib/ai/json";

const schema = z.object({
  verdict: z.enum(["ok", "bad"]),
  message: z.string(),
});

describe("parseAiJson", () => {
  it("parses direct JSON that matches the schema", () => {
    const result = parseAiJson('{"verdict":"ok","message":"fine"}', schema);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.verdict).toBe("ok");
    }
  });

  it("extracts JSON from text wrappers", () => {
    const result = parseAiJson('Here is the answer:\n{"verdict":"bad","message":"check"}', schema);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("check");
    }
  });

  it("rejects schema-invalid JSON", () => {
    const result = parseAiJson('{"verdict":"unknown","message":"x"}', schema);
    expect(result.success).toBe(false);
  });
});
