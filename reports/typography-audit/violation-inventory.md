# B. Violation Inventory

All violations resolved. Severity key: CRITICAL / HIGH / MEDIUM / LOW.

| # | File | Line | Current font | Expected font | Severity | Fix applied |
|---|------|------|--------------|---------------|----------|-------------|
| 1 | `app/admin/analytics/page.tsx` | 109 | `font-mono` | `font-ui` | MEDIUM | Replaced `font-mono` with `font-ui` (view-count metadata) |
| 2 | `app/admin/analytics/page.tsx` | 144 | `font-mono` | `font-ui` | MEDIUM | Replaced `font-mono` with `font-ui` (view-count metadata) |
| 3 | `app/admin/analytics/page.tsx` | 163 | `font-mono` | `font-ui` | MEDIUM | Replaced `font-mono` with `font-ui` (view-count metadata) |
| 4 | `components/admin/AuditLogList.tsx` | 63 | `font-mono` | `font-ui` | MEDIUM | Replaced `font-mono` with `font-ui` (audit-log key/data) |
| 5 | `components/admin/AuditLogList.tsx` | 193 | `font-mono` | `font-ui` | MEDIUM | Replaced `font-mono` with `font-ui` (audit-log data) |
| 6 | `components/admin/AuditLogList.tsx` | 200 | `font-mono` | `font-ui` | MEDIUM | Replaced `font-mono` with `font-ui` (audit-log value paragraph) |
| 7 | `app/global-not-found.tsx` | 25 | Inline `fontFamily: "system-ui, sans-serif"` on `<body>` | `font-body` utility + font variable classes on `<html>` | HIGH | Removed inline `fontFamily`; added `fontDisplay/fontUI/fontBody` variable classes to standalone `<html>`; set `className="font-body"` on `<body>`; `font-display` on "404" and heading |
| 8 | `app/error.tsx` | 31 | Inline `fontFamily: "system-ui, sans-serif"` on outer `<div>` | `font-body` utility + font variable class on the div itself | HIGH | Removed inline `fontFamily`; added `fontBody.variable` + `font-body` class on outer `<div>` (self-contained so it works even if root layout fails); `font-display` on "500" and heading |

### Items inspected and left unchanged (not violations)

- `app/admin/page.tsx:64,130` — `<p className="font-display text-4xl">` large statistics counts; "Large statistics" is an approved `font-display` use.
- `components/achievements/AchievementCTA.tsx:262,272` — `font-display` on decorative "?" placeholder and achievement title (a title → display).
- `components/achievements/AchievementToast.tsx:136` — `font-display` on toast title (`entry.title`).
- `components/achievements/AchievementCTA.tsx:286` and similar — paragraphs/descriptions already use `font-body`.
- `components/admin/TiptapEditor.tsx:78` — TipTap editor content uses `font-body` with `prose-headings:font-display`; correct.
- `components/layout/Navbar.tsx:24` — `bg-[url(/navbar_handrawn.png)]` is a background image (handdrawn button art), not a font reference; intentionally left.
- Components without an explicit font class (e.g. `app/(main)/games/[slug]/page.tsx:52` game shortDesc `<p>`) inherit `font-body` from `<body>` in `app/layout.tsx`; correct.

### Not present (verified absent)

- No `Caveat`, `Delicious Handrawn`, `font-sans`, `font-serif`, or arbitrary `font-family`/`fontFamily` declarations remain in active application code.
- No obsolete font references remain.
