# SLAFURRY STUDIOS — WEBSITE
The official (for now) website of Slafurry Studios — a small indie game studio built on rapid prototyping and unique ideas.

<p align="center">
  <img src="https://github.com/user-attachments/assets/45718cbb-a6ff-4df3-82b7-073562d35171" width="100%" alt="Slafurry Studios Website banner" />
</p>
<br>

<p align="left">
  <img src="https://img.shields.io/badge/NEXT.JS-ffffff?style=for-the-badge&logo=nextdotjs&logoColor=000000" />
  <img src="https://img.shields.io/badge/STATUS • RELEASED-000000?style=for-the-badge&logo=git&logoColor=ffffff" />
  <img src="https://img.shields.io/badge/MADE BY SLAFURRY STUDIOS-ffffff?style=for-the-badge&logo=gamepad&logoColor=000000" />
</p>

<p align="center">
  <a href="https://www.slafurrystudios.com"><b>www.slafurrystudios.com</b></a>
</p>

---

## ABOUT
The website for Slafurry Studios — home to our games, devlogs, and whatever else we're up to. Built with Next.js (App Router), Prisma on Supabase Postgres, Supabase Auth and Storage, and deployed on Vercel. Everything public is editable from a built-in admin panel, so new games and posts never need a code change.

---

## FEATURES

### Studio landing page
Hand-drawn pixel-frame style, the upcoming project front and centre, and a single button to the games.

<img src="docs/screenshots/home.png" width="100%" alt="Home page with the studio name, tagline and the upcoming project card" />

### Game portfolio
A featured game up top and every other project in a grid, each with its cover, status badge and description.

<img src="docs/screenshots/games.png" width="100%" alt="Games page with a large featured game card above a grid of game cards" />

### Game pages
Every game gets its own page with cover art, release status, the full write-up and links to play it.

<img src="docs/screenshots/game-detail.png" width="100%" alt="Detail page for An Unfinished Game with cover art and a Released badge" />

### Devlog and news, with tags and search
Two separate feeds. Filter by tag or search as you type, and subscribe through RSS (`/devlog/rss.xml`, `/news/rss.xml`).

<img src="docs/screenshots/devlog.png" width="100%" alt="Devlog list with tag filter buttons and a search box" />

### Article reader with comments
Rich-text posts written in the admin editor, with author, date and tags. Visitors can comment; comments appear after moderation.

<img src="docs/screenshots/article.png" width="100%" alt="News article titled Meet Our Accidental Mascot, Furrydora, with its cover illustration" />

### Press kit
Logos, character art and banners ready to download, plus press releases and a contact for press inquiries.

<img src="docs/screenshots/press.png" width="100%" alt="Press page with downloadable press kit items" />

### Contact
Direct email links for general and business inquiries, plus a contact form protected by Cloudflare Turnstile, a honeypot and rate limiting.

<img src="docs/screenshots/contact.png" width="100%" alt="Contact page with two email cards and the start of a message form" />

### Privacy-first analytics
Page views are only counted after a visitor says yes. No IP addresses, no ad trackers, and Global Privacy Control is respected. Visitors can change their choice from the footer, and [`/privacy`](https://www.slafurrystudios.com/privacy) explains exactly what's stored. Old visit records are deleted after 13 months.

<img src="docs/screenshots/consent-banner.png" width="100%" alt="Consent banner asking Can we count your visit, with Sure and No thanks buttons" />

### Works on phones
Every page is responsive, with a collapsible menu on small screens.

<p align="center">
  <img src="docs/screenshots/mobile-home.png" width="320" alt="Home page on a phone-sized screen" />
</p>

### Admin: games management
Add, edit, hide and drag-to-reorder games. The order here is the order on the site.

<img src="docs/screenshots/admin-games.png" width="100%" alt="Admin games list with cover thumbnails, status badges and drag handles" />

### Admin: post editor
A rich-text editor (TipTap) for devlogs and news, with headings, lists, quotes, links, images, code and autosave. Everything is sanitized before it's shown to visitors.

<img src="docs/screenshots/admin-editor.png" width="100%" alt="Admin post editor with a formatting toolbar above the post content" />

### Admin: comment moderation
Approve, reject or delete comments one at a time or in bulk, with search and filters.

<img src="docs/screenshots/admin-comments.png" width="100%" alt="Admin comments queue with three pending comments and approve, reject and delete actions" />

### Admin: analytics
Top pages, top referring sites and devices for the last 7, 30 or 90 days.

<img src="docs/screenshots/admin-analytics.png" width="100%" alt="Admin analytics with total views and top pages, referrers and devices" />

<sub>Admin screenshots use demo data, not real visitors or comments.</sub>

### Also under the hood
- **Admin access** is an allowlist (`ADMIN_EMAILS` plus the `AdminUser` table), checked on every admin page and API route. Creating, editing and deleting games, posts, press items, comments and contacts is recorded in an audit log.
- **Security headers**, CSRF checks on admin writes and shared rate limits for login, comments, contact and analytics.
- **SEO**: a generated sitemap and robots.txt, real 404 status codes, and Open Graph metadata for sharing.

---

## GETTING STARTED

### Prerequisites
- Node.js 22 or newer (CI runs on 22)
- npm
- A Supabase project (URL, publishable key and secret key), or Docker for a local Postgres

### Setup
```bash
git clone https://github.com/Slafurry-Studios/Slafurry-Website
cd Slafurry-Website
npm install
```

Copy the example env file and fill in your Supabase and database credentials. Every variable is explained in it:
```bash
cp .env.example .env
```

Then run the dev server (`npm install` already generated the Prisma client):
```bash
npm run dev
```

Open `http://localhost:3000`.

To work without a Supabase account, run everything on a local Docker Postgres instead: see [`docs/DATABASE.md`](docs/DATABASE.md).

---

## DATABASE

Prisma on Supabase PostgreSQL, with row-level security enabled on every table. Main models: Game, Post, Comment, PressRelease, PressKitAsset, ContactMessage, PageView, AuditLog, SiteSettings, SocialLink and AdminUser.

- Schema: `prisma/schema.prisma`
- Seed data: `prisma/seed.ts` (`npm run db:seed`, safe to re-run)
- Local Docker database: [`docs/DATABASE.md`](docs/DATABASE.md)

The site is English only, with no locale routing.

---

## TESTING

```bash
npm test
```

This runs `vitest run` (unit tests in `tests/unit/`) followed by `playwright test` (e2e tests in `tests/e2e/`). Run `npm run build` first: Playwright serves the production build. Install the browser once with `npx playwright install chromium`.

| Spec | Covers | Needs |
|---|---|---|
| `homepage.spec.ts` | Homepage renders | — |
| `not-found.spec.ts` | Missing pages return a real 404 | — |
| `admin-authz.spec.ts` | Non-admins get 401/403/404 on admin pages and APIs | `NON_ADMIN_TEST_EMAIL` / `NON_ADMIN_TEST_PASSWORD` for the signed-in part |
| `admin-qa.spec.ts` | Full admin panel QA (games, posts, comments, press, settings and more) | `ADMIN_TEST_EMAIL` / `ADMIN_TEST_PASSWORD` |

Tests that need credentials skip without them; never commit real ones. `npm run test:db` runs the unit tests against the local Docker database, including the Postgres rate-limit tests.

---

## DEPLOYMENT

Production runs on **Vercel**, with `www.slafurrystudios.com` as the canonical domain.

- Set every variable from `.env.example` in the Vercel project settings. `NEXT_PUBLIC_APP_URL` should be `https://www.slafurrystudios.com`.
- `ADMIN_EMAILS` decides who becomes an admin on first sign-in.
- `CRON_SECRET` enables the daily data-retention job defined in `vercel.json`.
- Database migrations in `prisma/migrations/` are applied to Supabase by hand. Never run `prisma migrate reset` or `db push` against production.

---

## TEAM
| Name | Role |
|---|---|
| Lord Zaini | Programmer |
| Althaf2406 | Programmer |
| csw | Emotional support pet |
| Alter | QA |

---

## VERSIONING & RELEASE

The project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (`MAJOR.MINOR.PATCH`, git tags `vMAJOR.MINOR.PATCH`). See [`CHANGELOG.md`](CHANGELOG.md) for every release.

- `feat` (backward-compatible feature) → MINOR bump
- `fix`/`perf` (backward-compatible fix) → PATCH bump
- Breaking change → MAJOR bump
- `docs`, `test`, `chore`, `ci`, `build`, `style`, `refactor` → no release

Conventional Commits are used (`<type>(<scope>): <summary>`). Changes are logged in `CHANGELOG.md` under `## [Unreleased]` (feat → Added, fix → Fixed, removals → Removed); breaking entries are prefixed with `**BREAKING:**` plus a short migration note.

Version headings, tags, and releases are cut only by the deployer via `gh release`. Never create a version heading or tag manually.

---

## CONNECT
<p align="left">
  <a href="https://github.com/Slafurry-Studios"><img src="https://img.shields.io/badge/GITHUB-ffffff?style=for-the-badge&logo=github&logoColor=000000" /></a>
  <a href="https://www.linkedin.com/company/slafurry-studios/"><img src="https://img.shields.io/badge/LINKEDIN-000000?style=for-the-badge&logo=linkedin&logoColor=ffffff" /></a>
  <a href="https://slafurrystudios.itch.io/"><img src="https://img.shields.io/badge/ITCH.IO-ffffff?style=for-the-badge&logo=itch.io&logoColor=000000" /></a>
</p>
