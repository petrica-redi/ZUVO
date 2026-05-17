#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Production deploy helper for Redi Health → redi.healthcare on Vercel.
#
# Use this from your local machine when you cannot (or don't want to) wait
# for Vercel's git-auto-deploy. Idempotent — safe to re-run.
#
#   Requires: Node 20+, npm
#   Optional: VERCEL_TOKEN (recommended) — otherwise the CLI runs `vercel login`.
#
# What it does:
#   1. Installs the Vercel CLI on demand.
#   2. Logs in (token from env, or interactive browser login).
#   3. Links this checkout to the Vercel project (one-time, cached in .vercel/).
#   4. Pulls the project envs for `production`.
#   5. (Optional) Sets DEEPGRAM_API_KEY for Production if you pass it on stdin
#      or set the SET_DEEPGRAM_KEY=1 flag — the script will prompt securely.
#   6. Builds with the production env and ships it with `vercel deploy --prebuilt --prod`.
#
# Example usage:
#   export VERCEL_TOKEN=...                       # from https://vercel.com/account/tokens
#   ./scripts/deploy-prod.sh                      # deploy current commit to production
#   SET_DEEPGRAM_KEY=1 ./scripts/deploy-prod.sh   # also set DEEPGRAM_API_KEY (prompted)
# ---------------------------------------------------------------------------

set -euo pipefail

repo_root=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_root"

log() { printf "\033[1;36m[deploy]\033[0m %s\n" "$*"; }
err() { printf "\033[1;31m[deploy]\033[0m %s\n" "$*" >&2; }

if ! command -v npx >/dev/null 2>&1; then
  err "Node.js (with npx) is required. Install Node 20+ and re-run."
  exit 1
fi

VERCEL="npx --yes vercel@latest"

token_flag=()
if [ -n "${VERCEL_TOKEN:-}" ]; then
  log "Using VERCEL_TOKEN from environment."
  token_flag=(--token "$VERCEL_TOKEN")
else
  log "VERCEL_TOKEN not set — the CLI will open an interactive login if needed."
  log "Tip: generate one at https://vercel.com/account/tokens to make this scriptable."
  $VERCEL whoami >/dev/null 2>&1 || $VERCEL login
fi

if [ ! -d .vercel ]; then
  log "Linking this checkout to your Vercel project (one-time)…"
  $VERCEL link "${token_flag[@]}" --yes
fi

if [ "${SET_DEEPGRAM_KEY:-0}" = "1" ]; then
  if [ -z "${DEEPGRAM_API_KEY:-}" ]; then
    printf "Paste DEEPGRAM_API_KEY (input hidden): "
    stty -echo
    read -r DEEPGRAM_API_KEY
    stty echo
    printf "\n"
  fi
  if [ -z "${DEEPGRAM_API_KEY:-}" ]; then
    err "No key provided; skipping env update."
  else
    log "Setting DEEPGRAM_API_KEY for Production…"
    # `vercel env rm` is idempotent; ignore failure when var doesn't exist yet.
    printf "y\n" | $VERCEL env rm DEEPGRAM_API_KEY production "${token_flag[@]}" >/dev/null 2>&1 || true
    printf "%s" "$DEEPGRAM_API_KEY" | $VERCEL env add DEEPGRAM_API_KEY production "${token_flag[@]}"
    log "DEEPGRAM_API_KEY stored in Vercel (Production scope)."
  fi
fi

log "Pulling production env into .vercel/.env.production.local…"
$VERCEL pull --yes --environment=production "${token_flag[@]}"

log "Building production bundle…"
$VERCEL build --prod "${token_flag[@]}"

log "Deploying to production…"
deploy_url=$($VERCEL deploy --prebuilt --prod "${token_flag[@]}")
log "Deploy URL: $deploy_url"
log "Production alias: https://redi.healthcare/"
log "Done. Verify with:  curl -sI https://redi.healthcare/ | head -1"
