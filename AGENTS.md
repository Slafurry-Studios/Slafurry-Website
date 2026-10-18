<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Instructions — Slafurry Studios Website

## Stack

Next.js 16 (App Router) · Prisma 6 · Supabase (Postgres + Auth + Storage) · Vercel · Framer Motion · Tailwind v4 · TipTap (admin editor)

## Commands

```bash
npm run dev          # dev server → localhost:3000 (root route, no locale redirect)
npm run build        # production build — only typecheck step (no `typecheck` script)
npm run lint         # eslint, flat config in `eslint.config.mjs`
npm run db:push      # prisma db push
npm run db:seed      # seed SiteSettings, achievements, social links
npm run db:studio    # Prisma Studio GUI
```

- No tests exist. `npm run lint && npm run build` is the full verification.
- `postinstall` runs `prisma generate` — Prisma client is regenerated on every `npm install`.
- Setup steps in `SETUP.md` are mostly right but reference a `.env.example` that **does not exist** — derive env var names from code instead (see below).

## Architecture

- **Route groups**: `app/layout.tsx` is the root layout (fonts, SettingsProvider, theme cookies). Public pages live in `app/(main)/` (route group, no URL segment) so `/` renders `app/(main)/page.tsx`. Admin UI in `app/admin/`, JSON endpoints in `app/api/*`, RSS in `app/news/rss.xml/route.ts` and `app/devlog/rss.xml/route.ts`.
- **Middleware**: `proxy.ts` (Next.js 16 name for `middleware.ts`). Does, in order: Supabase session refresh on every request, DB redirect lookup (`prisma.redirect`, 308, wrapped in try/catch so DB outage doesn't break all pages), `/admin/*` auth guard (redirects to `/admin/login?returnTo=...`). Matcher excludes `api`, `_next`, `sfx`, and any path containing a dot.
- **Admin auth**: Supabase email/password (`signInWithPassword` in `app/admin/login`). API routes under `app/api/admin/*` must do their own session check — `proxy.ts` only guards page navigation.
- **Data access**: server queries in `lib/queries/*`, server actions (contact form, comments, spam guards) in `lib/actions/*`, Prisma singleton `lib/prisma.ts`.
- **Supabase clients**: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts`, `lib/supabase/storage.ts`. Key naming uses Supabase's newer system: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY` — not `anon`/`service_role`.
- **Full env var list used in code**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `DATABASE_URL`, `DIRECT_URL` (Prisma), `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY` or `NEXT_PUBLIC_RESEND_API_KEY` (contact email — note the `NEXT_PUBLIC_` fallback exposes it to the browser; don't add new secrets that way).
- **Theme**: class-based on `<html>` (`dark` class + `.serious` for Serious Mode), read from cookies **server-side in `app/layout.tsx` before first paint** (no flash), then synced to localStorage by `components/layout/SettingsContext`. Sound-mute pref lives in the same cookie pass.
- **Fonts**: Bebas Neue + Poppins via `next/font/google`, variables in `lib/fonts.ts`.
- **Images**: remote pattern allows `*.supabase.co/storage/v1/object/public/**` only.
- **Not-found**: `experimental.globalNotFound: true` in `next.config.ts` + `app/global-not-found.tsx`; catch-all `app/(main)/[...rest]/page.tsx` calls `notFound()`.
- **Path alias**: only `@/*` → repo root. The `@/components/*`-style sub-aliases in older docs are gone.
- **Domain models**: full schema in `prisma/schema.prisma` (Game, Post, Comment, Press, Achievement, Contact, Analytics, AuditLog, Redirect, SiteSettings singleton id=1). `prisma/seed.ts`: SiteSettings/achievements/posts use upsert, but games/press/social/montage use plain `create` — rerun on a seeded DB fails on duplicates.

## Gotchas

- **i18n is removed.** Site is English-only (`<html lang="en">`). `next-intl` is not in dependencies; `messages/en.json` is a leftover nothing imports. Comments mentioning `app/[locale]/` or `useTranslations` are stale — the locale segment was deleted in commit "Revise leanguage to single leangage page". Don't reintroduce locale routing without asking the team.
- Root-level `fix_*.py` and `move_locales.py` are one-off codemods from past migrations — not part of the build, don't run them.
- `Website/` and `Studios/Slafurry/` leftover directories may appear on other branches — ignore.
- After first production deploy: `npx prisma db push && npm run db:seed` once against the production database (see `SETUP.md`).
- `CONTRIBUTING.md` still claims locales `en`/`id` — stale, see i18n note above.

## Contributing

Branch naming: `<type>/<issue-number>-<short-description>` (e.g. `feature/4-montage-video-shuffle`). Conventional commits. One issue per change; run `npm run build` before opening a PR. Full workflow in `CONTRIBUTING.md`.

Proprietary codebase (`LICENSE.md`) — no license grant; security reports go to security@slafurrystudios.com, never public issues (`SECURITY.md`).
