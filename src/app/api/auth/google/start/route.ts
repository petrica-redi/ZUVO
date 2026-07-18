import { NextRequest, NextResponse } from "next/server";
import {
  buildGoogleAuthorizeUrl,
  createOAuthState,
  createPkcePair,
  getGoogleOAuthConfig,
  persistOAuthCookies,
} from "@/lib/staff/google-native";

/**
 * Starts native Google OAuth (does not require Supabase Google provider).
 * GET /api/auth/google/start?locale=ro
 */
export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") || "ro";
  const config = getGoogleOAuthConfig();
  const origin = request.nextUrl.origin;
  const loginPath = locale === "ro" ? "/auth/login" : `/${locale}/auth/login`;

  if (!config) {
    return NextResponse.redirect(`${origin}${loginPath}?error=google_config`);
  }

  const state = createOAuthState();
  const { verifier, challenge } = createPkcePair();
  await persistOAuthCookies({ state, verifier, locale });

  return NextResponse.redirect(
    buildGoogleAuthorizeUrl({ config, state, challenge }),
  );
}
