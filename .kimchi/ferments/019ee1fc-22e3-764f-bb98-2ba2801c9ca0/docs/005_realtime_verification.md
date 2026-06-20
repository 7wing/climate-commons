# Step 5 — Realtime Replication Enablement

## Date
2026-06-19

## Tables Added to `supabase_realtime`
Per blueprint section 3.11, the following 9 tables were added to the `supabase_realtime` publication via the Supabase Management API (`POST /v1/projects/{ref}/database/query`):

1. `research_participants`
2. `forum_replies`
3. `forum_likes`
4. `action_participants`
5. `action_updates`
6. `action_impact_reports`
7. `policy_endorsements`
8. `notifications`
9. `originality_claims`

## Execution
- Publication `supabase_realtime` already existed.
- Each table was added with:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE public.<table_name>;
  ```
- Result: `[]` (no errors) for all 9 tables.

## Verification
Query executed:
```sql
SELECT tablename FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' ORDER BY tablename;
```

Result:
```
action_impact_reports
action_participants
action_updates
forum_likes
forum_replies
notifications
originality_claims
policy_endorsements
research_participants
```

All 9 tables confirmed.

## Side Fix: Users RLS Infinite Recursion
During verification, PostgREST query `users?limit=0` returned HTTP 500 with:
> "infinite recursion detected in policy for relation \"users\""

Root cause: `users_select_admin` and `users_update_admin` policies contained `EXISTS (SELECT 1 FROM users ...)` which recursively triggered RLS on `users`.

Fix applied via Management API:
1. Created `public.is_admin()` as `SECURITY DEFINER` function.
2. Dropped `users_select_admin` and `users_update_admin`.
3. Recreated them using `public.is_admin()` instead of the recursive subquery.

Post-RLS fix: `users?limit=0` returns HTTP 200.

## Verify Script
Created `/project/workspace/scripts/verify-schema.sh` (executable) with:
- PostgREST connectivity check (`users?limit=0` → 200)
- Realtime publication table listing and count
- Row-count sanity checks for seeded tables

Script runs successfully end-to-end and reports:
- users: 13 rows
- research_categories: 5 rows
- forum_categories: 5 rows
- partners: 5 rows
- platform_settings: 1 rows
- Total realtime tables: 9
