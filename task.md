# TASK: Complete Typography Consistency Audit & Remediation — Slafurry Studios

You are a senior frontend engineer and typography QA specialist working on the Slafurry Studios website.

Your task is to perform a COMPLETE typography audit across the entire codebase, identify every text element that does not follow the approved typography system, fix inconsistencies, and verify the results.

This is an execution task. Do not stop after generating an audit report. Inspect, fix, and validate the actual implementation.

---

# 1. PROJECT CONTEXT

Project: Slafurry Studios Official Website

Stack:
- Next.js 16 App Router
- React
- TypeScript
- Tailwind CSS v4
- Framer Motion 13
- Prisma 6
- Supabase
- TipTap

Architecture:
- Public pages: `app/(main)/`
- Admin pages: `app/admin/`
- API routes: `app/api/*`
- Shared components: `components/`
- Utilities: `lib/`
- Global styling: inspect existing CSS configuration.
- Font configuration: `lib/fonts.ts`
- Root layout: `app/layout.tsx`

Current branch:
`feat/typography-refresh`

# 2. APPROVED TYPOGRAPHY SYSTEM

The website must consistently use these three fonts.

## A. Pixelify Sans — Display Font

Purpose: Brand identity and expressive display typography.

Expected usage:
- Hero titles.
- Main page headings.
- Section headings.
- Game titles.
- Featured content titles.
- Large statistics.
- Promotional headings.
- Decorative display text.

## B. Geist Pixel — UI Font

Purpose: Pixel-inspired interface typography.

Expected usage:
- Navigation.
- Sidebar labels.
- Buttons.
- Badges.
- Tags.
- Breadcrumbs.
- Metadata.
- Timestamps.
- Small interface labels.
- Compact dashboard elements.

## C. Geist Sans — Body Font

Purpose: Readability and information presentation.

Expected usage:
- Paragraphs.
- Descriptions.
- Article content.
- Devlog body text.
- Game descriptions.
- Forms and inputs.
- Textareas.
- Dialog descriptions.
- Data-heavy admin interfaces.
- TipTap editor content.
- Long-form content.

IMPORTANT:
Do not arbitrarily assign fonts based on individual preference. Follow this typography hierarchy consistently.

# 3. AUDIT SCOPE — SEARCH EVERYTHING

Perform a comprehensive search across the entire application.

Inspect at minimum:

### Application and Layout
- `app/layout.tsx`
- `app/globals.css`
- `lib/fonts.ts`
- All nested layouts.
- Loading states.
- Error boundaries.
- Not-found pages.

### Public Website
- Homepage.
- Navigation.
- Mobile navigation.
- Hero sections.
- Games listing.
- Game detail pages.
- Devlog listing.
- Devlog article pages.
- Press pages.
- About pages.
- Contact pages.
- Achievement components.
- Montage/video sections.
- Footer.
- All public reusable components.

### Admin Dashboard
- Admin layout.
- Sidebar.
- Dashboard.
- Analytics.
- Games CRUD.
- Posts CRUD.
- Comments moderation.
- Press management.
- Contact inbox.
- Achievement management.
- Montage management.
- Settings.
- Media uploader.
- Data tables.
- Dialogs.
- Dropdown menus.
- Forms.
- Buttons.
- Pagination.
- Empty states.
- Toasts.
- TipTap editor.
- Confirmation dialogs.

### Other Sources of Text
- Dynamically rendered database content.
- Form validation messages.
- Error messages.
- Accessibility labels where font styling applies.
- Placeholder text.
- Tooltip content.
- Loading indicators.
- Empty-state messages.
- Markdown-rendered content.
- Rich-text content.

Do not overlook conditional rendering, responsive variants, or components used only on mobile.

# 4. DETECT TYPOGRAPHY VIOLATIONS

Search for all of the following:

1. Old font references:
   - Caveat
   - Delicious Handrawn
   - Any other previously used font.

2. Hardcoded font declarations:
   - `font-family`
   - Inline `style={{ fontFamily: ... }}`
   - CSS font-family declarations.
   - Arbitrary Tailwind font-family utilities.

3. Unmapped typography:
   - `font-sans`
   - `font-mono`
   - `font-serif`
   - Browser-default font rendering.
   - Components without an intentional font assignment.
   - Third-party components inheriting unintended fonts.

4. Inconsistent Tailwind usage:
   - Incorrect font utility classes.
   - Conflicting font classes.
   - Duplicate font declarations.
   - Typography overrides that bypass global variables.

5. Editor-specific problems:
   - TipTap content using the wrong font.
   - Editor placeholder using an inconsistent font.
   - Prose styles overriding the approved font system.

IMPORTANT:
Not every `font-sans` or `font-mono` occurrence is automatically a violation. Inspect the actual computed font and the intended role before changing it.

# 5. CLASSIFY EVERY VIOLATION

For every detected issue, classify it:

- CRITICAL: Old fonts still being used or incorrect font loading.
- HIGH: Major headings, navigation, or important UI using the wrong font.
- MEDIUM: Buttons, badges, forms, metadata, or descriptions using inconsistent fonts.
- LOW: Minor decorative or isolated typography inconsistencies.

Determine the correct font according to the approved typography hierarchy.

# 6. IMPLEMENTATION RULES

After identifying violations, fix them directly.

Requirements:

- Reuse the existing font definitions in `lib/fonts.ts`.
- Reuse the CSS variables defined in the root layout.
- Centralize typography rules.
- Prefer semantic utility classes.
- Avoid introducing additional font dependencies.
- Avoid duplicate font declarations.
- Preserve existing font weights and visual hierarchy where possible.
- Preserve responsive behavior.
- Ensure dynamically rendered text inherits the intended typography.
- Ensure TipTap content uses Geist Sans.
- Ensure form controls use Geist Sans unless intentionally classified as UI labels.
- Ensure pixel fonts are not used for long-form reading.

Do not perform an unnecessary redesign.

Do not change:
- Website colors.
- Layout structure.
- Spacing systems.
- Animations.
- Component behavior.
- Database schema.
- API behavior.
- Authentication.
- Storage implementation.

The objective is typography consistency, not a visual redesign.

# 7. SPECIAL ATTENTION: THIRD-PARTY COMPONENTS

Inspect components that may not inherit typography correctly:

- TipTap.
- Radix UI components, if present.
- Dialogs and popovers.
- Dropdown menus.
- Tooltips.
- Select components.
- Date pickers.
- Toast notifications.
- Native input elements.
- Browser-rendered controls.

Check pseudo-elements and placeholder styling where relevant.

Ensure portal-rendered components inherit the correct typography.

# 8. AUTOMATED VERIFICATION

Use a combination of static analysis and browser inspection.

## Static Analysis

Search the repository using appropriate tools such as:

- `rg`
- AST-based inspection where useful.
- CSS inspection.
- TypeScript inspection.

Produce a list of all font declarations and their locations.

Verify that:
- No obsolete font references remain in active application code.
- No unintended hardcoded font-family declarations remain.
- All three approved fonts are configured.
- Typography utilities map to the correct font variables.
- No accidental fallback overrides exist.

Do not modify historical changelog entries or documentation merely to remove mentions of old font names.

## Browser Verification

Use Playwright with visible Chromium (headed mode).

The human operator wants to observe the browser.

Run the application and inspect:

1. Homepage.
2. Games listing.
3. Game detail page.
4. Devlog listing.
5. Devlog detail page.
6. Contact page.
7. Navigation and mobile navigation.
8. Admin login.
9. Admin dashboard.
10. At least two CRUD screens.
11. TipTap editor.
12. Dialogs and forms.

Inspect desktop and mobile layouts.

Use browser-computed styles to verify actual rendered fonts, not just CSS class names.

Where possible, use:

`getComputedStyle(element).fontFamily`

Also verify that fonts are actually loaded using the browser Font Loading API.

Do not claim a font renders correctly merely because its CSS variable exists.

If authenticated admin access is unavailable, report those screens as BLOCKED rather than PASS.

Do not use production credentials or modify real production content.

# 9. REGRESSION CHECKS

After changes, run:

1. TypeScript:
   `npx tsc --noEmit`

2. Lint:
   `npm run lint`

3. Production build:
   `npm run build`

4. Tests:
   `npm test`

Build may require a running local PostgreSQL database.

If build fails because the database is unavailable, classify it as an environment blocker. Do not misrepresent it as a typography regression.

IMPORTANT:
The existing ESLint baseline is 78 errors and 31 warnings.

Do not introduce new lint errors.

Compare against the existing baseline where available.

# 10. FINAL REPORT

Generate:

`reports/typography-audit/`

Include:

### A. Audit Summary
- Total files inspected.
- Total font declarations found.
- Total violations detected.
- Total violations fixed.
- Remaining violations.
- Blocked verification areas.

### B. Violation Inventory

For each violation:
- File path.
- Line number.
- Current font.
- Expected font.
- Severity.
- Fix applied or reason for leaving unchanged.

### C. Font Coverage Matrix

| Area | Pixelify Sans | Geist Pixel | Geist Sans | Status |
| Public website | | | | |
| Navigation | | | | |
| Games | | | | |
| Devlog | | | | |
| Forms | | | | |
| Admin dashboard | | | | |
| Admin CRUD | | | | |
| TipTap editor | | | | |
| Dialogs | | | | |
| Mobile layouts | | | | |

### D. Verification Results

- TypeScript result.
- Lint result and baseline comparison.
- Build result.
- Unit test result.
- E2E result.
- Browser-computed font verification.

### E. Changed Files

List every modified file and explain why it changed.

### F. Remaining Issues

Clearly identify anything that could not be verified or fixed.

# 11. GIT SAFETY

Before starting:
- Run `git status --short`.
- Inspect existing uncommitted changes.
- Preserve all user work.

After completion:
- Run `git status --short` again.
- Report changed and untracked files.
- Do not stage files.
- Do not commit.
- Do not push.
- Do not merge or rebase.
- Do not switch branches.

Do not overwrite existing reports or test artifacts.

# FINAL EXECUTION REQUIREMENT

This is a full repository-wide audit and remediation task.

Do not simply search for old font names and stop.

Inspect every relevant text-rendering area, including shared components, admin pages, public pages, dynamically rendered content, third-party components, and responsive layouts.

Fix confirmed violations, verify actual rendered fonts in a visible browser, and provide an honest final report.

A successful result means the entire active application consistently follows:

- Pixelify Sans for display typography.
- Geist Pixel for interface typography.
- Geist Sans for readable body typography.

Do not claim 100% completion if any relevant area remains uninspected or unverified.
