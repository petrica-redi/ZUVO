/**
 * Resolve message JSON merge conflicts: keep PR #4 translations, add main-only namespaces.
 * Run during merge: node scripts/resolve-merge-messages.mjs
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const MAIN_ONLY = ["policies", "terms", "training"];

const LANGUAGE_COUNT_PATHS = [
  ["landing", "trustBadge2"],
  ["landing", "heroBadgeLanguages"],
  ["about", "values", "languagesLabel"],
];

function load(ref, file) {
  return JSON.parse(execSync(`git show ${ref}:messages/${file}`, { encoding: "utf8" }));
}

function getAt(obj, path) {
  return path.reduce((cur, key) => cur?.[key], obj);
}

function setAt(obj, path, value) {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!cur[key] || typeof cur[key] !== "object") cur[key] = {};
    cur = cur[key];
  }
  cur[path[path.length - 1]] = value;
}

const files = execSync("git diff --name-only --diff-filter=U", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((f) => f.startsWith("messages/") && f.endsWith(".json"))
  .map((f) => f.replace("messages/", ""));

for (const file of files) {
  const head = load("HEAD", file);
  const main = load("origin/main", file);
  const merged = structuredClone(head);

  for (const ns of MAIN_ONLY) {
    if (main[ns]) merged[ns] = main[ns];
  }

  for (const path of LANGUAGE_COUNT_PATHS) {
    const mainVal = getAt(main, path);
    if (mainVal !== undefined && getAt(merged, path) !== undefined) {
      setAt(merged, path, mainVal);
    }
  }

  writeFileSync(join(ROOT, "messages", file), `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`resolved messages/${file}`);
}
