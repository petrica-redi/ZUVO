import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { deepMergeMessages } from "@/lib/messages/merge-messages";
import en from "../../messages/en.json";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const localMod = (await import(`../../messages/${locale}.json`)).default;
  const messages =
    locale === "en" ? en : deepMergeMessages(en, localMod as typeof en);

  return {
    locale,
    messages,
  };
});
