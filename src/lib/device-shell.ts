/**
 * Maps User-Agent → shell presentation mode for SSR / middleware.
 * “mobile” keeps the centered phone-frame on tablet/desktop widths when relevant.
 * “desktop” uses the full-width shell on laptop monitors (no faux phone bezel).
 */
export type ShellMode = "mobile" | "desktop";

export function inferShellModeFromUserAgent(
  ua: string | null | undefined,
): ShellMode {
  if (!ua || ua.trim().length === 0) return "desktop";

  const s = ua.toLowerCase();

  // Explicit tablets / pads (legacy UA tokens).
  if (/\bipad\b|\btablet\b|\bplaybook\b|\bsilk\b/.test(s)) {
    return "mobile";
  }

  // Android phones & tablets — WebView / Chrome on Android surface here.
  if (/\bandroid\b/.test(s)) {
    return "mobile";
  }

  // Phones & portable UA families.
  if (
    /\biphone\b|\bipod\b|\bblackberry\b|\bbb10\b|\bwebos\b|\bwindows phone\b|\biemobile\b|\bopera mini\b|\bmobile\b/.test(
      s,
    )
  ) {
    return "mobile";
  }

  return "desktop";
}
