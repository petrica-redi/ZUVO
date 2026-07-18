#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# One-shot Google OAuth setup for Redi Health (terminal / CLI)
#
# What it does:
#   1) gcloud auth login  (browser once — you enter Google password there)
#   2) creates/selects a GCP project
#   3) creates a Web OAuth client with the correct redirect URI
#   4) writes creds + runs scripts/setup-google-oauth.mjs (Vercel env)
#   5) deploys production
#
# Run from the repo root:
#   chmod +x scripts/setup-google-oauth-interactive.sh
#   ./scripts/setup-google-oauth-interactive.sh
# ---------------------------------------------------------------------------
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

NATIVE_REDIRECT="https://redi.healthcare/api/auth/google/callback"
SUPABASE_REDIRECT="https://zukissjunpxmlrgbvbtb.supabase.co/auth/v1/callback"
PROJECT_ID="${GCP_PROJECT_ID:-redi-health-oauth}"
CREDS_FILE="/tmp/google-oauth-creds.env"

log() { printf "\033[1;36m[google-oauth]\033[0m %s\n" "$*"; }
err() { printf "\033[1;31m[google-oauth]\033[0m %s\n" "$*" >&2; }

# --- gcloud on PATH ---------------------------------------------------------
if ! command -v gcloud >/dev/null 2>&1; then
  if [[ -x "$HOME/google-cloud-sdk/google-cloud-sdk/bin/gcloud" ]]; then
    export PATH="$HOME/google-cloud-sdk/google-cloud-sdk/bin:$PATH"
  elif [[ -x "$HOME/google-cloud-sdk/bin/gcloud" ]]; then
    export PATH="$HOME/google-cloud-sdk/bin:$PATH"
  else
    err "gcloud not found. Install: https://cloud.google.com/sdk/docs/install"
    exit 1
  fi
fi

log "Step 1/5 — Google login (browser will open; enter your password there)"
gcloud auth login --update-adc

ACCOUNT="$(gcloud config get-value account 2>/dev/null || true)"
if [[ -z "$ACCOUNT" || "$ACCOUNT" == "(unset)" ]]; then
  err "Not logged in to gcloud."
  exit 1
fi
log "Logged in as: $ACCOUNT"

log "Step 2/5 — GCP project: $PROJECT_ID"
if ! gcloud projects describe "$PROJECT_ID" >/dev/null 2>&1; then
  log "Creating project $PROJECT_ID …"
  gcloud projects create "$PROJECT_ID" --name="Redi Health OAuth" || true
fi
gcloud config set project "$PROJECT_ID"

# Billing may be required for some APIs; Identity Toolkit / OAuth client APIs
# often work on free tier once the project exists.
log "Enabling APIs…"
gcloud services enable \
  iam.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iap.googleapis.com \
  --project="$PROJECT_ID" 2>/dev/null || true

log "Step 3/5 — OAuth consent brand (if missing)"
# Create an external brand / consent screen support email
BRAND_NAME=""
if gcloud alpha iap oauth-brands list --format='value(name)' 2>/dev/null | head -1 | grep -q .; then
  BRAND_NAME="$(gcloud alpha iap oauth-brands list --format='value(name)' | head -1)"
  log "Using existing brand: $BRAND_NAME"
else
  log "Creating OAuth brand…"
  # applicationTitle + supportEmail required
  BRAND_NAME="$(
    gcloud alpha iap oauth-brands create \
      --application_title="Redi Health" \
      --support_email="$ACCOUNT" \
      --format='value(name)' 2>/dev/null || true
  )"
fi

CLIENT_ID=""
CLIENT_SECRET=""

if [[ -n "${BRAND_NAME}" ]]; then
  log "Creating Web OAuth client under brand…"
  # IAP oauth-clients are for IAP; still yields client_id/secret usable for some flows.
  # Prefer Google Auth Platform clients via REST if brand path fails.
  CLIENT_JSON="$(
    gcloud alpha iap oauth-clients create "$BRAND_NAME" \
      --display_name="Redi Health Web" \
      --format=json 2>/dev/null || true
  )"
  if [[ -n "$CLIENT_JSON" ]]; then
    CLIENT_ID="$(printf '%s' "$CLIENT_JSON" | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("name","").split("/")[-1] if isinstance(d,dict) else "")' 2>/dev/null || true)"
    CLIENT_SECRET="$(printf '%s' "$CLIENT_JSON" | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("secret","") if isinstance(d,dict) else "")' 2>/dev/null || true)"
  fi
fi

# Fallback: ask user to paste Client ID/Secret created in Console
if [[ -z "$CLIENT_ID" || -z "$CLIENT_SECRET" ]]; then
  log "Automated client creation via gcloud IAP is unavailable/incomplete."
  log "Create a Web client in the browser (one page), then paste values here."
  log ""
  log "Open this URL, then Create client → Web application:"
  log "  https://console.cloud.google.com/auth/clients/create?project=$PROJECT_ID"
  log ""
  log "Authorized redirect URIs (add both):"
  log "  $NATIVE_REDIRECT"
  log "  $SUPABASE_REDIRECT"
  log ""
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "https://console.cloud.google.com/auth/clients/create?project=$PROJECT_ID" >/dev/null 2>&1 || true
  elif [[ -n "${DISPLAY:-}" ]] && command -v google-chrome >/dev/null 2>&1; then
    google-chrome "https://console.cloud.google.com/auth/clients/create?project=$PROJECT_ID" >/dev/null 2>&1 &
  fi
  printf "Paste GOOGLE_CLIENT_ID: "
  read -r CLIENT_ID
  printf "Paste GOOGLE_CLIENT_SECRET: "
  read -r CLIENT_SECRET
fi

CLIENT_ID="$(echo "$CLIENT_ID" | tr -d '[:space:]')"
CLIENT_SECRET="$(echo "$CLIENT_SECRET" | tr -d '[:space:]')"

if [[ -z "$CLIENT_ID" || -z "$CLIENT_SECRET" ]]; then
  err "Missing Client ID or Secret."
  exit 1
fi

log "Step 4/5 — Save credentials + push to Vercel"
cat > "$CREDS_FILE" <<EOF
GOOGLE_CLIENT_ID=$CLIENT_ID
GOOGLE_CLIENT_SECRET=$CLIENT_SECRET
EOF
chmod 600 "$CREDS_FILE"
export GOOGLE_CLIENT_ID="$CLIENT_ID"
export GOOGLE_CLIENT_SECRET="$CLIENT_SECRET"
export NEXT_PUBLIC_GOOGLE_CLIENT_ID="$CLIENT_ID"

node scripts/setup-google-oauth.mjs

log "Step 5/5 — Deploy production"
./scripts/deploy-prod.sh

log "Done."
log "Test: https://redi.healthcare/auth/register  →  Continue with Google"
log "Creds saved at: $CREDS_FILE (local only — do not commit)"
