import type { MetadataRoute } from "next";
import { getAppConfig } from "@/lib/env";
import { LOCALES } from "@/i18n/routing";
import { getPublicSitemapRoutes } from "@/lib/sitemap-routes";

function localePath(locale: string, route: string): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  if (route === "/") return prefix || "/";
  return `${prefix}${route}`;
}

function routePriority(route: string): number {
  if (route === "/") return 1;
  if (route === "/learn" || route === "/chat" || route === "/family") return 0.9;
  if (route.startsWith("/learn/") || route.startsWith("/students")) return 0.75;
  if (route.startsWith("/regions/")) return 0.7;
  return 0.8;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { appUrl } = getAppConfig();
  const base = appUrl ?? "http://localhost:3000";
  const now = new Date();
  const routes = getPublicSitemapRoutes();

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of LOCALES) {
      const path = localePath(locale, route);
      entries.push({
        url: `${base}${path === "/" ? "" : path}` || `${base}/`,
        lastModified: now,
        changeFrequency: route === "/" ? "weekly" : "monthly",
        priority: routePriority(route),
      });
    }
  }

  return entries;
}
