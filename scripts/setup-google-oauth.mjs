#!/usr/bin/env node
/**
 * Enable Google / Gmail login for Redi Health.
 *
 * Two modes (either is enough for the button to work):
 *
 * A) Native app OAuth (recommended — no Supabase Google provider needed)
 *    Requires: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 *    Writes them to Vercel Production via `vercel env`.
 *
 * B) Supabase Auth Google provider
 *    Requires: SUPABASE_ACCESS_TOKEN, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 *    PATCH https://api.supabase.com/v1/projects/{ref}/config/auth
 *
 * Create Google credentials:
 *   https://console.cloud.google.com/auth/clients
 *   Type: Web application
 *   Redirect URIs:
 *     - https://redi.healthcare/api/auth/google/callback   (native)
 *     - https://zukissjunpxmlrgbvbtb.supabase.co/auth/v1/callback  (Supabase)
 *
 * Supabase access token:
 *   https://supabase.com/dashboard/account/tokens
 *
 * Usage:
 *   export GOOGLE_CLIENT_ID=....apps.googleusercontent.com
 *   export GOOGLE_CLIENT_SECRET=....
 *   export VERCEL_TOKEN=....          # already set in CI
 *   export SUPABASE_ACCESS_TOKEN=.... # optional, for mode B
 *   node scripts/setup-google-oauth.mjs
 */

import { spawnSync } from "node:child_process";

const REF = "zukissjunpxmlrgbvbtb";
const NATIVE_REDIRECT = "https://redi.healthcare/api/auth/google/callback";
const SUPABASE_REDIRECT = `https://${REF}.supabase.co/auth/v1/callback`;

const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
const supabaseToken = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const vercelToken = process.env.VERCEL_TOKEN?.trim();

function log(msg) {
  console.log(`[google-oauth] ${msg}`);
}

function fail(msg) {
  console.error(`[google-oauth] ${msg}`);
  process.exit(1);
}

if (!clientId || !clientSecret) {
  fail(
    `Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET.

Create a Web OAuth client in Google Cloud Console, then re-run:

  export GOOGLE_CLIENT_ID="....apps.googleusercontent.com"
  export GOOGLE_CLIENT_SECRET="...."
  node scripts/setup-google-oauth.mjs

Authorized redirect URIs to add:
  ${NATIVE_REDIRECT}
  ${SUPABASE_REDIRECT}`,
  );
}

async function enableSupabaseProvider() {
  if (!supabaseToken) {
    log("SUPABASE_ACCESS_TOKEN not set — skipping Supabase provider enable (native OAuth still works).");
    return false;
  }
  log("Enabling Google provider on Supabase via Management API…");
  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/config/auth`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${supabaseToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_google_enabled: true,
      external_google_client_id: clientId,
      external_google_secret: clientSecret,
      site_url: "https://redi.healthcare",
      uri_allow_list:
        "https://redi.healthcare/**,https://redi.healthcare/auth/callback,https://redi.healthcare/*/auth/callback,https://redi.healthcare/api/auth/google/callback",
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    fail(`Supabase Management API failed (${res.status}): ${text.slice(0, 400)}`);
  }
  log("Supabase Google provider enabled.");
  return true;
}

function setVercelEnv(key, value) {
  if (!vercelToken) {
    log(`VERCEL_TOKEN missing — set ${key} manually in Vercel dashboard.`);
    return;
  }
  log(`Setting ${key} on Vercel Production…`);
  // Remove existing (ignore failure), then add
  spawnSync(
    "npx",
    ["--yes", "vercel", "env", "rm", key, "production", "--token", vercelToken, "--yes"],
    { stdio: "ignore" },
  );
  const add = spawnSync(
    "npx",
    ["--yes", "vercel", "env", "add", key, "production", "--token", vercelToken],
    { input: value, encoding: "utf8" },
  );
  if (add.status !== 0) {
    fail(`Failed to set ${key}: ${add.stderr || add.stdout}`);
  }
  log(`${key} stored.`);
}

async function main() {
  log(`Client ID: ${clientId.slice(0, 16)}…`);
  setVercelEnv("GOOGLE_CLIENT_ID", clientId);
  setVercelEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", clientId);
  setVercelEnv("GOOGLE_CLIENT_SECRET", clientSecret);
  await enableSupabaseProvider();
  log("Done. Redeploy production so the new env vars load:");
  log("  ./scripts/deploy-prod.sh");
  log(`Native Google start URL: https://redi.healthcare/api/auth/google/start`);
}

main().catch((e) => fail(e instanceof Error ? e.message : String(e)));
