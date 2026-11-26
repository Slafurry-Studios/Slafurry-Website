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

`authorizeAdmin()` auto-provisions the first signed-in user as admin while the `AdminUser` table is empty. The seed creates one, so on a seeded DB this does nothing.

## Untrusted HTML and public input

- Rich text (posts, `Game.longDesc`) is rendered with `dangerouslySetInnerHTML` and must go through `sanitizeRichText()` in `lib/security/sanitize.ts`, which uses DOMPurify. Don't replace it with a hand-rolled parser. The previous one was bypassable, and `tests/unit/sanitize.test.ts` has the regressions.
- Public write paths are server actions in `lib/actions/` (`submitComment`, `submitContactMessage`). They chain honeypot → Turnstile → rate limit. Turnstile fails closed in production when `TURNSTILE_SECRET_KEY` is missing.
- `lib/actions/form-guards.ts` and `lib/actions/turnstile.ts` are plain helpers, not `"use server"` modules. Keep it that way: every export of a `"use server"` file becomes a publicly callable endpoint.
- Rate limiting (`checkRateLimit`) is in-memory per serverless instance. It slows brute force down but is not a global limit.

## 404 status codes

Don't add `loading.tsx` (or a `<Suspense>` fallback that renders above the page) to `app/(main)/`. Either one starts streaming before `notFound()` or `permanentRedirect()` runs, which locks the response to `200` and turns 404s into soft-404s. `tests/e2e/not-found.spec.ts` guards this. If a page needs a skeleton, put the `<Suspense>` inside that page, below any `notFound()` check.

## Security headers

Headers are set in `next.config.ts` `headers()`. The CSP is still `Content-Security-Policy-Report-Only`, with violations logged by `/api/csp-reports`.
