/**
 * Overlays hand-crafted top-level learn strings onto generated learn/*.json files.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TOP_TRANSLATIONS } from "./learn-modules.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LEARN_DIR = join(HERE, "learn");

function setPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i += 1) cur = cur[parts[i]];
  cur[parts[parts.length - 1]] = value;
}

for (const file of readdirSync(LEARN_DIR).filter((f) => f.endsWith(".json"))) {
  const locale = file.replace(/\.json$/, "");
  const learn = JSON.parse(readFileSync(join(LEARN_DIR, file), "utf8"));
  for (const [path, values] of Object.entries(TOP_TRANSLATIONS)) {
    if (!(locale in values)) continue;
    setPath(learn, path, values[locale]);
  }
  writeFileSync(join(LEARN_DIR, file), JSON.stringify(learn, null, 2) + "\n");
  console.log(`Overlaid top learn strings for ${locale}`);
}
