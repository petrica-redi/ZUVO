import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

function isRecord(value: unknown): value is Messages {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeMessages(fallback: Messages, messages: Messages): Messages {
  const merged: Messages = { ...fallback };

  for (const [key, value] of Object.entries(messages)) {
    const fallbackValue = merged[key];
    merged[key] = isRecord(fallbackValue) && isRecord(value) ? mergeMessages(fallbackValue, value) : value;
  }

  return merged;
}

const FALLBACK_LOCALE = "en" as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const english = (await import(`../../messages/${FALLBACK_LOCALE}.json`)).default;

  if (locale === FALLBACK_LOCALE) {
    return { locale, messages: english };
  }

  const localeMessages = (await import(`../../messages/${locale}.json`)).default;

  // Always use English as the fallback layer so that any key missing from a
  // locale file shows in English rather than in the default locale (Romanian).
  return {
    locale,
    messages: mergeMessages(english, localeMessages),
  };
});
