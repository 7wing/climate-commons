# CLIMATE COMMONS — BLUEPRINT.md
> Source of truth for every decision. Read this before every session.
> Every blank is filled. Every decision is made. Build in order.

---

## The Golden Rules

> **If it needs to survive a page refresh → it lives in Supabase, not in state.**
> **Stop making decisions while building. Every decision is made here first.**
> **The quality of your prompts is the quality of your app.**

---

## PHASE 3 — THE BLUEPRINT

---

### 3.1 App Overview

```
App Name:         Climate Commons

What it does:     An open-source platform where ecologists, policymakers, and
                  community members collaborate on scientific research, real-world
                  climate actions, and legislative advocacy.
                  Users contribute original ideas, join field initiatives, track
                  verified policy changes, and access open ecological datasets.

Who it is for:    Ecologists, researchers, community organisers, policymakers,
                  environmental advocates, and citizens who want to take tangible
                  climate action.

Public or Private: Hybrid — most content is publicly readable.
                   Creating, joining, commenting, endorsing, and uploading
                   requires a logged-in account.

SEO needed:        Yes — research projects, forum threads, actions, and policy
                   updates must be indexable by search engines.

Framework:         TanStack Start (React + Vite + SSR where needed)
                   NOT Next.js — never suggest Next.js.
                   TanStack Start gives us React + Vite under the hood,
                   file-based routing, and SSR only on public pages that
                   need it (research, forum, policy, actions).
                   Authenticated app pages are SPA behaviour.
                   Deploy target: Netlify or Vercel (both supported).
                   State/data: TanStack Query for all server state.
                   Routing: TanStack Router (built into Start).
```

---

### 3.2 Auth — Who Are Your Users?

```
Sign up methods:       [x] Email/Password   [x] Google   [ ] GitHub   [ ] Other

Open sign up:          Yes — anyone can create an account

Logged-out experience: Can browse and read everything:
                       - Home page
                       - Research list + research detail pages
                       - Forum list + thread detail pages
                       - Actions list + action detail pages
                       - Policy list + policy detail pages
                       - Open Data page
                       - Partnerships, Forum Guidelines, Contact pages
                       Cannot: comment, join, endorse, submit, bookmark,
                               claim originality, upload, or post anything

Onboarding flow:       After signup → short welcome screen asking for:
                       - Display name
                       - Country (for Global Nodes count)
                       - Short bio (optional)
                       - Profile avatar upload (optional)
                       Then lands on Home page

Account deletion:      Soft delete — user record anonymised, content stays
                       (deleted threads show "Deleted User", not blank)

Email change:          [x] Yes — allowed, requires re-verification

Multiple sessions:     [x] Yes — phone + laptop at same time is fine

Password reset:        [x] Yes — email link via Supabase Auth + Resend
```

---

### 3.3 User Roles

```
Role column on users table:
  role TEXT DEFAULT 'user'
  Values: 'user' | 'contributor' | 'researcher' | 'elite' | 'admin'

Role ladder and what triggers each promotion:
  user          → default on signup
  contributor   → 3 verified originality claims (auto, Edge Function)
  researcher    → 6 verified originality claims (auto, Edge Function)
  elite         → 10 verified originality claims (auto, Edge Function)
  admin         → manually assigned by existing admin only

What each role can do:
  user:          Browse, comment, join actions, endorse policies,
                 submit proposals and actions for approval,
                 start forum discussions, bookmark content,
                 claim originality on their own threads

  contributor:   Everything user can do +
                 Recommend research proposals to admin

  researcher:    Everything contributor can do +
                 Create research projects directly (no approval needed)

  elite:         Everything researcher can do +
                 Proposals and actions auto-approved (no admin review)

  admin:         Everything + approve/reject all content,
                 manage all users, generate reports,
                 configure platform settings, hard-delete any content

Admin UI:        [x] Build admin panel — /admin/* routes (not just dashboard)
                 Admin panel screens listed in 3.9

First admin:     The very first admin cannot be set through the UI.
                 After signing up normally, set role = 'admin' directly
                 in Supabase Studio → users table.
                 All subsequent admin promotions go through /admin/users.
```

---

### 3.4 Data — Every Table in the App

```
USERS & PLATFORM
  users
  bookmarks                   (polymorphic — research | forum_thread | action)
  notifications
  newsletter_subscribers
  contact_submissions
  partnership_inquiries
  partners                    (org logos shown on Partnerships page)
  platform_settings           (trust_score, featured_project_id, etc.)
  events                      (analytics)

RESEARCH
  research_categories
  research_projects
  research_participants
  research_updates            (findings posted over time by author)
  research_attachments        (files uploaded to a project)
  proposals                   (submitted before becoming research_projects)

FORUM
  forum_categories
  forum_threads
  forum_replies               (self-referencing, unlimited nesting)
  forum_likes                 (covers both threads and replies)
  forum_attachments           (images/files in threads and replies)
  originality_claims
  content_flags               (threads and replies)

ACTIONS
  actions
  action_participants
  action_updates              (organiser-only announcements)
  action_impact_reports       (participant posts: what I did + photo)

POLICY
  policy_updates
  policy_endorsements
  policy_reports              (quarterly PDF reports)

OPEN DATA
  datasets
```

Every table has these columns — no exceptions:
```sql
id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
created_at  TIMESTAMPTZ DEFAULT NOW(),
updated_at  TIMESTAMPTZ DEFAULT NOW()
```

---

### 3.5 Table Relationships

```
USERS
- A user has one role (user | contributor | researcher | elite | admin)
- A user has many bookmarks
- A user has many notifications
- A user has many originality_claims
- A user has many content_flags (as reporter)

RESEARCH
- A research_project belongs to one user (created_by)
- A research_project belongs to one research_category
- A research_project has many research_participants (through users)
- A research_participant has a status: active | pending | rejected
- A research_project has many research_updates (posted by author)
- A research_project has many research_attachments
- A proposal belongs to one user (submitted_by)
- A proposal can be recommended by one user (researcher/contributor)
- A proposal can be approved by one user (admin)
- An approved proposal creates one research_project

FORUM
- A forum_thread belongs to one user (author)
- A forum_thread belongs to one forum_category
- A forum_thread has many forum_replies
- A forum_reply belongs to one forum_thread
- A forum_reply can belong to one parent forum_reply (self-reference, nullable)
- A forum_like belongs to one user and either one thread or one reply
- A forum_attachment belongs to either one thread or one reply
- An originality_claim belongs to one thread and one user
- A content_flag belongs to one user and either one thread or one reply

ACTIONS
- An action belongs to one user (created_by/organiser)
- An action has many action_participants (through users)
- An action has many action_updates (organiser only)
- An action has many action_impact_reports (participants only)

POLICY
- A policy_update belongs to one user (created_by, admin)
- A policy_update has many policy_endorsements (one per user)
- A policy_endorsement belongs to one user and one policy_update

BOOKMARKS (polymorphic)
- A bookmark belongs to one user
- A bookmark references one entity: research_project | forum_thread | action

OPEN DATA
- A dataset belongs to one user (created_by, admin/researcher)
```

---

### 3.6 Delete Strategy — Per Table

```
users                    → soft delete (anonymise, content stays)
bookmarks                → hard delete (fine to lose)
notifications            → hard delete after 90 days
newsletter_subscribers   → soft delete (unsubscribed_at)
contact_submissions      → soft delete (resolved_at)
partnership_inquiries    → soft delete (reviewed_at)
partners                 → soft delete
platform_settings        → never deleted
events                   → never deleted (analytics record)

research_categories      → soft delete
research_projects        → soft delete (deleted_at)
research_participants    → hard delete (just a join record)
research_updates         → soft delete
research_attachments     → soft delete
proposals                → soft delete

forum_categories         → soft delete
forum_threads            → soft delete (shows "Deleted" placeholder)
forum_replies            → soft delete (shows "Comment deleted" placeholder)
forum_likes              → hard delete
forum_attachments        → soft delete
originality_claims       → soft delete
content_flags            → soft delete (dismissed_at)

actions                  → soft delete
action_participants      → hard delete
action_updates           → soft delete
action_impact_reports    → soft delete

policy_updates           → soft delete
policy_endorsements      → hard delete (if user withdraws)
policy_reports           → soft delete

datasets                 → soft delete
```

---

### 3.7 Indexes — Large Tables

```
users                → email, role, country, created_at
research_projects    → category_id, status, created_by, created_at
research_participants→ research_project_id, user_id, status
proposals            → status, submitted_by, created_at
forum_threads        → category_id, author_id, created_at, tags (GIN index)
forum_replies        → thread_id, parent_id, author_id, created_at
forum_likes          → thread_id, reply_id, user_id
originality_claims   → user_id, status, thread_id
content_flags        → status, thread_id, reply_id
actions              → status, category, created_at
action_participants  → action_id, user_id
action_impact_reports→ action_id, author_id
policy_updates       → scope, status, created_at
policy_endorsements  → policy_id, user_id
bookmarks            → user_id, entity_type, entity_id
events               → user_id, event_name, created_at
datasets             → category, verification_status, created_at
```

---

### 3.8 Permissions — Who Can Do What?

```
GENERAL
- Logged-out users can read all public content (research, forum, actions,
  policy, open data)
- Logged-out users cannot write, join, comment, endorse, or upload anything
- Logged-in users can only edit and delete their own content
- Admins can read, edit, and delete anything

GATED CTA BEHAVIOUR (decided — v1)
- When a logged-out user clicks any gated CTA (Join, Support Now,
  Submit Proposal, Register an Action), they are redirected to:
    /auth/login?returnUrl=/[original-path]
- After login or signup, the app returns them to the original page
  via the returnUrl param. They must click the CTA a second time.
- The action is NOT auto-fired on return. This is intentional for v1.
  Auto-fire can be implemented in v2.

RESEARCH
- Anyone (logged out) can read research_projects and research_updates
- Logged-in users can download research_attachments
- research_project author can update their own project
- research_participants: user can join if join_mode = 'open' (auto-active)
- research_participants: user can request if join_mode = 'request' (pending)
- research_project author can approve/reject pending participants
- researcher role and above can create research_projects directly
- user and contributor must submit a proposal first
- elite role: proposals auto-approved, skip admin queue

FORUM
- Anyone can read forum_threads and forum_replies
- Logged-in users can create threads and replies
- Author can edit and soft-delete their own thread/reply
- Anyone can delete their own reply
- Admins can hard-delete any thread or reply
- Only the thread author can claim originality on their own thread
- One originality claim per thread per author
- Anyone logged-in can like threads and replies (one like per entity per user)
- Anyone logged-in can flag any thread or reply

ACTIONS
- Anyone can read actions and action_updates
- Logged-in users can submit actions (goes to pending, admin approves)
- elite role: actions auto-approved
- action organiser can post action_updates
- action participants can post action_impact_reports
- action_participants: join is open (no cap)

POLICY
- Anyone can read policy_updates
- Only admin and researcher can create policy_updates (admin publishes)
- One endorsement per user per policy (UNIQUE constraint enforced)
- Admins manage all policy content

OPEN DATA
- Anyone can read and download datasets
- Only admin and researcher can create datasets

ADMIN OVERRIDES
- Admin can approve/reject proposals
- Admin can approve/reject actions
- Admin can approve/reject originality_claims
- Admin can review and dismiss content_flags
- Admin can promote/demote user roles
- Admin can manage platform_settings
- Admin can generate policy_reports manually
```

---

### 3.9 Screens — Every Page in the App

```
LOGGED-OUT SCREENS
  /                           Home
  /research                   Research list
  /research/[id]              Research detail
  /forum                      Forum list
  /forum/[id]                 Forum thread detail
  /actions                    Actions list
  /actions/[id]               Action detail
  /policy                     Policy list
  /policy/[id]                Policy detail
  /open-data                  Open Data
  /partnerships               Partnerships
  /forum-guidelines           Forum Guidelines (static)
  /contact                    Contact Us
  /auth/login                 Login
  /auth/signup                Sign Up

LOGGED-IN SCREENS (all above + )
  /research/propose           Submit Research Proposal
  /forum/new                  Start a Discussion
  /actions/register           Register an Action
  /profile/[id]               User profile (own + others)
  /notifications              Notification centre
  /settings                   Account settings
  /bookmarks                  Saved bookmarks

ADMIN SCREENS (/admin/*)
  /admin                      Dashboard (stats overview)
  /admin/proposals            Proposal review queue
  /admin/actions              Action approval queue
  /admin/claims               Originality claims queue
  /admin/flags                Flagged content queue
  /admin/policy               Policy management
  /admin/users                User management + role changes
  /admin/reports              Generate + manage policy reports
  /admin/datasets             Open data management
  /admin/settings             Platform settings (trust score etc.)
  /admin/partnerships         Partnership inquiry review
  /admin/contact              Contact submission review
```

---

### 3.10 Screen Components — Every Screen Broken Down

```
HOME /
  HeroSection (headline, CTAs: Start Acting → /actions, Explore Data → /open-data)
  GlobalImpactStats (hectares protected, active members, purity rating)
  FeaturedSolutionCard (from platform_settings.featured_project_id)
  CommunityExchangePreview (latest 3 forum_threads)
  HomeFooter

RESEARCH LIST /research
  ResearchPageHeader
  CategoryFilterSidebar (checkboxes, filters research_projects)
  StatusFilterButtons (In Progress | Seeking Partners)
  ResearchCardGrid (paginated, max 20 per page)
  ResearchCard (cover, category badge, author, title, desc, 👥 count, 💬 count, View Data)
  SubmitProposalCTA (sidebar card)
  PaginationControls
  EmptyResearchState
  ErrorState

RESEARCH DETAIL /research/[id]
  ResearchHeroImage
  CategoryBadge + StatusBadge
  ResearchTitle + FullDescription
  AuthorInfo (avatar, name, date)
  ParticipantCount + JoinButton (mode: open → instant | request → pending)
    → logged-out: redirects to /auth/login?returnUrl=/research/[id]
  PendingJoinState (if request sent, awaiting approval)
  ResearchUpdatesFeed (findings over time, author only posts)
  ResearchAttachmentsList (download, logged-in only)
  UploadAttachmentButton (author only)
  ThreadedComments (unlimited nesting)
  CommentComposer (logged-in only)
  EmptyUpdatesState
  EmptyCommentsState
  ErrorState

FORUM LIST /forum
  ForumPageHeader + StartDiscussionButton
    → logged-out: StartDiscussionButton redirects to /auth/login?returnUrl=/forum/new
  SearchBar (UI state only)
  FiltersButton
  CategoryFilterTabs
  ThreadList (paginated, max 20)
  ThreadCard (category, title, author, like count, reply count, timestamp, tags)
  TrendingTopicsSidebar
  PaginationControls
  EmptyForumState
  ErrorState

FORUM THREAD DETAIL /forum/[id]
  ThreadTitle + CategoryBadge
  AuthorInfo (avatar, name, role badge, timestamp)
  ThreadBody (rich text)
  ThreadAttachments (images/files)
  LikeButton (optimistic update)
  ClaimOriginalityButton (if author + not yet claimed)
  FlagButton
  ThreadedCommentTree (unlimited nesting, recursive component)
  CommentNode (author, body, like, reply, flag, edit/delete if own)
  CommentComposer (reply at any level)
  EmptyCommentsState
  ErrorState

ACTIONS LIST /actions
  ActionsPageHeader
  ListMapToggle (UI state)
  CategoryFilterTabs (All | Conservation | Cleanup | Workshop | Advocacy)
  ActionCardGrid (list view, paginated)
  ActionCard (cover, category, impact badge, date, time, location, 👥 joined, Join/View Details)
  ActionMapView (Leaflet, pins per approved action)
  RegisterActionCTA
    → logged-out: redirects to /auth/login?returnUrl=/actions/register
  EmptyActionsState
  ErrorState

ACTION DETAIL /actions/[id]
  ActionHeroImage
  CategoryBadge + ImpactLevelBadge
  ActionTitle + FullDescription
  DateTime + LocationName
  OrganiserInfo
  LeafletMapPin (single location)
  ParticipantCount + JoinButton
    → logged-out: redirects to /auth/login?returnUrl=/actions/[id]
  PublicParticipantList (avatars + names, paginated, max 20)
  OrganisorUpdatesFeed (action_updates, organiser only posts)
  ImpactReportsFeed (action_impact_reports, participants post photo + text)
  ImpactReportComposer (participants only, photo + text)
  EmptyUpdatesState
  EmptyImpactState
  ErrorState

POLICY LIST /policy
  PolicyHeroImage
  SearchBar (UI state)
  RegionFilterTabs (All Regions | Latest Updates)
  PolicyUpdateList (paginated, max 20)
  PolicyUpdateCard (scope badge, title, preview, official source, Support Now, date)
    → Support Now logged-out: redirects to /auth/login?returnUrl=/policy/[id]
  PolicyTransparencyReportSidebar (download Q3 report)
  TrustScoreSidebar (98.4%, from platform_settings)
  EmptyPolicyState
  ErrorState

POLICY DETAIL /policy/[id]
  PolicyHeroImage
  ScopeBadge (National | Regional | Local)
  PolicyTitle + FullBody (rich text)
  PublishedDate
  OfficialSourceLink (external)
  FullTextPDFDownload (Supabase or external)
  LeafletRegionMap (GeoJSON boundary, regional/local only)
  SupportNowButton + EndorsementCount (optimistic update)
    → logged-out: redirects to /auth/login?returnUrl=/policy/[id]
  PublicEndorserList (avatars + names, paginated)
  DiscussInForumLink (searches forum for related threads)
  EmptyEndorserState
  ErrorState

USER PROFILE /profile/[id]
  ProfileCoverImage
  ProfileAvatar + DisplayName + DisplayTitle
  RoleBadge (Contributor | Researcher | Elite Contributor)
  Bio + Location
  ImpactScoreBadge
  VerifiedIdeasSection (approved originality_claims, with support counts)
  MyActionsList (actions joined, next upcoming first)
  BookmarkedResearchList (research_bookmarks)
  RecentForumActivity (threads + replies by this user)
  DownloadImpactReportButton
  EditProfileButton (own profile only)
  EmptyState per section
  ErrorState

NOTIFICATIONS /notifications
  NotificationList (paginated, max 20)
  NotificationItem (type icon, message, link, read/unread state, timestamp)
  MarkAllReadButton
  EmptyNotificationsState
  ErrorState

OPEN DATA /open-data
  OpenDataHeader
  SearchBar (UI state)
  CategorySidebarFilter (Air Quality | Soil Health | Water Quality | Biodiversity)
  DatasetList (paginated, max 20, list/grid toggle)
  DatasetCard (thumbnail, category, title, desc, verification badge, file formats, View Dataset)
  TrustScoreSidebar
  DownloadLatestReportButton (2024 Global Ecological State)
  EmptyDatasetState
  ErrorState

PARTNERSHIPS /partnerships
  PartnershipsHero
  PartnerLogoStrip (logos from partners table, uses logo_url column)
  WhyPartnerGrid (4 benefit cards — static content)
  PartnershipInquiryForm (org name, org type, contact email, collaboration goal)
  EmptyState
  SuccessState (after form submit)

CONTACT /contact
  ContactForm (full name, email, inquiry type, message)
  ContactSidebar (office address, Leaflet map, direct email, social links)
  SuccessState (after submit)
  ErrorState

ADMIN DASHBOARD /admin
  StatsOverviewCards (pending proposals, pending actions, pending claims, open flags)
  RecentActivityFeed
  QuickActionLinks

ADMIN QUEUES (proposals / actions / claims / flags)
  QueueList (paginated)
  QueueItem (content preview, approve/reject buttons, review notes field)
  EmptyQueueState

ADMIN USERS /admin/users
  UserSearchBar
  UserTable (name, email, role, joined date, actions)
  RoleChangeDropdown per user
  UserDetailDrawer

ADMIN SETTINGS /admin/settings
  TrustScoreInput
  FeaturedProjectSelector
  PlatformStatsInputs (hectares protected, purity rating)
  HeroImageUploads (home, policy, open-data, partnerships)
  SaveButton
```

---

### 3.11 Realtime — What Updates Live?

```
REALTIME (Supabase subscriptions)
  research_participants count    → realtime (people join projects live)
  forum_replies count            → realtime (active discussions)
  forum_likes count              → realtime
  action_participants count      → realtime
  action_updates                 → realtime (organiser posts, participants see)
  action_impact_reports          → realtime (participants post, others see)
  policy_endorsements count      → realtime
  notifications                  → realtime (user sees bell update instantly)
  originality_claims status      → realtime (user sees approval live)

NOT REALTIME (normal fetch on load)
  research_projects list         → not realtime (batch updates fine)
  forum_threads list             → not realtime
  actions list                   → not realtime
  policy_updates list            → not realtime
  datasets list                  → not realtime
  user profile data              → not realtime
  platform_settings              → not realtime
```

---

### 3.12 File Uploads

```
[x] File uploads needed

Buckets:

  research-covers
    file types: jpg, png, webp
    max size: 5MB
    public/private: PUBLIC

  research-attachments
    file types: csv, pdf, jpg, png, webp, xlsx, json
    max size: 50MB
    public/private: PRIVATE (logged-in users only)

  forum-attachments
    file types: jpg, png, webp, gif, pdf
    max size: 10MB
    public/private: PRIVATE (logged-in users only)

  action-media
    file types: jpg, png, webp
    max size: 10MB
    public/private: PRIVATE (logged-in users only)

  policy-documents
    file types: pdf
    max size: 50MB
    public/private: PUBLIC (anyone can download)

  open-datasets
    file types: csv, json, xlsx, sql, geojson
    max size: 100MB
    public/private: PUBLIC (open data)

  avatars
    file types: jpg, png, webp
    max size: 2MB
    public/private: PUBLIC

  profile-covers
    file types: jpg, png, webp
    max size: 5MB
    public/private: PUBLIC

  hero-images
    file types: jpg, png, webp
    max size: 10MB
    public/private: PUBLIC
    managed by: admin only via /admin/settings
    images: hero-home, hero-policy, hero-opendata, hero-partnerships
```

---

### 3.13 Notifications

```
[x] In-app notifications: Yes
[x] Email notifications: Yes (Resend) — for critical events only
[ ] Push notifications: No — not in v1

Every trigger that creates a notification:

RESEARCH
  - Your proposal was approved → in-app + email
  - Your proposal was rejected → in-app + email
  - Someone requested to join your project → in-app
  - Your join request was approved → in-app + email
  - Your join request was rejected → in-app
  - A research project you participate in got a new update → in-app

FORUM
  - Someone replied to your thread → in-app
  - Someone replied to your comment → in-app
  - Your originality claim was approved → in-app + email
  - Your originality claim was rejected → in-app
  - Your role was upgraded (contributor/researcher/elite) → in-app + email
  - Your thread or comment was flagged and removed → in-app + email

ACTIONS
  - Your action submission was approved → in-app + email
  - Your action submission was rejected → in-app + email
  - An action you joined has a new organiser update → in-app

POLICY
  - A policy you endorsed has hit its endorsement threshold → in-app + email

PLATFORM
  - Newsletter confirmation → email only
  - Password reset → email only
  - Welcome email on signup → email only
```

---

### 3.14 Third Party Services

```
[x] Email:     Resend — transactional + newsletter emails
[ ] Payments:  None in v1
[ ] SMS:       None
[x] Maps:      Leaflet + OpenStreetMap (no API key required)
[ ] AI:        None in v1 (deferred)
[ ] API portal: Deferred to v2

Schema impact:
  Resend → no schema impact (called from Edge Functions only)
  Leaflet → actions table has lat/lng columns
             policy_updates table has region_geojson, map_center_lat,
             map_center_lng, map_zoom_level columns
```

---

### 3.15 Performance

```
[x] Max 20 items per fetch — enforced on every list
[x] Pagination style: page numbers (research, forum, actions, policy, open data)
[x] Infinite scroll: NOT used (pagination everywhere)
[x] Lazy loading on all images
[x] No SELECT * on large tables — always select specific columns
[x] Trending topics = computed query (no materialised view needed in v1)
[x] Platform stats = mix of platform_settings (manually set) + COUNT queries
[x] Impact score = computed on profile load, cached on user row
```

---

### 3.16 Device & Responsive

```
Both — mobile first, desktop enhanced
Bottom navigation bar on mobile (Home, Research, Forum, Actions, Policy)
Sidebar navigation on desktop
All pages fully responsive
Map view on Actions page works on mobile (Leaflet is mobile friendly)
```

---

### 3.17 Design Tokens

```
Primary colour:      #006C0C  (forest green — from DESIGN.md)
Secondary colour:    #00629E  (ocean blue)
Accent colour:       #9C3E2B  (terracotta)
Background:          #FAF9F6  (warm white/cream)
Surface:             #FFFFFF  (cards, modals)
Text primary:        #1A1C1A  (deep moss)
Text secondary:      #3F4A3B  (on-surface-variant)
Outline:             #6F7A6A
Error:               #BA1A1A
Success:             #006C0C
Warning:             #9C3E2B

Font:                Atkinson Hyperlegible Next (weights: 400, 600, 700)
                     Import from Google Fonts
Border radius:       0.5rem cards/inputs, 0.25rem small, 9999px pill/badges
Shadows:             ambient only — rgba(34,139,34,0.08) hint of green
Hover interactions:  scale(1.02) + inner glow — no heavy shadows
Overall vibe:        Ecological Optimism. Sun-drenched meadow.
                     Open, breathing, inviting. Not alarmist.

Component library:   shadcn/ui + Tailwind CSS
Icons:               Lucide React
```

---

### 3.18 Folder Structure

```
src/
  components/       reusable UI only — no Supabase calls, no business logic
  hooks/            ALL Supabase + TanStack Query logic lives here — one hook per feature
  routes/           TanStack Router file-based routes (replaces pages/)
                    Public SSR routes: /research, /forum, /actions, /policy
                    Auth-protected SPA routes: /profile, /notifications, /admin/*
  lib/              supabase.js, analytics.js, resend.js, helpers.js
  types/            TypeScript types and interfaces (generated from Supabase)
  constants/        copy.js (all strings), config.js (env-safe values)
  styles/           globals.css, tailwind config

Tell AI this structure on day one and every session start.
Never put Supabase logic inside a component. Ever.
Never use useEffect for data fetching — always TanStack Query.
```

---

### 3.19 TypeScript

```
[x] TypeScript — always, everywhere
[ ] Plain JavaScript — never

Generate types from Supabase schema using:
  npx supabase gen types typescript --project-id [id] > src/types/database.ts

Never mix. Tell AI once and repeat in every session prompt.
```

---

### 3.20 Rate Limiting

```
Sign up attempts:        5 per IP per hour
Login attempts:          10 per IP per hour
Forum thread creation:   5 per user per hour
Forum reply creation:    30 per user per hour
Proposal submission:     3 per user per day
Action submission:       3 per user per day
Originality claim:       1 per thread (one-time, not rate limited — unique constraint handles it)
File uploads:            20 per user per hour
Policy endorsements:     enforced by UNIQUE constraint (one per user per policy)
Newsletter signup:       3 attempts per email per day
Contact form:            5 per IP per day
Partnership inquiry:     3 per email per day
Email sending (Resend):  respect Resend free tier limits — queue if needed

All rate limit errors use COPY.errorRateLimit from constants/copy.js
Rate limiting implemented in Edge Functions using Supabase Redis or upstash
```

---

### 3.21 Analytics

```
[x] Analytics needed — Supabase events table (no third party tool in v1)

Key events to track:

  user_signed_up
  user_logged_in
  research_project_viewed        { project_id }
  proposal_submitted             { proposal_id }
  research_joined                { project_id, join_mode }
  forum_thread_created           { thread_id, category }
  forum_thread_viewed            { thread_id }
  forum_reply_created            { thread_id, is_nested: bool }
  forum_liked                    { entity_type, entity_id }
  originality_claim_submitted    { thread_id }
  action_viewed                  { action_id }
  action_joined                  { action_id }
  action_submitted               { action_id }
  impact_report_posted           { action_id }
  policy_viewed                  { policy_id }
  policy_endorsed                { policy_id }
  dataset_viewed                 { dataset_id }
  dataset_downloaded             { dataset_id }
  bookmark_added                 { entity_type, entity_id }
  newsletter_subscribed
  contact_submitted
  partnership_inquiry_submitted
  search_performed               { page, query }
```

---

### 3.22 Copy & Content

All strings live in `src/constants/copy.js`. Never hardcode strings in components.

```javascript
// src/constants/copy.js

export const COPY = {

  // --- ONBOARDING ---
  onboardingWelcomeTitle: "Welcome to Climate Commons.",
  onboardingWelcomeSubtitle: "You're joining a global network of ecologists, advocates, and community builders. Let's set up your profile.",
  onboardingNameLabel: "What should we call you?",
  onboardingCountryLabel: "Where are you based?",
  onboardingBioLabel: "Tell the community a little about yourself (optional)",
  onboardingSkipBio: "Skip for now",
  onboardingComplete: "Let's get started",

  // --- EMPTY STATES ---
  emptyResearch: "No research projects yet. Be the first to submit a proposal.",
  emptyForum: "No discussions yet. Start the first one.",
  emptyActions: "No actions in this area yet. Register the first one.",
  emptyPolicy: "No policy updates yet.",
  emptyDatasets: "No datasets in this category yet.",
  emptyNotifications: "You're all caught up. Nothing new right now.",
  emptyBookmarks: "You haven't saved anything yet. Bookmark research, threads, and actions to find them here.",
  emptyComments: "No comments yet. Start the conversation.",
  emptyParticipants: "No participants yet. Be the first to join.",
  emptyEndorsers: "No endorsements yet. Support this policy.",
  emptyImpactReports: "No impact reports yet. Be the first to share what you did.",
  emptyOrgUpdates: "The organiser hasn't posted any updates yet.",
  emptyVerifiedIdeas: "No verified ideas yet.",
  emptyMyActions: "You haven't joined any actions yet.",

  // --- SUCCESS STATES ---
  successProposalSubmitted: "Your proposal has been submitted. We'll review it and notify you of the outcome.",
  successActionSubmitted: "Your action has been registered for review. You'll hear back within a few days.",
  successJoinedOpen: "You've joined this project.",
  successJoinRequested: "Your request to join has been sent. The project owner will review it.",
  successEndorsed: "Your support has been recorded.",
  successBookmarked: "Saved to your bookmarks.",
  successUnbookmarked: "Removed from bookmarks.",
  successContactSent: "Message sent. We'll get back to you shortly.",
  successPartnershipSent: "Partnership inquiry sent. We review every application personally.",
  successNewsletterSignup: "You're in. We'll be in touch.",
  successImpactReportPosted: "Impact report shared. Thank you for taking action.",
  successProfileUpdated: "Profile updated.",
  successOriginalityClaimed: "Originality claim submitted. Admin will review it shortly.",

  // --- ERROR STATES ---
  errorGeneric: "Something went wrong. Please try again.",
  errorNetwork: "You appear to be offline. Check your connection and try again.",
  errorNotFound: "This page doesn't exist or has been removed.",
  errorUnauthorised: "You need to be logged in to do that.",
  errorForbidden: "You don't have permission to do that.",
  errorRateLimit: "You're doing that too fast. Please wait a moment and try again.",
  errorUploadTooLarge: "This file is too large. Please check the size limit and try again.",
  errorUploadWrongType: "This file type isn't supported here.",
  errorFormRequired: "Please fill in all required fields.",
  errorEmailInvalid: "Please enter a valid email address.",
  errorAlreadyEndorsed: "You've already supported this policy.",
  errorAlreadyClaimed: "You've already claimed originality on this thread.",
  errorSessionExpired: "Your session has expired. Please log in again.",

  // --- RATE LIMIT SPECIFIC ---
  errorRateLimitProposal: "You can submit up to 3 proposals per day. Try again tomorrow.",
  errorRateLimitAction: "You can register up to 3 actions per day. Try again tomorrow.",
  errorRateLimitThread: "You're posting too quickly. Please wait before starting another discussion.",
  errorRateLimitUpload: "You've uploaded too many files recently. Please try again in an hour.",

  // --- ROLE UPGRADES ---
  notificationContributor: "You've reached Contributor status. You can now recommend research proposals.",
  notificationResearcher: "You've reached Researcher status. You can now create research projects directly.",
  notificationElite: "You've reached Elite Contributor status. Your submissions are now auto-approved.",

  // --- MODERATION ---
  deletedThread: "[This discussion has been removed]",
  deletedComment: "[Comment deleted]",
  deletedUser: "Deleted User",
  flagSubmitted: "Thank you. This has been flagged for review.",
}
```

---

## FULL SCHEMA REFERENCE

```sql
-- =============================================
-- USERS
-- =============================================
CREATE TABLE users (
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

-- =============================================
-- BOOKMARKS (polymorphic)
-- =============================================
CREATE TABLE bookmarks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  entity_type TEXT CHECK (entity_type IN ('research','forum_thread','action')),
  entity_id   UUID NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entity_type, entity_id)
);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE notifications (
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
-- NEWSLETTER SUBSCRIBERS
-- =============================================
CREATE TABLE newsletter_subscribers (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email           TEXT UNIQUE NOT NULL,
  subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CONTACT SUBMISSIONS
-- =============================================
CREATE TABLE contact_submissions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  inquiry_type TEXT NOT NULL,
  message      TEXT NOT NULL,
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PARTNERSHIP INQUIRIES
-- =============================================
CREATE TABLE partnership_inquiries (
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
-- PARTNERS (logo strip on /partnerships)
-- =============================================
CREATE TABLE partners (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  logo_url    TEXT,
  website_url TEXT,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PLATFORM SETTINGS (single row, never deleted)
-- =============================================
CREATE TABLE platform_settings (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trust_score          DECIMAL DEFAULT 98.4,
  hectares_protected   TEXT DEFAULT '0',
  purity_rating        TEXT DEFAULT '0%',
  featured_project_id  UUID REFERENCES research_projects(id) ON DELETE SET NULL,
  hero_home_url        TEXT,
  hero_policy_url      TEXT,
  hero_opendata_url    TEXT,
  hero_partnerships_url TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EVENTS (analytics)
-- =============================================
CREATE TABLE events (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RESEARCH CATEGORIES
-- =============================================
CREATE TABLE research_categories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  color      TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RESEARCH PROJECTS
-- =============================================
CREATE TABLE research_projects (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  category_id  UUID REFERENCES research_categories(id),
  status       TEXT DEFAULT 'seeking_partners'
               CHECK (status IN ('in_progress','seeking_partners','completed')),
  join_mode    TEXT DEFAULT 'open'
               CHECK (join_mode IN ('open','request')),
  cover_image_url TEXT,
  created_by   UUID REFERENCES users(id),
  deleted_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RESEARCH PARTICIPANTS
-- =============================================
CREATE TABLE research_participants (
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

-- =============================================
-- RESEARCH UPDATES
-- =============================================
CREATE TABLE research_updates (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  research_project_id UUID REFERENCES research_projects(id) ON DELETE CASCADE,
  author_id           UUID REFERENCES users(id),
  title               TEXT NOT NULL,
  body                TEXT NOT NULL,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RESEARCH ATTACHMENTS
-- =============================================
CREATE TABLE research_attachments (
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

-- =============================================
-- PROPOSALS
-- =============================================
CREATE TABLE proposals (
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

-- =============================================
-- FORUM CATEGORIES
-- =============================================
CREATE TABLE forum_categories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  color      TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FORUM THREADS
-- =============================================
CREATE TABLE forum_threads (
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

-- =============================================
-- FORUM REPLIES (self-referencing)
-- =============================================
CREATE TABLE forum_replies (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id  UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
  author_id  UUID REFERENCES users(id),
  parent_id  UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FORUM LIKES (threads and replies)
-- =============================================
CREATE TABLE forum_likes (
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

-- =============================================
-- FORUM ATTACHMENTS
-- =============================================
CREATE TABLE forum_attachments (
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

-- =============================================
-- ORIGINALITY CLAIMS
-- =============================================
CREATE TABLE originality_claims (
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

-- =============================================
-- CONTENT FLAGS
-- =============================================
CREATE TABLE content_flags (
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

-- =============================================
-- ACTIONS
-- =============================================
CREATE TABLE actions (
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

-- =============================================
-- ACTION PARTICIPANTS
-- =============================================
CREATE TABLE action_participants (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_id   UUID REFERENCES actions(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(action_id, user_id)
);

-- =============================================
-- ACTION UPDATES
-- =============================================
CREATE TABLE action_updates (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_id  UUID REFERENCES actions(id) ON DELETE CASCADE,
  author_id  UUID REFERENCES users(id),
  body       TEXT NOT NULL,
  image_url  TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ACTION IMPACT REPORTS
-- =============================================
CREATE TABLE action_impact_reports (
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

-- =============================================
-- POLICY UPDATES
-- =============================================
CREATE TABLE policy_updates (
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

-- =============================================
-- POLICY ENDORSEMENTS
-- =============================================
CREATE TABLE policy_endorsements (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id UUID REFERENCES policy_updates(id) ON DELETE CASCADE,
  user_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(policy_id, user_id)
);

-- =============================================
-- POLICY REPORTS
-- =============================================
CREATE TABLE policy_reports (
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
-- OPEN DATA DATASETS
-- =============================================
CREATE TABLE datasets (
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
```

---

## SESSION STARTER PROMPT
Paste this at the start of every coding session:

```
Read BLUEPRINT.md and PROGRESS.md before we do anything.

Stack: TanStack Start + Supabase + TypeScript + Tailwind CSS + shadcn/ui
       TanStack Router for routing, TanStack Query for all server state.
       DO NOT suggest Next.js. DO NOT suggest useEffect for data fetching.

Rules for this session:
- No mock data ever. Supabase for all persistence.
- Never use useState for data that needs to survive a refresh.
- All Supabase logic lives in hooks in src/hooks/, never in components.
- Use TanStack Query for all data fetching — never raw useEffect + fetch.
- Always handle loading (skeleton), empty (from COPY constants), and error states.
- Use optimistic updates for all toggle actions (likes, joins, endorsements, bookmarks).
- Never fetch more than 20 items at once. Always paginate.
- All strings come from src/constants/copy.js only. Never hardcode strings in components.
- Folder structure: components / hooks / routes / lib / types / constants. Never deviate.
- TypeScript only. Never mix with plain JS.
- All sensitive operations (email sending, role changes, approvals) in Edge Functions only.
- Service role key never in any frontend file.
- SSR only on public-facing routes that need SEO. Auth-protected routes are SPA.
- Gated CTAs redirect to /auth/login?returnUrl=/[original-path]. Never auto-fire
  the action on return — user clicks again. This is decided. Do not change it.
- Font: Atkinson Hyperlegible Next from Google Fonts. No other typeface.
- Design reference: DESIGN.md. Primary #006C0C, secondary #00629E, bg #FAF9F6.
```

---

*Every blank is filled. Every decision is made. Follow the build order. Update PROGRESS.md every session.*
