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
    merged[key] =
      isRecord(fallbackValue) && isRecord(value)
        ? mergeMessages(fallbackValue, value)
        : value;
  }

  return merged;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // English is the complete catalog; Romanian (default) and each locale layer on top.
  const en = (await import(`../../messages/en.json`)).default as Messages;
  const defaultMessages = (await import(
    `../../messages/${routing.defaultLocale}.json`
  )).default as Messages;
  const localeMessages =
    locale === "en"
      ? en
      : ((await import(`../../messages/${locale}.json`)).default as Messages);

  const catalog = mergeMessages(en, defaultMessages);
  const messages =
    locale === routing.defaultLocale
      ? catalog
      : locale === "en"
        ? mergeMessages(defaultMessages, en)
        : mergeMessages(catalog, localeMessages);

  return {
    locale,
    messages,
    getMessageFallback({ namespace, key }) {
      return namespace ? `${namespace}.${key}` : key;
    },
    onError(error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[i18n]", error.message);
      }
    },
  };
});
