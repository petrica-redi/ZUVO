/**
 * Generates per-locale learn/*.json from compact module translation tables.
 * Run: node scripts/i18n-data/core-pages/generate-learn-json.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MODULE_TRANSLATIONS, TOP_TRANSLATIONS } from "./learn-modules.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LEARN_DIR = join(HERE, "learn");
const enLearn = JSON.parse(readFileSync(join(HERE, "../../../messages/en.json"), "utf8")).learn;

const LOCALES = ["sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"];

function setPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i += 1) cur = cur[parts[i]];
  cur[parts[parts.length - 1]] = value;
}

function buildLearn(locale) {
  const out = structuredClone(enLearn);
  for (const [path, values] of Object.entries(TOP_TRANSLATIONS)) {
    if (!(locale in values)) throw new Error(`Missing top ${path} for ${locale}`);
    setPath(out, path, values[locale]);
  }
  for (const [modulePath, fields] of Object.entries(MODULE_TRANSLATIONS)) {
    for (const [field, values] of Object.entries(fields)) {
      if (!(locale in values)) throw new Error(`Missing ${modulePath}.${field} for ${locale}`);
      setPath(out, `${modulePath}.${field}`, values[locale]);
    }
  }
  return out;
}

mkdirSync(LEARN_DIR, { recursive: true });
for (const locale of LOCALES) {
  const learn = buildLearn(locale);
  writeFileSync(join(LEARN_DIR, `${locale}.json`), JSON.stringify(learn, null, 2) + "\n");
  console.log(`Wrote learn/${locale}.json`);
}
