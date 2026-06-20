# 001_schema.sql Migration Notes

## Date
2026-06-19

## Scope
Created `/project/workspace/supabase/migrations/001_schema.sql` containing:
- All CREATE TABLE statements for the Climate Commons schema
- All CHECK constraints exactly as defined in BLUEPRINT.md
- All indexes from section 3.7
- No triggers (reserved for 002_triggers.sql)
- No RLS policies (reserved for 003_rls.sql)

## Table Count
30 tables created in dependency order:

### Phase 1 — No FKs
1. users
2. research_categories
3. forum_categories
4. partners
5. newsletter_subscribers
6. contact_submissions
7. partnership_inquiries

### Phase 2 — Reference phase 1
8. research_projects
9. proposals
10. forum_threads
11. actions
12. policy_updates
13. datasets
14. events
15. platform_settings
16. bookmarks
17. notifications

### Phase 3 — Reference phase 2
18. research_participants
19. research_updates
20. research_attachments
21. forum_replies
22. forum_likes
23. forum_attachments
24. originality_claims
25. content_flags
26. action_participants
27. action_updates
28. action_impact_reports
29. policy_endorsements
30. policy_reports

## Index Count
52 indexes created (including composite and GIN indexes).

## Verification
- All 30 expected table names confirmed present in migration.
- All section 3.7 indexes confirmed present.
- No forbidden elements (triggers, policies, RLS) found.
