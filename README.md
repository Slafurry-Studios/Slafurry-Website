# SLAFURRY STUDIOS — WEBSITE

The official (for now) website of Slafurry Studios — a small indie game studio built on rapid prototyping and unique ideas.

<p align="center">
  <img src="https://github.com/user-attachments/assets/bdfe1587-f5ea-417a-85e3-11a838b12b6a" width="100%" alt="Slafurry Studios Website banner" />
</p>
<br>

<p align="left">
  <img src="https://img.shields.io/badge/NEXT.JS_16-ffffff?style=for-the-badge&logo=nextdotjs&logoColor=000000" />
  <img src="https://img.shields.io/badge/STATUS_•_IN_DEVELOPMENT-000000?style=for-the-badge&logo=git&logoColor=ffffff" />
  <img src="https://img.shields.io/badge/MADE_BY_SLAFURRY_STUDIOS-ffffff?style=for-the-badge&logo=gamepad&logoColor=000000" />
</p>

---

## ABOUT

The website for Slafurry Studios — home to our games, devlogs, and whatever else we're up to.

The website is being developed in phases, with features and systems being introduced progressively as development continues.

Built with Next.js 16 on the App Router, Supabase for PostgreSQL, authentication, and storage, Prisma as the ORM layer, and Vercel for deployment.

---

## FEATURES

* Studio landing page
* Game portfolio
* itch.io game catalog
* Studio blog / devlog
* English / Indonesian localization
* Supabase-backed data
* Authentication
* Protected admin area
* Achievement system
* Analytics
* Audit logging

---

## GETTING STARTED

### Prerequisites

* Node.js
* npm or pnpm
* A Supabase project

### Setup

**1. Clone the repository**

```bash
git clone https://github.com/Slafurry-Studios/Slafurry-Website.git
cd Slafurry-Website
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in the required credentials:

```env
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

`DATABASE_URL` and `DIRECT_URL` are obtained from the Supabase project's database settings.

The project uses Supabase's newer API key system. The key names differ from the older `anon` / `service_role` system.

**Never commit real credentials or secrets to the repository.**

**4. Generate Prisma client and push the schema**

```bash
npx prisma generate
npx prisma db push
```

**5. Seed the database**

```bash
npm run db:seed
```

**6. Start the development server**

```bash
npm run dev
```

Open `http://localhost:3000`.

The application will automatically redirect to `/en`.

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

The website currently supports:

* 🇬🇧 English (`en`)
* 🇮🇩 Indonesian (`id`)

English is currently the default locale.

Internationalization is handled with `next-intl`.

---

## DEPLOYMENT

The website is deployed through Vercel.

### Deploy

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Connect the GitHub repository.
4. Add the required environment variables in Vercel Project Settings.
5. Deploy.

Vercel should automatically detect the Next.js build configuration.

After the first production deployment, initialize the production database if required:

```bash
npx prisma db push
npm run db:seed
```

Make sure the environment variables point to the intended production database before running these commands.

---

## PROJECT STRUCTURE

The project structure is being developed progressively alongside the roadmap.

For detailed schema information and planned architecture, see:

```text
slafurry-studios-technical-spec.md
```

---

## TEAM

## TEAM | Role | Name | 
|---|---| 
| Lord Zaini | Programmer | 
| csw | Web Ideas | 
| Dina Varya | Professional/Business Advisor |

---

## CONNECT

<p align="left">
  <a href="https://github.com/Slafurry-Studios"><img src="https://img.shields.io/badge/GITHUB-ffffff?style=for-the-badge&logo=github&logoColor=000000" /></a>
  <a href="https://www.linkedin.com/company/slafurry-studios/"><img src="https://img.shields.io/badge/LINKEDIN-000000?style=for-the-badge&logo=linkedin&logoColor=ffffff" /></a>
  <a href="https://slafurrystudios.itch.io/"><img src="https://img.shields.io/badge/ITCH.IO-ffffff?style=for-the-badge&logo=itch.io&logoColor=000000" /></a>
</p>
