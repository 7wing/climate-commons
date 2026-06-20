-- =============================================
-- Climate Commons — Full Schema Migration
-- 001_schema.sql: tables, constraints, indexes
-- =============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- PHASE 1 — Base tables (no foreign keys)
-- =============================================

CREATE TABLE IF NOT EXISTS users (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email             TEXT UNIQUE NOT NULL,
  display_name      TEXT NOT NULL,
  display_title     TEXT,
  avatar_url        TEXT,
  cover_image_url   TEXT,
  bio               TEXT,
  country           TEXT,
  location          TEXT,
  role              TEXT DEFAULT 'user'
                    CHECK (role IN ('user','contributor','researcher','elite','admin')),
  impact_score      DECIMAL DEFAULT 0,
  deleted_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS research_categories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  color      TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_categories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  color      TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partners (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  logo_url    TEXT,
  website_url TEXT,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email           TEXT UNIQUE NOT NULL,
  subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  inquiry_type TEXT NOT NULL,
  message      TEXT NOT NULL,
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partnership_inquiries (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_name           TEXT NOT NULL,
  org_type           TEXT NOT NULL,
  contact_email      TEXT NOT NULL,
  collaboration_goal TEXT NOT NULL,
  reviewed_at        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PHASE 2 — Tables referencing phase 1
-- =============================================

CREATE TABLE IF NOT EXISTS research_projects (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  category_id     UUID REFERENCES research_categories(id),
  status          TEXT DEFAULT 'seeking_partners'
                  CHECK (status IN ('in_progress','seeking_partners','completed')),
  join_mode       TEXT DEFAULT 'open'
                  CHECK (join_mode IN ('open','request')),
  cover_image_url TEXT,
  created_by      UUID REFERENCES users(id),
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proposals (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  category_id      UUID REFERENCES research_categories(id),
  status           TEXT DEFAULT 'submitted'
                   CHECK (status IN ('submitted','recommended','approved','rejected')),
  submitted_by     UUID REFERENCES users(id),
  recommended_by   UUID REFERENCES users(id),
  approved_by      UUID REFERENCES users(id),
  submitted_at     TIMESTAMPTZ,
  recommended_at   TIMESTAMPTZ,
  approved_at      TIMESTAMPTZ,
  review_notes     TEXT,
  deleted_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_threads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  author_id   UUID REFERENCES users(id),
  category_id UUID REFERENCES forum_categories(id),
  tags        TEXT[] DEFAULT '{}',
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS actions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        TEXT NOT NULL,
  impact_level    TEXT CHECK (impact_level IN ('high_impact','standard')),
  cover_image_url TEXT,
  event_date      DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME,
  location_name   TEXT NOT NULL,
  latitude        DECIMAL NOT NULL,
  longitude       DECIMAL NOT NULL,
  status          TEXT DEFAULT 'submitted'
                  CHECK (status IN ('draft','submitted','approved','rejected')),
  created_by      UUID REFERENCES users(id),
  approved_by     UUID REFERENCES users(id),
  submitted_at    TIMESTAMPTZ,
  approved_at     TIMESTAMPTZ,
  review_notes    TEXT,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS policy_updates (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title                 TEXT NOT NULL,
  body                  TEXT NOT NULL,
  scope                 TEXT CHECK (scope IN ('national','regional','local')),
  status                TEXT DEFAULT 'draft'
                        CHECK (status IN ('draft','submitted','published')),
  official_source_url   TEXT,
  full_text_pdf_url     TEXT,
  press_release_url     TEXT,
  endorsement_threshold INTEGER,
  threshold_reached_at  TIMESTAMPTZ,
  threshold_notified    BOOLEAN DEFAULT false,
  region_geojson        TEXT,
  map_center_lat        DECIMAL,
  map_center_lng        DECIMAL,
  map_zoom_level        INTEGER,
  created_by            UUID REFERENCES users(id),
  published_at          TIMESTAMPTZ,
  deleted_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS datasets (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title               TEXT NOT NULL,
  description         TEXT NOT NULL,
  category            TEXT CHECK (category IN ('air_quality','soil_health','water_quality','biodiversity')),
  verification_status TEXT CHECK (verification_status IN ('verified_source','community_verified','peer_reviewed')),
  file_formats        TEXT[] DEFAULT '{}',
  file_url            TEXT,
  external_url        TEXT,
  created_by          UUID REFERENCES users(id),
  deleted_at          TIMESTAMPTZ,
  published_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS platform_settings (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trust_score           DECIMAL DEFAULT 98.4,
  hectares_protected    TEXT DEFAULT '0',
  purity_rating         TEXT DEFAULT '0%',
  featured_project_id   UUID REFERENCES research_projects(id) ON DELETE SET NULL,
  hero_home_url         TEXT,
  hero_policy_url       TEXT,
  hero_opendata_url     TEXT,
  hero_partnerships_url TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  entity_type TEXT CHECK (entity_type IN ('research','forum_thread','action')),
  entity_id   UUID NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  link       TEXT,
  read       BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PHASE 3 — Dependent tables
-- =============================================

CREATE TABLE IF NOT EXISTS research_participants (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  research_project_id UUID REFERENCES research_projects(id) ON DELETE CASCADE,
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  status              TEXT DEFAULT 'active'
                      CHECK (status IN ('active','pending','rejected')),
  joined_at           TIMESTAMPTZ DEFAULT NOW(),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(research_project_id, user_id)
);

CREATE TABLE IF NOT EXISTS research_updates (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  research_project_id UUID REFERENCES research_projects(id) ON DELETE CASCADE,
  author_id           UUID REFERENCES users(id),
  title               TEXT NOT NULL,
  body                TEXT NOT NULL,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS research_attachments (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  research_project_id UUID REFERENCES research_projects(id) ON DELETE CASCADE,
  uploaded_by         UUID REFERENCES users(id),
  file_url            TEXT NOT NULL,
  file_type           TEXT NOT NULL,
  file_name           TEXT NOT NULL,
  file_size           INTEGER NOT NULL,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_replies (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id  UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
  author_id  UUID REFERENCES users(id),
  parent_id  UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_likes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  thread_id  UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
  reply_id   UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, thread_id),
  UNIQUE(user_id, reply_id),
  CHECK (
    (thread_id IS NOT NULL AND reply_id IS NULL) OR
    (reply_id IS NOT NULL AND thread_id IS NULL)
  )
);

CREATE TABLE IF NOT EXISTS forum_attachments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id   UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
  reply_id    UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES users(id),
  file_url    TEXT NOT NULL,
  file_type   TEXT NOT NULL,
  file_name   TEXT NOT NULL,
  file_size   INTEGER NOT NULL,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS originality_claims (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id   UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  status      TEXT DEFAULT 'pending'
              CHECK (status IN ('pending','verified','rejected')),
  claimed_at  TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id),
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

CREATE TABLE IF NOT EXISTS content_flags (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES users(id),
  thread_id   UUID REFERENCES forum_threads(id),
  reply_id    UUID REFERENCES forum_replies(id),
  reason      TEXT NOT NULL,
  status      TEXT DEFAULT 'pending'
              CHECK (status IN ('pending','reviewed','dismissed')),
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS action_participants (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_id  UUID REFERENCES actions(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(action_id, user_id)
);

CREATE TABLE IF NOT EXISTS action_updates (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_id  UUID REFERENCES actions(id) ON DELETE CASCADE,
  author_id  UUID REFERENCES users(id),
  body       TEXT NOT NULL,
  image_url  TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS action_impact_reports (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_id   UUID REFERENCES actions(id) ON DELETE CASCADE,
  author_id   UUID REFERENCES users(id),
  body        TEXT NOT NULL,
  photo_url   TEXT,
  reported_at DATE NOT NULL,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS policy_endorsements (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id  UUID REFERENCES policy_updates(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(policy_id, user_id)
);

CREATE TABLE IF NOT EXISTS policy_reports (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  period          TEXT NOT NULL,
  pdf_url         TEXT,
  policy_snapshot JSONB DEFAULT '{}',
  generated_at    TIMESTAMPTZ DEFAULT NOW(),
  created_by      UUID REFERENCES users(id),
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES (section 3.7)
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_research_projects_category_id ON research_projects(category_id);
CREATE INDEX IF NOT EXISTS idx_research_projects_status ON research_projects(status);
CREATE INDEX IF NOT EXISTS idx_research_projects_created_by ON research_projects(created_by);
CREATE INDEX IF NOT EXISTS idx_research_projects_created_at ON research_projects(created_at);

CREATE INDEX IF NOT EXISTS idx_research_participants_project_id ON research_participants(research_project_id);
CREATE INDEX IF NOT EXISTS idx_research_participants_user_id ON research_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_research_participants_status ON research_participants(status);

CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_submitted_by ON proposals(submitted_by);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at);

CREATE INDEX IF NOT EXISTS idx_forum_threads_category_id ON forum_threads(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_author_id ON forum_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_created_at ON forum_threads(created_at);
CREATE INDEX IF NOT EXISTS idx_forum_threads_tags ON forum_threads USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_forum_replies_thread_id ON forum_replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_parent_id ON forum_replies(parent_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_author_id ON forum_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_created_at ON forum_replies(created_at);

CREATE INDEX IF NOT EXISTS idx_forum_likes_thread_id ON forum_likes(thread_id);
CREATE INDEX IF NOT EXISTS idx_forum_likes_reply_id ON forum_likes(reply_id);
CREATE INDEX IF NOT EXISTS idx_forum_likes_user_id ON forum_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_originality_claims_user_id ON originality_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_originality_claims_status ON originality_claims(status);
CREATE INDEX IF NOT EXISTS idx_originality_claims_thread_id ON originality_claims(thread_id);

CREATE INDEX IF NOT EXISTS idx_content_flags_status ON content_flags(status);
CREATE INDEX IF NOT EXISTS idx_content_flags_thread_id ON content_flags(thread_id);
CREATE INDEX IF NOT EXISTS idx_content_flags_reply_id ON content_flags(reply_id);

CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(status);
CREATE INDEX IF NOT EXISTS idx_actions_category ON actions(category);
CREATE INDEX IF NOT EXISTS idx_actions_created_at ON actions(created_at);

CREATE INDEX IF NOT EXISTS idx_action_participants_action_id ON action_participants(action_id);
CREATE INDEX IF NOT EXISTS idx_action_participants_user_id ON action_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_action_impact_reports_action_id ON action_impact_reports(action_id);
CREATE INDEX IF NOT EXISTS idx_action_impact_reports_author_id ON action_impact_reports(author_id);

CREATE INDEX IF NOT EXISTS idx_policy_updates_scope ON policy_updates(scope);
CREATE INDEX IF NOT EXISTS idx_policy_updates_status ON policy_updates(status);
CREATE INDEX IF NOT EXISTS idx_policy_updates_created_at ON policy_updates(created_at);

CREATE INDEX IF NOT EXISTS idx_policy_endorsements_policy_id ON policy_endorsements(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_endorsements_user_id ON policy_endorsements(user_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_entity ON bookmarks(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_entity ON bookmarks(user_id, entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_event_name ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

CREATE INDEX IF NOT EXISTS idx_datasets_category ON datasets(category);
CREATE INDEX IF NOT EXISTS idx_datasets_verification_status ON datasets(verification_status);
CREATE INDEX IF NOT EXISTS idx_datasets_created_at ON datasets(created_at);
