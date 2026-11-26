# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `/privacy` page describing what the site collects (opt-in analytics, comments, contact form, Turnstile, YouTube, hosting), linked from the footer and the consent banner.
- `ADMIN_EMAILS` env var: comma-separated emails that are provisioned as admin on first sign-in.
- Shared rate limiting: counters live in a new `RateLimit` table in production, so limits hold across serverless instances (migration `20261126120000_add_rate_limit`).
- E2E test `admin-authz.spec.ts` for unauthenticated and signed-in non-admin access (needs `NON_ADMIN_TEST_EMAIL` / `NON_ADMIN_TEST_PASSWORD`).
- Analytics consent banner (pixel-frame style) with a "Cookie settings" link in the footer to change the choice; respects Global Privacy Control.
- Page-view tracking for public pages, sent only after the visitor accepts. Stores path, referring site hostname, device class and country (from Vercel's header); no IPs, no full referrer URLs.
- Admin analytics page is back in the admin nav, with total views and empty states.
- Contact and press pages pull heading, intro, and emails from `SiteSettings` (admin-editable; ISR 60s).

### Changed
- CI lint step now fails on any ESLint error or warning (was: up to 78 errors). The old step also passed silently if ESLint crashed.
- YouTube trailers use the privacy-enhanced `youtube-nocookie.com` player.
### Deprecated
### Removed
- Static `public/sitemap.xml` and `public/robots.txt` (replaced by generated ones, see Fixed).
- Netlify leftovers: `netlify.toml` and the `@netlify/plugin-nextjs` dev dependency (production is Vercel).
- Unused `POST /api/comments` route, which skipped the Turnstile check the comment form's server action enforces.
- `app/(main)/loading.tsx` (see Fixed).
### Fixed
- Sitemap and robots.txt pointed at a misspelled domain (`slafurystudios.com`) and dead `/en/...` URLs, and listed no games or posts. They are now generated (`app/sitemap.ts`, `app/robots.ts`) from visible games and published posts on the canonical `www` origin, refreshed hourly.
- Admin analytics page links no longer render as `//games` (protocol-relative to another host), and it queries the DB directly instead of fetching its own API.
- RSS feed links no longer point at the removed `/en/` prefix, and the fallback domain typo (`slafurystudios.com`) is fixed.
- `metadataBase` is set, so Open Graph/Twitter image URLs resolve to the site domain instead of localhost.
- Analytics tracking accepts the current page paths (it still listed the old `/en/...` paths).
- Missing pages and unknown game/news/devlog slugs now return HTTP 404 instead of a 200 soft-404. The `(main)` route-group `loading.tsx` started streaming before `notFound()` ran, which locked the status to 200. Stored redirects now return a real 308.
- Post “more” button no longer spawns when there is no more content ([#156](https://github.com/Slafurry-Studios/Slafurry-Website/pull/156)).
- Upcoming games no longer take featured slots ([#157](https://github.com/Slafurry-Studios/Slafurry-Website/pull/157)).
### Security
- **BREAKING:** removed the "first signed-in user becomes admin when the AdminUser table is empty" fallback (it lived in the admin guard and in both auth providers). Existing admins are unaffected; new admins need their email in `ADMIN_EMAILS`.
- `/api/analytics/track` checks the consent cookie server-side, derives device and country itself instead of trusting the client, skips bots, and rate-limits per IP on the server (the old limit was a cookie the client could delete).
- New migration `rls_production_policies_2_pageview_admin_read` restricts direct `PageView` reads to admins (it was publicly readable via the Supabase API). Not applied automatically.
- Plaintext achievement flag code removed from `app/(main)/not-found.tsx` comments.
- Admin API routes and server-rendered admin pages now check the `AdminUser` allowlist; previously reorder, autosave, upload, settings, social links, read endpoints and admin pages only required *any* signed-in Supabase account. `/api/analytics` now requires admin too.
- Rich-text sanitizer replaced with DOMPurify; the hand-rolled one let entity-encoded `javascript:` links and unclosed tags through.
- Turnstile verification fails closed in production when `TURNSTILE_SECRET_KEY` is missing.
- `form-guards.ts` and `turnstile.ts` are no longer `"use server"` modules (they were exposed as callable server actions).
- Security headers (nosniff, frame denial, referrer and permissions policy, report-only CSP) are now served from `next.config.ts`, so they apply on Vercel.
- Local storage read route rejects unknown buckets (`..` escaped the storage root); uploads reject HTML/SVG/XML/JS and sanitize the file extension.

## [v1.15.1] - 2026-11-15

### Added
- Draggable ordering for admin lists and project carousel ([#151](https://github.com/Slafurry-Studios/Slafurry-Website/pull/151)).

### Changed
- Public page layout and line-break components ([#154](https://github.com/Slafurry-Studios/Slafurry-Website/pull/154)).
- README refresh ([#155](https://github.com/Slafurry-Studios/Slafurry-Website/pull/155)).

### Deprecated
### Removed
### Fixed
- Project carousel container and image size ([#150](https://github.com/Slafurry-Studios/Slafurry-Website/pull/150)).
- Admin login/forgot-password layout ([#152](https://github.com/Slafurry-Studios/Slafurry-Website/pull/152)).
- Draggable reorder delay ([#153](https://github.com/Slafurry-Studios/Slafurry-Website/pull/153)).
### Security

## [v1.15.0] - 2026-11-15

### Added
- Local PostgreSQL (Docker) with auth and storage adapters; provider (`local` | `supabase`) chosen via env vars (`AUTH_PROVIDER`, `STORAGE_PROVIDER`); portable migrations via `prisma migrate` (no auth/storage schema, RLS, triggers, or Supabase functions).
- Auth adapter (`getSession`, `requireAdmin`, `signIn`, `signOut`) and storage adapter (`upload`, `getUrl`, `delete`) with local and Supabase implementations.
- Website typography refresh: Pixelify Sans for display headings, Geist Pixel for UI (nav, buttons, badges, metadata), Geist Sans for body/reading text; replaces Caveat and Delicious Handrawn.
- UX heuristic fixes, animations, YouTube preview, admin panel support ([#140](https://github.com/Slafurry-Studios/Slafurry-Website/pull/140)).
- Cloudflare Turnstile captcha on comment and contact forms.

### Changed
- Project carousel order reversed ([#148](https://github.com/Slafurry-Studios/Slafurry-Website/pull/148)).
- Incomplete admin-panel feature removed ([#147](https://github.com/Slafurry-Studios/Slafurry-Website/pull/147)).
- Prisma removed from Next.js middleware to fix deploy ([#141](https://github.com/Slafurry-Studios/Slafurry-Website/pull/141), [#142](https://github.com/Slafurry-Studios/Slafurry-Website/pull/142)).

### Deprecated
### Removed
- `messages/en.json` and remaining next-intl/i18n code; site is single language (English), URLs unchanged.

### Fixed
- Stale press-kit assets ([#149](https://github.com/Slafurry-Studios/Slafurry-Website/pull/149)).
- Home project-carousel image sizing and game-page order issues.

### Security
- Security hardening Tasks 1–8 ([#143](https://github.com/Slafurry-Studios/Slafurry-Website/pull/143)).
- `sanitizeRichText` never throws on server; jsdom-based sanitizer replaced to fix serverless 500s on slug pages ([#144](https://github.com/Slafurry-Studios/Slafurry-Website/pull/144), [#145](https://github.com/Slafurry-Studios/Slafurry-Website/pull/145)).

## [v1.14.1] - 2026-11-06

### Added
- Vitest unit tests (`checkHoneypot` form spam guard, `extractIdFromUrl` audit helper) and a Playwright homepage smoke test (HTTP 200, renders content).
- GitHub Actions CI workflow: Node 22, `npm ci`, `prisma generate`, `tsc --noEmit`, lint (gated to baseline of 78 errors), `next build`, `npm test`.

### Changed
### Deprecated
### Removed
### Fixed
- Public Prisma queries (`home`, `posts`, `games`, `comments`) degrade gracefully (`[]` / `null`) when the database is unreachable, so static prerendering no longer crashes the build without a live DB. Behavior with a live DB is unchanged.
- Session-gated admin routes (`/admin`, posts, achievements, games, press, montage, audit-log, settings, contacts, comments) opted out of static prerendering (`export const dynamic = "force-dynamic"`); they require a valid Supabase session and must not be built statically.

### Security

[unreleased]: https://github.com/Slafurry-Studios/Slafurry-Website/compare/v1.15.1-release...HEAD
[v1.15.1]: https://github.com/Slafurry-Studios/Slafurry-Website/compare/v1.15.0-release...v1.15.1-release
[v1.15.0]: https://github.com/Slafurry-Studios/Slafurry-Website/compare/v1.14.1...v1.15.0-release
[v1.14.1]: https://github.com/Slafurry-Studios/Slafurry-Website/compare/v1.14.0-alpha...v1.14.1
