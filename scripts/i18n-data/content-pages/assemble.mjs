/**
 * Assembles content-pages-translations.mjs from per-locale JSON bundles.
 * Run: node scripts/i18n-data/content-pages/assemble.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const LOCALES = readdirSync(HERE)
  .filter((f) => f.endsWith(".json") && !f.endsWith("-cache.json") && f !== "translation-cache.json")
  .map((f) => f.replace(/\.json$/, ""));

const enAll = JSON.parse(readFileSync(join(HERE, "..", "..", "..", "messages", "en.json"), "utf8"));
const enContent = {};
for (const ns of ["healthQuiz", "rights", "stories", "challenges", "certificate"]) {
  enContent[ns] = enAll[ns];
}

const translations = {
  en: enContent,
};

for (const locale of LOCALES) {
  translations[locale] = JSON.parse(readFileSync(join(HERE, `${locale}.json`), "utf8"));
}

const out = join(HERE, "..", "content-pages-translations.mjs");
writeFileSync(
  out,
  `/** Auto-assembled content page translations */\nexport const TRANSLATIONS = ${JSON.stringify(translations, null, 2)};\n`,
);
console.log(`Assembled en + ${LOCALES.join(", ")} -> ${out}`);
