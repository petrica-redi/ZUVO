/* eslint @typescript-eslint/no-explicit-any: off -- deep merge of JSON message trees */
export function isPlainObject(
  v: unknown,
): v is Record<string, string | number | boolean | null | object> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * Recursively merge partial locale overrides on top of English base messages
 * (next-intl requires complete keys; partial JSONs stay maintainable for translators).
 */
export function deepMergeMessages<T>(base: T, override: unknown): T {
  if (override === null || override === undefined) {
    return base;
  }
  if (!isPlainObject(base) && !isPlainObject(override)) {
    return (override as T) ?? base;
  }
  if (isPlainObject(base) && isPlainObject(override)) {
    const out = { ...base } as Record<string, unknown>;
    for (const k of Object.keys(override)) {
      const ok = (override as Record<string, unknown>)[k];
      const bk = (base as Record<string, unknown>)[k];
      if (isPlainObject(bk) && isPlainObject(ok)) {
        out[k] = deepMergeMessages(bk, ok);
      } else if (ok !== undefined) {
        out[k] = ok;
      }
    }
    return out as T;
  }
  return (override as T) ?? base;
}
