<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Instructions — Slafurry Studios Website

Stack: Next.js 16 (App Router) · Prisma 6 · Supabase (Postgres + Auth + Storage) · Vercel · Tailwind v4 · Framer Motion 13 · TipTap (admin editor).

## Commands

```bash
npm run dev          # next dev → localhost:3000
npm run build        # next build — also the typecheck step (no `typecheck` script)
npm run lint         # eslint
npm run db:up        # docker compose up -d --wait postgres (local DB for tests)
npm run db:down      # docker compose down
npm run db:push      # prisma db push — local/dev only, NOT production Supabase
npm run db:migrate   # prisma migrate dev — local/dev only
npm run db:seed      # tsx prisma/seed.ts
npm run db:studio    # prisma studio
npm run db:reset     # prisma migrate reset --force && db:seed (local only)
npm run test:db      # vitest run against local docker DB (needs db:up first)
npm test             # vitest run (tests/unit) && playwright test (tests/e2e)
```

- `postinstall` runs `prisma generate`.
- **Command order:** `npm run build` before `npm test` — Playwright starts `npm run start`, which serves `.next`; e2e fails on a missing build.
- **Build is flaky, not broken.** `next build` prerenders `/admin/*` against the live DB; transient `PrismaClientKnownRequestError` / "build worker exited with code 1" happens. Re-run before investigating.
- **Lint baseline is dirty**: ~72 errors / ~51 warnings pre-existing (CI gates at max 78 errors). Don't fix them all; just don't add new ones.
- **`.env.example` exists** — copy to `.env`, fill real Supabase credentials. `.env*` is gitignored; never commit it.

## Environment

Keys use Supabase's newer naming (not `anon`/`service_role`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`. Plus `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY` / `NEXT_PUBLIC_RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (Cloudflare Turnstile for comments + contact), `AUTH_PROVIDER`, `STORAGE_PROVIDER`, `AUTH_LOCAL_SECRET` (local dev only), `ADMIN_EMAILS` (comma-separated emails allowed to become admin), `RATE_LIMIT_STORE` (optional; `postgres` in production by default).

- `AUTH_PROVIDER=supabase` in production; `local` is refused in production (`lib/auth/proxy-session.ts` throws when `NODE_ENV=production` or `VERCEL` set).
- Vercel: set env vars in Project Settings → Environment Variables, never in repo. Production is Vercel; the earlier Netlify config has been removed.

## Architecture

- **Root layout** `app/layout.tsx`: fonts + `SettingsProvider`, static, `<html lang="en">`, light-only theme.
- **Public pages**: `app/(main)/` route group (no URL segment); `/` = `app/(main)/page.tsx`.
- **Admin UI**: `app/admin/`. **JSON API**: `app/api/*`. **RSS**: `app/news/rss.xml/route.ts`, `app/devlog/rss.xml/route.ts`.
- **Not-found**: `experimental.globalNotFound: true` + `app/global-not-found.tsx`; catch-all `app/(main)/[...rest]/page.tsx` runs `followStoredRedirect()` then `notFound()`.
- **Path alias**: `@/*` → repo root (tsconfig also maps `@/components/*`, `@/lib/*`, etc.).
- **Fonts**: Pixelify Sans (`font-display`), Geist Pixel (`font-ui`), Geist Sans (`font-body`) via `lib/fonts.ts`. `app/globals.css` sets `html { font-size: 18px }` — rem sizes and Tailwind breakpoints scale ~12% (`sm` ≈ 720px). Intentional; don't change to 16px.
- **Data access**: server queries `lib/queries/*`, server actions `lib/actions/*`, `lib/prisma.ts` singleton, `lib/audit.ts`.

## Auth & middleware (proxy.ts at repo root)

`proxy.ts` is Next.js middleware at the project root (NOT `app/`). It is Prisma-free — middleware runs on the edge runtime, where Prisma's native engine can't load (this previously broke Netlify deploys; same constraint holds on Vercel).

Order:
1. Supabase session refresh via `lib/auth/proxy-session.ts` (`getProxySession`).
2. `/api/admin/*` guard: `401 {"error":"Unauthorized"}` JSON when unauthenticated; `403 Forbidden` for cross-site unsafe methods (CSRF, `lib/security/csrf.ts`).
3. `/admin/*` page guard: `307` to `/admin/login?returnTo=…` when unauthenticated (except `/admin/login`); logged-in → `/admin/login` redirects to `/admin`.
4. Matcher excludes `_next/static`, `_next/image`, `favicon.ico`, `sitemap.xml`, `robots.txt`, `sfx`, non-admin API routes (`api/(?!admin)`), and dotted paths.

Stored redirects (`prisma.redirect`) are **not** in middleware. `lib/queries/redirects.ts` `followStoredRedirect()` runs in the catch-all page before `notFound()` (wrapped in try/catch so DB outage doesn't break the site).

Admin auth: Supabase email/password in `app/admin/login`. `AdminUser` is a DB model (matched by `supabaseUserId`), not the auth source.

## Database / Prisma / RLS

Models (`prisma/schema.prisma`): Game, PlayLink, MontageVideo, Post, Comment, PressRelease, PressKitAsset, ContactMessage, Achievement, SocialLink, Redirect, SiteSettings (singleton id=1), AdminUser, PageView, AuditLog.

- Local DB: `npm run db:up` (docker compose postgres:15 on `localhost:5432`, db `slafurry`); `npm run test:db` uses `slafurry_test`.
- Schema changes locally: `prisma migrate dev`. Production: `npx prisma migrate deploy`.
- **Do NOT** run `prisma migrate reset` or `db push` against production Supabase — it deletes data. After first production deploy, run `npx prisma db push && npm run db:seed` once against production DB.
- **Seed** (`prisma/seed.ts`): SiteSettings/achievements/posts use `upsert`; games/playLinks/montage/social/press use plain `create` — re-running on an already-seeded DB fails on duplicates.
- **RLS**: enabled on all tables via `prisma/migrations/rls_production_policies/migration.sql` (applied to production Supabase). Public read for content; admin-only writes via `auth.uid()::text` = `AdminUser.supabaseUserId`; public insert for contact form and analytics.

## Storage

Buckets must exist: `game-covers`, `post-covers`, `post-covers`, `press-kit` (public), `montage-videos` (public, video-only). Upload endpoint `app/api/admin/upload/route.ts`; public URLs match `next.config.ts` `remotePatterns` (`*.supabase.co/storage/v1/object/public/**`). `STORAGE_PROVIDER=supabase` in production.

## Testing

- Unit: `tests/unit/*.test.ts` via vitest (alias `@` → repo root).
- E2E: `tests/e2e/` via Playwright Chromium (`npx playwright install chromium`). `npm test` builds via `npm run start`; run `npm run build` first.
- Admin QA write tests (Games, Posts, Press, Achievements, Montage, Settings) need `ADMIN_TEST_EMAIL` / `ADMIN_TEST_PASSWORD` in `.env` (never commit real creds); they skip gracefully without creds.
- Headed run: `npx playwright test --headed tests/e2e/admin-qa.spec.ts` (`--headed` is a Playwright CLI flag).

## Gotchas

- **i18n removed** — English only (`<html lang="en">`). `messages/en.json` is dead, `next-intl` not a dependency.
- **Achievements disabled by comment** in `app/(main)/layout.tsx` and `app/(main)/not-found.tsx` — `lib/achievements/*` still exists. Re-enable by uncommenting.
- **Handdrawn button art**: `public/*_btn.png`, applied as literal background classes (`bg-[url(/x_btn.png)] bg-[length:100%_100%]`). Keep class strings literal — Tailwind can't resolve dynamic template strings.
- **Tailwind v4 important modifier**: trailing `!` (`border-0!`), not `!border-0`.
- Root-level `fix_*.py` / `move_locales.py` do not exist in this repo — legacy codemod references are stale.

## Hosting

- Deployed on **Vercel** (zero-config Next.js; no `vercel.json` in repo). Live response headers: `server: Vercel`, `x-vercel-id`.
- Custom domain: `slafurrystudios.com` (primary) + `www.slafurrystudios.com` redirect (308 at apex). HTTPS auto-provisioned by Vercel.
- Security headers (nosniff, frame denial, referrer/permissions policy, report-only CSP) are set in `next.config.ts` `headers()`; violations go to `/api/csp-reports`.

## Contributing

Branch naming: `<type>/<issue-number>-<short-description>`. Conventional commits. Run `npm run build` before PR.
