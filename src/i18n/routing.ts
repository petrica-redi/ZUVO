import { defineRouting } from "next-intl/routing";

export const LOCALES = [
  "en",  // English
  "sq",  // Albanian
  "rom", // Romani
  "ro",  // Romanian
  "hu",  // Hungarian
  "sk",  // Slovak
  "cs",  // Czech
  "bg",  // Bulgarian
  "sr",  // Serbian
  "hr",  // Croatian
  "bs",  // Bosnian
  "mk",  // Macedonian
  "sl",  // Slovenian
  "el",  // Greek
  "tr",  // Turkish
] as const;

export type Locale = (typeof LOCALES)[number];

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "en",
  localePrefix: "as-needed",
});
