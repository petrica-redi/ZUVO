import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SEARCH_DIRS = [
  "./messages",
  "./scripts/i18n-data/student-health",
  "./scripts/i18n-data/core-pages/learn",
  "./scripts/i18n-data/content-pages"
];

const MAPPING = {
  'цоунтри': 'country',
  'левел': 'level',
  'цомплетед': 'completed',
  'тотал': 'total',
  'кп': 'xp',
  'тачно': 'correct',
  'стаге': 'stage',
  'фаза': 'stage',
  'пцт': 'pct',
  'цуррент': 'current',
  'дате': 'date',
  'ревиевер': 'reviewer',
  'титле': 'title',
  'н': 'n',
  'укупно': 'total',
  'мин': 'min',
  'цоунт': 'count',
  'сцоре': 'score',
  'типе': 'type',
  'веекс': 'weeks',
  'аге': 'age',
  'популатион': 'population',
  'нумбер': 'number',
  'регион': 'region',
  'data': 'date'
};

function fixString(str, file, keyPath) {
  return str.replace(/\{([^\}]+)\}/g, (match, inner) => {
    if (!inner.includes(",")) {
      const trimmed = inner.trim();
      if (MAPPING[trimmed]) {
        return `{${MAPPING[trimmed]}}`;
      }
    } else {
      const parts = inner.split(",");
      const varName = parts[0].trim();
      if (MAPPING[varName]) {
        parts[0] = parts[0].replace(varName, MAPPING[varName]);
      }
      
      if (parts[1]) {
        const type = parts[1].trim();
        if (type === "плурал" || type === "plural") {
          parts[1] = parts[1].replace(type, "plural");
        }
      }
      
      // For the rest of the parts, we might have cases like "one {# ...}" or "other {# ...}"
      for (let i = 2; i < parts.length; i++) {
        const casePart = parts[i];
        const matchCase = casePart.match(/^\s*([^\s\{]+)/);
        if (matchCase) {
          const caseName = matchCase[1];
          if (caseName === "оне" || caseName === "оnе") {
            parts[i] = casePart.replace(caseName, "one");
          } else if (caseName === "отхер" || caseName === "оtհеr") {
            parts[i] = casePart.replace(caseName, "other");
          }
        }
      }
      
      const replacedInner = parts.join(",");
      if (replacedInner !== inner) {
        console.log(`  [${file}] ${keyPath}: {${inner}} -> {${replacedInner}}`);
        return `{${replacedInner}}`;
      }
    }
    return match;
  });
}

function processObject(obj, file, currentPath = "") {
  let updated = false;
  if (typeof obj === "string") {
    const fixed = fixString(obj, file, currentPath);
    if (fixed !== obj) {
      return { val: fixed, updated: true };
    }
    return { val: obj, updated: false };
  } else if (typeof obj === "object" && obj !== null) {
    const newObj = Array.isArray(obj) ? [] : {};
    for (const [k, v] of Object.entries(obj)) {
      const nextPath = currentPath ? `${currentPath}.${k}` : k;
      const res = processObject(v, file, nextPath);
      newObj[k] = res.val;
      if (res.updated) updated = true;
    }
    return { val: newObj, updated };
  }
  return { val: obj, updated: false };
}

function main() {
  console.log("Auditing and fixing placeholders across all translation directories...");
  
  for (const dir of SEARCH_DIRS) {
    try {
      const files = readdirSync(dir).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
      for (const file of files) {
        const path = join(dir, file);
        const data = JSON.parse(readFileSync(path, "utf8"));
        const res = processObject(data, file);
        if (res.updated) {
          writeFileSync(path, JSON.stringify(res.val, null, 2) + "\n", "utf8");
          console.log(`Saved fixes to ${path}`);
        }
      }
    } catch (e) {
      console.log(`Warning: skipped directory ${dir} (${e.message})`);
    }
  }
  console.log("Done fixing placeholders.");
}

main();
