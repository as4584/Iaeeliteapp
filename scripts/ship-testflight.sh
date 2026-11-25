#!/usr/bin/env bash
# Push the v22 branch, build iOS on EAS with Doppler's EXPO_TOKEN, auto-submit to TestFlight.
# Usage: bash scripts/ship-testflight.sh [doppler-project] [doppler-config]
set -euo pipefail
cd "$(dirname "$0")/.."
BRANCH=feat/v16-damian-assets
[ "$(git rev-parse --abbrev-ref HEAD)" = "$BRANCH" ] || { echo "Checkout $BRANCH first"; exit 1; }
git push -u origin "$BRANCH"
DOPPLER_ARGS=()
[ -n "${1:-}" ] && DOPPLER_ARGS+=(--project "$1")
[ -n "${2:-}" ] && DOPPLER_ARGS+=(--config "$2")
doppler run "${DOPPLER_ARGS[@]}" -- bash -c '[ -n "${EXPO_TOKEN:-}" ] || { echo "EXPO_TOKEN missing in this Doppler config"; exit 1; }; npx eas-cli@latest build -p ios --profile production --auto-submit --non-interactive'
