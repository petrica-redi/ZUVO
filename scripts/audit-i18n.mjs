/**
 * Reports i18n coverage per locale vs messages/en.json.
 * Run: node scripts/audit-i18n.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES = join(ROOT, "messages");

const PAGE_NAMESPACES = [
  "learn",
  "track",
  "profile",
  "mediator",
  "healthQuiz",
  "rights",
  "stories",
  "challenges",
  "certificate",
  "explain",
  "symptoms",
  "consult",
  "navigate",
  "about",
  "family",
  "glossary",
  "vaccines",
  "theme",
  "emergency",
  "voice",
  "severity",
  "studentHealth",
  "regions",
];

function leafPaths(obj, prefix = "") {
  const paths = [];
  if (obj === null || obj === undefined) return paths;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      paths.push(...leafPaths(item, `${prefix}[${i}]`));
    });
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

const en = JSON.parse(readFileSync(join(MESSAGES, "en.json"), "utf8"));
const localeFiles = readdirSync(MESSAGES).filter((f) => f.endsWith(".json") && !f.startsWith("_"));

console.log("i18n audit — page namespaces vs en.json\n");

let totalMissing = 0;

for (const file of localeFiles.sort()) {
  const locale = file.replace(".json", "");
  if (locale === "en") continue;

  const data = JSON.parse(readFileSync(join(MESSAGES, file), "utf8"));
  const missingNamespaces = [];
  const partialNamespaces = [];

  for (const ns of PAGE_NAMESPACES) {
    if (!(ns in en)) continue;
    if (!(ns in data)) {
      missingNamespaces.push(ns);
      continue;
    }
    const enLeaves = leafPaths(en[ns]);
    const missingLeaves = enLeaves.filter((p) => {
      const enVal = getAtPath(en[ns], p);
      const locVal = getAtPath(data[ns], p);
      return locVal === undefined;
    });
    const englishLeaves = enLeaves.filter((p) => {
      const enVal = getAtPath(en[ns], p);
      const locVal = getAtPath(data[ns], p);
      return typeof enVal === "string" && locVal === enVal;
    });
    if (missingLeaves.length > 0 || englishLeaves.length > 0) {
      partialNamespaces.push({
        ns,
        missing: missingLeaves.length,
        english: englishLeaves.length,
        total: enLeaves.length,
      });
    }
  }

  const nsMissing = missingNamespaces.length;
  const leafGap = partialNamespaces.reduce((s, p) => s + p.missing + p.english, 0);
  totalMissing += nsMissing + leafGap;

  console.log(`## ${locale}`);
  if (missingNamespaces.length) {
    console.log(`  Missing namespaces (${missingNamespaces.length}): ${missingNamespaces.join(", ")}`);
  }
  if (partialNamespaces.length) {
    const worst = partialNamespaces
      .sort((a, b) => b.missing + b.english - (a.missing + a.english))
      .slice(0, 8);
    for (const p of worst) {
      console.log(
        `  ${p.ns}: ${p.missing} missing keys, ${p.english}/${p.total} still English`,
      );
    }
  }
  if (!missingNamespaces.length && !partialNamespaces.length) {
    console.log("  ✓ All page namespaces present and translated");
  }
  console.log();
}

console.log(`Total gap score (lower is better): ${totalMissing}`);
