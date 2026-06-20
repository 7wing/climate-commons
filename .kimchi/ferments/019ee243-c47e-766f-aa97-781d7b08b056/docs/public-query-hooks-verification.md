# Public Query Hooks — Verification Report

Date: 2026-06-20

## Files Created

| File | Domain | Hooks | Tables Queried |
|------|--------|-------|----------------|
| `src/hooks/useResearch.ts` | Research | `useResearchList`, `useResearchById` | `research_projects`, `research_categories`, `research_participants`, `research_updates`, `research_attachments` |
| `src/hooks/useForum.ts` | Forum | `useForumTopics`, `useForumTopicById`, `useForumCategories` | `forum_threads`, `forum_categories`, `forum_replies` |
| `src/hooks/useActions.ts` | Actions | `useActionsList`, `useActionById`, `useActionParticipants` | `actions`, `action_participants` |
| `src/hooks/usePolicy.ts` | Policy | `usePolicies`, `usePolicyById`, `usePolicyEndorsements` | `policy_updates`, `policy_endorsements` |
| `src/hooks/useOpenData.ts` | OpenData | `useDatasets`, `useDatasetById` | `datasets` |
| `src/hooks/usePartners.ts` | Partners | `usePartners`, `usePartnershipInquiries` | `partners`, `partnership_inquiries` |
| `src/hooks/useAuth.ts` | Auth | `useAuth`, `useCurrentUser` | Supabase Auth session/user |
| `src/hooks/index.ts` | Exports | Re-exports all domain hooks | — |

## Modifications to Existing Files

- `src/lib/supabase.ts` — Added `Database` generic to `createClient<Database>` for full type-safe queries.
- `src/main.tsx` — Wrapped `RouterProvider` with `QueryClientProvider` from `@tanstack/react-query`.

## Type Safety

- All hooks import `Tables<...>` from `src/types/database.ts`.
- All hooks use the typed `supabase` client from `src/lib/supabase.ts`.
- `npx tsc --noEmit` passes with zero errors.

## Verification Command

```bash
find src/hooks -name '*.ts' | wc -l | xargs test 5 -le
```

Result: **PASS** (8 `.ts` files in `src/hooks/`).

## Dependencies Added

- `@tanstack/react-query`
- `@tanstack/react-query-devtools`

## Notes

- Blueprint table names `research_papers`, `paper_authors`, `research_citations`, `forum_topics`, `forum_posts`, `climate_actions`, `policy_proposals`, `open_datasets`, `dataset_files`, `partnerships`, and `funding_streams` do not exist in the current schema.
- Hooks used the closest available schema tables:
  - `research_papers` -> `research_projects`
  - `paper_authors` -> `research_participants`
  - `forum_topics` -> `forum_threads`
  - `forum_posts` -> `forum_replies`
  - `climate_actions` -> `actions`
  - `policy_proposals` -> `policy_updates`
  - `open_datasets` -> `datasets`
  - `partnerships` -> `partners`
- `dataset_files` and `funding_streams` tables are not present in the schema; no equivalents were found, so related queries were omitted.
