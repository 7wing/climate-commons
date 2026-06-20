#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f .env ]; then
  while IFS='=' read -r key value; do
    [ -z "$key" ] && continue
    [[ "$key" =~ ^# ]] && continue
    key=$(echo "$key" | tr -d '\r')
    value=$(echo "$value" | tr -d '\r')
    export "$key=$value"
  done < .env
fi

SUPABASE_URL="${VITE_SUPABASE_URL:-}"
SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY:-}"
SUPABASE_ACCESS_TOKEN="${SUPABASE_ACCESS_TOKEN:-}"
REF="${VITE_SUPABASE_URL:-}"
REF="${REF#https://}"
REF="${REF%.supabase.co}"
# Strip any stray carriage returns
REF=$(echo "$REF" | tr -d '\r')

echo "== Climate Commons Schema Verification =="
echo ""

# 1. PostgREST basic connectivity
echo "1. PostgREST connectivity (users?limit=0)..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "${SUPABASE_URL}/rest/v1/users?limit=0" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}")
if [ "$STATUS" = "200" ]; then
  echo "   OK (200)"
else
  echo "   FAIL (HTTP $STATUS)"
  exit 1
fi
echo ""

# 2. Realtime publication tables (requires Management API)
echo "2. Realtime publication tables..."
if [ -n "$SUPABASE_ACCESS_TOKEN" ] && [ -n "$REF" ]; then
  RESULT=$(curl -s -X POST "https://api.supabase.com/v1/projects/${REF}/database/query" \
    -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"query":"SELECT tablename FROM pg_publication_tables WHERE pubname = '\''supabase_realtime'\'' ORDER BY tablename;"}')
  # Pretty-print the tables
  echo "$RESULT" | jq -r '.[].tablename' 2>/dev/null | sed 's/^/   - /' || echo "   (raw: $RESULT)"
  COUNT=$(echo "$RESULT" | jq 'length')
  echo "   Total tables in supabase_realtime: $COUNT"
else
  echo "   SKIPPED (SUPABASE_ACCESS_TOKEN or REF not available)"
fi
echo ""

# 3. Row count sanity checks for seed tables
echo "3. Row count sanity checks..."
for TABLE in users research_categories forum_categories partners platform_settings; do
  RANGE=$(curl -s -i "${SUPABASE_URL}/rest/v1/${TABLE}?select=id" \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Range: 0-0" \
    -H "Prefer: count=exact" \
    | grep -i "^content-range:" | sed 's/.*\///;s/[^0-9].*//')
  if [ -n "$RANGE" ]; then
    echo "   $TABLE: $RANGE rows"
  else
    echo "   $TABLE: (unable to determine)"
  fi
done

echo ""
echo "== Verification complete =="
