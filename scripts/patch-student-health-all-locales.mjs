/**
 * Adds full studentHealth namespace translations to all supported locales.
 * Run: node scripts/patch-student-health-all-locales.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TRANSLATIONS } from "./i18n-data/student-health-translations.mjs";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES_DIR = join(ROOT_DIR, "messages");

const LOCALES = ["en", "it", "sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"];

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

function validateStudentHealth(locale, data) {
  const en = TRANSLATIONS.en;
  const enLeaves = leafPaths(en);
  const locLeaves = leafPaths(data);

  const missing = enLeaves.filter((p) => !locLeaves.includes(p));
  if (missing.length > 0) {
    throw new Error(`Missing keys for locale "${locale}": ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "..." : ""}`);
  }

  const extra = locLeaves.filter((p) => !enLeaves.includes(p));
  if (extra.length > 0) {
    throw new Error(`Unexpected keys for locale "${locale}": ${extra.slice(0, 5).join(", ")}`);
  }

  for (const path of enLeaves) {
    const value = getAtPath(data, path);
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`Invalid value at "${path}" for locale "${locale}"`);
    }
  }
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

const files = readdirSync(MESSAGES_DIR)
  .filter((name) => name.endsWith(".json") && !name.startsWith("_"))
  .sort();
const fileLocales = files.map((name) => name.replace(/\.json$/, ""));
const missingFiles = LOCALES.filter((locale) => !fileLocales.includes(locale));
const unexpectedFiles = fileLocales.filter((locale) => !LOCALES.includes(locale));
const missingTranslations = LOCALES.filter((locale) => !(locale in TRANSLATIONS));
const unexpectedTranslations = Object.keys(TRANSLATIONS).filter((locale) => !LOCALES.includes(locale));

if (missingFiles.length > 0 || unexpectedFiles.length > 0) {
  throw new Error(
    `Locale file mismatch. Missing files: [${missingFiles.join(", ")}]. Unexpected files: [${unexpectedFiles.join(", ")}].`,
  );
}

if (missingTranslations.length > 0 || unexpectedTranslations.length > 0) {
  throw new Error(
    `Translation map mismatch. Missing translations: [${missingTranslations.join(", ")}]. Unexpected translations: [${unexpectedTranslations.join(", ")}].`,
  );
}

for (const locale of LOCALES) {
  validateStudentHealth(locale, TRANSLATIONS[locale]);
}

for (const file of files) {
  const locale = file.replace(/\.json$/, "");
  const path = join(MESSAGES_DIR, file);
  const data = JSON.parse(readFileSync(path, "utf8"));
  const nextStudentHealth = JSON.parse(JSON.stringify(TRANSLATIONS[locale]));

  if (locale === "en" && JSON.stringify(data.studentHealth) === JSON.stringify(nextStudentHealth)) {
    console.log(`Verified ${file} studentHealth already matches source (${leafPaths(nextStudentHealth).length} keys)`);
    continue;
  }

  data.studentHealth = nextStudentHealth;
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`Patched ${file} with studentHealth (${leafPaths(nextStudentHealth).length} keys)`);
}

console.log(`Patched studentHealth namespace in ${files.length} locale files: ${fileLocales.join(", ")}`);
