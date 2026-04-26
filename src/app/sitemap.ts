import type { MetadataRoute } from "next";
import { getBaseUrlString } from "@/lib/app-url";
import { LOCALES } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrlString();
  const now = new Date();

  const routes = ["/", "/learn", "/track", "/mediator", "/regions"];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of LOCALES) {
      const prefix = locale === "en" ? "" : `/${locale}`;
      const url = `${base}${prefix}${route === "/" ? "" : route}` || `${base}/`;
      entries.push({
        url,
        lastModified: now,
        changeFrequency: route === "/" ? "weekly" : "monthly",
        priority: route === "/" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
