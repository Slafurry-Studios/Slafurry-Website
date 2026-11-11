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
npm run lint         # eslint
npm run db:push      # prisma db push
npm run db:migrate   # prisma migrate dev
npm run db:seed      # tsx prisma/seed.ts
npm run db:studio    # prisma studio
npm test             # vitest run && playwright test
```

- **Build is flaky, not broken.** `next build` prerenders `/admin/*`, which hits the live database; a transient `PrismaClientKnownRequestError` / "build worker exited with code 1" happens. Re-run before investigating.
- **Lint baseline is dirty**: ~110 problems (~77 errors) pre-existing repo-wide. Don't fix them all; just don't add new ones.
- `postinstall` runs `prisma generate`.
- **Only `.env` exists** — no `.env.example` was committed. Derive variable names from code.

## Architecture

- **Route groups**: `app/layout.tsx` is root layout (fonts + `SettingsProvider`). Public pages live in `app/(main)/` (route group, no URL segment) so `/` renders `app/(main)/page.tsx`. Admin UI `app/admin/`, JSON endpoints `app/api/*`, RSS `app/news/rss.xml/route.ts` and `app/devlog/rss.xml/route.ts`.
- **Middleware is `proxy.ts`**, in order: Supabase session refresh → **`/api/admin/*` guard returning `401 {"error":"Unauthorized"}` JSON when unauthenticated** → `prisma.redirect` lookup (308, in try/catch so DB outage doesn't break site) → `/admin/*` page guard (`307` to `/admin/login?returnTo=…`). Matcher deliberately allows `api/admin` while excluding other `api` routes.
- **Admin auth**: Supabase email/password (`signInWithPassword` in `app/admin/login`). `AdminUser` is a DB model, not the auth source.
- **Data access**: server queries `lib/queries/*`, server actions `lib/actions/*`, `lib/prisma.ts` singleton, `lib/audit.ts`.
- **Supabase clients**: `lib/supabase/client.ts` (browser), `server.ts` (`createClient` = cookie session; `createServiceRoleClient` = RLS bypass), `storage.ts` (`deleteStorageFile`). Keys use Supabase's newer naming: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY` — not `anon`/`service_role`.
- **Storage buckets** (must exist): `game-covers`, `post-covers`, `press-kit` (public), `montage-videos` (public, video-only). Upload endpoint `app/api/admin/upload/route.ts`; public URL matches `next.config.ts` `remotePatterns`.
- **Env vars referenced**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY` / `NEXT_PUBLIC_RESEND_API_KEY`.
- **Fonts**: Pixelify Sans (`font-display`), Geist Pixel (`font-ui`), Geist Sans (`font-body`) via `lib/fonts.ts`.
- **Theme**: light-only. `app/layout.tsx` is static. Serious mode and sound mute were removed (`SettingsContext` is inert).
- **Path alias**: only `@/*` → repo root.
- **Not-found**: `experimental.globalNotFound: true` + `app/global-not-found.tsx`; catch-all `app/(main)/[...rest]/page.tsx` calls `notFound()`.
- **Models** (`prisma/schema.prisma`): Game, PlayLink, MontageVideo, Post, Comment, PressRelease, PressKitAsset, ContactMessage, Achievement, SocialLink, Redirect, SiteSettings (singleton id=1), AdminUser, PageView, AuditLog.
- **Seed** (`prisma/seed.ts`): SiteSettings/achievements/posts use `upsert`, but games/playLinks/montage/social/press use plain `create` — re-running on an already-seeded DB fails on duplicates.

## Gotchas

- **`app/globals.css` sets `html { font-size: 18px }`** → every rem-based size *and Tailwind breakpoint* scales ~12% (`sm` is 720px, not 640px). Intentional; don't change to 16px.
- **i18n is removed** — single language, English only (`<html lang="en">`). `messages/en.json` is dead, `next-intl` isn't a dependency.
- **Achievements are disabled by comment** in `app/(main)/layout.tsx` and `app/(main)/not-found.tsx` — `lib/achievements/*` still exists. Re-enable by uncommenting.
- Handdrawn button art: served in `public/*_btn.png`. Applied as background images (`bg-[url(/x_btn.png)] bg-[length:100%_100%]`). Keep class strings literal since Tailwind can't resolve dynamic template strings.
- Tailwind v4 important modifier is a **trailing** `!` (`border-0!`), not `!border-0`.
- Root-level `fix_*.py` / `move_locales.py` are one-off legacy codemods — do not run them.
- After first production deploy: run `npx prisma db push && npm run db:seed` once against production DB.

## Contributing

Branch naming: `<type>/<issue-number>-<short-description>`. Conventional commits. Run `npm run build` before PR.
