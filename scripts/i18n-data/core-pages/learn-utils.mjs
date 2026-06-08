/** Helpers to build nested learn namespace from flat key maps. */

export function flattenLearn(obj, prefix = "") {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out[path] = value;
    else Object.assign(out, flattenLearn(value, path));
  }
  return out;
}

export function buildLearnFromFlat(flat, template) {
  const out = structuredClone(template);
  for (const [path, value] of Object.entries(flat)) {
    const parts = path.split(".");
    let cur = out;
    for (let i = 0; i < parts.length - 1; i += 1) {
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }
  return out;
}
