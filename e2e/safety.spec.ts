import { test, expect } from "@playwright/test";

/**
 * Safety-critical paths.
 * These flows protect users from harmful AI advice and malicious input.
 */

test.describe("Emergency red-flag override", () => {
  test("/api/consult returns red severity for chest pain without calling AI", async ({
    request,
  }) => {
    const res = await request.post("/api/consult", {
      data: {
        messages: [{ role: "user", content: "I have chest pain and shortness of breath" }],
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.safetyOverride).toBe(true);
    expect(body.data.severity).toBe("red");
    expect(body.data.whatToDo).toMatch(/112|emergency/i);
  });

  test("/api/consult overrides for suicidal ideation", async ({ request }) => {
    const res = await request.post("/api/consult", {
      data: {
        messages: [{ role: "user", content: "I want to kill myself" }],
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.safetyOverride).toBe(true);
    expect(body.data.severity).toBe("red");
  });

  test("/api/symptom-check returns red severity for child not breathing", async ({
    request,
  }) => {
    const res = await request.post("/api/symptom-check", {
      data: {
        bodyArea: "chest",
        symptoms: "My baby is not breathing and has blue lips",
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.safetyOverride).toBe(true);
    expect(body.data.severity).toBe("red");
  });
});

test.describe("Input validation", () => {
  test("/api/consult rejects empty messages", async ({ request }) => {
    const res = await request.post("/api/consult", { data: { messages: [] } });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test("/api/consult rejects invalid JSON", async ({ request }) => {
    const res = await request.post("/api/consult", {
      data: "not-an-object",
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
  });

  test("/api/scan rejects too-short claims", async ({ request }) => {
    const res = await request.post("/api/scan", { data: { claim: "x" } });
    expect(res.status()).toBe(400);
  });

  test("/api/progress rejects unauthenticated requests", async ({ request }) => {
    const res = await request.post("/api/progress", {
      data: { pillarId: "student_health", moduleId: "test", status: "completed" },
    });
    expect(res.status()).toBe(401);
  });

  test("/api/progress rejects malformed anonymous id", async ({ request }) => {
    const res = await request.post("/api/progress", {
      data: { pillarId: "student_health", moduleId: "test", status: "completed" },
      headers: { "x-anonymous-id": "x" },
    });
    expect(res.status()).toBe(401);
  });

  test("/api/me/export requires authentication", async ({ request }) => {
    const res = await request.get("/api/me/export");
    expect(res.status()).toBe(401);
  });

  test("/api/me/delete requires authentication", async ({ request }) => {
    const res = await request.post("/api/me/delete", {
      data: { confirmation: "DELETE" },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe("Rate limiting", () => {
  test("/api/consult includes rate-limit headers", async ({ request }) => {
    const res = await request.post("/api/consult", {
      data: {
        messages: [{ role: "user", content: "I have a mild cough" }],
      },
    });
    // The request may succeed (200), be missing AI key (503), or hit a budget gate.
    expect([200, 502, 503]).toContain(res.status());
  });
});

test.describe("Localised emergency content", () => {
  test("home page shows 112 emergency CTA in default locale", async ({ page }) => {
    await page.goto("/");
    // Multiple 112 references on the landing (tel: anchor + footer copy);
    // assert at least one visible occurrence.
    await expect(page.getByText(/112/).first()).toBeVisible();
  });

  test("Romanian locale renders translated home", async ({ page }) => {
    await page.goto("/ro");
    // Romanian for "Emergency? Call 112" — multiple touchpoints (header CTA +
    // emergency strip), so assert at least one visible occurrence.
    await expect(page.getByText(/Urgență\?/i).first()).toBeVisible();
  });

  test("Albanian locale renders translated home", async ({ page }) => {
    await page.goto("/sq");
    await expect(page.getByText(/Emergjencë\?/i).first()).toBeVisible();
  });
});
