export type FontOption = {
  id: string;
  label: string;
  family: string;
  /** Google Fonts weights to load */
  weights: string;
};

export const FONT_SANS_OPTIONS: FontOption[] = [
  { id: "inter", label: "Inter (default)", family: "Inter", weights: "400;500;600;700" },
  { id: "dm-sans", label: "DM Sans", family: "DM Sans", weights: "400;500;600;700" },
  { id: "source-sans-3", label: "Source Sans 3", family: "Source Sans 3", weights: "400;600;700" },
  { id: "nunito-sans", label: "Nunito Sans", family: "Nunito Sans", weights: "400;600;700" },
  { id: "work-sans", label: "Work Sans", family: "Work Sans", weights: "400;500;600;700" },
];

export const FONT_DISPLAY_OPTIONS: FontOption[] = [
  { id: "geist", label: "Geist (default)", family: "Geist", weights: "400;500;600;700" },
  { id: "plus-jakarta", label: "Plus Jakarta Sans", family: "Plus Jakarta Sans", weights: "500;600;700;800" },
  { id: "outfit", label: "Outfit", family: "Outfit", weights: "500;600;700;800" },
  { id: "manrope", label: "Manrope", family: "Manrope", weights: "500;600;700;800" },
  { id: "sora", label: "Sora", family: "Sora", weights: "500;600;700;800" },
];

export const FONT_EDITORIAL_OPTIONS: FontOption[] = [
  { id: "fraunces", label: "Fraunces (default)", family: "Fraunces", weights: "400;500;600;700" },
  { id: "lora", label: "Lora", family: "Lora", weights: "400;500;600;700" },
  { id: "playfair", label: "Playfair Display", family: "Playfair Display", weights: "400;500;600;700" },
  { id: "dm-serif", label: "DM Serif Display", family: "DM Serif Display", weights: "400" },
  { id: "libre-baskerville", label: "Libre Baskerville", family: "Libre Baskerville", weights: "400;700" },
];

const ALL_OPTIONS = [...FONT_SANS_OPTIONS, ...FONT_DISPLAY_OPTIONS, ...FONT_EDITORIAL_OPTIONS];

export function findFontOption(id: string | null | undefined): FontOption | null {
  if (!id) return null;
  return ALL_OPTIONS.find((f) => f.id === id) ?? null;
}

function googleFamilyParam(family: string): string {
  return family.replace(/ /g, "+");
}

export type FontStyles = {
  linkHref: string | null;
  css: string;
};

/**
 * Builds a Google Fonts stylesheet URL and CSS variable overrides from admin config.
 * Falls back to build-time Next.js fonts when no override is set.
 */
export function buildFontStyles(config: {
  fontSans?: string | null;
  fontDisplay?: string | null;
  fontEditorial?: string | null;
}): FontStyles {
  const sans = findFontOption(config.fontSans);
  const display = findFontOption(config.fontDisplay);
  const editorial = findFontOption(config.fontEditorial);

  const families: string[] = [];
  const rules: string[] = [];

  if (sans) {
    families.push(`family=${googleFamilyParam(sans.family)}:wght@${sans.weights}`);
    rules.push(`--font-sans: '${sans.family}', ui-sans-serif, system-ui, sans-serif;`);
  }
  if (display) {
    families.push(`family=${googleFamilyParam(display.family)}:wght@${display.weights}`);
    rules.push(`--font-display: '${display.family}', ui-sans-serif, system-ui, sans-serif;`);
  }
  if (editorial) {
    families.push(`family=${googleFamilyParam(editorial.family)}:wght@${editorial.weights}`);
    rules.push(`--font-editorial: '${editorial.family}', Georgia, 'Times New Roman', serif;`);
  }

  if (families.length === 0) {
    return { linkHref: null, css: "" };
  }

  const linkHref = `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
  const css = `:root { ${rules.join(" ")} }`;
  return { linkHref, css };
}
