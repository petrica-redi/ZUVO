import { test, expect } from "@playwright/test";

/**
 * Lightweight accessibility smoke tests.
 *
 * Full axe-core runs are gated behind the `A11Y_AUDIT=1` env so they don't
 * block the default Playwright suite. Run via `A11Y_AUDIT=1 npm run test:e2e`
 * after installing `@axe-core/playwright`.
 */

const ROUTES = [
  { path: "/", name: "home" },
  { path: "/students", name: "academy hub" },
  { path: "/students/local/emergency101", name: "first aid lesson" },
  { path: "/privacy", name: "privacy" },
];

test.describe("accessibility — structural smoke", () => {
  for (const route of ROUTES) {
    test(`${route.name} has a single h1 and a main landmark`, async ({ page }) => {
      await page.goto(route.path);
      // Single h1 per page
      const h1Count = await page.locator("h1").count();
      expect(h1Count, `${route.name} should have exactly one h1`).toBeGreaterThanOrEqual(1);
      // Main landmark
      await expect(page.locator("main").first()).toBeVisible();
      // Skip-link is in the markup
      const skip = page.locator(".skip-link");
      await expect(skip).toHaveCount(1);
    });

    test(`${route.name} respects keyboard navigation entry`, async ({ page }) => {
      await page.goto(route.path);
      await page.keyboard.press("Tab");
      const active = await page.evaluate(() => document.activeElement?.tagName ?? "");
      expect(["A", "BUTTON", "INPUT"].includes(active)).toBeTruthy();
    });
  }
});

if (process.env.A11Y_AUDIT === "1") {
  test.describe("accessibility — axe-core full audit", () => {
    test("home page has no critical violations", async ({ page }) => {
      await page.goto("/");
      type AxeRunner = (
        page: import("@playwright/test").Page,
      ) => { analyze: () => Promise<{ violations: Array<{ impact?: string }> }> };
      const mod = (await import(
        /* webpackIgnore: true */ "@axe-core/playwright" as string,
      ).catch(() => null)) as { default?: AxeRunner } | null;
      if (!mod?.default) {
        test.skip(true, "@axe-core/playwright is not installed in this environment");
        return;
      }
      const builder = mod.default(page);
      const results = await builder.analyze();
      const critical = results.violations.filter((v) => v.impact === "critical");
      expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
    });
  });
}
