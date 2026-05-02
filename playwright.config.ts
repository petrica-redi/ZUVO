import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

/**
 * Production-grade Playwright config.
 *
 * - In CI: builds and starts the production server so we test what we ship.
 * - Locally: uses `next dev` for fast iteration.
 * - HTML report on failure, single chromium project for v1.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["html", { open: "never" }], ["list"]] : "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: isCI ? "retain-on-failure" : "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: isCI ? "npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
