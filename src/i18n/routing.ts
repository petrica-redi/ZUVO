import { defineRouting } from "next-intl/routing";

export const LOCALES = [
  "en",  // English
  "it",  // Italian
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
  defaultLocale: "ro",
  localePrefix: "as-needed",
  // Disable automatic locale detection from Accept-Language headers.
  // Without this, navigating to an un-prefixed path (e.g. /chat) on a
  // browser set to English causes the middleware to redirect to /en/chat,
  // losing the user's selected Romanian locale.
  // Locale is controlled exclusively by the URL prefix or the language picker.
  localeDetection: false,
});
