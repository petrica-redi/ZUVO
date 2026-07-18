import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createFieldSessionToken,
  verifyFieldSessionToken,
} from "./session";
import { hashFieldPassword } from "./roster";

describe("field session tokens", () => {
  const prev = { ...process.env };

  beforeEach(() => {
    process.env.FIELD_SESSION_SECRET = "test-field-session-secret-32chars!!";
    process.env.FIELD_STAFF_PEPPER = "test-pepper";
  });

  afterEach(() => {
    process.env.FIELD_SESSION_SECRET = prev.FIELD_SESSION_SECRET;
    process.env.FIELD_STAFF_PEPPER = prev.FIELD_STAFF_PEPPER;
  });

  it("accepts a freshly signed field token", () => {
    const token = createFieldSessionToken({
      email: "amc@redi.healthcare",
      displayName: "Maria Popescu",
      role: "mediator",
      workspaceId: "ws-judet-b",
      countyCode: "B",
    });
    const session = verifyFieldSessionToken(token);
    expect(session?.email).toBe("amc@redi.healthcare");
    expect(session?.role).toBe("mediator");
    expect(session?.workspaceId).toBe("ws-judet-b");
  });

  it("rejects a tampered signature", () => {
    const token = createFieldSessionToken({
      email: "amc@redi.healthcare",
      displayName: "Maria Popescu",
      role: "nurse",
      workspaceId: "ws-1",
      countyCode: "CJ",
    });
    const [payload] = token.split(".");
    expect(verifyFieldSessionToken(`${payload}.deadbeef`)).toBeNull();
  });

  it("hashes passwords deterministically with pepper", () => {
    const a = hashFieldPassword("Welcome2REDI*");
    const b = hashFieldPassword("Welcome2REDI*");
    expect(a).toBe(b);
    expect(a).not.toBe("Welcome2REDI*");
  });
});
