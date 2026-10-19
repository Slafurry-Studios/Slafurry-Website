<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Instructions — Slafurry Studios Website

Stack: Next.js 16 (App Router) · Prisma 6 · Supabase (Postgres + Auth + Storage) · Vercel · Tailwind v4 · Framer Motion 13 · TipTap (admin editor).

`CLAUDE.md` is just `@AGENTS.md` — this file is the source of truth.

## Commands

```bash
npm run dev          # next dev → localhost:3000 (root route, no locale redirect)
npm run build        # next build — the only typecheck step (there is no `typecheck` script)
npm run lint         # eslint, flat config in eslint.config.mjs
npm run db:push      # prisma db push
npm run db:migrate   # prisma migrate dev
npm run db:seed      # tsx prisma/seed.ts
npm run db:studio    # prisma studio
```

- No tests exist. Full verification is `npm run lint && npm run build`.
- **Build is flaky, not broken.** `next build` prerenders `/admin/*`, which hits the live database; a transient `PrismaClientKnownRequestError` / "build worker exited with code 1" happens. Re-run before investigating.
- **Lint baseline is dirty**: ~110 problems (~79 errors) pre-existing repo-wide. Don't try to fix them all; just don't add new ones.
- `postinstall` runs `prisma generate`.
- **Only `.env` exists** — `SETUP.md` tells you to `cp .env.example .env`, but `.env.example` was never committed. Derive variable names from code (list below).

## Architecture

- **Route groups**: `app/layout.tsx` is the root layout (fonts + `SettingsProvider`). Public pages live in `app/(main)/` (route group, no URL segment) so `/` renders `app/(main)/page.tsx`. Admin UI `app/admin/`, JSON endpoints `app/api/*`, RSS `app/news/rss.xml/route.ts` and `app/devlog/rss.xml/route.ts`.
- **Middleware is `proxy.ts`** (Next.js 16 name for `middleware.ts`), in order: Supabase session refresh → **`/api/admin/*` guard returning `401 {"error":"Unauthorized"}` JSON when unauthenticated** → `prisma.redirect` lookup (308, in try/catch so a DB outage doesn't break the site) → `/admin/*` page guard (`307` to `/admin/login?returnTo=…`). Matcher: `"/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sfx|api/(?!admin)|.*\\..*).*)"` — it deliberately allows `api/admin` while excluding other `api` routes. Adding a route under `app/api/admin/` is auto-protected; a new public API route is not.
- **Admin auth**: Supabase email/password (`signInWithPassword` in `app/admin/login`). `AdminUser` is a DB model, not the auth source.
- **Data access**: server queries `lib/queries/*`, server actions `lib/actions/*` (contact, comments, spam guards), `lib/prisma.ts` singleton, `lib/audit.ts`.
- **Supabase clients**: `lib/supabase/client.ts` (browser), `server.ts` (`createClient` = cookie session; `createServiceRoleClient` = RLS bypass), `storage.ts` (`deleteStorageFile`). Keys use Supabase's newer naming: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY` — not `anon`/`service_role`.
- **Storage buckets** (must exist; otherwise uploads fail `500 … Bucket not found`): `game-covers`, `post-covers`, `press-kit` (public), `montage-videos` (public but **video-only** — uploading an image gives `mime type … is not supported`). Upload endpoint `app/api/admin/upload/route.ts`; public URL is `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/<bucket>/<file>`, which is exactly the only `remotePatterns` entry in `next.config.ts`.
- **Env vars actually referenced**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `DATABASE_URL`, `DIRECT_URL` (Prisma), `NEXT_PUBLIC_APP_URL` (RSS/analytics absolute URLs), `RESEND_API_KEY` / `NEXT_PUBLIC_RESEND_API_KEY` (contact mail; the `NEXT_PUBLIC_` fallback leaks it to the browser — don't extend that pattern).
- **Fonts**: Caveat (headings → `font-heading`, var `--font-heading-family`) + Delicious Handrawn (body/UI, single 400 weight, `font-body`) via `next/font/google` in `lib/fonts.ts`. Not Bebas/Poppins anymore.
- **Theme**: light-only. `app/layout.tsx` is static — it reads no cookies and never sets `dark`/`serious`, so all `dark:` classes are dead. Serious Mode and sound mute were removed (`SettingsContext` is inert).
- **Path alias**: only `@/*` → repo root. The `@/components/*`-style sub-aliases in older docs are gone.
- **Not-found**: `experimental.globalNotFound: true` + `app/global-not-found.tsx`; catch-all `app/(main)/[...rest]/page.tsx` calls `notFound()`.
- **Models** (`prisma/schema.prisma`): Game, PlayLink, MontageVideo, Post, Comment, PressRelease, PressKitAsset, ContactMessage, Achievement, SocialLink, Redirect, SiteSettings (singleton id=1), AdminUser, PageView, AuditLog.
- **Seed** (`prisma/seed.ts`): SiteSettings/achievements/posts use `upsert`, but games/playLinks/montage/social/press use plain `create` — re-running on an already-seeded DB fails on duplicates.

## Gotchas

- **`app/globals.css` sets `html { font-size: 18px }`** → every rem-based size *and Tailwind breakpoint* scales ~12% (`sm` is 720px, not 640px). Intentional; don't "correct" it to 16px.
- **i18n is removed** — English only (`<html lang="en">`). `messages/en.json` is dead, `next-intl` isn't a dependency. Comments referencing `app/[locale]/` (including in `next.config.ts`) and `useTranslations` are stale. Don't reintroduce locale routing without asking.
- **Achievements are disabled by comment** in `app/(main)/layout.tsx` (imports and JSX) and `app/(main)/not-found.tsx` (flag hint) — `lib/achievements/*` still exists. Re-enable by uncommenting, not rewriting.
- **Serious Mode / sound mute removed**: `components/layout/SettingsContext.tsx` is inert, `.serious` / `joke-only` / `serious-only` CSS hooks in `globals.css` are dead.
- Handdrawn button art: served copies in `public/*_btn.png`, source PNGs at repo root (untracked). Applied as background images (`bg-[url(/x_btn.png)] bg-[length:100%_100%]`) and Tailwind can't resolve class names built from template strings — keep such class strings literal.
- Tailwind v4 important modifier is a **trailing** `!` (`border-0!`), not `!border-0`.
- Root-level `fix_*.py` / `move_locales.py` are one-off codemods from past migrations — not part of the build, don't run them. `Website/` and `Studios/Slafurry/` leftovers may appear on other branches — ignore.
- After first production deploy: run `npx prisma db push && npm run db:seed` once against the production database (`SETUP.md`).

## Contributing

Branch naming: `<type>/<issue-number>-<short-description>` (e.g. `feature/4-montage-video-shuffle`). Conventional commits. One issue per change; run `npm run build` before opening a PR. Full workflow in `CONTRIBUTING.md`.

Proprietary codebase (`LICENSE.md`) — no license grant; security reports go to security@slafurrystudios.com, never public issues (`SECURITY.md`).
