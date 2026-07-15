/** Strip CMS custom CSS patterns that can block all UI interaction. */
export function sanitizeCustomCss(css: string | null | undefined): string {
  if (!css?.trim()) return "";

  let safe = css;

  // Never allow global interaction lockouts from admin-injected CSS.
  safe = safe.replace(/pointer-events\s*:\s*none/gi, "pointer-events: auto");
  safe = safe.replace(/user-select\s*:\s*none/gi, "user-select: auto");

  // Block full-viewport fixed traps injected via pseudo-elements.
  if (/position\s*:\s*fixed[\s\S]*inset\s*:\s*0/i.test(safe) && /z-index\s*:\s*\d{4,}/i.test(safe)) {
    return "";
  }

  return safe;
}
