/**
 * Patches regions UI keys (romaPop, detail.*, healthIndex.*) into all locale files.
 * Run: node scripts/patch-regions-ui-all-locales.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { REGIONS_UI_TRANSLATIONS } from "./i18n-data/regions-ui-translations.mjs";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES_DIR = join(ROOT_DIR, "messages");

const LOCALES = ["en", "it", "sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"];
const UI_KEYS = ["romaPop", "detail", "healthIndex"];

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function extractExistingUi(locale, regions) {
  const ui = {};
  for (const key of UI_KEYS) {
    ui[key] = regions[key];
  }
  return ui;
}

function validateUi(locale, ui) {
  if (typeof ui.romaPop !== "string" || !ui.romaPop.trim()) {
    throw new Error(`Missing regions.romaPop for locale "${locale}"`);
  }
  const detailKeys = [
    "back",
    "romaPopulation",
    "ofTotal",
    "healthAccess",
    "healthChallenges",
    "organizationsHelp",
    "emergency",
    "ambulance",
    "askAboutHealth",
  ];
  for (const key of detailKeys) {
    if (typeof ui.detail?.[key] !== "string" || !ui.detail[key].trim()) {
      throw new Error(`Missing regions.detail.${key} for locale "${locale}"`);
    }
  }
  for (const key of ["veryPoor", "poor", "fair", "good", "excellent"]) {
    if (typeof ui.healthIndex?.[key] !== "string" || !ui.healthIndex[key].trim()) {
      throw new Error(`Missing regions.healthIndex.${key} for locale "${locale}"`);
    }
  }
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

  const localeData = Object.fromEntries(
    files.map((file) => {
      const locale = file.replace(/\.json$/, "");
      return [locale, JSON.parse(readFileSync(join(MESSAGES_DIR, file), "utf8"))];
    }),
  );

  const englishRegions = localeData.en?.regions;
  if (!englishRegions) {
    throw new Error("messages/en.json is missing regions namespace");
  }

  const englishUi = extractExistingUi("en", englishRegions);
  validateUi("en", englishUi);

  for (const locale of LOCALES) {
    if (locale === "en") continue;

    const ui = locale === "ro" && localeData.ro.regions?.romaPop
      ? extractExistingUi(locale, localeData.ro.regions)
      : deepClone(REGIONS_UI_TRANSLATIONS[locale]);

    validateUi(locale, ui);

    const data = localeData[locale];
    data.regions = {
      ...data.regions,
      ...ui,
    };

    writeFileSync(join(MESSAGES_DIR, `${locale}.json`), `${JSON.stringify(data, null, 2)}\n`);
    console.log(`Patched ${locale}.json with regions UI keys`);
  }

  console.log(`Patched regions UI in ${LOCALES.length - 1} non-English locale files`);
}

main();
