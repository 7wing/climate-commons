#!/usr/bin/env bash
set -euo pipefail

PORT=5173
BASE="http://localhost:${PORT}"
ERR=0

echo "== Climate Commons Frontend Smoke Test =="

# Kill any previous dev server
pkill -f "vite.*dev.*--port ${PORT}" 2>/dev/null || true
sleep 1

# Verify route file counts
PUBLIC_COUNT=$(find src/routes -maxdepth 1 -name '*.tsx' -o -maxdepth 1 -name 'index.tsx' | wc -l)
ADMIN_COUNT=$(find src/routes/admin -name '*.tsx' | wc -l)
BUILD_CLIENT=$(test -d dist/client && echo 1 || echo 0)
BUILD_SERVER=$(test -d dist/server && echo 1 || echo 0)

echo "Build artifacts:"
echo "  dist/client: $([ $BUILD_CLIENT -eq 1 ] && echo 'OK' || echo 'MISSING')"
echo "  dist/server: $([ $BUILD_SERVER -eq 1 ] && echo 'OK' || echo 'MISSING')"
echo "  Admin routes: $ADMIN_COUNT"

if [ "$ADMIN_COUNT" -lt 12 ]; then
  echo "ERROR: Expected 12 admin routes, found $ADMIN_COUNT"
  ERR=1
fi

if [ $BUILD_CLIENT -eq 0 ] || [ $BUILD_SERVER -eq 0 ]; then
  echo "ERROR: Build artifacts missing"
  ERR=1
fi

# Start dev server on strict port
pnpm run dev --port $PORT --strictPort >/tmp/cc-dev.log 2>&1 &
PID=$!
 trap "kill $PID 2>/dev/null || true; wait $PID 2>/dev/null || true" EXIT

# Wait for server to boot
echo ""
echo "Starting dev server (PID $PID) on port $PORT..."
for i in {1..40}; do
  if curl -fs "$BASE" >/dev/null 2>&1; then
    break
  fi
  if ! kill -0 $PID 2>/dev/null; then
    echo "ERROR: Dev server exited early"
    cat /tmp/cc-dev.log | tail -20
    ERR=1
    exit $ERR
  fi
  sleep 1
done

if ! curl -fs "$BASE" >/dev/null 2>&1; then
  echo "ERROR: Dev server did not start within 40s"
  cat /tmp/cc-dev.log | tail -20
  ERR=1
  exit $ERR
fi

echo "Dev server up. Curling routes..."

ROUTES=(
  "/"
  "/research"
  "/forum"
  "/actions"
  "/policy"
  "/auth/login"
  "/auth/signup"
  "/admin"
)

for route in "${ROUTES[@]}"; do
  code=$(curl -L -s -o /dev/null -w "%{http_code}" "$BASE$route" || echo "000")
  if [ "$code" = "200" ]; then
    echo "  $route -> 200 OK"
  else
    echo "  $route -> $code FAIL"
    ERR=1
  fi
done

echo ""
if [ $ERR -eq 0 ]; then
  echo "== ALL SMOKE TESTS PASSED =="
else
  echo "== SMOKE TESTS FAILED =="
fi

exit $ERR
