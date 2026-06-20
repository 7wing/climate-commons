# Frontend–Database Alignment Audit Report

## Executive Summary

**Date:** 2026-06-20  
**Scope:** All 31 frontend routes (section 3.9) mapped against `001_schema.sql` + `003_rls.sql`.  
**Overall Status:** Mostly aligned with **4 medium-severity gaps** and **1 architectural concern** identified. No show-stopping blockers, but fixes are required before the profile page, policy sidebar, and soft-delete logic work correctly.

- **Routes mapped:** 31
- **Mismatches / gaps found:** 5
- **Severity:** 1 architectural concern, 4 medium

---

## Route-to-DB Mapping Table

| Route | Page Type | Tables Used | Columns / Queries Needed | RLS Implications |
|-------|-----------|-------------|--------------------------|------------------|
| `/` | Public | `platform_settings`, `research_projects`, `forum_threads` | `platform_settings.featured_project_id`, `hectares_protected`, `purity_rating`, `trust_score`; latest 3 `forum_threads` (`title`, `author_id`, `created_at`) | `platform_settings_select_public` OK; `forum_threads_select_public` OK |
| `/research` | Public | `research_projects`, `research_categories`, `users` | `title`, `description`, `status`, `category_id`, `cover_image_url`, `created_by`; COUNT participants; category filter by `slug` | `research_projects_select_public` OK; `research_categories_select_public` OK; `users_select_public` OK |
| `/research/[id]` | Public | `research_projects`, `research_categories`, `users`, `research_participants`, `research_updates`, `research_attachments` | Full project + author profile + participant list + updates + attachments | `research_projects_select_public` OK; `research_participants_select_public` OK; `research_updates_select_public` OK; `research_attachments_select_authenticated` requires login |
| `/forum` | Public | `forum_threads`, `forum_categories`, `users`, `forum_likes`, `forum_replies` | List threads with author, category, like count, reply count, tags | `forum_threads_select_public` OK; `forum_likes_select_public` OK; `forum_replies_select_public` OK |
| `/forum/[id]` | Public | `forum_threads`, `forum_replies`, `forum_likes`, `forum_attachments`, `users`, `originality_claims`, `content_flags` | Thread body + nested replies + likes + attachments + author info | `forum_threads_select_public` OK; `forum_replies_select_public` OK; `forum_attachments_select_public` OK; `originality_claims_select_owner` blocks public view; `content_flags_select_reporter` blocks public view |
| `/actions` | Public | `actions`, `users` | `title`, `description`, `category`, `impact_level`, `event_date`, `location_name`, `latitude`, `longitude`, `cover_image_url`, `created_by`; COUNT participants | `actions_select_public` OK; `users_select_public` OK |
| `/actions/[id]` | Public | `actions`, `users`, `action_participants`, `action_updates`, `action_impact_reports` | Action detail + organiser + participants + updates + impact reports | `actions_select_public` OK; `action_participants_select_public` OK; `action_updates_select_public` OK; `action_impact_reports_select_public` OK |
| `/policy` | Public | `policy_updates`, `platform_settings`, `policy_reports` | List published policies + `trust_score`; sidebar Q3 report download | `policy_updates_select_public` OK; `platform_settings_select_public` OK; `policy_reports_select_admin` **blocks public download** |
| `/policy/[id]` | Public | `policy_updates`, `policy_endorsements`, `users`, `platform_settings` | Policy body + endorsements + endorser avatars + map geojson | `policy_updates_select_public` OK; `policy_endorsements_select_public` OK; `users_select_public` OK |
| `/open-data` | Public | `datasets`, `platform_settings` | `title`, `description`, `category`, `verification_status`, `file_formats`, `file_url`, `external_url` | `datasets_select_public` OK; `platform_settings_select_public` OK |
| `/partnerships` | Public | `partners`, `partnership_inquiries` | `name`, `logo_url`, `website_url`; inquiry form INSERT | `partners_select_public` OK; `partnership_inquiries_insert_public` OK |
| `/forum-guidelines` | Public | — | Static page, no DB reads | N/A |
| `/contact` | Public | `contact_submissions` | Form fields INSERT (`full_name`, `email`, `inquiry_type`, `message`) | `contact_submissions_insert_public` OK |
| `/auth/login` | Public | Supabase Auth | Standard Supabase Auth sign-in | Handled by Supabase Auth (not RLS) |
| `/auth/signup` | Public | Supabase Auth, `users` | Auth signup + trigger creates `users` row | Handled by Supabase Auth + `users_select_public` |
| `/research/propose` | Auth | `proposals`, `research_categories` | INSERT `title`, `description`, `category_id`, `submitted_by` | `proposals_insert_authenticated` OK; `research_categories_select_public` OK |
| `/forum/new` | Auth | `forum_threads`, `forum_categories`, `forum_attachments` | INSERT thread + optional attachments | `forum_threads_insert_authenticated` OK; `forum_attachments_insert_authenticated` OK |
| `/actions/register` | Auth | `actions` | INSERT `title`, `description`, `category`, `impact_level`, `event_date`, `start_time`, `end_time`, `location_name`, `latitude`, `longitude`, `created_by` | `actions_insert_authenticated` OK |
| `/profile/[id]` | Auth + Public read | `users`, `originality_claims`, `action_participants`, `bookmarks`, `forum_threads`, `forum_replies` | Profile info + verified ideas + joined actions + bookmarks + recent forum activity | `users_select_public` OK; `originality_claims_select_owner` **blocks others from seeing verified ideas**; `bookmarks_select_own` OK (private); `forum_threads_select_public` OK; `forum_replies_select_public` OK |
| `/notifications` | Auth | `notifications` | SELECT own notifications; UPDATE `read` | `notifications_select_own` OK; `notifications_update_own` OK |
| `/settings` | Auth | `users` | UPDATE own profile (`display_name`, `display_title`, `avatar_url`, `cover_image_url`, `bio`, `country`, `location`) | `users_update_own` OK |
| `/bookmarks` | Auth | `bookmarks` | SELECT own bookmarks; DELETE own bookmark | `bookmarks_select_own` OK; `bookmarks_delete_own` OK |
| `/admin` | Admin | `proposals`, `actions`, `originality_claims`, `content_flags`, `events` | COUNT pending items; recent activity feed | Admin SELECT policies OK |
| `/admin/proposals` | Admin | `proposals` | SELECT all proposals; UPDATE `status`, `review_notes`, `approved_by`, `approved_at`, `recommended_by` | `proposals_select_admin` OK; `proposals_update_admin` OK |
| `/admin/actions` | Admin | `actions` | SELECT all actions; UPDATE `status`, `review_notes`, `approved_by`, `approved_at` | `actions_select_public` OK; `actions_update_admin` OK |
| `/admin/claims` | Admin | `originality_claims`, `users` | SELECT all claims; UPDATE `status`, `verified_by`, `verified_at` | `originality_claims_select_admin` OK; `originality_claims_update_admin` OK |
| `/admin/flags` | Admin | `content_flags`, `forum_threads`, `forum_replies`, `users` | SELECT all flags; UPDATE `status` | `content_flags_select_admin` OK; `content_flags_update_admin` OK |
| `/admin/policy` | Admin | `policy_updates` | Full CRUD on policy updates | `policy_updates_insert_elevated` OK; `policy_updates_update_admin` OK; `policy_updates_delete_admin` OK |
| `/admin/users` | Admin | `users` | SELECT all; UPDATE `role` | `users_select_admin` OK; `users_update_admin` OK |
| `/admin/reports` | Admin | `policy_reports` | INSERT, SELECT, UPDATE, DELETE reports | `policy_reports_insert_admin` OK; `policy_reports_select_admin` OK; `policy_reports_update_admin` OK |
| `/admin/datasets` | Admin | `datasets` | SELECT all; UPDATE/DELETE any | `datasets_select_public` OK; `datasets_update_admin` OK; `datasets_delete_admin` OK |
| `/admin/settings` | Admin | `platform_settings` | SELECT, UPDATE settings | `platform_settings_select_public` OK; `platform_settings_update_admin` OK |
| `/admin/partnerships` | Admin | `partnership_inquiries` | SELECT all; UPDATE `reviewed_at` | `partnership_inquiries_select_admin` OK; `partnership_inquiries_update_admin` OK |
| `/admin/contact` | Admin | `contact_submissions` | SELECT all; UPDATE `resolved_at` | `contact_submissions_select_admin` OK; `contact_submissions_update_admin` OK |

---

## Mismatches & Gaps

### 1. `originality_claims` — Missing Public Read Policy for Verified Ideas
- **Severity:** Medium  
- **Route affected:** `/profile/[id]` (VerifiedIdeasSection)  
- **Issue:** Blueprint section 3.10 states the profile page shows `VerifiedIdeasSection` — approved originality claims with support counts. The current RLS (`originality_claims_select_owner`, `originality_claims_select_admin`) means only the claim owner and admins can read claims. Public visitors to another user’s profile will receive zero claims.  
- **Recommendation:** Add a public SELECT policy: `FOR SELECT USING (status = 'verified' AND deleted_at IS NULL)`. This still hides pending/rejected claims while exposing verified ones publicly.

### 2. `policy_reports` — No Public Download Policy
- **Severity:** Medium  
- **Route affected:** `/policy` (PolicyTransparencyReportSidebar — "download Q3 report")  
- **Issue:** Blueprint expects a public download link for quarterly policy transparency reports on the policy list page. Current RLS only allows `policy_reports_select_admin`. A logged-out or regular user querying the table will get an empty result.  
- **Recommendation:** Either (a) add `policy_reports_select_public` for rows meeting a published condition (e.g., a new `published_at` column), or (b) store the public report URL in `platform_settings` instead of the `policy_reports` table. If option (a), add `published_at TIMESTAMPTZ` to `policy_reports`.

### 3. Soft-Deleted Records Visible in Public SELECTs
- **Severity:** Medium (data-leak / UX risk)  
- **Routes affected:** `/research`, `/forum`, `/actions`, `/policy`, `/open-data`, `/profile/[id]`, `/partnerships`  
- **Issue:** Every public SELECT policy (`*_select_public`) uses `USING (true)` and does **not** filter out rows where `deleted_at IS NOT NULL`. Blueprint section 3.6 defines soft delete for most content tables, and section 3.8 says deleted threads should show a "Deleted" placeholder. However, the placeholder is a UI concern; the raw data should not be returned to the public by default.  
- **Recommendation:** Update every public SELECT policy to include `AND deleted_at IS NULL`, or ensure every frontend query adds `.is('deleted_at', null)`. Preferred fix is in RLS so that soft-deleted content is never accidentally exposed.

### 4. Supabase Storage Buckets Not Defined in Schema Migrations
- **Severity:** Architectural concern (blocks file-upload feature)  
- **Routes affected:** `/research/[id]`, `/forum/new`, `/forum/[id]`, `/actions/register`, `/actions/[id]`, `/policy/[id]`, `/open-data`, `/profile/[id]`, `/settings`, `/admin/settings`  
- **Issue:** Blueprint section 3.12 defines 9 storage buckets (`research-covers`, `research-attachments`, `forum-attachments`, `action-media`, `policy-documents`, `open-datasets`, `avatars`, `profile-covers`, `hero-images`) with file-type/size rules. Neither `001_schema.sql` nor `003_rls.sql` creates these buckets or applies bucket-level RLS. Supabase file uploads will fail until buckets are provisioned.  
- **Recommendation:** Add a new migration (e.g., `002_storage.sql`) that inserts into `storage.buckets` and sets bucket-level policies to enforce file-type/size constraints. Alternatively document manual bucket creation in Supabase Studio, but a migration is safer for reproducibility.

### 5. `action_impact_reports` INSERT — Does Not Verify Active Participation
- **Severity:** Low–Medium  
- **Route affected:** `/actions/[id]` (ImpactReportComposer)  
- **Issue:** The INSERT policy for `action_impact_reports` checks only that `auth.uid()` exists in `action_participants` for that `action_id`. It does **not** verify `status = 'active'`. A participant whose join request is still `pending` (or was `rejected`) could technically post an impact report. Blueprint says only participants can post impact reports, which implies active participants.  
- **Recommendation:** Tighten the INSERT policy to: `auth.uid() IN (SELECT user_id FROM action_participants WHERE action_id = action_id AND status = 'active')`.

---

## Recommendations

### Schema Changes
1. Add `published_at TIMESTAMPTZ` to `policy_reports` if public downloads are to be served directly from this table (alternative: use `platform_settings` for the public report URL).
2. Consider adding a `deleted_at` guard column check in all public SELECT policies per gap #3.

### RLS Changes
1. **originality_claims:** Add `originality_claims_select_verified_public` allowing `SELECT WHERE status = 'verified' AND deleted_at IS NULL`.
2. **policy_reports:** Add `policy_reports_select_public` allowing `SELECT WHERE published_at IS NOT NULL AND deleted_at IS NULL` (requires schema change above) OR move public report links to `platform_settings`.
3. **Soft-delete filter:** Append `AND deleted_at IS NULL` to all `*_select_public` policies across content tables (`research_projects`, `forum_threads`, `forum_replies`, `actions`, `policy_updates`, `datasets`, `partners`, `research_updates`, `action_updates`, `action_impact_reports`, etc.). If the front end is expected to show "[Comment deleted]" placeholders, those should be rendered from the frontend layer after filtering `deleted_at IS NULL` from primary lists; hard-deleted content should not stream to clients.
4. **action_impact_reports:** Tighten INSERT policy to require `status = 'active'` in `action_participants`.

### Storage Setup
5. Create migration `002_storage.sql` (or equivalent) to:
   - Insert the 9 buckets into `storage.buckets`.
   - Set bucket-level RLS policies enforcing file-type/size limits where possible (Supabase bucket policies run at the row/OBJ level; size/type validation may also need Edge Function guards).

### Blueprint ↔ Schema Sync
6. Blueprint section 3.12 (File Uploads) and the schema are aligned on bucket names and privacy levels, but the schema migrations do not actually provision them. A cross-reference note in the blueprint would help future maintainers.
7. No columns referenced by the blueprint are missing from the schema. All fields needed for section 3.9 and 3.10 components exist.

---

## Appendix: Quick Reference — Auth / Role / Data Flow

| Action | Who | Tables | RLS Check |
|--------|-----|--------|-----------|
| Browse research | Anyone | `research_projects`, `research_categories` | `research_projects_select_public` |
| Join project (open) | Logged-in | `research_participants` | `research_participants_insert_authenticated` |
| Submit proposal | Logged-in | `proposals` | `proposals_insert_authenticated` |
| Create project directly | Researcher+ | `research_projects` | `research_projects_insert_researcher` |
| Post thread / reply | Logged-in | `forum_threads`, `forum_replies` | `*_insert_authenticated` |
| Like thread/reply | Logged-in | `forum_likes` | `forum_likes_insert_authenticated` |
| Claim originality | Thread author | `originality_claims` | `originality_claims_insert_thread_author` |
| Register action | Logged-in | `actions` | `actions_insert_authenticated` |
| Post action update | Organiser | `action_updates` | `action_updates_insert_organiser` |
| Post impact report | Active participant | `action_impact_reports` | Insert + active check (gap #5) |
| Endorse policy | Logged-in | `policy_endorsements` | `policy_endorsements_insert_authenticated` |
| Create dataset | Researcher+ | `datasets` | `datasets_insert_elevated` |
| Bookmark | Logged-in | `bookmarks` | `bookmarks_insert_own` |
| Admin dashboard / queues | Admin | All tables | `*_select_admin` / `*_update_admin` |

---

*Report generated by build agent during Phase 1, Step 1.*
