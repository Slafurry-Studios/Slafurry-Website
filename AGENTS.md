<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Instructions — Slafurry Studios Website

## Stack

Next.js 16 (App Router) · Prisma 6 · Supabase (Postgres + Auth + Storage) · Vercel · next-intl · Framer Motion · Tailwind v4

## Quick Reference

```bash
npm run dev          # dev server → localhost:3000, auto-redirects to /en
npm run build        # production build — run this to verify changes
npm run lint         # eslint (next core-web-vitals + typescript)
npm run db:push      # push Prisma schema to database
npm run db:seed      # seed initial data (SiteSettings, achievements, social links)
npm run db:studio    # Prisma Studio GUI
```

There is no typecheck script — `npm run build` runs the TypeScript compiler. There are no tests.

## Architecture

- **App Router** with locale segment: `app/[locale]/layout.tsx` is the root layout (Navbar + Footer + SettingsProvider + achievement system).
- **Middleware**: `proxy.ts` (not `middleware.ts` — Next.js 16 naming). Handles locale routing, Supabase session refresh, redirect lookups from DB, and `/admin/*` protection.
- **i18n**: `next-intl` with locales `en` (default) and `id`. Routing defined in `i18n/routing.ts`. Translation files in `messages/*.json`.
- **Database**: Prisma with Supabase PostgreSQL. Schema at `prisma/schema.prisma`. Prisma client singleton at `lib/prisma.ts`.
- **Supabase**: Uses newer key naming (`publishable_key` / `secret_key`, not `anon` / `service_role`). Client helpers in `lib/supabase/client.ts` and `lib/supabase/server.ts`.
- **Path alias**: `@/*` maps to project root (configured in `tsconfig.json`).
- **Dark mode**: Class-based (`dark` class on `<html>`), toggled via cookie + localStorage. Serious Mode adds `.serious` class.
- **Fonts**: Bebas Neue (headings) + Poppins (body) via `next/font/google`.
- **Images**: Remote patterns configured for `*.supabase.co` (Supabase Storage covers/OG images).
- **PostCSS**: Tailwind v4 via `@tailwindcss/postcss` plugin.
- **Global not-found**: `experimental.globalNotFound: true` in `next.config.ts` — required because root layout uses `app/[locale]/` dynamic segment.

## Gotchas

- `Website/` and `Studios/Slafurry/` are empty leftover directories — ignore them.
- After first production deploy, run `npx prisma db push && npm run db:seed` once against the production database.
- Supabase env vars use the newer key system — see `.env.example` for exact names.
- The `proxy.ts` matcher excludes `api`, static assets, and files with extensions.

## Contributing

Branch naming: `<type>/<issue-number>-<short-description>` (e.g. `feature/4-montage-video-shuffle`). Conventional commits. See `CONTRIBUTING.md` for full workflow.
