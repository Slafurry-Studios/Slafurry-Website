# SLAFURRY STUDIOS — WEBSITE
The official (for now) website of Slafurry Studios — a small indie game studio built on rapid prototyping and unique ideas.

<p align="center">
  <img src="https://github.com/user-attachments/assets/bdfe1587-f5ea-417a-85e3-11a838b12b6a" width="100%" alt="Slafurry Studios Website banner" />
</p>
<br>

<p align="left">
  <img src="https://img.shields.io/badge/NEXT.JS-ffffff?style=for-the-badge&logo=nextdotjs&logoColor=000000" />
  <img src="https://img.shields.io/badge/STATUS • IN DEVELOPMENT-000000?style=for-the-badge&logo=git&logoColor=ffffff" />
  <img src="https://img.shields.io/badge/MADE BY SLAFURRY STUDIOS-ffffff?style=for-the-badge&logo=gamepad&logoColor=000000" />
</p>

---

## ABOUT
The website for Slafurry Studios — home to our games, devlogs, and whatever else we're up to. Currently in a soft, phased rollout as we build it out piece by piece. Built with Next.js on the frontend, Supabase for data/auth, and Prisma as the ORM layer connecting the two.

---

## FEATURES

* Studio landing page
* Game portfolio
* itch.io game catalog
* Studio blog / devlog
* English only
* Supabase-backed data
* Authentication
* Protected admin area
* Achievement system
* Analytics
* Audit logging

---

## GETTING STARTED

### Prerequisites
- Node.js `[version]`
- npm or pnpm
- A Supabase project (URL + anon key)

### Setup
```bash
git clone [repo-url]
cd [repo-folder]
npm install
```

Create a `.env` file in the root with your Supabase and database credentials:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
```

Then generate the Prisma client and run the dev server:
```bash
npx prisma generate
npm run dev
```

Open `http://localhost:3000`.

---

## DATABASE

The project uses Prisma with Supabase PostgreSQL.

The current schema includes systems such as:

* Game
* Post
* Comment
* Press
* Achievement
* Contact
* Analytics
* Audit Log
* Site Settings
* Social Links

The Prisma schema is located at:

```text
prisma/schema.prisma
```

Initial seed data is located at:

```text
prisma/seed.ts
```

---

## INTERNATIONALIZATION

Single language, no i18n — English only (`<html lang="en">`). `next-intl` and locale routing were removed; `messages/en.json` is dead. Do not reintroduce locale routing without asking.

---

## TESTING

Run the unit and smoke test suite:

```bash
npm test
```

This runs `vitest run` (unit tests in `tests/unit/`) followed by `playwright test` (e2e tests in `tests/e2e/`): the homepage smoke test (`homepage.spec.ts`) and the admin panel QA spec (`admin-qa.spec.ts`, groups A–L covering Authentication, Dashboard, Games, Posts, Comments, Press, Contacts, Achievements, Montage, Settings, Media, Audit logs, plus Responsive QA and Console/network checks). Playwright Chromium is installed via `npx playwright install chromium`.

Admin QA tests that write data (Games, Posts, Press, Achievements, Montage, Settings) require a test admin account. Set `ADMIN_TEST_EMAIL` and `ADMIN_TEST_PASSWORD` in `.env` (never commit real credentials). Without creds these tests skip gracefully. Run headed Chromium with `npx playwright test --headed tests/e2e/admin-qa.spec.ts` (`--headed` is a Playwright CLI flag; `slowMo` is a browser launch option, not a CLI flag).

---

## TEAM
| Role | Name |
|---|---|
| [Role] | [Name] |
| [Role] | [Name] |

---

## VERSIONING & RELEASE

The project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (`MAJOR.MINOR.PATCH`, git tags `vMAJOR.MINOR.PATCH`). Current version: `1.14.1`.

- `feat` (backward-compatible feature) → MINOR bump
- `fix`/`perf` (backward-compatible fix) → PATCH bump
- Breaking change → MAJOR bump
- `docs`, `test`, `chore`, `ci`, `build`, `style`, `refactor` → no release

Conventional Commits are used (`<type>(<scope>): <summary>`). Changes are logged in `CHANGELOG.md` under `## [Unreleased]` (feat → Added, fix → Fixed, removals → Removed); breaking entries are prefixed with `**BREAKING:**` plus a short migration note.

Version headings, tags, and releases are cut only by the deployer via `gh release`. Never create a version heading or tag manually.

## LICENSE

Proprietary codebase — see `LICENSE.md`. All rights reserved; no license grant is implied by access to this repository. For permission or licensing inquiries, contact Slafurry Studios through its official channels.

## PROJECT STRUCTURE

The project structure is being developed progressively alongside the roadmap.

For detailed schema information and planned architecture, see:

This is a **commercial, proprietary project**. All source code, assets, artwork, audio, design documents, and other materials contained in this repository are the exclusive property of Slafurry Studio.

No part of this project may be reproduced, distributed, copied, modified, reverse-engineered, sublicensed, or used in any form or by any means — electronic, mechanical, or otherwise — without the prior **written permission** of Slafurry Studio.

Unauthorized use, reproduction, or distribution of this project or any portion of it may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law.

**Access to this repository does not grant any license or ownership rights.** This repository and its contents are provided strictly for authorized internal development purposes only.

---

## CONNECT
<p align="left">
  <a href="https://github.com/Slafurry-Studios"><img src="https://img.shields.io/badge/GITHUB-ffffff?style=for-the-badge&logo=github&logoColor=000000" /></a>
  <a href="https://www.linkedin.com/company/slafurry-studios/"><img src="https://img.shields.io/badge/LINKEDIN-000000?style=for-the-badge&logo=linkedin&logoColor=ffffff" /></a>
  <a href="https://slafurrystudios.itch.io/"><img src="https://img.shields.io/badge/ITCH.IO-ffffff?style=for-the-badge&logo=itch.io&logoColor=000000" /></a>
</p>
