# Auth Routes Implementation

## Files Created

- `src/routes/auth/login.tsx`
- `src/routes/auth/signup.tsx`

## Architecture

Both routes use TanStack Router `createFileRoute`, Supabase Auth, and Tailwind CSS.
No shadcn/ui components are installed, so plain HTML inputs with Tailwind are used.

## Login (`/auth/login`)

- Form: email + password
- Calls `supabase.auth.signInWithPassword({ email, password })`
- Handles loading, error (displays `COPY.auth.invalidCredentials`), and success
- On success: navigates to `returnUrl` search param or `/`
- Gate: `beforeLoad` checks session via `supabase.auth.getSession()` and redirects away if already logged in
- Cross-links to `/auth/signup` preserving `returnUrl`

## Signup (`/auth/signup`)

- Form: email + password
- Calls `supabase.auth.signUp({ email, password })`
- Handles loading, error, and success
- On success: shows confirmation message instructing user to verify email
- Gate: identical session check in `beforeLoad`
- Cross-links to `/auth/login` preserving `returnUrl`

## Build Fixes Applied

The project had pre-existing scaffold issues that prevented compilation of any `createFileRoute` usage:

1. `src/routeTree.gen.ts` was a placeholder. Replaced with a manually-constructed route tree including `FileRoutesByPath` module augmentation for `/`, `/auth/login`, and `/auth/signup`.
2. `vite.config.ts` missing `router.entry` for `tanstackStart()`. Added `{ router: { entry: './app.tsx' } }`.
3. `src/app.tsx` missing named `getRouter` export expected by TanStack Start. Added `export function getRouter()`.
4. Created `src/vite-env.d.ts` to resolve `import.meta.env` TypeScript errors.

## Verification

- `tsc --noEmit` passes with zero errors.
- `npm run build` (Vite production build) succeeds for both client and SSR environments.
- `test -f src/routes/auth/login.tsx && test -f src/routes/auth/signup.tsx` returns OK.

## Testing

No test runner (Vitest/Jest/etc.) is installed in the project. Tests could not be written or executed under the constraint of not introducing new dependencies.
