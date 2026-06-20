-- =============================================
-- Climate Commons — RLS Policies Migration
-- 003_rls.sql: enable RLS + policies per section 3.8
-- =============================================

-- =============================================
-- 1. Enable RLS on every table
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE originality_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_impact_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_reports ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. Helper note — admin check pattern
--    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
-- =============================================

-- =============================================
-- 3. Users
-- =============================================

CREATE POLICY users_select_public ON users
  FOR SELECT USING (true);

CREATE POLICY users_select_admin ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY users_update_admin ON users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

-- =============================================
-- 4. Categories & Partners (public read, admin CUD)
-- =============================================

CREATE POLICY research_categories_select_public ON research_categories
  FOR SELECT USING (true);

CREATE POLICY research_categories_insert_admin ON research_categories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY research_categories_update_admin ON research_categories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY research_categories_delete_admin ON research_categories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY forum_categories_select_public ON forum_categories
  FOR SELECT USING (true);

CREATE POLICY forum_categories_insert_admin ON forum_categories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY forum_categories_update_admin ON forum_categories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY forum_categories_delete_admin ON forum_categories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY partners_select_public ON partners
  FOR SELECT USING (true);

CREATE POLICY partners_insert_admin ON partners
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY partners_update_admin ON partners
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY partners_delete_admin ON partners
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

-- =============================================
-- 5. Public submission tables (public INSERT, admin R/W/D)
-- =============================================

CREATE POLICY newsletter_subscribers_insert_public ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY newsletter_subscribers_select_admin ON newsletter_subscribers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY newsletter_subscribers_update_admin ON newsletter_subscribers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY newsletter_subscribers_delete_admin ON newsletter_subscribers
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY contact_submissions_insert_public ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY contact_submissions_select_admin ON contact_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY contact_submissions_update_admin ON contact_submissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY contact_submissions_delete_admin ON contact_submissions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY partnership_inquiries_insert_public ON partnership_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY partnership_inquiries_select_admin ON partnership_inquiries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY partnership_inquiries_update_admin ON partnership_inquiries
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY partnership_inquiries_delete_admin ON partnership_inquiries
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

-- =============================================
-- 6. Research
-- =============================================

CREATE POLICY research_projects_select_public ON research_projects
  FOR SELECT USING (true);

CREATE POLICY research_projects_insert_researcher ON research_projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('researcher', 'elite', 'admin', 'platform_admin', 'moderator')
    )
  );

CREATE POLICY research_projects_update_own ON research_projects
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY research_projects_update_admin ON research_projects
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY research_projects_delete_admin ON research_projects
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY proposals_select_owner ON proposals
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY proposals_select_admin ON proposals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY proposals_insert_authenticated ON proposals
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY proposals_update_own ON proposals
  FOR UPDATE USING (auth.uid() = submitted_by);

CREATE POLICY proposals_update_admin ON proposals
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY proposals_delete_admin ON proposals
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY research_participants_select_public ON research_participants
  FOR SELECT USING (true);

CREATE POLICY research_participants_insert_authenticated ON research_participants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY research_participants_update_owner ON research_participants
  FOR UPDATE USING (
    auth.uid() IN (SELECT created_by FROM research_projects WHERE id = research_project_id)
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY research_participants_delete_own ON research_participants
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY research_participants_delete_admin ON research_participants
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY research_updates_select_public ON research_updates
  FOR SELECT USING (true);

CREATE POLICY research_updates_insert_author ON research_updates
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND auth.uid() IN (SELECT created_by FROM research_projects WHERE id = research_project_id)
  );

CREATE POLICY research_updates_update_own ON research_updates
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY research_updates_update_admin ON research_updates
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY research_updates_delete_admin ON research_updates
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY research_attachments_select_authenticated ON research_attachments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY research_attachments_insert_author ON research_attachments
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by
    AND auth.uid() IN (SELECT created_by FROM research_projects WHERE id = research_project_id)
  );

CREATE POLICY research_attachments_update_own ON research_attachments
  FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY research_attachments_update_admin ON research_attachments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY research_attachments_delete_own ON research_attachments
  FOR DELETE USING (auth.uid() = uploaded_by);

CREATE POLICY research_attachments_delete_admin ON research_attachments
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

-- =============================================
-- 7. Forum
-- =============================================

CREATE POLICY forum_threads_select_public ON forum_threads
  FOR SELECT USING (true);

CREATE POLICY forum_threads_insert_authenticated ON forum_threads
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY forum_threads_update_own ON forum_threads
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY forum_threads_update_admin ON forum_threads
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY forum_threads_delete_admin ON forum_threads
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY forum_replies_select_public ON forum_replies
  FOR SELECT USING (true);

CREATE POLICY forum_replies_insert_authenticated ON forum_replies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY forum_replies_update_own ON forum_replies
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY forum_replies_update_admin ON forum_replies
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY forum_replies_delete_admin ON forum_replies
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY forum_likes_select_public ON forum_likes
  FOR SELECT USING (true);

CREATE POLICY forum_likes_insert_authenticated ON forum_likes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY forum_likes_delete_own ON forum_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY forum_attachments_select_public ON forum_attachments
  FOR SELECT USING (true);

CREATE POLICY forum_attachments_insert_authenticated ON forum_attachments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY forum_attachments_update_own ON forum_attachments
  FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY forum_attachments_delete_own ON forum_attachments
  FOR DELETE USING (auth.uid() = uploaded_by);

CREATE POLICY forum_attachments_delete_admin ON forum_attachments
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY originality_claims_select_owner ON originality_claims
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY originality_claims_select_admin ON originality_claims
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY originality_claims_insert_thread_author ON originality_claims
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT author_id FROM forum_threads WHERE id = thread_id)
  );

CREATE POLICY originality_claims_update_admin ON originality_claims
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY originality_claims_delete_admin ON originality_claims
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY content_flags_select_reporter ON content_flags
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY content_flags_select_admin ON content_flags
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY content_flags_insert_authenticated ON content_flags
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY content_flags_update_admin ON content_flags
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY content_flags_delete_admin ON content_flags
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

-- =============================================
-- 8. Actions
-- =============================================

CREATE POLICY actions_select_public ON actions
  FOR SELECT USING (true);

CREATE POLICY actions_insert_authenticated ON actions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY actions_update_own ON actions
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY actions_update_admin ON actions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY actions_delete_admin ON actions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY action_participants_select_public ON action_participants
  FOR SELECT USING (true);

CREATE POLICY action_participants_insert_authenticated ON action_participants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY action_participants_delete_own ON action_participants
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY action_participants_delete_admin ON action_participants
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY action_updates_select_public ON action_updates
  FOR SELECT USING (true);

CREATE POLICY action_updates_insert_organiser ON action_updates
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND auth.uid() IN (SELECT created_by FROM actions WHERE id = action_id)
  );

CREATE POLICY action_updates_update_own ON action_updates
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY action_updates_update_admin ON action_updates
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY action_updates_delete_admin ON action_updates
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY action_impact_reports_select_public ON action_impact_reports
  FOR SELECT USING (true);

CREATE POLICY action_impact_reports_insert_participant ON action_impact_reports
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND auth.uid() IN (SELECT user_id FROM action_participants WHERE action_id = action_id)
  );

CREATE POLICY action_impact_reports_update_own ON action_impact_reports
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY action_impact_reports_update_admin ON action_impact_reports
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY action_impact_reports_delete_own ON action_impact_reports
  FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY action_impact_reports_delete_admin ON action_impact_reports
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

-- =============================================
-- 9. Policy (legislative)
-- =============================================

CREATE POLICY policy_updates_select_public ON policy_updates
  FOR SELECT USING (true);

CREATE POLICY policy_updates_insert_elevated ON policy_updates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('researcher', 'elite', 'admin', 'platform_admin', 'moderator')
    )
  );

CREATE POLICY policy_updates_update_admin ON policy_updates
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY policy_updates_delete_admin ON policy_updates
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY policy_endorsements_select_public ON policy_endorsements
  FOR SELECT USING (true);

CREATE POLICY policy_endorsements_insert_authenticated ON policy_endorsements
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY policy_endorsements_delete_own ON policy_endorsements
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY policy_reports_select_admin ON policy_reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY policy_reports_insert_admin ON policy_reports
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY policy_reports_update_admin ON policy_reports
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY policy_reports_delete_admin ON policy_reports
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

-- =============================================
-- 10. Open Data
-- =============================================

CREATE POLICY datasets_select_public ON datasets
  FOR SELECT USING (true);

CREATE POLICY datasets_insert_elevated ON datasets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('researcher', 'elite', 'admin', 'platform_admin', 'moderator')
    )
  );

CREATE POLICY datasets_update_own ON datasets
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY datasets_update_admin ON datasets
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY datasets_delete_admin ON datasets
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

-- =============================================
-- 11. Platform & Analytics
-- =============================================

CREATE POLICY events_insert_any ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY events_select_admin ON events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY events_update_admin ON events
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY events_delete_admin ON events
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY platform_settings_select_public ON platform_settings
  FOR SELECT USING (true);

CREATE POLICY platform_settings_insert_admin ON platform_settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY platform_settings_update_admin ON platform_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

CREATE POLICY platform_settings_delete_admin ON platform_settings
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'moderator'))
  );

-- =============================================
-- 12. User-owned tables
-- =============================================

CREATE POLICY bookmarks_select_own ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY bookmarks_insert_own ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY bookmarks_update_own ON bookmarks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY bookmarks_delete_own ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY notifications_select_own ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY notifications_delete_own ON notifications
  FOR DELETE USING (auth.uid() = user_id);
