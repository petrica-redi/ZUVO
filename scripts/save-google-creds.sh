#!/usr/bin/env bash
# Usage after creating the OAuth client in Google Cloud Console:
#   ./scripts/save-google-creds.sh 'CLIENT_ID.apps.googleusercontent.com' 'GOCSPX-SECRET'
set -euo pipefail
ID="${1:-}"
SECRET="${2:-}"
if [[ -z "$ID" || -z "$SECRET" ]]; then
  echo "Usage: $0 <GOOGLE_CLIENT_ID> <GOOGLE_CLIENT_SECRET>"
  exit 1
fi
cat > /tmp/google-oauth-creds.env <<EOF
GOOGLE_CLIENT_ID=$ID
GOOGLE_CLIENT_SECRET=$SECRET
EOF
echo "Saved to /tmp/google-oauth-creds.env"
echo "Watcher will configure Vercel and deploy automatically."
