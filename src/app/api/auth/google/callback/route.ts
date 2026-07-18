import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  exchangeGoogleCode,
  getGoogleOAuthConfig,
  readAndClearOAuthCookies,
} from "@/lib/staff/google-native";
import { upsertOAuthStaffAccount } from "@/lib/staff/actions";

function localePath(locale: string, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "ro") return clean;
  return `/${locale}${clean}`;
}

/** Deterministic UUID from Google `sub` for staff_accounts.supabase_auth_id. */
function googleSubToUuid(sub: string): string {
  const hex = createHash("sha256").update(`google:${sub}`).digest("hex");
  const variant = ((parseInt(hex.slice(16, 18), 16) & 0x3f) | 0x80)
    .toString(16)
    .padStart(2, "0");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `${variant}${hex.slice(18, 20)}`,
    hex.slice(20, 32),
  ].join("-");
}

/**
 * Google OAuth callback for native (non-Supabase) Google login.
 * GET /api/auth/google/callback?code=...&state=...
 */
export async function GET(request: NextRequest) {
  const config = getGoogleOAuthConfig();
  const origin = new URL(request.url).origin;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");

  const stored = await readAndClearOAuthCookies();
  const locale = stored?.locale || "ro";

  if (oauthError || !config || !code || !state || !stored || state !== stored.state) {
    return NextResponse.redirect(
      `${origin}${localePath(locale, "/auth/login")}?error=oauth`,
    );
  }

  const profile = await exchangeGoogleCode({
    config,
    code,
    verifier: stored.verifier,
  });

  if (!profile) {
    return NextResponse.redirect(
      `${origin}${localePath(locale, "/auth/login")}?error=oauth`,
    );
  }

  const result = await upsertOAuthStaffAccount({
    email: profile.email,
    displayName: profile.name,
    supabaseAuthId: googleSubToUuid(profile.sub),
    provider: "google",
  });

  return NextResponse.redirect(
    `${origin}${localePath(locale, result.redirectTo || "/auth/pending")}`,
  );
}
