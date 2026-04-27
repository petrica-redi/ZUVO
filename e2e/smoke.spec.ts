import { test, expect } from "@playwright/test";

test("home page loads with Sastipe branding", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Sastipe/);
  await expect(page.getByRole("heading", { name: "Sastipe" })).toBeVisible();
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

test("Albanian locale home loads Sastipe branding", async ({ page }) => {
  await page.goto("/sq");
  await expect(page).toHaveTitle(/Sastipe/);
});
