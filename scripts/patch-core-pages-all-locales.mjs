/**
 * Adds learn, track, profile, and mediator namespace translations to all non-English locales.
 *
 * Prerequisite: scripts/i18n-data/core-pages-translations.mjs (assembled via
 *   node scripts/i18n-data/core-pages/assemble-translations.mjs)
 *
 * Run: node scripts/patch-core-pages-all-locales.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TRANSLATIONS } from "./i18n-data/core-pages-translations.mjs";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES_DIR = join(ROOT_DIR, "messages");
const NAMESPACES = ["learn", "track", "profile"];
const NON_EN_LOCALES = ["it", "sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"];

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

function validateNamespace(locale, ns, enNs, locNs) {
  const enLeaves = leafPaths(enNs);
  const missing = enLeaves.filter((p) => getAtPath(locNs, p) === undefined);
  if (missing.length > 0) {
    throw new Error(`Missing ${ns} keys for "${locale}": ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "..." : ""}`);
  }

  const englishCopies = enLeaves.filter((p) => {
    const enVal = getAtPath(enNs, p);
    const locVal = getAtPath(locNs, p);
    return typeof enVal === "string" && locVal === enVal;
  });
  if (englishCopies.length > 0) {
    throw new Error(
      `Untranslated ${ns} keys for "${locale}" (still English): ${englishCopies.slice(0, 5).join(", ")}${englishCopies.length > 5 ? "..." : ""}`,
    );
  }
}

const en = JSON.parse(readFileSync(join(MESSAGES_DIR, "en.json"), "utf8"));
const missingLocales = NON_EN_LOCALES.filter((locale) => !(locale in TRANSLATIONS));
if (missingLocales.length > 0) {
  throw new Error(`Missing translation bundles: ${missingLocales.join(", ")}`);
}

for (const locale of NON_EN_LOCALES) {
  for (const ns of NAMESPACES) {
    validateNamespace(locale, ns, en[ns], TRANSLATIONS[locale][ns]);
  }
}

let patchedCount = 0;
for (const locale of NON_EN_LOCALES) {
  const path = join(MESSAGES_DIR, `${locale}.json`);
  const data = JSON.parse(readFileSync(path, "utf8"));
  for (const ns of NAMESPACES) {
    data[ns] = JSON.parse(JSON.stringify(TRANSLATIONS[locale][ns]));
  }
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  patchedCount += 1;
  console.log(`Patched ${locale}.json — learn, track, profile, mediator`);
}

console.log(`Patched ${patchedCount} locale files: ${NON_EN_LOCALES.join(", ")}`);
