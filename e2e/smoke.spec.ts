import { test, expect } from "@playwright/test";

test("home page loads with Redi Health branding", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Redi Health/);
  // Landing hero — editorial headline split across two lines.
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Trusted guidance/i);
});

test("robots.txt is accessible", async ({ page }) => {
  const res = await page.goto("/robots.txt");
  expect(res?.status()).toBe(200);
  const body = await res?.text();
  expect(body).toContain("User-agent");
});

test("sitemap.xml is accessible", async ({ page }) => {
  const res = await page.goto("/sitemap.xml");
  expect(res?.status()).toBe(200);
});

test("Student Health Academy hub loads", async ({ page }) => {
  await page.goto("/students");
  await expect(page.getByText(/Redi Health Academy/i).first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /health translator/i }),
  ).toBeVisible();
});
