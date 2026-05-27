#!/usr/bin/env bash
set -euo pipefail

FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ROOT_DIR="$(cd "$FRONTEND_DIR/../.." && pwd)"

echo "Starting PostgreSQL and API..."
docker compose -f "$ROOT_DIR/docker-compose.yml" up -d --build

echo "Waiting for API on http://localhost:8080 ..."
for i in {1..60}; do
  if curl -sf "http://localhost:8080/movies" >/dev/null; then
    echo "API is ready."
    break
  fi
  if [[ "$i" -eq 60 ]]; then
    echo "API did not become ready in time." >&2
    exit 1
  fi
  sleep 2
done

cd "$FRONTEND_DIR"
npm run e2e
