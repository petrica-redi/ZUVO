import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";

const STATE_COOKIE = "google_oauth_state";
const VERIFIER_COOKIE = "google_oauth_verifier";
const COOKIE_MAX_AGE = 60 * 10;

export type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export function getGoogleOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://redi.healthcare";

  return {
    clientId,
    clientSecret,
    redirectUri: `${appUrl}/api/auth/google/callback`,
  };
}

export function isNativeGoogleOAuthConfigured(): boolean {
  return getGoogleOAuthConfig() !== null;
}

function base64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function createPkcePair(): { verifier: string; challenge: string } {
  const verifier = base64url(randomBytes(32));
  const challenge = base64url(createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

export function createOAuthState(): string {
  return base64url(randomBytes(16));
}

export async function persistOAuthCookies(input: {
  state: string;
  verifier: string;
  locale: string;
}) {
  const jar = await cookies();
  const common = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  };
  jar.set(STATE_COOKIE, `${input.state}.${input.locale}`, common);
  jar.set(VERIFIER_COOKIE, input.verifier, common);
}

export async function readAndClearOAuthCookies(): Promise<{
  state: string;
  locale: string;
  verifier: string;
} | null> {
  const jar = await cookies();
  const rawState = jar.get(STATE_COOKIE)?.value;
  const verifier = jar.get(VERIFIER_COOKIE)?.value;
  jar.delete(STATE_COOKIE);
  jar.delete(VERIFIER_COOKIE);
  if (!rawState || !verifier) return null;
  const [state, locale = "ro"] = rawState.split(".");
  if (!state) return null;
  return { state, locale, verifier };
}

export function buildGoogleAuthorizeUrl(input: {
  config: GoogleOAuthConfig;
  state: string;
  challenge: string;
}): string {
  const params = new URLSearchParams({
    client_id: input.config.clientId,
    redirect_uri: input.config.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: input.state,
    code_challenge: input.challenge,
    code_challenge_method: "S256",
    access_type: "offline",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeGoogleCode(input: {
  config: GoogleOAuthConfig;
  code: string;
  verifier: string;
}): Promise<{
  email: string;
  name: string;
  sub: string;
} | null> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: input.code,
      client_id: input.config.clientId,
      client_secret: input.config.clientSecret,
      redirect_uri: input.config.redirectUri,
      grant_type: "authorization_code",
      code_verifier: input.verifier,
    }),
  });

  if (!tokenRes.ok) return null;
  const tokens = (await tokenRes.json()) as {
    access_token?: string;
    id_token?: string;
  };
  if (!tokens.access_token) return null;

  const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!profileRes.ok) return null;
  const profile = (await profileRes.json()) as {
    email?: string;
    email_verified?: boolean | string;
    name?: string;
    sub?: string;
  };

  if (!profile.email || !profile.sub) return null;
  if (profile.email_verified === false || profile.email_verified === "false") {
    return null;
  }

  return {
    email: profile.email,
    name: profile.name || profile.email.split("@")[0] || "User",
    sub: profile.sub,
  };
}
