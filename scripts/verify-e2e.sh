#!/usr/bin/env bash
set -uo pipefail

cd "$(dirname "$0")/.."

# Load .env
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
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}"
REF="${SUPABASE_URL#https://}"
REF="${REF%.supabase.co}"
REF="${REF%%.*}"
REF=$(echo "$REF" | tr -d '\r')

PASS=0
FAIL=0

pass() { echo "  [PASS] $1"; PASS=$((PASS + 1)); }
fail() { echo "  [FAIL] $1"; FAIL=$((FAIL + 1)); }
warn() { echo "  [WARN] $1"; }

# Helper: run SQL via Management API
run_sql() {
  local query="$1"
  curl -s -X POST "https://api.supabase.com/v1/projects/${REF}/database/query" \
    -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"$query\"}"
}

echo "============================================"
echo " Climate Commons — End-to-End Verification"
echo "============================================"
echo ""

if [ -z "$SUPABASE_ACCESS_TOKEN" ] || [ -z "$REF" ]; then
  echo "ERROR: SUPABASE_ACCESS_TOKEN or project ref missing from .env"
  exit 1
fi

# ------------------------------------------------------------------
# A. Connection test
# ------------------------------------------------------------------
echo "A. Connection Test (PostgREST)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "${SUPABASE_URL}/rest/v1/users?limit=0" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}")
if [ "$STATUS" = "200" ]; then
  pass "PostgREST /users?limit=0 returned 200"
else
  fail "PostgREST returned HTTP $STATUS"
fi
echo ""

# ------------------------------------------------------------------
# B. Table count & existence
# ------------------------------------------------------------------
echo "B. Tables (information_schema.tables)"
EXPECTED_TABLES=(
  action_impact_reports action_participants action_updates actions
  bookmarks contact_submissions content_flags datasets events
  forum_attachments forum_categories forum_likes forum_replies forum_threads
  newsletter_subscribers notifications originality_claims partners
  partnership_inquiries platform_settings policy_endorsements policy_reports
  policy_updates proposals research_attachments research_categories
  research_participants research_projects research_updates users
)

TABLE_JSON=$(run_sql "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;")
TABLE_COUNT=$(echo "$TABLE_JSON" | jq 'length')

if [ "$TABLE_COUNT" -eq "${#EXPECTED_TABLES[@]}" ]; then
  pass "Found ${TABLE_COUNT} tables (expected ${#EXPECTED_TABLES[@]})"
else
  fail "Found ${TABLE_COUNT} tables (expected ${#EXPECTED_TABLES[@]})"
fi

MISSING_TABLES=()
for t in "${EXPECTED_TABLES[@]}"; do
  HAS=$(echo "$TABLE_JSON" | jq -r --arg t "$t" '[.[] | select(.table_name == $t)] | length')
  if [ "$HAS" -eq 0 ]; then
    MISSING_TABLES+=("$t")
  fi
done
if [ ${#MISSING_TABLES[@]} -eq 0 ]; then
  pass "All expected tables present"
else
  fail "Missing tables: ${MISSING_TABLES[*]}"
fi
echo ""

# ------------------------------------------------------------------
# C. Indexes
# ------------------------------------------------------------------
echo "C. Indexes (pg_indexes)"
INDEX_JSON=$(run_sql "SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;")
INDEX_COUNT=$(echo "$INDEX_JSON" | jq 'length')

echo "  Total indexes in public schema: $INDEX_COUNT"

# Verify specific indexes from section 3.7
EXPECTED_INDEXES=(
  "users:idx_users_email"
  "users:idx_users_role"
  "users:idx_users_country"
  "users:idx_users_created_at"
  "research_projects:idx_research_projects_category_id"
  "research_projects:idx_research_projects_status"
  "research_projects:idx_research_projects_created_by"
  "research_projects:idx_research_projects_created_at"
  "research_participants:idx_research_participants_project_id"
  "research_participants:idx_research_participants_user_id"
  "research_participants:idx_research_participants_status"
  "proposals:idx_proposals_status"
  "proposals:idx_proposals_submitted_by"
  "proposals:idx_proposals_created_at"
  "forum_threads:idx_forum_threads_category_id"
  "forum_threads:idx_forum_threads_author_id"
  "forum_threads:idx_forum_threads_created_at"
  "forum_threads:idx_forum_threads_tags"
  "forum_replies:idx_forum_replies_thread_id"
  "forum_replies:idx_forum_replies_parent_id"
  "forum_replies:idx_forum_replies_author_id"
  "forum_replies:idx_forum_replies_created_at"
  "forum_likes:idx_forum_likes_thread_id"
  "forum_likes:idx_forum_likes_reply_id"
  "forum_likes:idx_forum_likes_user_id"
  "originality_claims:idx_originality_claims_user_id"
  "originality_claims:idx_originality_claims_status"
  "originality_claims:idx_originality_claims_thread_id"
  "content_flags:idx_content_flags_status"
  "content_flags:idx_content_flags_thread_id"
  "content_flags:idx_content_flags_reply_id"
  "actions:idx_actions_status"
  "actions:idx_actions_category"
  "actions:idx_actions_created_at"
  "action_participants:idx_action_participants_action_id"
  "action_participants:idx_action_participants_user_id"
  "action_impact_reports:idx_action_impact_reports_action_id"
  "action_impact_reports:idx_action_impact_reports_author_id"
  "policy_updates:idx_policy_updates_scope"
  "policy_updates:idx_policy_updates_status"
  "policy_updates:idx_policy_updates_created_at"
  "policy_endorsements:idx_policy_endorsements_policy_id"
  "policy_endorsements:idx_policy_endorsements_user_id"
  "bookmarks:idx_bookmarks_user_id"
  "bookmarks:idx_bookmarks_entity"
  "bookmarks:idx_bookmarks_user_entity"
  "events:idx_events_user_id"
  "events:idx_events_event_name"
  "events:idx_events_created_at"
  "datasets:idx_datasets_category"
  "datasets:idx_datasets_verification_status"
  "datasets:idx_datasets_created_at"
)

IDX_FOUND=0
IDX_MISSING=0
for entry in "${EXPECTED_INDEXES[@]}"; do
  tbl="${entry%%:*}"
  idx="${entry#*:}"
  HAS=$(echo "$INDEX_JSON" | jq -r --arg tbl "$tbl" --arg idx "$idx" '[.[] | select(.tablename == $tbl and .indexname == $idx)] | length')
  if [ "$HAS" -gt 0 ]; then
    IDX_FOUND=$((IDX_FOUND + 1))
  else
    echo "  [MISS] Index ${idx} on ${tbl}"
    IDX_MISSING=$((IDX_MISSING + 1))
  fi
done

if [ "$IDX_MISSING" -eq 0 ]; then
  pass "All ${#EXPECTED_INDEXES[@]} expected indexes found"
else
  fail "${IDX_MISSING} expected indexes missing (${IDX_FOUND} found)"
fi
echo ""

# ------------------------------------------------------------------
# D. RLS Policies
# ------------------------------------------------------------------
echo "D. RLS Policies (pg_policies)"
POLICY_JSON=$(run_sql "SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;")
POLICY_COUNT=$(echo "$POLICY_JSON" | jq 'length')
echo "  Total policies: $POLICY_COUNT"

# Every expected table must have at least one policy
RLS_MISSING=()
for t in "${EXPECTED_TABLES[@]}"; do
  HAS_POLICY=$(echo "$POLICY_JSON" | jq -r --arg t "$t" '[.[] | select(.tablename == $t)] | length')
  if [ "$HAS_POLICY" -eq 0 ]; then
    RLS_MISSING+=("$t")
  fi
done
if [ ${#RLS_MISSING[@]} -eq 0 ]; then
  pass "Every table has at least one RLS policy (${POLICY_COUNT} total)"
else
  fail "Tables missing RLS policies: ${RLS_MISSING[*]}"
fi
echo ""

# ------------------------------------------------------------------
# E. Triggers
# ------------------------------------------------------------------
echo "E. Triggers"

# updated_at triggers
UPD_TRIGGERS=$(run_sql "SELECT tgname, tgrelid::regclass::text as table_name FROM pg_trigger WHERE tgname LIKE 'trg_%_updated_at' AND tgrelid::regclass::text NOT LIKE 'storage.%' AND tgrelid::regclass::text NOT LIKE 'auth.%' ORDER BY tgrelid::regclass::text;")
UPD_COUNT=$(echo "$UPD_TRIGGERS" | jq 'length')
echo "  updated_at triggers: $UPD_COUNT"

# auth.users trigger
AUTH_TRIG=$(run_sql "SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created' AND tgrelid::regclass::text = 'auth.users';")
AUTH_TRIG_COUNT=$(echo "$AUTH_TRIG" | jq 'length')

TABLES_WITH_UPDATED_AT=(
  action_impact_reports action_participants action_updates actions
  bookmarks contact_submissions content_flags datasets events
  forum_attachments forum_categories forum_likes forum_replies forum_threads
  newsletter_subscribers notifications originality_claims partners
  partnership_inquiries platform_settings policy_reports policy_updates
  proposals research_attachments research_categories research_participants
  research_projects research_updates users
)

UPD_MISSING=()
for t in "${TABLES_WITH_UPDATED_AT[@]}"; do
  HAS_TRIG=$(echo "$UPD_TRIGGERS" | jq --arg t "$t" '[.[] | select(.table_name == $t)] | length')
  if [ "$HAS_TRIG" -eq 0 ]; then
    UPD_MISSING+=("$t")
  fi
done

if [ ${#UPD_MISSING[@]} -eq 0 ]; then
  pass "All ${#TABLES_WITH_UPDATED_AT[@]} tables have updated_at trigger"
else
  fail "Tables missing updated_at trigger: ${UPD_MISSING[*]}"
fi

if [ "$AUTH_TRIG_COUNT" -eq 1 ]; then
  pass "Trigger on_auth_user_created exists on auth.users"
else
  fail "Trigger on_auth_user_created missing on auth.users"
fi
echo ""

# ------------------------------------------------------------------
# F. Realtime tables
# ------------------------------------------------------------------
echo "F. Realtime (pg_publication_tables)"
REALTIME_JSON=$(run_sql "SELECT tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime' ORDER BY tablename;")
EXPECTED_REALTIME=(
  action_impact_reports action_participants action_updates
  forum_likes forum_replies notifications originality_claims
  policy_endorsements research_participants
)

RT_MISSING=()
for t in "${EXPECTED_REALTIME[@]}"; do
  HAS=$(echo "$REALTIME_JSON" | jq -r --arg t "$t" '[.[] | select(.tablename == $t)] | length')
  if [ "$HAS" -eq 0 ]; then
    RT_MISSING+=("$t")
  fi
done
if [ ${#RT_MISSING[@]} -eq 0 ]; then
  pass "All ${#EXPECTED_REALTIME[@]} realtime tables present"
else
  fail "Missing realtime tables: ${RT_MISSING[*]}"
fi
echo ""

# ------------------------------------------------------------------
# G. Storage buckets
# ------------------------------------------------------------------
echo "G. Storage Buckets"
if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  STORAGE_API="https://${REF}.supabase.co/storage/v1/bucket"
  BUCKETS_JSON=$(curl -s "$STORAGE_API" \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}")

  EXPECTED_PUBLIC="hero-images research-covers policy-documents open-datasets avatars profile-covers"
  EXPECTED_PRIVATE="research-attachments forum-attachments action-media"

  BUCKET_PASS=0
  BUCKET_FAIL=0
  for bucket in $EXPECTED_PUBLIC; do
    found=$(echo "$BUCKETS_JSON" | jq -r --arg b "$bucket" '.[] | select(.id == $b) | .public')
    if [ "$found" = "true" ]; then
      BUCKET_PASS=$((BUCKET_PASS + 1))
    elif [ -n "$found" ]; then
      echo "  [FAIL] ${bucket}: expected public=true but got public=${found}"
      BUCKET_FAIL=$((BUCKET_FAIL + 1))
    else
      echo "  [FAIL] ${bucket}: bucket not found"
      BUCKET_FAIL=$((BUCKET_FAIL + 1))
    fi
  done
  for bucket in $EXPECTED_PRIVATE; do
    found=$(echo "$BUCKETS_JSON" | jq -r --arg b "$bucket" '.[] | select(.id == $b) | .public')
    if [ "$found" = "false" ]; then
      BUCKET_PASS=$((BUCKET_PASS + 1))
    elif [ -n "$found" ]; then
      echo "  [FAIL] ${bucket}: expected public=false but got public=${found}"
      BUCKET_FAIL=$((BUCKET_FAIL + 1))
    else
      echo "  [FAIL] ${bucket}: bucket not found"
      BUCKET_FAIL=$((BUCKET_FAIL + 1))
    fi
  done

  if [ "$BUCKET_FAIL" -eq 0 ]; then
    pass "All 9 storage buckets verified (${BUCKET_PASS} passed)"
  else
    fail "${BUCKET_FAIL} storage bucket checks failed"
  fi
else
  warn "SUPABASE_SERVICE_ROLE_KEY missing — skipping storage bucket check"
fi
echo ""

# ------------------------------------------------------------------
# H. Seed row counts
# ------------------------------------------------------------------
echo "H. Seed Row Counts"
SEED_SQL="SELECT 'users' as tbl, COUNT(*) as cnt FROM users UNION ALL SELECT 'research_categories', COUNT(*) FROM research_categories UNION ALL SELECT 'forum_categories', COUNT(*) FROM forum_categories UNION ALL SELECT 'partners', COUNT(*) FROM partners UNION ALL SELECT 'platform_settings', COUNT(*) FROM platform_settings UNION ALL SELECT 'research_projects', COUNT(*) FROM research_projects UNION ALL SELECT 'research_participants', COUNT(*) FROM research_participants UNION ALL SELECT 'research_updates', COUNT(*) FROM research_updates UNION ALL SELECT 'proposals', COUNT(*) FROM proposals UNION ALL SELECT 'forum_threads', COUNT(*) FROM forum_threads UNION ALL SELECT 'forum_replies', COUNT(*) FROM forum_replies UNION ALL SELECT 'forum_likes', COUNT(*) FROM forum_likes UNION ALL SELECT 'originality_claims', COUNT(*) FROM originality_claims UNION ALL SELECT 'content_flags', COUNT(*) FROM content_flags UNION ALL SELECT 'actions', COUNT(*) FROM actions UNION ALL SELECT 'action_participants', COUNT(*) FROM action_participants UNION ALL SELECT 'action_updates', COUNT(*) FROM action_updates UNION ALL SELECT 'action_impact_reports', COUNT(*) FROM action_impact_reports UNION ALL SELECT 'policy_updates', COUNT(*) FROM policy_updates UNION ALL SELECT 'policy_endorsements', COUNT(*) FROM policy_endorsements UNION ALL SELECT 'datasets', COUNT(*) FROM datasets UNION ALL SELECT 'bookmarks', COUNT(*) FROM bookmarks UNION ALL SELECT 'notifications', COUNT(*) FROM notifications UNION ALL SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers"

SEED_JSON=$(run_sql "$SEED_SQL")
SEED_PASS=0
SEED_FAIL=0

while IFS='|' read -r tbl cnt; do
  tbl=$(echo "$tbl" | xargs)
  cnt=$(echo "$cnt" | xargs)
  if [ "$cnt" -gt 0 ] 2>/dev/null; then
    SEED_PASS=$((SEED_PASS + 1))
  else
    echo "  [FAIL] $tbl: expected >0 rows but got $cnt"
    SEED_FAIL=$((SEED_FAIL + 1))
  fi
done < <(echo "$SEED_JSON" | jq -r '.[] | "\(.tbl)|\(.cnt)"')

if [ "$SEED_FAIL" -eq 0 ]; then
  pass "All ${SEED_PASS} seeded tables have non-zero row counts"
else
  fail "${SEED_FAIL} seeded tables have zero rows"
fi
echo ""

# ------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------
echo "============================================"
echo " Summary: ${PASS} passed, ${FAIL} failed"
echo "============================================"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi

echo "All e2e verification checks passed successfully!"
exit 0
