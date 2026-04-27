import type { Locale } from "@/i18n/routing";

/**
 * Map UI locale to emergency-number region keys used in SosButton / regions data.
 * Romani ("rom") spans many countries — we default to EU 112.
 */
const LOCALE_TO_REGION: Partial<Record<Locale, string>> = {
  en: "default",
  sq: "albania",
  rom: "slovakia",
  ro: "romania",
  hu: "hungary",
  sk: "slovakia",
  cs: "czech",
  bg: "bulgaria",
  sr: "serbia",
  hr: "croatia",
  bs: "bosnia",
  mk: "northmacedonia",
  sl: "slovenia",
  el: "greece",
  tr: "turkey",
};

export function getEmergencyRegionForLocale(locale: string | undefined): string {
  if (!locale) return "default";
  const r = LOCALE_TO_REGION[locale as Locale];
  return r ?? "default";
}
