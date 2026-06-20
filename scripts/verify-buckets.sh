#!/usr/bin/env bash
set -euo pipefail

# Load env from .env if present
if [ -f .env ]; then
  export $(grep -v '^#' .env | tr -d '\r' | xargs)
fi

PROJECT_REF="${VITE_SUPABASE_URL:-https://yvgrbxgbsgmwerfjhutn.supabase.co}"
PROJECT_REF="${PROJECT_REF#https://}"
PROJECT_REF="${PROJECT_REF%.supabase.co}"
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}"

if [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "Error: SUPABASE_SERVICE_ROLE_KEY not set"
  exit 1
fi

STORAGE_API="https://${PROJECT_REF}.supabase.co/storage/v1/bucket"

echo "Fetching storage buckets from ${STORAGE_API} ..."

BUCKETS_JSON=$(curl -s "${STORAGE_API}" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}")

EXPECTED_PUBLIC="hero-images research-covers policy-documents open-datasets avatars profile-covers"
EXPECTED_PRIVATE="research-attachments forum-attachments action-media"

PASS=0
FAIL=0

for bucket in $EXPECTED_PUBLIC; do
  found=$(echo "$BUCKETS_JSON" | jq -r --arg b "$bucket" '.[] | select(.id == $b) | .public')
  if [ "$found" = "true" ]; then
    echo "[PASS] ${bucket}: public=true"
    PASS=$((PASS + 1))
  elif [ -n "$found" ]; then
    echo "[FAIL] ${bucket}: expected public=true but got public=${found}"
    FAIL=$((FAIL + 1))
  else
    echo "[FAIL] ${bucket}: bucket not found"
    FAIL=$((FAIL + 1))
  fi
done

for bucket in $EXPECTED_PRIVATE; do
  found=$(echo "$BUCKETS_JSON" | jq -r --arg b "$bucket" '.[] | select(.id == $b) | .public')
  if [ "$found" = "false" ]; then
    echo "[PASS] ${bucket}: public=false"
    PASS=$((PASS + 1))
  elif [ -n "$found" ]; then
    echo "[FAIL] ${bucket}: expected public=false but got public=${found}"
    FAIL=$((FAIL + 1))
  else
    echo "[FAIL] ${bucket}: bucket not found"
    FAIL=$((FAIL + 1))
  fi
done

echo ""
echo "Results: ${PASS} passed, ${FAIL} failed"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi

echo "All 9 storage buckets verified successfully!"
