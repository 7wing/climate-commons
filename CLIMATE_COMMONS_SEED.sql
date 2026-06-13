-- =============================================
-- CLIMATE COMMONS — DEV SEED SCRIPT
-- Run this in your Supabase SQL editor on the DEV project only.
-- NEVER run on prod.
-- Creates 10 test users + realistic data across all features.
-- =============================================

-- =============================================
-- STEP 1: USERS
-- Note: These bypass Supabase Auth (no real login).
-- To test auth flows, create real accounts manually.
-- These seed users are for data/UI testing only.
-- =============================================

INSERT INTO users (id, email, display_name, display_title, bio, country, location, role, impact_score, avatar_url) VALUES

-- Admin
('00000000-0000-0000-0000-000000000001',
 'ada@climatecommons.dev',
 'Ada Okafor',
 'Platform Administrator',
 'Keeping the commons clean and thriving. Based in Lagos.',
 'Nigeria', 'Lagos',
 'admin', 99.1,
 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdaOkafor'),

-- Elite Contributor (10 verified claims)
('00000000-0000-0000-0000-000000000002',
 'elena@climatecommons.dev',
 'Dr. Elena Rodriguez',
 'Elite Contributor',
 'Ecological economist and community advocate based in Madrid. Dedicated to urban reforestation and decentralised energy networks.',
 'Spain', 'Madrid',
 'elite', 98.4,
 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRodriguez'),

-- Researcher (6 verified claims)
('00000000-0000-0000-0000-000000000003',
 'ravi@climatecommons.dev',
 'Dr. Ravi Shankar',
 'Researcher',
 'Marine biologist focused on seagrass meadow restoration in the Indo-Pacific.',
 'India', 'Chennai',
 'researcher', 87.2,
 'https://api.dicebear.com/7.x/avataaars/svg?seed=RaviShankar'),

-- Contributor (3 verified claims)
('00000000-0000-0000-0000-000000000004',
 'carlos@climatecommons.dev',
 'Carlos Mendes',
 'Contributor',
 'Community energy cooperative organiser. Working on peer-to-peer solar grids in São Paulo.',
 'Brazil', 'São Paulo',
 'contributor', 74.5,
 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosMendes'),

-- Regular users
('00000000-0000-0000-0000-000000000005',
 'uma@climatecommons.dev',
 'Uma Patel',
 NULL,
 'Urban farmer and soil health advocate. Turning vacant lots into food forests.',
 'India', 'Mumbai',
 'user', 45.0,
 'https://api.dicebear.com/7.x/avataaars/svg?seed=UmaPatel'),

('00000000-0000-0000-0000-000000000006',
 'marcus@climatecommons.dev',
 'Marcus Thorne',
 NULL,
 'Energy systems researcher. Interested in microgrid governance for small collectives.',
 'United Kingdom', 'Bristol',
 'user', 38.7,
 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusThorne'),

('00000000-0000-0000-0000-000000000007',
 'sarah@climatecommons.dev',
 'Sarah Chen',
 NULL,
 'Regenerative agriculture consultant. Investigating fungal networks in depleted soils.',
 'Canada', 'Vancouver',
 'user', 52.3,
 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen'),

('00000000-0000-0000-0000-000000000008',
 'david@climatecommons.dev',
 'David Kim',
 NULL,
 'Pollinator corridor mapper. Native bee migration and suburban garden networks.',
 'South Korea', 'Seoul',
 'user', 29.1,
 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidKim'),

('00000000-0000-0000-0000-000000000009',
 'priya@climatecommons.dev',
 'Priya Nair',
 NULL,
 'Climate justice advocate and community organiser. Focused on water access in rural areas.',
 'Kenya', 'Nairobi',
 'user', 61.8,
 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaNair'),

-- Brand new user, no activity
('00000000-0000-0000-0000-000000000010',
 'james@climatecommons.dev',
 'James Osei',
 NULL,
 NULL,
 'Ghana', 'Accra',
 'user', 0,
 'https://api.dicebear.com/7.x/avataaars/svg?seed=JamesOsei');

-- =============================================
-- STEP 2: RESEARCH CATEGORIES
-- =============================================

INSERT INTO research_categories (id, name, slug, color) VALUES
('10000000-0000-0000-0000-000000000001', 'Marine Ecosystems',    'marine',      '#0EA5E9'),
('10000000-0000-0000-0000-000000000002', 'Urban Micro-forests',  'urban',       '#22C55E'),
('10000000-0000-0000-0000-000000000003', 'Regenerative Soil',    'soil',        '#A16207'),
('10000000-0000-0000-0000-000000000004', 'Arctic Resilience',    'arctic',      '#818CF8'),
('10000000-0000-0000-0000-000000000005', 'Fauna & Pollinators',  'fauna',       '#F59E0B');

-- =============================================
-- STEP 3: RESEARCH PROJECTS
-- =============================================

INSERT INTO research_projects (id, title, description, category_id, status, join_mode, created_by, created_at) VALUES

('20000000-0000-0000-0000-000000000001',
 'Carbon Sequestration in Kelp',
 'Analyzing the efficiency of Macrocystis pyrifera in long-term carbon storage along coastal shelf regions. We are tracking biomass accumulation rates across 12 monitoring stations.',
 '10000000-0000-0000-0000-000000000001',
 'in_progress', 'open',
 '00000000-0000-0000-0000-000000000003',
 NOW() - INTERVAL '14 days'),

('20000000-0000-0000-0000-000000000002',
 'Urban Micro-forests',
 'Measuring the cooling effect and biodiversity increase of Miyawaki-style forests in dense metropolitan areas. Partnering with 6 city councils across Europe.',
 '10000000-0000-0000-0000-000000000002',
 'seeking_partners', 'request',
 '00000000-0000-0000-0000-000000000002',
 NOW() - INTERVAL '10 days'),

('20000000-0000-0000-0000-000000000003',
 'Regenerative Mycelium Networks',
 'Investigating fungal networks and their role in nutrient cycling within depleted agricultural landscapes. 500 farm sites across the Midwest participating.',
 '10000000-0000-0000-0000-000000000003',
 'in_progress', 'open',
 '00000000-0000-0000-0000-000000000007',
 NOW() - INTERVAL '21 days'),

('20000000-0000-0000-0000-000000000004',
 'Pollinator Corridors',
 'Mapping migration routes for native bees through suburban garden networks to optimise floral diversity and seasonal coverage.',
 '10000000-0000-0000-0000-000000000005',
 'seeking_partners', 'open',
 '00000000-0000-0000-0000-000000000008',
 NOW() - INTERVAL '7 days');

-- =============================================
-- STEP 4: RESEARCH PARTICIPANTS
-- =============================================

INSERT INTO research_participants (research_project_id, user_id, status) VALUES
-- Carbon Sequestration (open join)
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'active'),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'active'),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'active'),

-- Urban Micro-forests (request join — mix of statuses)
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'active'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000009', 'pending'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'pending'),

-- Regenerative Mycelium
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'active'),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'active'),

-- Pollinator Corridors
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', 'active'),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000009', 'active');

-- =============================================
-- STEP 5: RESEARCH UPDATES (findings)
-- =============================================

INSERT INTO research_updates (research_project_id, author_id, title, body, created_at) VALUES
('20000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000003',
 'Month 1 Baseline Measurements Complete',
 'We have completed baseline biomass measurements across all 12 stations. Average kelp density is 4.2kg/m² which is within expected range. Carbon capture rates will be measured monthly from here.',
 NOW() - INTERVAL '10 days'),

('20000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000003',
 'Unexpected Storm Impact — Data Adjustment',
 'A coastal storm event affected stations 7 and 9 last week. We are adjusting our models to account for disturbance events. This actually gives us valuable resilience data.',
 NOW() - INTERVAL '3 days'),

('20000000-0000-0000-0000-000000000003',
 '00000000-0000-0000-0000-000000000007',
 'First Soil Samples Processed',
 'Lab results from the first 50 farm sites are back. Mycorrhizal network density correlates strongly with topsoil carbon content (r=0.74). Exciting early signal.',
 NOW() - INTERVAL '5 days');

-- =============================================
-- STEP 6: PROPOSALS (in the admin queue)
-- =============================================

INSERT INTO proposals (id, title, description, category_id, status, submitted_by, submitted_at, created_at) VALUES

('30000000-0000-0000-0000-000000000001',
 'Arctic Permafrost Methane Monitoring',
 'Proposing a community-led network of low-cost methane sensors across permafrost zones in northern Canada and Siberia. Data would feed directly into climate models.',
 '10000000-0000-0000-0000-000000000004',
 'submitted',
 '00000000-0000-0000-0000-000000000006',
 NOW() - INTERVAL '2 days',
 NOW() - INTERVAL '2 days'),

('30000000-0000-0000-0000-000000000002',
 'Urban Heat Island Mapping via Citizen Science',
 'A mobile app-based project where citizens record surface temperatures across their neighbourhoods to build high-resolution urban heat maps.',
 '10000000-0000-0000-0000-000000000002',
 'recommended',
 '00000000-0000-0000-0000-000000000005',
 NOW() - INTERVAL '5 days',
 NOW() - INTERVAL '5 days'),

('30000000-0000-0000-0000-000000000003',
 'Mangrove Restoration Drone Survey',
 'Using drone photogrammetry to monitor mangrove replanting success rates across 15 coastal sites in Southeast Asia.',
 '10000000-0000-0000-0000-000000000001',
 'submitted',
 '00000000-0000-0000-0000-000000000009',
 NOW() - INTERVAL '1 day',
 NOW() - INTERVAL '1 day');

-- Recommended by contributor
UPDATE proposals
SET recommended_by = '00000000-0000-0000-0000-000000000004',
    recommended_at = NOW() - INTERVAL '3 days'
WHERE id = '30000000-0000-0000-0000-000000000002';

-- =============================================
-- STEP 7: FORUM CATEGORIES
-- =============================================

INSERT INTO forum_categories (id, name, slug, color) VALUES
('40000000-0000-0000-0000-000000000001', 'Regional Planning',  'regional-planning',  '#8B5CF6'),
('40000000-0000-0000-0000-000000000002', 'Energy Systems',     'energy-systems',     '#F59E0B'),
('40000000-0000-0000-0000-000000000003', 'Agriculture',        'agriculture',        '#22C55E'),
('40000000-0000-0000-0000-000000000004', 'Water Justice',      'water-justice',      '#0EA5E9'),
('40000000-0000-0000-0000-000000000005', 'Biodiversity',       'biodiversity',       '#EC4899');

-- =============================================
-- STEP 8: FORUM THREADS
-- =============================================

INSERT INTO forum_threads (id, title, body, author_id, category_id, tags, created_at) VALUES

('50000000-0000-0000-0000-000000000001',
 'Implementing Vertical Bio-Filters in High-Density Districts',
 'Our recent pilot in Milan shows a 14% reduction in local PM2.5 levels using modular moss-based filtration units. Looking to collaborate with microgrid specialists to automate irrigation cycles. Has anyone integrated these with greywater systems?',
 '00000000-0000-0000-0000-000000000002',
 '40000000-0000-0000-0000-000000000001',
 ARRAY['#CarbonAccounting', '#UrbanAir', '#BioFilters'],
 NOW() - INTERVAL '2 hours'),

('50000000-0000-0000-0000-000000000002',
 'Community Microgrids: Scaling Governance for Small Collectives',
 'The bottleneck is not the battery tech, it is the legal framework for peer-to-peer trading. I have drafted a modular bylaws template for housing cooperatives. Would love feedback from anyone who has navigated energy regulations in their country.',
 '00000000-0000-0000-0000-000000000006',
 '40000000-0000-0000-0000-000000000002',
 ARRAY['#EnergyJustice', '#Microgrids', '#CarbonAccounting'],
 NOW() - INTERVAL '5 hours'),

('50000000-0000-0000-0000-000000000003',
 'Hydroponic Retrofitting for Abandoned Retail Spaces',
 'How can we repurpose suburban mall voids for climate-stable food production? Looking for data on HVAC energy trade-offs in these large volumes. The thermal mass is actually a hidden asset.',
 '00000000-0000-0000-0000-000000000007',
 '40000000-0000-0000-0000-000000000003',
 ARRAY['#RegenerativeFarming', '#UrbanFood'],
 NOW() - INTERVAL '1 day'),

('50000000-0000-0000-0000-000000000004',
 'Greywater Recycling Systems for New Developments',
 'We should consider the salinity levels of greywater before implementing in coastal districts. Anyone have field data from Mediterranean climates?',
 '00000000-0000-0000-0000-000000000002',
 '40000000-0000-0000-0000-000000000004',
 ARRAY['#WaterJustice', '#GreyWater'],
 NOW() - INTERVAL '2 hours'),

('50000000-0000-0000-0000-000000000005',
 'Co-op Energy Storage: Success in Madrid District 4',
 'A case study on how we achieved 100% energy autonomy last month using a community battery cooperative model. Full breakdown inside.',
 '00000000-0000-0000-0000-000000000002',
 '40000000-0000-0000-0000-000000000002',
 ARRAY['#EnergyStorage', '#CarbonAccounting', '#Microgrids'],
 NOW() - INTERVAL '1 day'),

('50000000-0000-0000-0000-000000000006',
 'Native Seed Banks: Community-Led Conservation',
 'Starting a thread to coordinate native seed bank efforts across the southern hemisphere. Looking for partners in Brazil, Kenya, and Australia.',
 '00000000-0000-0000-0000-000000000009',
 '40000000-0000-0000-0000-000000000005',
 ARRAY['#MyceliumMaterials', '#Biodiversity'],
 NOW() - INTERVAL '3 days'),

('50000000-0000-0000-0000-000000000007',
 'New Policy Draft for Mangrove Protection: Call for Peer Reviewers',
 'I have drafted a regional policy framework for mangrove buffer zone protections. Need researchers and advocates to review before we submit to the policy hub.',
 '00000000-0000-0000-0000-000000000003',
 '40000000-0000-0000-0000-000000000001',
 ARRAY['#PolicyDraft', '#Mangroves', '#WaterJustice'],
 NOW() - INTERVAL '5 hours'),

('50000000-0000-0000-0000-000000000008',
 'Optimising Soil pH for Native Wildflower Restoration in Urban Corridors',
 'Field notes from our London pilot. Turns out legacy industrial soil contamination is the biggest barrier, not moisture or light. Sharing our remediation protocol.',
 '00000000-0000-0000-0000-000000000004',
 '40000000-0000-0000-0000-000000000003',
 ARRAY['#SoilHealth', '#MyceliumMaterials', '#UrbanBio'],
 NOW() - INTERVAL '2 hours');

-- =============================================
-- STEP 9: FORUM REPLIES (including nested)
-- =============================================

INSERT INTO forum_replies (id, thread_id, author_id, parent_id, body, created_at) VALUES

-- Replies to thread 1 (Bio-filters)
('60000000-0000-0000-0000-000000000001',
 '50000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000004', NULL,
 'Fascinating results. Did you control for seasonal variation in PM2.5 from traffic? We saw a similar effect in São Paulo but it dropped off significantly in winter.',
 NOW() - INTERVAL '1 hour 45 minutes'),

('60000000-0000-0000-0000-000000000002',
 '50000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000002',
 '60000000-0000-0000-0000-000000000001',
 'Yes — we ran 12 months of baseline before installing. Winter dip is about 4% but the annual average still holds at 14%. Happy to share the raw dataset.',
 NOW() - INTERVAL '1 hour 20 minutes'),

('60000000-0000-0000-0000-000000000003',
 '50000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000006', NULL,
 'The irrigation automation angle is key. We tried manual cycles and the maintenance burden killed the project. What sensors are you using?',
 NOW() - INTERVAL '45 minutes'),

('60000000-0000-0000-0000-000000000004',
 '50000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000002',
 '60000000-0000-0000-0000-000000000003',
 'Cheap capacitive soil sensors from AliExpress wired to an ESP32. Total cost per unit is under $8. Not elegant but it works.',
 NOW() - INTERVAL '30 minutes'),

('60000000-0000-0000-0000-000000000005',
 '50000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000009',
 '60000000-0000-0000-0000-000000000004',
 'This is the kind of low-cost hardware approach we need. Could this work in high-humidity tropical climates? Asking for a Nairobi project.',
 NOW() - INTERVAL '15 minutes'),

-- Replies to thread 2 (Microgrids)
('60000000-0000-0000-0000-000000000006',
 '50000000-0000-0000-0000-000000000002',
 '00000000-0000-0000-0000-000000000005', NULL,
 'The legal piece is exactly the bottleneck we hit in Mumbai. Which jurisdiction did you draft these bylaws for? EU rules are quite different from South Asian frameworks.',
 NOW() - INTERVAL '4 hours'),

('60000000-0000-0000-0000-000000000007',
 '50000000-0000-0000-0000-000000000002',
 '00000000-0000-0000-0000-000000000006',
 '60000000-0000-0000-0000-000000000006',
 'EU — specifically Spain and Portugal. But I have tried to make the core framework jurisdiction-agnostic. The appendix flags where local legal advice is required.',
 NOW() - INTERVAL '3 hours 30 minutes'),

-- Replies to thread 3 (Hydroponic)
('60000000-0000-0000-0000-000000000008',
 '50000000-0000-0000-0000-000000000003',
 '00000000-0000-0000-0000-000000000003', NULL,
 'Thermal mass point is underappreciated. We modelled this for a decommissioned shopping centre in Chennai and the passive cooling savings were significant.',
 NOW() - INTERVAL '20 hours'),

('60000000-0000-0000-0000-000000000009',
 '50000000-0000-0000-0000-000000000003',
 '00000000-0000-0000-0000-000000000007',
 '60000000-0000-0000-0000-000000000008',
 'Would love to see that modelling data. Can you share it as an attachment or link to the research project?',
 NOW() - INTERVAL '18 hours');

-- =============================================
-- STEP 10: FORUM LIKES
-- =============================================

INSERT INTO forum_likes (user_id, thread_id) VALUES
('00000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000004'),
('00000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000005'),
('00000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000007');

INSERT INTO forum_likes (user_id, reply_id) VALUES
('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000007', '60000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000005', '60000000-0000-0000-0000-000000000003'),
('00000000-0000-0000-0000-000000000009', '60000000-0000-0000-0000-000000000004');

-- =============================================
-- STEP 11: ORIGINALITY CLAIMS
-- =============================================

INSERT INTO originality_claims (thread_id, user_id, status, claimed_at, verified_at, verified_by) VALUES

-- Verified claims for Elena (elite — needs 10, we seed 10)
('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'verified', NOW() - INTERVAL '2 days',  NOW() - INTERVAL '1 day',  '00000000-0000-0000-0000-000000000001'),
('50000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'verified', NOW() - INTERVAL '5 days',  NOW() - INTERVAL '4 days', '00000000-0000-0000-0000-000000000001'),
('50000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'verified', NOW() - INTERVAL '8 days',  NOW() - INTERVAL '7 days', '00000000-0000-0000-0000-000000000001'),

-- Verified claims for Ravi (researcher — needs 6)
('50000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 'verified', NOW() - INTERVAL '3 days',  NOW() - INTERVAL '2 days', '00000000-0000-0000-0000-000000000001'),

-- Verified claims for Carlos (contributor — needs 3)
('50000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000004', 'verified', NOW() - INTERVAL '4 days',  NOW() - INTERVAL '3 days', '00000000-0000-0000-0000-000000000001'),

-- Pending claims (in admin queue)
('50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', 'pending',  NOW() - INTERVAL '1 day',   NULL, NULL),
('50000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000009', 'pending',  NOW() - INTERVAL '12 hours', NULL, NULL),

-- Rejected claim (for testing rejected state)
('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', 'rejected', NOW() - INTERVAL '6 days',  NOW() - INTERVAL '5 days', '00000000-0000-0000-0000-000000000001');

-- =============================================
-- STEP 12: CONTENT FLAGS (admin queue)
-- =============================================

INSERT INTO content_flags (reporter_id, thread_id, reason, status) VALUES
('00000000-0000-0000-0000-000000000005',
 '50000000-0000-0000-0000-000000000002',
 'This post appears to be promoting a specific commercial product without disclosure.',
 'pending'),
('00000000-0000-0000-0000-000000000008',
 '50000000-0000-0000-0000-000000000003',
 'Data cited here appears to be from an unverified source. Please ask for citations.',
 'pending');

INSERT INTO content_flags (reporter_id, reply_id, reason, status) VALUES
('00000000-0000-0000-0000-000000000003',
 '60000000-0000-0000-0000-000000000006',
 'This reply is off-topic and does not contribute to the discussion.',
 'dismissed');

-- =============================================
-- STEP 13: ACTIONS
-- =============================================

INSERT INTO actions (id, title, description, category, impact_level, event_date, start_time, end_time, location_name, latitude, longitude, status, created_by, approved_by, approved_at) VALUES

('70000000-0000-0000-0000-000000000001',
 'Sunday Beach Cleanup',
 'Join us for our monthly beach cleanup along North Harbor Coastline. Gloves and bags provided. All ages welcome. Last month we collected over 340kg of waste.',
 'Cleanup', 'high_impact',
 CURRENT_DATE + INTERVAL '3 days', '08:00', '11:30',
 'North Harbor Coastline', -33.8688, 151.2093,
 'approved',
 '00000000-0000-0000-0000-000000000009',
 '00000000-0000-0000-0000-000000000001',
 NOW() - INTERVAL '5 days'),

('70000000-0000-0000-0000-000000000002',
 'Native Tree Planting Drive',
 'Community tree planting event at Greenway Park. We will be planting 200 native species chosen for their pollinator support and drought resilience.',
 'Conservation', 'standard',
 CURRENT_DATE + INTERVAL '6 days', '10:00', NULL,
 'Greenway Park', -33.8751, 151.2049,
 'approved',
 '00000000-0000-0000-0000-000000000004',
 '00000000-0000-0000-0000-000000000001',
 NOW() - INTERVAL '3 days'),

('70000000-0000-0000-0000-000000000003',
 'Solar Home Workshop',
 'Free workshop covering home solar installation basics, battery storage options, feed-in tariffs, and community solar co-op models. No experience needed.',
 'Workshop', 'standard',
 CURRENT_DATE + INTERVAL '9 days', '14:30', NULL,
 'Community Centre', -33.8700, 151.2100,
 'approved',
 '00000000-0000-0000-0000-000000000006',
 '00000000-0000-0000-0000-000000000001',
 NOW() - INTERVAL '2 days'),

('70000000-0000-0000-0000-000000000004',
 'Zero Waste Market Day',
 'A community market showcasing zero-waste products, bulk food buying, repair cafes, and swap stalls. Bring your own containers.',
 'Advocacy', 'standard',
 CURRENT_DATE + INTERVAL '12 days', '09:00', '15:00',
 'Town Square', -33.8650, 151.2150,
 'approved',
 '00000000-0000-0000-0000-000000000005',
 '00000000-0000-0000-0000-000000000001',
 NOW() - INTERVAL '1 day'),

-- Pending action (in admin queue)
('70000000-0000-0000-0000-000000000005',
 'Rooftop Garden Installation Day',
 'Help install modular raised bed gardens on three community building rooftops. We need people with basic DIY skills. Materials provided.',
 'Conservation', 'standard',
 CURRENT_DATE + INTERVAL '20 days', '09:00', '17:00',
 'East Community Hub', -33.8800, 151.2200,
 'submitted',
 '00000000-0000-0000-0000-000000000007',
 NULL, NULL);

-- =============================================
-- STEP 14: ACTION PARTICIPANTS
-- =============================================

INSERT INTO action_participants (action_id, user_id) VALUES
-- Beach Cleanup
('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004'),
('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005'),
('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006'),
('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000009'),

-- Tree Planting
('70000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005'),
('70000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000008'),
('70000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000009'),

-- Solar Workshop
('70000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004'),
('70000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007'),

-- Zero Waste Market
('70000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002'),
('70000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003'),
('70000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005'),
('70000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000009');

-- =============================================
-- STEP 15: ACTION UPDATES (organiser posts)
-- =============================================

INSERT INTO action_updates (action_id, author_id, body) VALUES
('70000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000009',
 'Update: Please bring sunscreen — it is going to be warm this Sunday. We will have water stations set up. Parking is available at the North Harbor car park, entry off Marine Drive.'),

('70000000-0000-0000-0000-000000000002',
 '00000000-0000-0000-0000-000000000004',
 'The saplings have arrived and are looking healthy. We have 200 banksias, 150 grevilleas, and 80 bottlebrushes ready to go. See you Saturday!');

-- =============================================
-- STEP 16: ACTION IMPACT REPORTS
-- =============================================

INSERT INTO action_impact_reports (action_id, author_id, body, reported_at) VALUES
('70000000-0000-0000-0000-000000000004',
 '00000000-0000-0000-0000-000000000002',
 'Incredible day. Our stall diverted over 40kg of clothing from landfill through the swap. Met three new neighbours I had never spoken to before.',
 CURRENT_DATE - INTERVAL '1 day'),

('70000000-0000-0000-0000-000000000004',
 '00000000-0000-0000-0000-000000000005',
 'We sold out of all our bulk dry goods by 11am. Going to need to bring double next time. The repair cafe fixed 12 items including two toasters and a sewing machine.',
 CURRENT_DATE - INTERVAL '1 day');

-- =============================================
-- STEP 17: POLICY UPDATES
-- =============================================

INSERT INTO policy_updates (id, title, body, scope, status, official_source_url, endorsement_threshold, created_by, published_at) VALUES

('80000000-0000-0000-0000-000000000001',
 'Federal Green Infrastructure Act 2024',
 'A landmark bill proposing $4B in sustainable transit and rural reforestation has received bi-partisan endorsement. This move signals a significant shift toward large-scale carbon sequestration projects across federal lands. The bill includes provisions for community-led monitoring and indigenous land stewardship.',
 'national', 'published',
 'https://example.gov/green-infrastructure-act-2024',
 500,
 '00000000-0000-0000-0000-000000000001',
 NOW() - INTERVAL '2 hours'),

('80000000-0000-0000-0000-000000000002',
 'Midwest Renewable Energy Cooperative Agreement',
 'Five states have entered a formal agreement to share wind and solar power grids, reducing reliance on non-renewable sources by an estimated 22% over the next decade. The agreement creates a framework for cross-state energy credits and community benefit funds.',
 'regional', 'published',
 'https://example.gov/midwest-renewable-agreement',
 300,
 '00000000-0000-0000-0000-000000000001',
 NOW() - INTERVAL '1 day'),

('80000000-0000-0000-0000-000000000003',
 'Portland Municipal Composting Mandate',
 'The city council has passed Ordinance 77-B, requiring all commercial businesses to implement organic waste separation by early 2025. The ordinance includes a community composting grant programme and free collection for qualifying small businesses.',
 'local', 'published',
 'https://example.gov/portland-composting-mandate',
 100,
 '00000000-0000-0000-0000-000000000001',
 NOW() - INTERVAL '2 months');

-- =============================================
-- STEP 18: POLICY ENDORSEMENTS
-- =============================================

INSERT INTO policy_endorsements (policy_id, user_id) VALUES
('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004'),
('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005'),
('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006'),
('80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
('80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007'),
('80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000008'),
('80000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000009'),
('80000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005');

-- =============================================
-- STEP 19: OPEN DATA DATASETS
-- =============================================

INSERT INTO datasets (title, description, category, verification_status, file_formats, external_url, created_by, published_at) VALUES

('Alpine Watershed Purity Index',
 'Real-time telemetry data tracking pH levels and oxygen saturation across 14 high-altitude monitoring stations in the Central Alps.',
 'water_quality', 'verified_source',
 ARRAY['csv', 'json', 'api'],
 'https://example.org/datasets/alpine-watershed',
 '00000000-0000-0000-0000-000000000003',
 NOW() - INTERVAL '2 hours'),

('Urban Particulate Matter Scan — Berlin',
 'Aggregated PM2.5 and PM10 sensor data from community-led monitoring networks across the Berlin metropolitan area.',
 'air_quality', 'community_verified',
 ARRAY['sql', 'geojson'],
 'https://example.org/datasets/berlin-particulates',
 '00000000-0000-0000-0000-000000000002',
 NOW() - INTERVAL '5 hours'),

('Regenerative Agriculture Carbon Sequestration',
 'Longitudinal study data tracking carbon capture efficiency in topsoil across 500 participating regenerative farms in the Midwest.',
 'soil_health', 'peer_reviewed',
 ARRAY['xlsx', 'csv'],
 'https://example.org/datasets/regen-ag-carbon',
 '00000000-0000-0000-0000-000000000007',
 NOW() - INTERVAL '1 day');

-- =============================================
-- STEP 20: BOOKMARKS
-- =============================================

INSERT INTO bookmarks (user_id, entity_type, entity_id) VALUES
('00000000-0000-0000-0000-000000000005', 'research',      '20000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000005', 'research',      '20000000-0000-0000-0000-000000000003'),
('00000000-0000-0000-0000-000000000006', 'forum_thread',  '50000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000006', 'forum_thread',  '50000000-0000-0000-0000-000000000005'),
('00000000-0000-0000-0000-000000000009', 'action',        '70000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000008', 'research',      '20000000-0000-0000-0000-000000000004');

-- =============================================
-- STEP 21: NOTIFICATIONS
-- =============================================

INSERT INTO notifications (user_id, type, title, body, link, read) VALUES

('00000000-0000-0000-0000-000000000007',
 'proposal_submitted',
 'Proposal under review',
 'Your proposal "Arctic Permafrost Methane Monitoring" has been submitted and is under admin review.',
 '/admin/proposals',
 false),

('00000000-0000-0000-0000-000000000005',
 'proposal_recommended',
 'Your proposal was recommended',
 'Carlos Mendes has recommended your proposal "Urban Heat Island Mapping" to the admin team.',
 '/admin/proposals',
 false),

('00000000-0000-0000-0000-000000000009',
 'join_request',
 'New join request',
 'Priya Nair has requested to join your research project "Urban Micro-forests".',
 '/research/20000000-0000-0000-0000-000000000002',
 false),

('00000000-0000-0000-0000-000000000006',
 'originality_rejected',
 'Originality claim not approved',
 'Your originality claim on "Community Microgrids: Scaling Governance" was not approved this time.',
 '/forum/50000000-0000-0000-0000-000000000002',
 true),

('00000000-0000-0000-0000-000000000004',
 'role_upgrade',
 'You are now a Contributor',
 'Congratulations! You have earned Contributor status. You can now recommend research proposals.',
 '/profile/00000000-0000-0000-0000-000000000004',
 false),

('00000000-0000-0000-0000-000000000009',
 'action_update',
 'New update on Beach Cleanup',
 'The organiser has posted an update: "Please bring sunscreen — it is going to be warm this Sunday."',
 '/actions/70000000-0000-0000-0000-000000000001',
 false);

-- =============================================
-- STEP 22: NEWSLETTER SUBSCRIBERS
-- =============================================

INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES
('newsletter1@example.com', NOW() - INTERVAL '30 days'),
('newsletter2@example.com', NOW() - INTERVAL '14 days'),
('newsletter3@example.com', NOW() - INTERVAL '7 days'),
('newsletter4@example.com', NOW() - INTERVAL '2 days');

-- =============================================
-- STEP 23: PLATFORM SETTINGS (single row)
-- Includes hero image URL columns added in updated schema.
-- After uploading images to the hero-images bucket in Supabase
-- Storage, update these URLs via /admin/settings in the app.
-- =============================================

INSERT INTO platform_settings (
  trust_score,
  hectares_protected,
  purity_rating,
  featured_project_id,
  hero_home_url,
  hero_policy_url,
  hero_opendata_url,
  hero_partnerships_url
) VALUES (
  98.4,
  '1.2M',
  '98%',
  '20000000-0000-0000-0000-000000000001',
  NULL,  -- upload via /admin/settings after seeding
  NULL,  -- upload via /admin/settings after seeding
  NULL,  -- upload via /admin/settings after seeding
  NULL   -- upload via /admin/settings after seeding
);

-- =============================================
-- STEP 24: PARTNERS (logos on Partnerships page)
-- logo_url is NULL here — upload partner logos to the
-- avatars bucket and set URLs via /admin/partnerships.
-- =============================================

INSERT INTO partners (name, logo_url, website_url) VALUES
('ECO-NET',         NULL, 'https://example.org/econet'),
('Terra Fountain',  NULL, 'https://example.org/terrafountain'),
('Green Gov',       NULL, 'https://example.org/greengov'),
('Solaris Bridges', NULL, 'https://example.org/solarisbridges'),
('Roots NGO',       NULL, 'https://example.org/rootsngo');

-- =============================================
-- DONE
-- =============================================
-- Test accounts summary:
--   ada@climatecommons.dev       → admin
--   elena@climatecommons.dev     → elite contributor
--   ravi@climatecommons.dev      → researcher
--   carlos@climatecommons.dev    → contributor
--   uma@climatecommons.dev       → user (active)
--   marcus@climatecommons.dev    → user (forum focus)
--   sarah@climatecommons.dev     → user (research focus)
--   david@climatecommons.dev     → user (policy focus)
--   priya@climatecommons.dev     → user (actions focus)
--   james@climatecommons.dev     → user (brand new, no activity)
--
-- Note: These users are seeded directly into the users table.
-- They do NOT have Supabase Auth accounts.
-- To test actual login flows, create real accounts manually
-- in Supabase Auth and use those emails.
--
-- What changed from the original seed:
--   - platform_settings now includes hero_home_url, hero_policy_url,
--     hero_opendata_url, hero_partnerships_url columns (all NULL by default)
--   - partners now includes logo_url column (NULL by default)
--   - Both are populated after seeding via the admin panel
-- =============================================
