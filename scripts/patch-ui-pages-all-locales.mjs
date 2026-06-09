/**
 * Patches UI page namespaces into all locale message files.
 * Run: node scripts/patch-ui-pages-all-locales.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TRANSLATIONS } from "./i18n-data/ui-pages-translations.mjs";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES_DIR = join(ROOT_DIR, "messages");

const LOCALES = ["en", "it", "sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"];
const EXISTING_UI_PAGE_LOCALES = new Set(["sq", "rom"]);
const SQ_ROM_EXTRA_NAMESPACES = ["healthQuiz", "rights", "stories", "challenges", "certificate"];
const NEW_UI_PAGE_LOCALES = ["it", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"];
const NEW_UI_PAGE_NAMESPACES = [
  "explain",
  "symptoms",
  "consult",
  "navigate",
  "about",
  "theme",
  "emergency",
  "voice",
  "severity",
];

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function leafPaths(obj, prefix = "") {
  const paths = [];
  if (obj === null || obj === undefined) return paths;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => paths.push(...leafPaths(item, `${prefix}[${i}]`)));
    return paths;
  }
  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      const next = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object") paths.push(...leafPaths(value, next));
      else paths.push(next);
    }
    return paths;
  }
  paths.push(prefix);
  return paths;
}

function getAtPath(obj, path) {
  const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}

function validateNamespace(locale, namespace, value, english) {
  if (!value || typeof value !== "object") {
    throw new Error(`Missing ${namespace} object for locale "${locale}"`);
  }
  for (const path of leafPaths(english)) {
    if (getAtPath(value, path) === undefined) {
      throw new Error(`Missing ${namespace}.${path} for locale "${locale}"`);
    }
  }
}

function hasNamespace(data, namespace) {
  return Object.prototype.hasOwnProperty.call(data, namespace);
}

function namespacesForLocale(locale) {
  if (NEW_UI_PAGE_LOCALES.includes(locale)) return NEW_UI_PAGE_NAMESPACES;
  if (EXISTING_UI_PAGE_LOCALES.has(locale)) return SQ_ROM_EXTRA_NAMESPACES;
  return [];
}

function main() {
  const files = readdirSync(MESSAGES_DIR)
    .filter((name) => name.endsWith(".json") && !name.startsWith("_"))
    .sort();

  const fileLocales = files.map((name) => name.replace(/\.json$/, ""));
  const missingFiles = LOCALES.filter((locale) => !fileLocales.includes(locale));
  if (missingFiles.length > 0) {
    throw new Error(`Missing locale files: [${missingFiles.join(", ")}]`);
  }

  const patchLocales = [...NEW_UI_PAGE_LOCALES, ...EXISTING_UI_PAGE_LOCALES];
  const missingTranslationLocales = patchLocales.filter((locale) => !(locale in TRANSLATIONS));
  if (missingTranslationLocales.length > 0) {
    throw new Error(`Missing TRANSLATIONS for: [${missingTranslationLocales.join(", ")}]`);
  }

  const localeData = Object.fromEntries(
    files.map((file) => {
      const locale = file.replace(/\.json$/, "");
      return [locale, JSON.parse(readFileSync(join(MESSAGES_DIR, file), "utf8"))];
    }),
  );

  const english = localeData.en;

  for (const locale of patchLocales) {
    for (const namespace of namespacesForLocale(locale)) {
      if (!english[namespace]) {
        throw new Error(`messages/en.json is missing ${namespace} namespace`);
      }
      if (!(namespace in TRANSLATIONS[locale])) {
        throw new Error(`Missing TRANSLATIONS[${locale}][${namespace}]`);
      }
      validateNamespace(locale, namespace, TRANSLATIONS[locale][namespace], english[namespace]);
    }
  }

  const updates = [];

  for (const locale of patchLocales) {
    const data = localeData[locale];
    const patched = [];

    for (const namespace of namespacesForLocale(locale)) {
      if (EXISTING_UI_PAGE_LOCALES.has(locale) && hasNamespace(data, namespace)) {
        continue;
      }
      data[namespace] = deepClone(TRANSLATIONS[locale][namespace]);
      patched.push(namespace);
    }

    if (patched.length > 0) {
      writeFileSync(join(MESSAGES_DIR, `${locale}.json`), `${JSON.stringify(data, null, 2)}\n`);
      updates.push({ locale, namespaces: patched });
      console.log(`Patched ${locale}.json (${patched.length} namespaces): ${patched.join(", ")}`);
    }
  }

  if (updates.length === 0) {
    console.log("No locale files needed patching.");
  } else {
    console.log(`\nPatched UI page namespaces in ${updates.length} locale files.`);
    for (const { locale, namespaces } of updates) {
      console.log(`  ${locale}: ${namespaces.join(", ")}`);
    }
  }
}

main();
