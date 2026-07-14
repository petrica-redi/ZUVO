let sequence = 0;

/** Generate human-readable case numbers: REDI-RO-2026-00042 */
export function generateCaseNumber(countryCode = "RO"): string {
  sequence += 1;
  const year = new Date().getFullYear();
  const seq = String(sequence).padStart(5, "0");
  return `REDI-${countryCode.toUpperCase()}-${year}-${seq}`;
}

export function generateIntakeReference(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HELP-${ts}-${rand}`;
}

/** Reset sequence in tests only */
export function _resetCaseSequenceForTests(): void {
  sequence = 0;
}
