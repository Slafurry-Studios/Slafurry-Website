# F. Remaining Issues

## Not fixable in this session (environment)

1. **Production build blocked.** `npm run build` fails at type-check due to pre-existing type errors in the untracked file `tests/e2e/admin-qa.spec.ts` (unrelated to typography; existed before this session). Classified as environment blocker per task guidance, not a typography regression.
2. **E2E / browser-computed font verification blocked.** `playwright test` requires a running dev server and a database; admin screens additionally require authenticated access. No production credentials used. Reported BLOCKED.

## Intentionally left as-is (not violations)

- `app/admin/page.tsx:64,130` — large statistic counts use `font-display`, which is an approved use ("Large statistics").
- `components/layout/Navbar.tsx:24` — `navbar_handrawn.png` is a background image (handdrawn button art), not a font.
- Elements without an explicit font utility inherit `font-body` from `<body>` in `app/layout.tsx`; correct per system.
- TipTap editor already maps `font-body` to content and `font-display` to headings.

## Notes for QA

- Verify the 4 changed files render with the intended computed fonts in a headed browser against a live dev server once the environment (DB + build blocker) is resolved.
- Confirm `app/global-not-found.tsx` and `app/error.tsx` (standalone error pages) resolve `--font-body-family` / `--font-display-family` correctly since they carry their own font variable classes.
