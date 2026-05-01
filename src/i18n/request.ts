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

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages:
      locale === routing.defaultLocale
        ? messages
        : mergeMessages((await import(`../../messages/${routing.defaultLocale}.json`)).default, messages),
  };
});
