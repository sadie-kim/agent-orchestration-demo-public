#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist-public"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/demo" "$DIST_DIR/server" "$DIST_DIR/scripts"

cp "$ROOT_DIR/demo/agent-orchestration.html" "$DIST_DIR/demo/"
cp "$ROOT_DIR/server/index.js" "$DIST_DIR/server/"
cp "$ROOT_DIR/server/Caddyfile" "$DIST_DIR/server/"
cp "$ROOT_DIR/server/agent-orchestration-demo.service" "$DIST_DIR/server/"
cp "$ROOT_DIR/server/README.md" "$DIST_DIR/server/"
cp "$ROOT_DIR/scripts/google-apps-script.js" "$DIST_DIR/scripts/"
cp "$ROOT_DIR/.env.example" "$DIST_DIR/"
cp "$ROOT_DIR/package.json" "$DIST_DIR/"
cp "$ROOT_DIR/README.md" "$DIST_DIR/"
cp "$ROOT_DIR/DEPLOYMENT_CONTENTS.md" "$DIST_DIR/"

if [ -f "$ROOT_DIR/package-lock.json" ]; then
  cp "$ROOT_DIR/package-lock.json" "$DIST_DIR/"
fi

printf 'Public release written to %s\n' "$DIST_DIR"
