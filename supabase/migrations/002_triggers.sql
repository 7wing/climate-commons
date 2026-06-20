-- =============================================
-- Climate Commons — Triggers Migration
-- 002_triggers.sql: updated_at triggers + auth user insert trigger
-- =============================================

-- =============================================
-- 1. Generic updated_at trigger function
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 2. Attach BEFORE UPDATE trigger to every table with updated_at
--    (policy_endorsements is the only table without updated_at)
-- =============================================

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_research_categories_updated_at ON public.research_categories;
CREATE TRIGGER trg_research_categories_updated_at
  BEFORE UPDATE ON public.research_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_forum_categories_updated_at ON public.forum_categories;
CREATE TRIGGER trg_forum_categories_updated_at
  BEFORE UPDATE ON public.forum_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_partners_updated_at ON public.partners;
CREATE TRIGGER trg_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_newsletter_subscribers_updated_at ON public.newsletter_subscribers;
CREATE TRIGGER trg_newsletter_subscribers_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER trg_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_partnership_inquiries_updated_at ON public.partnership_inquiries;
CREATE TRIGGER trg_partnership_inquiries_updated_at
  BEFORE UPDATE ON public.partnership_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_research_projects_updated_at ON public.research_projects;
CREATE TRIGGER trg_research_projects_updated_at
  BEFORE UPDATE ON public.research_projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_proposals_updated_at ON public.proposals;
CREATE TRIGGER trg_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_forum_threads_updated_at ON public.forum_threads;
CREATE TRIGGER trg_forum_threads_updated_at
  BEFORE UPDATE ON public.forum_threads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_actions_updated_at ON public.actions;
CREATE TRIGGER trg_actions_updated_at
  BEFORE UPDATE ON public.actions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_policy_updates_updated_at ON public.policy_updates;
CREATE TRIGGER trg_policy_updates_updated_at
  BEFORE UPDATE ON public.policy_updates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_datasets_updated_at ON public.datasets;
CREATE TRIGGER trg_datasets_updated_at
  BEFORE UPDATE ON public.datasets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_events_updated_at ON public.events;
CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_platform_settings_updated_at ON public.platform_settings;
CREATE TRIGGER trg_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_bookmarks_updated_at ON public.bookmarks;
CREATE TRIGGER trg_bookmarks_updated_at
  BEFORE UPDATE ON public.bookmarks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_notifications_updated_at ON public.notifications;
CREATE TRIGGER trg_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_research_participants_updated_at ON public.research_participants;
CREATE TRIGGER trg_research_participants_updated_at
  BEFORE UPDATE ON public.research_participants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_research_updates_updated_at ON public.research_updates;
CREATE TRIGGER trg_research_updates_updated_at
  BEFORE UPDATE ON public.research_updates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_research_attachments_updated_at ON public.research_attachments;
CREATE TRIGGER trg_research_attachments_updated_at
  BEFORE UPDATE ON public.research_attachments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_forum_replies_updated_at ON public.forum_replies;
CREATE TRIGGER trg_forum_replies_updated_at
  BEFORE UPDATE ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_forum_likes_updated_at ON public.forum_likes;
CREATE TRIGGER trg_forum_likes_updated_at
  BEFORE UPDATE ON public.forum_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_forum_attachments_updated_at ON public.forum_attachments;
CREATE TRIGGER trg_forum_attachments_updated_at
  BEFORE UPDATE ON public.forum_attachments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_originality_claims_updated_at ON public.originality_claims;
CREATE TRIGGER trg_originality_claims_updated_at
  BEFORE UPDATE ON public.originality_claims
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_content_flags_updated_at ON public.content_flags;
CREATE TRIGGER trg_content_flags_updated_at
  BEFORE UPDATE ON public.content_flags
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_action_participants_updated_at ON public.action_participants;
CREATE TRIGGER trg_action_participants_updated_at
  BEFORE UPDATE ON public.action_participants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_action_updates_updated_at ON public.action_updates;
CREATE TRIGGER trg_action_updates_updated_at
  BEFORE UPDATE ON public.action_updates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_action_impact_reports_updated_at ON public.action_impact_reports;
CREATE TRIGGER trg_action_impact_reports_updated_at
  BEFORE UPDATE ON public.action_impact_reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_policy_reports_updated_at ON public.policy_reports;
CREATE TRIGGER trg_policy_reports_updated_at
  BEFORE UPDATE ON public.policy_reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- 3. Auth user → public.users insert trigger
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
