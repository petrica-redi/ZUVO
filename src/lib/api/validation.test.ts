import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  anonymousIdSchema,
  extractJsonObject,
  getAnonymousId,
  getClientIp,
  invalidAnonymousIdResponse,
  localeSchema,
  parseAiJson,
  parseJsonBody,
  validationErrorResponse,
} from "./validation";

function makeReq(body?: unknown, headers: Record<string, string> = {}) {
  const init: RequestInit = { method: "POST", headers };
  if (body !== undefined) {
    init.headers = { ...headers, "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }
  return new Request("https://test/", init) as unknown as import("next/server").NextRequest;
}

describe("anonymousIdSchema", () => {
  it("accepts UUID-like and base64-like ids", () => {
    expect(anonymousIdSchema.safeParse("12345678-abcd-efgh-1234").success).toBe(true);
    expect(anonymousIdSchema.safeParse("ABC123def456ghi789").success).toBe(true);
  });

  it("rejects too-short ids", () => {
    expect(anonymousIdSchema.safeParse("short").success).toBe(false);
    expect(anonymousIdSchema.safeParse("abc").success).toBe(false);
  });

  it("rejects too-long ids", () => {
    expect(anonymousIdSchema.safeParse("a".repeat(81)).success).toBe(false);
  });

  it("rejects invalid characters", () => {
    expect(anonymousIdSchema.safeParse("contains spaces here").success).toBe(false);
    expect(anonymousIdSchema.safeParse("path/with/slash").success).toBe(false);
    expect(anonymousIdSchema.safeParse("<script>alert(1)").success).toBe(false);
  });
});

describe("localeSchema", () => {
  it("accepts 2-letter and 3-letter locales", () => {
    expect(localeSchema.safeParse("en").success).toBe(true);
    expect(localeSchema.safeParse("rom").success).toBe(true);
  });

  it("accepts BCP-47 region tags", () => {
    expect(localeSchema.safeParse("en-US").success).toBe(true);
  });

  it("rejects malformed locales", () => {
    expect(localeSchema.safeParse("ENGLISH").success).toBe(false);
    expect(localeSchema.safeParse("e").success).toBe(false);
  });
});

describe("getAnonymousId", () => {
  it("extracts valid header", () => {
    const req = makeReq(undefined, { "x-anonymous-id": "valid-id-12345678" });
    expect(getAnonymousId(req)).toBe("valid-id-12345678");
  });

  it("returns null for missing header", () => {
    expect(getAnonymousId(makeReq())).toBeNull();
  });

  it("returns null for invalid header", () => {
    expect(getAnonymousId(makeReq(undefined, { "x-anonymous-id": "bad" }))).toBeNull();
  });
});

describe("getClientIp", () => {
  it("returns anonymous ID when present", () => {
    const req = makeReq(undefined, { "x-anonymous-id": "anon-id-12345678" });
    expect(getClientIp(req)).toBe("anon-id-12345678");
  });

  it("returns IP when no anon ID", () => {
    const req = makeReq(undefined, { "x-forwarded-for": "10.0.0.1" });
    expect(getClientIp(req)).toBe("10.0.0.1");
  });
});

describe("parseJsonBody", () => {
  const schema = z.object({ name: z.string().min(1) });

  it("parses valid body", async () => {
    const req = makeReq({ name: "Alice" });
    const result = await parseJsonBody(req, schema);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Alice");
  });

  it("rejects invalid body", async () => {
    const req = makeReq({ name: "" });
    const result = await parseJsonBody(req, schema);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.response.status).toBe(400);
      const body = await result.response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBeTruthy();
    }
  });

  it("rejects malformed JSON", async () => {
    const req = new Request("https://test/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{invalid",
    }) as unknown as import("next/server").NextRequest;
    const result = await parseJsonBody(req, schema);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.response.status).toBe(400);
  });
});

describe("validationErrorResponse", () => {
  it("returns 400 with structured error for ZodError", () => {
    const result = z.string().min(5).safeParse("a");
    if (result.success) throw new Error("expected zod failure");
    const res = validationErrorResponse(result.error);
    expect(res.status).toBe(400);
  });

  it("returns 400 with message for plain Error", () => {
    const res = validationErrorResponse(new Error("custom"));
    expect(res.status).toBe(400);
  });
});

describe("invalidAnonymousIdResponse", () => {
  it("returns 400 with structured error", () => {
    const res = invalidAnonymousIdResponse();
    expect(res.status).toBe(400);
  });
});

describe("extractJsonObject", () => {
  it("parses pure JSON", () => {
    expect(extractJsonObject('{"a":1}')).toEqual({ a: 1 });
  });

  it("extracts JSON wrapped in prose", () => {
    expect(extractJsonObject('Here is the answer: {"a":2} thanks')).toEqual({ a: 2 });
  });

  it("throws on no JSON found", () => {
    expect(() => extractJsonObject("no json here")).toThrow();
  });

  it("throws on empty input", () => {
    expect(() => extractJsonObject("")).toThrow();
  });
});

describe("parseAiJson", () => {
  const schema = z.object({ verdict: z.enum(["yes", "no"]) });

  it("returns parsed data on valid input", () => {
    const result = parseAiJson('{"verdict":"yes"}', schema);
    expect(result).toEqual({ verdict: "yes" });
  });

  it("returns null when schema fails", () => {
    expect(parseAiJson('{"verdict":"maybe"}', schema)).toBeNull();
  });

  it("returns null on parse failure", () => {
    expect(parseAiJson("not json", schema)).toBeNull();
  });
});
