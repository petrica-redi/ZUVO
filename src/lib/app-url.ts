import { getAppConfig } from "@/lib/env";

export function getBaseUrlString(): string {
  const { appUrl } = getAppConfig();
  if (appUrl) return appUrl;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
