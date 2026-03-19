import type { MetadataRoute } from "next";
import { getAppConfig } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { appUrl } = getAppConfig();
  const baseUrl = appUrl ? new URL(appUrl) : new URL("http://localhost:3000");
  const now = new Date();

  // MVP routes: keep it minimal until we add more content pages.
  return [
    {
      url: baseUrl.toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

