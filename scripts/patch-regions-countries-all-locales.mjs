/**
 * Patches regions.countries content into all locale message files.
 * Run: node scripts/patch-regions-countries-all-locales.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ENGLISH_COUNTRIES, REGION_IDS } from "./i18n-data/regions-countries-en.mjs";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES_DIR = join(ROOT_DIR, "messages");
const LOCALES_DIR = join(ROOT_DIR, "scripts/i18n-data/regions-countries/locales");

const LOCALES = ["en", "it", "sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"];

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validateCountry(locale, regionId, country) {
  if (!country?.healthChallenges || typeof country.healthChallenges !== "object") {
    throw new Error(`Missing countries.${regionId}.healthChallenges for locale "${locale}"`);
  }
  for (let i = 0; i < 5; i++) {
    const key = String(i);
    if (typeof country.healthChallenges[key] !== "string" || !country.healthChallenges[key].trim()) {
      throw new Error(`Missing countries.${regionId}.healthChallenges.${key} for locale "${locale}"`);
    }
  }
  if (typeof country.keyFact !== "string" || !country.keyFact.trim()) {
    throw new Error(`Missing countries.${regionId}.keyFact for locale "${locale}"`);
  }
  if (!country.organizations || typeof country.organizations !== "object") {
    throw new Error(`Missing countries.${regionId}.organizations for locale "${locale}"`);
  }
  const orgKeys = Object.keys(country.organizations);
  if (orgKeys.length < 2) {
    throw new Error(`Expected at least 2 organizations for ${regionId} in locale "${locale}"`);
  }
  for (const key of orgKeys) {
    if (typeof country.organizations[key]?.focus !== "string" || !country.organizations[key].focus.trim()) {
      throw new Error(`Missing countries.${regionId}.organizations.${key}.focus for locale "${locale}"`);
    }
  }
}

function validateCountries(locale, countries) {
  for (const regionId of REGION_IDS) {
    if (!countries[regionId]) {
      throw new Error(`Missing countries.${regionId} for locale "${locale}"`);
    }
    validateCountry(locale, regionId, countries[regionId]);
  }
}

async function loadLocaleCountries(locale) {
  if (locale === "en") return deepClone(ENGLISH_COUNTRIES);
  const path = join(LOCALES_DIR, `${locale}.mjs`);
  const mod = await import(pathToFileURL(path).href);
  return deepClone(mod.COUNTRIES);
}

async function main() {
  const files = readdirSync(MESSAGES_DIR)
    .filter((name) => name.endsWith(".json") && !name.startsWith("_"))
    .sort();

  const fileLocales = files.map((name) => name.replace(/\.json$/, ""));
  const missingFiles = LOCALES.filter((locale) => !fileLocales.includes(locale));
  if (missingFiles.length > 0) {
    throw new Error(`Missing locale files: [${missingFiles.join(", ")}]`);
  }

  const translations = {};
  for (const locale of LOCALES) {
    translations[locale] = await loadLocaleCountries(locale);
    validateCountries(locale, translations[locale]);
  }

  for (const locale of LOCALES) {
    const path = join(MESSAGES_DIR, `${locale}.json`);
    const data = JSON.parse(readFileSync(path, "utf8"));
    data.regions = {
      ...data.regions,
      countries: deepClone(translations[locale]),
    };
    writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`Patched ${locale}.json with regions.countries (${REGION_IDS.length} countries)`);
  }

  console.log(`Patched regions.countries in ${LOCALES.length} locale files: ${LOCALES.join(", ")}`);
}

await main();
