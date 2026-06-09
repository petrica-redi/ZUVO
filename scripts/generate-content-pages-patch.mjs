/**
 * Generates scripts/patch-content-pages-all-locales.mjs with embedded TRANSLATIONS.
 * Run: node scripts/generate-content-pages-patch.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TRANSLATIONS } from "./i18n-data/content-pages-translations.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOCALES = ["en", "it", "sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"];
const NAMESPACES = ["healthQuiz", "rights", "stories", "challenges", "certificate"];

const patchBody = `/**
 * Adds full healthQuiz, rights, stories, challenges, certificate translations to all locales.
 * Run: node scripts/patch-content-pages-all-locales.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES_DIR = join(ROOT_DIR, "messages");

const LOCALES = ${JSON.stringify(LOCALES)};
const NAMESPACES = ${JSON.stringify(NAMESPACES)};

const TRANSLATIONS = ${JSON.stringify(TRANSLATIONS, null, 2)};

function leafPaths(obj, prefix = "") {
  const paths = [];
  if (obj === null || obj === undefined) return paths;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => paths.push(...leafPaths(item, \`\${prefix}[\${i}]\`)));
    return paths;
  }
  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      const next = prefix ? \`\${prefix}.\${key}\` : key;
      if (value && typeof value === "object") paths.push(...leafPaths(value, next));
      else paths.push(next);
    }
    return paths;
  }
  paths.push(prefix);
  return paths;
}

function getAtPath(obj, path) {
  const parts = path.replace(/\\[(\\d+)\\]/g, ".$1").split(".").filter(Boolean);
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}

function validateNamespace(locale, ns, enNs, locNs) {
  for (const path of leafPaths(enNs)) {
    if (getAtPath(locNs, path) === undefined) {
      throw new Error(\`Missing \${ns}.\${path} for locale "\${locale}"\`);
    }
  }
}

const files = readdirSync(MESSAGES_DIR)
  .filter((name) => name.endsWith(".json") && !name.startsWith("_"))
  .sort();
const fileLocales = files.map((name) => name.replace(/\\.json$/, ""));
const missingFiles = LOCALES.filter((locale) => !fileLocales.includes(locale));
if (missingFiles.length > 0) {
  throw new Error(\`Missing locale files: [\${missingFiles.join(", ")}]\`);
}

for (const locale of LOCALES) {
  if (!(locale in TRANSLATIONS)) throw new Error(\`Missing TRANSLATIONS for \${locale}\`);
  for (const ns of NAMESPACES) {
    validateNamespace(locale, ns, TRANSLATIONS.en[ns], TRANSLATIONS[locale][ns]);
  }
}

let patched = 0;
for (const file of files) {
  const locale = file.replace(/\\.json$/, "");
  const path = join(MESSAGES_DIR, file);
  const data = JSON.parse(readFileSync(path, "utf8"));
  let changed = false;
  for (const ns of NAMESPACES) {
    const next = JSON.parse(JSON.stringify(TRANSLATIONS[locale][ns]));
    if (JSON.stringify(data[ns]) !== JSON.stringify(next)) {
      data[ns] = next;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(path, JSON.stringify(data, null, 2) + "\\n");
    patched += 1;
    console.log(\`Patched \${file} — \${NAMESPACES.join(", ")}\`);
  } else {
    console.log(\`Verified \${file} already up to date\`);
  }
}

console.log(\`Done. Updated \${patched} of \${files.length} locale files.\`);
`;

writeFileSync(join(ROOT, "scripts/patch-content-pages-all-locales.mjs"), patchBody);
console.log(`Generated scripts/patch-content-pages-all-locales.mjs (${(patchBody.length / 1024).toFixed(0)} KB)`);
