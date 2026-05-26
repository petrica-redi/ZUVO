import type { MetadataRoute } from "next";
import { getAppConfig } from "@/lib/env";
import { LOCALES, routing } from "@/i18n/routing";
import { STUDENT_MODULES, STAGE_ORDER } from "@/data/student-health";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { appUrl } = getAppConfig();
  const base = appUrl ?? "http://localhost:3000";
  const now = new Date();

  const studentRoutes = [
    "/students",
    ...STAGE_ORDER.map((s) => `/students/quiz/${s}`),
    ...STUDENT_MODULES.map((m) => `/students/${m.stageId}/${m.id}`),
  ];

  const routes = ["/", "/learn", "/track", "/mediator", "/regions", ...studentRoutes];

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
