/**
 * Lightweight confetti helper.
 *
 * Wraps `canvas-confetti` so callers don't have to import it directly,
 * respects `prefers-reduced-motion`, and stages the burst as a small
 * double-pop that feels celebratory but not gaudy.
 */
import type confetti from "canvas-confetti";

let _confetti: typeof confetti | null = null;
let _loading: Promise<typeof confetti> | null = null;

async function load(): Promise<typeof confetti> {
  if (_confetti) return _confetti;
  if (_loading) return _loading;
  _loading = import("canvas-confetti").then((m) => {
    _confetti = m.default;
    return _confetti;
  });
  return _loading;
}

type Options = {
  /** Where on the screen (0–1 ratios) to anchor the burst. Defaults to center. */
  origin?: { x?: number; y?: number };
  /** Match a specific colour palette. Defaults to brand + ember + sage. */
  colors?: string[];
};

const BRAND_COLORS = [
  "#6366F1", // brand-500
  "#4338CA", // brand-700
  "#F59E0B", // ember-500
  "#10B981", // sage-500
  "#FBBF24", // gold accent
];

/**
 * Fire a celebratory two-burst confetti effect at the given anchor.
 * Safe to call on the server / before mount — it's a no-op there.
 */
export async function celebrate(options: Options = {}) {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const { origin = { x: 0.5, y: 0.6 }, colors = BRAND_COLORS } = options;
  const fn = await load();
  if (!fn) return;

  fn({
    particleCount: 60,
    spread: 70,
    startVelocity: 38,
    ticks: 180,
    scalar: 0.9,
    origin,
    colors,
    disableForReducedMotion: true,
  });

  // Small follow-up burst to make the moment feel layered.
  window.setTimeout(() => {
    fn({
      particleCount: 30,
      spread: 110,
      startVelocity: 28,
      ticks: 140,
      scalar: 0.7,
      origin,
      colors,
      disableForReducedMotion: true,
    });
  }, 180);
}
