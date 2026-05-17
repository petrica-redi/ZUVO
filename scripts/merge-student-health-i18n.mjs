/**
 * Merges messages/_studentHealth.json into every messages/*.json (except this fragment).
 * Run from repo root: node scripts/merge-student-health-i18n.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const fragPath = path.join(root, "messages", "_studentHealth.json");
const frag = JSON.parse(fs.readFileSync(fragPath, "utf8"));
const dir = path.join(root, "messages");

for (const name of fs.readdirSync(dir)) {
  if (!name.endsWith(".json") || name.startsWith("_")) continue;
  const p = path.join(dir, name);
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  data.studentHealth = frag;
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}
console.log("Merged studentHealth into all message files.");
