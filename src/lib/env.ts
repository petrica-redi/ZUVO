import { z } from "zod";
import { LOCALES } from "@/i18n/routing";

/**
 * NOTE:
 * - This module must never crash the app when env vars are missing.
 * - Service wrappers are responsible for returning `null` when their config is unavailable.
 */

const localeEnum = z.enum(LOCALES);
export const supportedLocaleSchema = localeEnum;
export type SupportedLocale = z.infer<typeof localeEnum>;

const ALL_LOCALES = [...LOCALES] as SupportedLocale[];

function parseSupportedLocales(raw: string | undefined): SupportedLocale[] {
  if (!raw) return ALL_LOCALES;
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const parsed = parts
    .map((p) => (supportedLocaleSchema.safeParse(p).success ? (p as SupportedLocale) : null))
    .filter((v): v is SupportedLocale => v !== null);
  return parsed.length ? parsed : ALL_LOCALES;
}

// -------------------------
// App Config
// -------------------------
export type AppConfig = {
  appName: string;
  appUrl: string | null;
  defaultLocale: SupportedLocale;
  supportedLocales: SupportedLocale[];
};

export function getAppConfig(): AppConfig {
  const appName = process.env.NEXT_PUBLIC_APP_NAME?.trim() || "Sastipe";
  const defaultLocaleRaw = process.env.NEXT_PUBLIC_DEFAULT_LOCALE?.trim();
  const defaultLocale =
    defaultLocaleRaw && supportedLocaleSchema.safeParse(defaultLocaleRaw).success
      ? (defaultLocaleRaw as SupportedLocale)
      : "en";
  const supportedLocales = parseSupportedLocales(process.env.NEXT_PUBLIC_SUPPORTED_LOCALES);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || null;

  return { appName, appUrl, defaultLocale, supportedLocales };
}

// -------------------------
// OpenAI (or compatible) — used for all AI features
// -------------------------
export type OpenAIConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

export function getOpenAIConfig(): OpenAIConfig | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  const baseUrl = process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o";
  return { apiKey, baseUrl, model };
}

// -------------------------
// Supabase
// -------------------------
export type SupabaseConfig = {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
};

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !anonKey) return null;
  return { url, anonKey, serviceRoleKey: serviceRoleKey || undefined };
}

// -------------------------
// Anthropic (Claude)
// -------------------------
export type AnthropicConfig = {
  apiKey: string;
};

export function getAnthropicConfig(): AnthropicConfig | null {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return null;
  return { apiKey };
}

// -------------------------
// Firebase (FCM)
// -------------------------
export type FirebaseConfig = {
  apiKey: string;
  projectId: string;
  privateKey: string;
};

export function getFirebaseConfig(): FirebaseConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();

  if (!apiKey || !projectId || !privateKey) return null;
  return { apiKey, projectId, privateKey };
}

// -------------------------
// PostHog (Analytics)
// -------------------------
export type PosthogConfig = {
  key: string;
  host: string;
};

export function getPosthogConfig(): PosthogConfig | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim();
  if (!key || !host) return null;
  return { key, host };
}

// -------------------------
// Langfuse
// -------------------------
export type LangfuseConfig = {
  publicKey: string;
  secretKey: string;
  baseUrl: string;
};

export function getLangfuseConfig(): LangfuseConfig | null {
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY?.trim();
  const secretKey = process.env.LANGFUSE_SECRET_KEY?.trim();
  const baseUrl = process.env.LANGFUSE_BASE_URL?.trim();
  if (!publicKey || !secretKey || !baseUrl) return null;
  return { publicKey, secretKey, baseUrl };
}

// -------------------------
// Trigger.dev
// -------------------------
export function getTriggerSecretKey(): string | null {
  const key = process.env.TRIGGER_SECRET_KEY?.trim();
  if (!key) return null;
  return key;
}

// -------------------------
// Resend
// -------------------------
export type ResendConfig = {
  apiKey: string;
  fromEmail: string;
};

export function getResendConfig(): ResendConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !fromEmail) return null;
  return { apiKey, fromEmail };
}

// -------------------------
// Sentry
// -------------------------
export type SentryConfig = {
  dsn: string;
  org: string;
  project: string;
  authToken?: string;
};

export function getSentryConfig(): SentryConfig | null {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  const org = process.env.SENTRY_ORG?.trim();
  const project = process.env.SENTRY_PROJECT?.trim();
  const authToken = process.env.SENTRY_AUTH_TOKEN?.trim();
  if (!dsn || !org || !project) return null;
  return { dsn, org, project, authToken: authToken || undefined };
}

// -------------------------
// Database URL (Drizzle/Neon default)
// -------------------------
export function getDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  return url;
}

