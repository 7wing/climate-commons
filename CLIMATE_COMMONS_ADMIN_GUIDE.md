# Climate Commons — Admin & Launch Readiness Guide

> Everything you need to do before a single test user logs in.
> Read top to bottom. Do things in order — later steps depend on earlier ones.

---

## 1. The one decision to make before you build

When a logged-out user clicks a gated CTA (Join, Support Now, Submit Proposal, Register an Action) they get redirected to `/auth/login`. After they log in, **you need to decide what happens next** — pick one and write it into the blueprint:

| Option | What it means | Build cost |
|---|---|---|
| **A — Land and click again** | After login, they return to the page they came from. They have to click the CTA a second time. | Low |
| **B — Auto-fire the action** | After login, the app detects a pending intent (stored in the `returnUrl` param) and automatically completes the action. | High |

**Recommendation: Option A for v1.** Store `?returnUrl=/actions/[id]` in the login redirect so they land back in the right place, but make them click again. You can upgrade to auto-fire in v2. Write your decision into the blueprint now so your builder doesn't guess.

---

## 2. Become the first admin

There is no UI for the very first admin — you have to set it directly in the database.

1. Sign up normally at `/auth/signup` using your real email.
2. Complete the onboarding screen (display name, country, bio).
3. Open Supabase Studio → Table Editor → `users` table.
4. Find your row. Set `role = 'admin'`.
5. You can now access `/admin` and all `/admin/*` routes.

All future admin promotions are done through the UI at `/admin/users`.

---

## 3. Run the seed script

Run `CLIMATE_COMMONS_SEED.sql` in your **Supabase SQL editor on the dev project only — never on prod**.

The seed script inserts everything in this order. You do not need to run it in pieces — it is one script:

| Step | What it creates |
|---|---|
| 1 | 10 test users across all role levels |
| 2 | 5 research categories |
| 3 | 4 research projects |
| 4 | Research participants (open joins + pending requests) |
| 5 | Research updates / findings |
| 6 | 3 proposals in the admin queue |
| 7 | 5 forum categories |
| 8 | 8 forum threads |
| 9 | Nested forum replies |
| 10–11 | Forum likes + originality claims (verified, pending, rejected) |
| 12 | Content flags in admin queue |
| 13 | 4 approved actions + 1 pending action |
| 14 | Action participants |
| 15 | Action organiser updates |
| 16 | Action impact reports |
| 17 | 3 published policy updates |
| 18 | Policy endorsements |
| 19 | 3 open datasets |
| 20 | Bookmarks |
| 21 | Notifications |
| 22 | Newsletter subscribers |
| 23 | Platform settings (trust score, featured project, stats) |
| 24 | 5 partner organisations |

> **Important:** Seed users do NOT have Supabase Auth accounts. They are data rows only — you cannot log in as them. To test actual login flows, create real accounts manually (see Section 5).

---

## 4. Upload hero images

Hero images live in the `hero-images` Supabase storage bucket. Only admins can upload to it. All images are public.

**Specs for every image:** JPG, PNG, or WebP. Max 10MB. Minimum 1920 × 1080px. Landscape orientation.

After uploading each image, copy the public URL and paste it into the corresponding field in `/admin/settings`.

| Image | Used on | Visual direction |
|---|---|---|
| `hero-home` | `/` — full-bleed HeroSection background | Nature or community in action. Wide open landscape, hopeful. |
| `hero-policy` | `/policy` list + `/policy/[id]` detail | Parliament, legislation, community meeting, civic energy. |
| `hero-opendata` | `/open-data` | Data visualisation, field monitoring station, research lab. |
| `hero-partnerships` | `/partnerships` | Collaboration, two organisations working together, handshake. |

Free sources that fit the design language: [Unsplash](https://unsplash.com) (search "reforestation", "community garden", "renewable energy"), [Pexels](https://pexels.com). Download the largest available size.

---

## 5. Configure platform settings

Go to `/admin/settings` and fill in every field. The seed script pre-fills these values — confirm or update them:

| Setting | Seed value | What it powers |
|---|---|---|
| Trust score | `98.4` | TrustScoreSidebar on `/policy` and `/open-data` |
| Featured project ID | `20000000-0000-0000-0000-000000000001` (Carbon Sequestration in Kelp) | FeaturedSolutionCard on the home page |
| Hectares protected | `1.2M` | GlobalImpactStats on the home page |
| Purity rating | `98%` | GlobalImpactStats on the home page |

> **Note:** The seed script also confirms the `platform_settings` table has these columns: `trust_score`, `featured_project_id`, `hectares_protected`, `purity_rating`. If your migration created additional hero image URL columns, add those values here too.

---

## 6. Add partner logos

The Partnerships page (`/partnerships`) shows a logo strip from the `partners` table. The seed script inserts 5 partner names but no logos — you need to upload the actual image files.

1. For each partner, find or create a logo (PNG with transparent background, recommended size 300 × 100px).
2. Upload each logo to the `avatars` bucket (or create a dedicated `partner-logos` bucket if you prefer).
3. Go to `/admin/partnerships` and set the `logo_url` for each partner row.

The 5 seeded partners are: ECO-NET, Terra Fountain, Green Gov, Solaris Bridges, Roots NGO. For testing purposes, placeholder logos are fine.

---

## 7. Upload a quarterly policy report PDF

The `/policy` page has a PolicyTransparencyReportSidebar with a download link. Without a PDF attached, that link is dead.

1. Create or obtain a PDF (even a placeholder document works for testing).
2. Upload it to the `policy-documents` bucket in Supabase Storage.
3. Copy the public URL.
4. Go to `/admin/reports` and create a new policy report row with:
   - Title: e.g. `Q3 2024 Ecological Policy Report`
   - Period: e.g. `Q3 2024`
   - PDF URL: the URL you just copied

---

## 8. Create real test accounts for login testing

Seed users cannot log in — they have no Supabase Auth record. Create these real accounts to test the full auth flow:

| Email | Role to set after signup | What to test with it |
|---|---|---|
| `user@test.com` | `user` (default, no change needed) | Basic browsing, joining actions, posting forum threads |
| `contributor@test.com` | `contributor` | Recommending proposals to admin |
| `researcher@test.com` | `researcher` | Creating research projects directly, uploading datasets |
| `elite@test.com` | `elite` | Auto-approved proposals and actions |

To set a role after signup:
1. Sign up at `/auth/signup` using the test email.
2. Open Supabase Studio → `users` table → find the row → set `role` to the correct value.

Test the onboarding flow (display name, country, bio, avatar) with at least one fresh account before showing anyone else.

---

## 9. Pre-approve admin queue items

After running the seed and logging in as admin, your queues will have items waiting. Work through them so the app looks live:

**Go to `/admin/proposals`** — 3 proposals are seeded:
- Arctic Permafrost Methane Monitoring — approve or reject it
- Urban Heat Island Mapping (already recommended by Carlos) — approve it to create a research project
- Mangrove Restoration Drone Survey — approve or reject it

**Go to `/admin/actions`** — 1 pending action is seeded:
- Rooftop Garden Installation Day — approve it so it appears on the map and action list

**Go to `/admin/claims`** — 2 pending originality claims:
- Hydroponic Retrofitting for Abandoned Retail Spaces (Sarah Chen) — approve or reject
- Native Seed Banks (Priya Nair) — approve or reject

**Go to `/admin/flags`** — 2 pending content flags:
- Thread flagged for promoting a commercial product — review and dismiss or act
- Thread flagged for unverified data source — review and dismiss or act

---

## 10. Verify the home page

Once settings and seed data are in place, the home page should show:

- **HeroSection** — your uploaded hero image, with the two primary CTAs: "Start Acting" (→ `/actions`) and "Explore Data" (→ `/open-data`)
- **GlobalImpactStats** — 1.2M hectares protected, active member count (live query), 98% purity rating
- **FeaturedSolutionCard** — Carbon Sequestration in Kelp (the seeded featured project)
- **CommunityExchangePreview** — the 3 most recent forum threads from the seed

If any of these are missing or broken, the most likely cause is a missing platform_settings row or a missing hero image URL.

---

## 11. Test the CTA flows end to end

Do this as a logged-out user (use a private/incognito window):

| CTA | Expected behaviour |
|---|---|
| Start Acting | Lands on `/actions`. Sees the 4 approved action cards and the Leaflet map. No login required. |
| Explore Data | Lands on `/open-data`. Sees the 3 seeded datasets. No login required. |
| Join (on an action) | Redirected to `/auth/login?returnUrl=/actions/[id]`. After login, lands back on the action page. |
| Support Now (on a policy) | Redirected to `/auth/login?returnUrl=/policy/[id]`. After login, the endorsement button is active. |
| Submit Proposal | Redirected to `/auth/login?returnUrl=/research/propose`. After login, lands on the proposal form. |
| View Dataset (Open Data) | Public — no login required. Download requires login if the bucket is private. |

---

## 12. Storage bucket summary

These buckets must exist in Supabase Storage before any uploads will work:

| Bucket | Public | Max file size | Accepted types |
|---|---|---|---|
| `hero-images` | Yes | 10MB | jpg, png, webp |
| `research-covers` | Yes | 5MB | jpg, png, webp |
| `research-attachments` | No (logged-in only) | 50MB | csv, pdf, jpg, png, webp, xlsx, json |
| `forum-attachments` | No (logged-in only) | 10MB | jpg, png, webp, gif, pdf |
| `action-media` | No (logged-in only) | 10MB | jpg, png, webp |
| `policy-documents` | Yes | 50MB | pdf |
| `open-datasets` | Yes | 100MB | csv, json, xlsx, sql, geojson |
| `avatars` | Yes | 2MB | jpg, png, webp |
| `profile-covers` | Yes | 5MB | jpg, png, webp |

Create any missing buckets in Supabase Storage → Buckets → New bucket. Set public/private accordingly.

---

## 13. Test accounts at a glance

These are the seeded users (data only, no login) and the real accounts you create in Section 8:

| Email | Role | Key behaviour to test |
|---|---|---|
| `ada@climatecommons.dev` | admin | Seed only — mirrors your admin account |
| `elena@climatecommons.dev` | elite | Auto-approved proposals, auto-approved actions |
| `ravi@climatecommons.dev` | researcher | Creates research directly, manages datasets |
| `carlos@climatecommons.dev` | contributor | Recommends proposals, cannot create research directly |
| `uma@climatecommons.dev` | user | Active — has bookmarks, joined research and actions |
| `marcus@climatecommons.dev` | user | Forum-focused — has threads, pending originality claim |
| `sarah@climatecommons.dev` | user | Research-focused — pending originality claim |
| `david@climatecommons.dev` | user | Policy and bookmarks focus |
| `priya@climatecommons.dev` | user | Actions and water justice focus |
| `james@climatecommons.dev` | user | Brand new, zero activity — tests empty states |

---

## Quick reference: where things live in the admin panel

| Task | Route |
|---|---|
| Platform stats, featured project, trust score | `/admin/settings` |
| Approve / reject research proposals | `/admin/proposals` |
| Approve / reject community actions | `/admin/actions` |
| Review originality claims | `/admin/claims` |
| Review flagged content | `/admin/flags` |
| Publish / manage policy updates | `/admin/policy` |
| Manage users and roles | `/admin/users` |
| Generate policy reports | `/admin/reports` |
| Manage open datasets | `/admin/datasets` |
| Review partnership inquiries | `/admin/partnerships` |
| Review contact form submissions | `/admin/contact` |
