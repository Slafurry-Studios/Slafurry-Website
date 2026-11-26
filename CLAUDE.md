# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

The imported `AGENTS.md` above is the main reference: commands, architecture, env vars, DB/RLS, hosting, gotchas. The notes below only add what it doesn't cover.

## Running a single test

```bash
npx vitest run tests/unit/sanitize.test.ts          # one unit file
npx vitest run -t "blocks entity-encoded"           # by test name
npx playwright test tests/e2e/homepage.spec.ts      # one e2e spec (needs `npm run build` first)
npx playwright test -g "returns 404"                # e2e by title
```

## Authorization model (read before touching admin code)

There are three layers. Each new admin surface needs the right one:

1. **`proxy.ts`** only proves the caller has *some* session. Any Supabase account passes it, so it is not an admin check. It can't be one, because the AdminUser allowlist needs Prisma and middleware must stay Prisma-free.
2. **`/api/admin/*` route handlers** must enforce the allowlist themselves, in one of two ways:
   - Mutations that should be audited: wrap them in `withAudit(...)` from `lib/audit.ts`, which calls `authorizeAdmin()` first.
   - Everything else (GETs, reorder, autosave, upload, settings): start the handler with
     `const auth = await authorizeAdmin(); if (!auth.ok) return auth.response;` from `lib/auth/admin-guard.ts`.
3. **Server-rendered `/admin/*` pages** must call `await requireAdminPage()` at the top. A check in `app/admin/layout.tsx` is not enough, because client-side navigations fetch only the page segment.

Who counts as admin is decided in one place, `resolveAdminUser()` in `lib/auth/admin-users.ts`. Users with an `AdminUser` row are admins. A user without a row gets one only if their email is in `ADMIN_EMAILS` (comma separated). There is no "first user becomes admin" fallback; don't add one back.

`tests/e2e/admin-authz.spec.ts` checks that a signed-in non-admin gets 404/403 everywhere. It needs `NON_ADMIN_TEST_EMAIL` / `NON_ADMIN_TEST_PASSWORD`, and skips without them.

## Untrusted HTML and public input

- Rich text (posts, `Game.longDesc`) is rendered with `dangerouslySetInnerHTML` and must go through `sanitizeRichText()` in `lib/security/sanitize.ts`, which uses DOMPurify. Don't replace it with a hand-rolled parser. The previous one was bypassable, and `tests/unit/sanitize.test.ts` has the regressions.
- Public write paths are server actions in `lib/actions/` (`submitComment`, `submitContactMessage`). They chain honeypot → Turnstile → rate limit. Turnstile fails closed in production when `TURNSTILE_SECRET_KEY` is missing.
- `lib/actions/form-guards.ts` and `lib/actions/turnstile.ts` are plain helpers, not `"use server"` modules. Keep it that way: every export of a `"use server"` file becomes a publicly callable endpoint.
- Rate limiting (`checkRateLimit` → `lib/security/rate-limit.ts`) uses the `RateLimit` Postgres table in production, so limits are shared across serverless instances. Dev and tests use memory. Override with `RATE_LIMIT_STORE=postgres|memory`. If Postgres errors, it falls back to memory instead of blocking logins. `tests/unit/rate-limit-postgres.test.ts` runs only under `npm run test:db`.

## 404 status codes

Don't add `loading.tsx` (or a `<Suspense>` fallback that renders above the page) to `app/(main)/`. Either one starts streaming before `notFound()` or `permanentRedirect()` runs, which locks the response to `200` and turns 404s into soft-404s. `tests/e2e/not-found.spec.ts` guards this. If a page needs a skeleton, put the `<Suspense>` inside that page, below any `notFound()` check.

## Analytics

- Tracking is opt-in. `components/analytics/ConsentBanner.tsx` writes the `analytics_consent` cookie (`lib/analytics/consent.ts`). `PageViewTracker` sends a beacon per route change only when that cookie is `granted`, and `/api/analytics/track` checks the cookie again server-side.
- `/privacy` (`app/(main)/privacy/page.tsx`) describes what the site collects. Update it when you change analytics, comments, the contact form or third-party embeds.
- The track endpoint stores only the path (allowlisted in `lib/analytics/track.ts`), referring hostname, device class and the `x-vercel-ip-country` header. Keep it that way: no IPs or full referrer URLs.
- Admin reads go through `lib/queries/analytics.ts`, used by both `/admin/analytics` and `GET /api/analytics`.

## Security headers

Headers are set in `next.config.ts` `headers()`. The CSP is still `Content-Security-Policy-Report-Only`, with violations logged by `/api/csp-reports`.
