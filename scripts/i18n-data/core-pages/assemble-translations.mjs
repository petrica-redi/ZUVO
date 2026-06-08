/**
 * Assembles core-pages-translations.mjs from UI + per-locale learn JSON files.
 * Run: node scripts/i18n-data/core-pages/assemble-translations.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { UI } from "./ui.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LEARN_DIR = join(HERE, "learn");
const LOCALES = readdirSync(LEARN_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));

const translations = {};
for (const locale of LOCALES) {
  const learn = JSON.parse(readFileSync(join(LEARN_DIR, `${locale}.json`), "utf8"));
  const ui = UI[locale];
  if (!ui) throw new Error(`Missing UI bundle for ${locale}`);
  translations[locale] = {
    learn,
    track: ui.track,
    profile: ui.profile,
    mediator: ui.mediator,
  };
}

const out = `/** Auto-assembled — run assemble-translations.mjs to regenerate */\nexport const TRANSLATIONS = ${JSON.stringify(translations, null, 2)};\n`;
writeFileSync(join(HERE, "..", "core-pages-translations.mjs"), out);
console.log(`Assembled translations for: ${LOCALES.join(", ")}`);
