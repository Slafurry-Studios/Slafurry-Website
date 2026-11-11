# E. Changed Files

Only the four files below were modified by this session. Pre-existing uncommitted changes (`CHANGELOG.md`, `README.md`) and untracked files (`task.md`, `opencode.json`, `reports/baseline/`, `test-results/`, `tests/e2e/admin-qa.spec.ts`) were left untouched per git-safety rules.

| File | Why changed |
|------|-------------|
| `app/admin/analytics/page.tsx` | Replaced 3× `font-mono` with `font-ui` on view-count metadata spans (lines 109, 144, 163). `font-mono` is not an approved font; metadata/timestamps use Geist Pixel. |
| `components/admin/AuditLogList.tsx` | Replaced 3× `font-mono` with `font-ui` on audit-log key/data/value spans (lines 63, 193, 200). |
| `app/global-not-found.tsx` | Removed hardcoded inline `fontFamily: "system-ui, sans-serif"` on `<body>`. Imported the 3 fonts from `@/lib/fonts`, applied their CSS-variable classes to the standalone `<html>` (this page bypasses root layout), set `className="font-body"` on `<body>`, and `font-display` on the "404" and heading. |
| `app/error.tsx` | Removed hardcoded inline `fontFamily: "system-ui, sans-serif"` on the outer `<div>`. Imported fonts, applied `fontBody.variable` + `font-body` class directly on the div (self-contained; works even if root layout fails before theme variables attach), and `font-display` on "500"/heading. |

No colors, layout, spacing, animations, component behavior, schema, API, auth, or storage were changed.
