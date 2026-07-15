#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Wire Supabase Postgres to Vercel and apply SQL migrations.
#
# Prerequisites:
#   - Vercel CLI authenticated (VERCEL_TOKEN or `vercel login`)
#   - Project linked (`.vercel/project.json`)
#   - Supabase marketplace resource connected to this Vercel project
#
# Usage:
#   ./scripts/setup-vercel-db.sh                  # sync DATABASE_URL + migrate
#   ./scripts/setup-vercel-db.sh --connect redi-health-db
#   ./scripts/setup-vercel-db.sh --migrate-only
# ---------------------------------------------------------------------------

set -euo pipefail

repo_root=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_root"

log() { printf "\033[1;36m[db]\033[0m %s\n" "$*"; }
err() { printf "\033[1;31m[db]\033[0m %s\n" "$*" >&2; }

VERCEL="npx --yes vercel@latest"
token_flag=()
if [ -n "${VERCEL_TOKEN:-}" ]; then
  token_flag=(--token "$VERCEL_TOKEN")
fi

CONNECT_RESOURCE=""
MIGRATE_ONLY=0

while [ $# -gt 0 ]; do
  case "$1" in
    --connect)
      CONNECT_RESOURCE="${2:-}"
      shift 2
      ;;
    --migrate-only)
      MIGRATE_ONLY=1
      shift
      ;;
    -h|--help)
      sed -n '2,20p' "$0"
      exit 0
      ;;
    *)
      err "Unknown argument: $1"
      exit 1
      ;;
  esac
done

if [ ! -d .vercel ]; then
  log "Linking project…"
  $VERCEL link "${token_flag[@]}" --yes
fi

if [ -n "$CONNECT_RESOURCE" ]; then
  log "Connecting Supabase resource '$CONNECT_RESOURCE' to project…"
  $VERCEL integration resource connect "$CONNECT_RESOURCE" \
    -e production -e preview --yes "${token_flag[@]}"
fi

if [ "$MIGRATE_ONLY" = 0 ]; then
  log "Pulling production env…"
  $VERCEL pull --yes --environment=production "${token_flag[@]}"

  log "Syncing DATABASE_URL from POSTGRES_URL…"
  POSTGRES_URL=$(node -e "
    const fs = require('fs');
    const env = fs.readFileSync('.vercel/.env.production.local', 'utf8');
    const m = env.match(/^POSTGRES_URL=\"?([^\"\\n]+)\"?/m);
    if (!m) { console.error('POSTGRES_URL missing — connect Supabase integration first'); process.exit(1); }
    process.stdout.write(m[1]);
  ")

  for scope in production preview; do
    printf "y\n" | $VERCEL env rm DATABASE_URL "$scope" "${token_flag[@]}" >/dev/null 2>&1 || true
    printf '%s' "$POSTGRES_URL" | $VERCEL env add DATABASE_URL "$scope" "${token_flag[@]}"
    log "DATABASE_URL stored for $scope"
  done
fi

log "Applying SQL migrations…"
node scripts/run-migrations.mjs

log "Done. Redeploy production so runtime picks up DATABASE_URL:"
log "  ./scripts/deploy-prod.sh"
