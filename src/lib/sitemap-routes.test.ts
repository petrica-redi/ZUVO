import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/routing";
import { getPublicSitemapRoutes } from "./sitemap-routes";

describe("getPublicSitemapRoutes", () => {
  it("includes core static pages", () => {
    const routes = getPublicSitemapRoutes();
    for (const path of [
      "/",
      "/chat",
      "/learn",
      "/family",
      "/glossary",
      "/quiz",
      "/vaccines",
      "/students",
      "/students/certificate",
    ]) {
      expect(routes).toContain(path);
    }
  });

  it("includes dynamic learn and region routes", () => {
    const routes = getPublicSitemapRoutes();
    expect(routes.some((r) => r.startsWith("/learn/prevention/"))).toBe(true);
    expect(routes).toContain("/regions/romania");
  });

  it("excludes admin routes", () => {
    const routes = getPublicSitemapRoutes();
    expect(routes.some((r) => r.startsWith("/admin"))).toBe(false);
  });

  it("produces one sitemap entry per locale", () => {
    const routes = getPublicSitemapRoutes();
    expect(routes.length * LOCALES.length).toBeGreaterThan(1000);
  });
});
