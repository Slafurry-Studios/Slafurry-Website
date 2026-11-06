# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

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

[unreleased]: https://github.com/Slafurry-Studios/Slafurry-Website/compare/v1.14.1...HEAD
[v1.14.1]: https://github.com/Slafurry-Studios/Slafurry-Website/compare/v1.14.0-alpha...v1.14.1
