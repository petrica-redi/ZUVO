/**
 * GET /api/health — service health probe for uptime monitors.
 *
 * Returns:
 *   200 OK     — all required services healthy
 *   200 OK     — degraded (some optional services unavailable)
 *   503        — at least one required service unhealthy
 *
 * Required services: process, env validation.
 * Optional / observed: database, redis, openai key presence, sentry config.
 *
 * Never throws. Caches result for 5s to avoid hammering downstream services.
 */
import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { sql } from "drizzle-orm";

type ServiceStatus = "ok" | "degraded" | "down" | "unconfigured";

type HealthReport = {
  status: "ok" | "degraded" | "down";
  uptime: number;
  timestamp: string;
  version: string;
  region: string | null;
  services: {
    database: ServiceStatus;
    redis: ServiceStatus;
    ai: ServiceStatus;
    sentry: ServiceStatus;
    email: ServiceStatus;
    analytics: ServiceStatus;
  };
};

let cache: { at: number; report: HealthReport } | null = null;
const CACHE_MS = 5_000;

async function checkDatabase(): Promise<ServiceStatus> {
  const db = getDb();
  if (!db) return "unconfigured";
  try {
    await db.execute(sql`SELECT 1`);
    return "ok";
  } catch {
    return "down";
  }
}

async function checkRedis(): Promise<ServiceStatus> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return "unconfigured";
  try {
    const res = await fetch(`${url}/ping`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return "down";
    return "ok";
  } catch {
    return "down";
  }
}

function checkConfig(envVar: string): ServiceStatus {
  return process.env[envVar]?.trim() ? "ok" : "unconfigured";
}

async function buildReport(): Promise<HealthReport> {
  const [database, redis] = await Promise.all([checkDatabase(), checkRedis()]);
  const ai = checkConfig("OPENAI_API_KEY");
  const sentry = checkConfig("NEXT_PUBLIC_SENTRY_DSN");
  const email = checkConfig("RESEND_API_KEY");
  const analytics = checkConfig("NEXT_PUBLIC_POSTHOG_KEY");

  // Required: in production, database and AI must be configured.
  const inProduction = process.env.NODE_ENV === "production";
  const databaseRequired = inProduction;
  const aiRequired = inProduction;

  let status: HealthReport["status"] = "ok";
  if (databaseRequired && database !== "ok") status = "down";
  else if (aiRequired && ai !== "ok") status = "down";
  else if (database !== "ok" || redis === "down") status = "degraded";

  return {
    status,
    uptime: typeof process.uptime === "function" ? process.uptime() : 0,
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
    region: process.env.VERCEL_REGION ?? process.env.AWS_REGION ?? null,
    services: { database, redis, ai, sentry, email, analytics },
  };
}

export async function GET() {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) {
    return NextResponse.json(cache.report, {
      status: cache.report.status === "down" ? 503 : 200,
      headers: { "Cache-Control": "public, max-age=5" },
    });
  }

  const report = await buildReport();
  cache = { at: now, report };

  return NextResponse.json(report, {
    status: report.status === "down" ? 503 : 200,
    headers: { "Cache-Control": "public, max-age=5" },
  });
}
