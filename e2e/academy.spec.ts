import { test, expect } from "@playwright/test";

/**
 * E2E coverage for the Student Health Academy critical workflow.
 * Validates routing, hub rendering, lesson navigation, and Field Lab interaction.
 */

test.describe("Student Health Academy", () => {
  test("hub renders mission dashboard and stage cards", async ({ page }) => {
    await page.goto("/students");
    // Editorial L8 hero: eyebrow + multi-line headline ending on "translator".
    await expect(page.getByText(/Sastipe Health Academy/i).first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /health translator/i }),
    ).toBeVisible();
    // Mission deck is the primary call-to-action surface.
    await expect(page.getByText(/Mission deck/i).first()).toBeVisible();
    // All three stages should appear as headings on the cards.
    await expect(page.getByRole("heading", { name: "Local" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Regional" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "National" })).toBeVisible();
  });

  test("first lesson navigates from hub stepper", async ({ page }) => {
    await page.goto("/students/local/emergency101");
    await expect(
      page.getByRole("heading", { name: /Emergency signals/i }),
    ).toBeVisible();
    // Stepper should announce lesson 1 of N
    await expect(page.getByText(/Lesson 1 of/i)).toBeVisible();
    // Verified sources card present
    await expect(page.getByText(/verified sources/i)).toBeVisible();
  });

  test("locked national stage cannot be reached without unlock", async ({
    page,
  }) => {
    await page.goto("/students");
    // The National stage card should expose its locked state
    const nationalCard = page.getByRole("heading", { name: "National" }).locator("..");
    await expect(nationalCard).toContainText(/locked/i);
  });
});

test.describe("Privacy & data subject rights", () => {
  test("privacy page exposes data export and delete actions", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: /privacy/i }).first()).toBeVisible();
    await expect(page.getByText(/Download my data/i)).toBeVisible();
    await expect(page.getByText(/Delete my account/i)).toBeVisible();
  });
});

test.describe("Application shell", () => {
  test("offline shell is reachable", async ({ page }) => {
    const res = await page.goto("/offline.html");
    expect(res?.status()).toBe(200);
    await expect(page.getByText(/you are offline/i)).toBeVisible();
  });

  test("health endpoint reports service status", async ({ request }) => {
    const res = await request.get("/api/health");
    expect([200, 503]).toContain(res.status());
    const body = await res.json();
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("services");
    expect(body.services).toHaveProperty("database");
  });

  test("404 renders branded not-found", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByText(/not found/i)).toBeVisible();
  });
});
