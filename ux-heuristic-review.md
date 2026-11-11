# Heuristic Evaluation: Slafurry Studios Website — 2026-11-11

Scope: Public visitors (players, fans, press) and authenticated admins. Tasks: (1) browse homepage & games, (2) read devlog post, (3) sign in to admin dashboard, (4) submit contact form, (5) create admin game. Devices: desktop 1440×900, mobile 390×844. Evaluator: single (AI-assisted) review.

## Summary

- 2 severity-3, 6 severity-2, 1 severity-1 findings. Biggest risk: users encounter wrong-language copy and broken API resources that erode trust in a studio site whose core value is showing games and devlogs.
- Top fixes: 1) Replace Indonesian "Kembali ke daftar game" with English "Back to game list" on game detail pages. 2) Fix copy-paste headings that say "Check Out Our Games" on /contact and /admin/login. 3) Investigate and resolve 400/404 console errors and contact page hydration mismatch.

## Findings

| ID | Task / screen | Heuristic | Issue | Evidence | Sev | Why (F/I/P) | Recommendation |
|----|---------------|-----------|-------|----------|-----|-------------|----------------|
| H-01 | Game detail /games/[slug] | 2 Match system/real world | "Back to game list" link shows Indonesian text "Kembali ke daftar game" on an English-only site (`<html lang="en">`). | app/(main)/games/[slug]/page.tsx:88; ux-review/desktop/homepage/03-game-detail.png; ux-review/mobile/homepage/03-game-detail.png | 3 | Every user who opens a game detail; persistent on every visit; breaks language expectation set by README English-only policy. | Change link text to "Back to game list". |
| H-02 | Multiple pages: /contact, /admin/login | 2 Match system/real world + 4 Consistency | H1 reads "Check Out Our Games" on the Contact page and Admin Login page — copy-paste from homepage/games that mislabels the page purpose. | app/(main)/contact/page.tsx:17; app/admin/login/page.tsx:49; ux-review/desktop/contact-submit/01-contact-form.png; ux-review/desktop/admin-login/02-admin-login.png | 2 | Every visitor to /contact or /admin/login; persistent; causes momentary confusion about where they are. | Change /contact H1 to "Contact Us" or "Send us a message"; change /admin/login H1 to "Sign in to admin" or "Admin Login". |
| H-03 | Contact page /contact | 1 Visibility of system status + 9 Error recovery | React hydration mismatch warning logged in console; SSR/client HTML differ on the contact form. | Console error captured during ux-capture desktop run; app/(main)/contact/page.tsx; ux-review/desktop/contact-submit/01-contact-form.png | 3 | Every visitor to /contact on first load; persistent; may cause UI to feel unstable or misrendered. | Fix client/server render mismatch in ContactForm (e.g., `useEffect`-gated client-only state, or ensure initial render matches). |
| H-04 | Multiple pages | 1 Visibility + 9 Error recovery | 400 Bad Request and 404 Not Found console errors on page loads, indicating broken API routes or missing assets. | Console errors captured during ux-capture desktop run (desktop: repeated 400/404); ux-review/desktop/*/01-*.png | 2 | Frequent on navigation; impact moderate (resources fail silently unless console checked); persistent. | Audit failing network requests in dev tools; fix 404 asset paths and 400 API endpoints; surface user-visible fallback instead of silent failure. |
| H-05 | Admin login /admin/login | 3 User control and freedom | No "Forgot password?" or account recovery link — locked-out users have no self-service path back in. | app/admin/login/page.tsx (no recovery link); ux-review/desktop/admin-login/02-admin-login.png | 2 | Only users who forget credentials; high impact when hit; one-time occurrence per user. | Add "Forgot password?" link pointing to a reset flow or support contact. |
| H-06 | Admin login /admin/login | 3 User control and freedom | No "Create account" or signup link — new admins cannot self-onboard from the login page. | app/admin/login/page.tsx (no signup link); ux-review/desktop/admin-login/02-admin-login.png | 2 | New admin users; moderate impact; persistent barrier to entry. | Add "Create account" link or instruct users to contact an existing admin. |
| H-07 | Games list /games | 10 Help and documentation | No empty state when no games exist — page shows only the H1 "Check Out Our Games" with no guidance. | app/(main)/games/page.tsx (no empty-state branch); ux-review/desktop/blog-read/02-blog-nav.png (no games empty state captured) | 2 | Every visitor when database is empty (fresh deploy, seed not run); persistent until games added. | Add "No games available yet" message with a suggestion (e.g., check back later or visit itch.io catalog). |
| H-08 | Admin login /admin/login | 1 Visibility of system status | `Suspense fallback={null}` renders nothing during initial load — possible flash of empty content before login form appears. | app/admin/login/page.tsx:13; ux-review/desktop/admin-login/01-admin-redirect.png | 1 | Every visitor to /admin/login; brief but noticeable; low impact. | Replace `fallback={null}` with a skeleton or spinner. |
| H-09 | All pages (Navbar) | 3 User control and freedom | Mobile burger menu has no Escape key listener — users cannot dismiss the overlay with Escape. | components/layout/Navbar.tsx (no `keydown` Escape handler); ux-review/mobile/homepage/01-home.png | 2 | Mobile users who open the menu; low-to-moderate impact; every time menu is opened. | Add Escape key listener to close mobile menu. |

## What works well

- **Contact form status feedback** — button shows "Sending…" during pending, and success/error toast with check/alert icons after submit (components/contact/ContactForm.tsx:20-32, 110-118). Clear visibility of system status (Heuristic 1) and error recovery (Heuristic 9).
- **Admin login loading state** — button shows "Signing in…" with `disabled` during submit; error shown with `IconAlertCircle` (app/admin/login/page.tsx:107-113, 56-61). Good visibility and error communication (Heuristics 1, 9).
- **Navbar active-state indicator** — current section underlined with `underline-offset-4` (components/layout/Navbar.tsx:40-42). Clear visibility of system status (Heuristic 1).
- **Devlog search + tag filtering** — client-side search and tag chips with active-state styling (components/posts/PostListClient.tsx:68-95). Supports recognition over recall (Heuristic 6) and flexibility (Heuristic 7).
- **Game detail external links** — "Play on" links show external-link icon and `target="_blank"` with `rel="noopener noreferrer"` (app/(main)/games/[slug]/page.tsx:56-80). Recognition of off-site destination (Heuristic 6).
- **Game status badge** — RELEASED/UPCOMING color-coded label on game detail (app/(main)/games/[slug]/page.tsx:40-49). Match to real-world game-release concepts (Heuristic 2).
- **Devlog adjacent posts** — prev/next navigation between articles (app/(main)/devlog/[slug]/page.tsx:15-18). Efficiency for readers (Heuristic 7).
- **Contact honeypot field** — hidden `company` field for spam prevention without user-facing friction (components/contact/ContactForm.tsx:36-43). Error prevention (Heuristic 5) that doesn't burden users.

## Limits and next steps

- One evaluator finds a fraction of issues; NN/g recommends 3–5 independent evaluators.
- Validate severity-3 findings (H-01, H-03) with 5 users on the same tasks (see `ux-research`).
- Screenshots captured at `ux-review/{desktop,mobile}/{task}/{NN}-*.png` — 48 total across 5 tasks × 2 viewports.
- Console errors (400/404/hydration) should be investigated with DevTools network tab before release.
