/**
 * POST /api/mediator/pin-check
 *
 * Server-side verification of the optional mediator UI PIN. The PIN is a
 * UI-only convenience gate — the *real* mediator authorisation happens on
 * every protected endpoint via `requireMediator` (Supabase role + DB).
 *
 * Moving the check here means the PIN value is no longer shipped in the
 * client bundle. Configure via the server-only env `MEDIATOR_PIN`.
 * If unset, falls back to `"2026"` so dev/preview keeps working.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";

const schema = z.object({
  code: z.string().trim().min(1).max(32),
});

export async function POST(req: NextRequest) {
  const rate = await applyRateLimitAsync(req, {
    namespace: "mediator-pin",
    limit: 10,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, schema);
  if (!parsed.success) return parsed.response;

  const expected = process.env.MEDIATOR_PIN?.trim() || "2026";
  // Constant-time-ish comparison so timing leaks don't reveal the prefix.
  if (parsed.data.code.length !== expected.length) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= parsed.data.code.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (mismatch !== 0) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
