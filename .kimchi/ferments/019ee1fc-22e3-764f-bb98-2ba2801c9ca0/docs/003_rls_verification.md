# 003_rls.sql — Verification Report

## File
`/project/workspace/supabase/migrations/003_rls.sql`

## Checks Performed

1. **ALTER TABLE count**: 30 tables — matches all 30 tables defined in `001_schema.sql`.
2. **Policy count**: 134 policies created.
3. **Every table has at least one policy**: Confirmed by extracting `CREATE POLICY ... ON <table>` clauses and comparing against the schema table list.

## Tables Covered

| Table | RLS Enabled | Policies | Notes |
|---|---|---|---|
| users | Yes | 4 | Public select; own update; admin select/update all |
| research_categories | Yes | 4 | Public select; admin CUD |
| forum_categories | Yes | 4 | Public select; admin CUD |
| partners | Yes | 4 | Public select; admin CUD |
| newsletter_subscribers | Yes | 4 | Public INSERT; admin SELECT/UPDATE/DELETE |
| contact_submissions | Yes | 4 | Public INSERT; admin SELECT/UPDATE/DELETE |
| partnership_inquiries | Yes | 4 | Public INSERT; admin SELECT/UPDATE/DELETE |
| research_projects | Yes | 5 | Public SELECT; researcher+ INSERT; own/admin UPDATE; admin DELETE |
| proposals | Yes | 6 | Owner SELECT; authenticated INSERT; own/admin UPDATE; admin DELETE |
| research_participants | Yes | 5 | Public SELECT; authenticated INSERT; owner UPDATE; own/admin DELETE |
| research_updates | Yes | 5 | Public SELECT; project author INSERT; own/admin UPDATE; admin DELETE |
| research_attachments | Yes | 6 | Authenticated SELECT; project author INSERT; own/admin UPDATE/DELETE |
| forum_threads | Yes | 5 | Public SELECT; authenticated INSERT; own/admin UPDATE; admin DELETE |
| forum_replies | Yes | 5 | Public SELECT; authenticated INSERT; own/admin UPDATE; admin DELETE |
| forum_likes | Yes | 3 | Public SELECT; authenticated INSERT; own DELETE |
| forum_attachments | Yes | 5 | Public SELECT; authenticated INSERT; own UPDATE/DELETE; admin DELETE |
| originality_claims | Yes | 5 | Owner/admin SELECT; thread author INSERT; admin UPDATE/DELETE |
| content_flags | Yes | 5 | Reporter/admin SELECT; authenticated INSERT; admin UPDATE/DELETE |
| actions | Yes | 5 | Public SELECT; authenticated INSERT; own/admin UPDATE; admin DELETE |
| action_participants | Yes | 4 | Public SELECT; authenticated INSERT; own/admin DELETE |
| action_updates | Yes | 5 | Public SELECT; organiser INSERT; own/admin UPDATE; admin DELETE |
| action_impact_reports | Yes | 5 | Public SELECT; participant INSERT; own/admin UPDATE; own/admin DELETE |
| policy_updates | Yes | 4 | Public SELECT; researcher+ INSERT; admin UPDATE/DELETE |
| policy_endorsements | Yes | 3 | Public SELECT; authenticated INSERT; own DELETE |
| policy_reports | Yes | 4 | Admin-only read/write |
| datasets | Yes | 5 | Public SELECT; researcher+ INSERT; own/admin UPDATE; admin DELETE |
| events | Yes | 4 | Any INSERT; admin SELECT/UPDATE/DELETE |
| platform_settings | Yes | 4 | Public SELECT; admin CUD |
| bookmarks | Yes | 4 | Owner-only CRUD |
| notifications | Yes | 3 | Owner-only SELECT/UPDATE/DELETE |

## Admin Role Check Pattern

All admin-override policies use the exact pattern specified in the task:

```sql
EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
```

## Elevated Role Checks

Researcher-level INSERT policies use the valid roles from the blueprint:

```sql
role IN ('researcher', 'elite', 'admin', 'platform_admin', 'moderator')
```

## Naming Convention

All policies follow `<table>_<action>_<scope>`:
- `users_select_public`
- `research_projects_insert_researcher`
- `forum_threads_insert_authenticated`
- `content_flags_update_admin`

## Result

PASS — `003_rls.sql` is complete and consistent with the schema and blueprint section 3.8.
