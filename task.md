# Security fixes — Slafurry Studios Website

Source: security audit against Next.js 16 + Supabase Auth/Storage + Prisma + Netlify.
Execute in priority order. Each task is one commit.

## Task 1 — Sanitize rendered rich text (XSS, highest priority)

File: `app/(main)/games/[slug]/page.tsx`
Line: 54
Problem: `dangerouslySetInnerHTML={{ __html: game.longDesc || "" }}` renders TipTap content unsanitized. Stored XSS if admin content is compromised.
Fix:
- Import `isomorphic-dompurify` (already a dependency, unused).
- Build an allowlist config: tags `p, br, strong, em, a, ul, ol, li, code, pre, blockquote, h1-h6, img`; attrs `href, title, src, alt`; strip `javascript:`/data URIs on href/src; enforce `rel="noopener noreferrer"` and `target="_blank"` on `target="_blank"` anchors.
- Wrap `game.longDesc` through sanitizer at render, not on input.
- Verify: payload `<img src=x onerror=alert(1)>`, `"><svg onload=alert(1)>`, `javascript:alert(1)`, `</script><script>alert(1)</script>` all render inert.

## Task 2 — CSRF/Fetch-Metadata guard for admin API

File: `proxy.ts`
Lines: 24-33 (`isAdminApi` block)
Problem: `app/api/admin/*` unsafe methods (POST/PUT/DELETE) protected only by session cookie. No Fetch-Metadata / Origin / token check. Authenticated admin lured to attacker site can trigger state-changing requests.
Fix:
- Add check inside `/api/admin/*` guard: reject unsafe methods (POST/PUT/PATCH/DELETE) when `sec-fetch-site` is `cross-site` and no valid same-origin `Origin` header. Allow `same-origin` / `none` / missing browser headers.
- Alternative: create a route-handler wrapper and apply to every admin POST/PUT/DELETE route (21 routes under `app/api/admin/`).
- Also set `serverActions.allowedOrigins` in `next.config.ts` if Server Actions are used behind Netlify proxy.
Verify: curl from different origin with `Sec-Fetch-Site: cross-site` + `Origin: https://evil.test` and valid session cookie → 403. Same-origin request → 2xx.

## Task 3 — Content Security Policy

File: `netlify.toml`
Lines: 27-32 (`[[headers]]` block)
Problem: No CSP header. Combined with Task 1 XSS sink, impact unbounded.
Fix:
- Add `Content-Security-Policy-Report-Only` with strict baseline: `default-src 'self'`, `script-src 'self'`, `style-src 'self' 'unsafe-inline'` (Tailwind v4 may need inline style; audit first), `img-src 'self' data: https:`, `connect-src 'self' https: *.supabase.co`, `frame-ancestors 'none'`, `base-uri 'self'`, `object-src 'none'`, `report-to csp`.
- Add `Reporting-Endpoints: csp="https://.../csp-reports"` (or keep report-uri for older browsers).
- Run in report-only, collect violations, then switch to enforced `Content-Security-Policy`.
- Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` while here.
Verify: DevTools shows header; no violations on core flows in report-only; enforced does not break login or image loading.

## Task 4 — Cookie hardening (local provider dev fallback)

File: `lib/auth/providers/local.ts`
Lines: 59, 129 (`clearCookie`, `sessionCookie`)
Problem: Session cookie lacks `__Host-` prefix, no `secure` in dev (acceptable dev-only), JWT has no `exp` — lives until browser clear. No idle/absolute timeout.
Fix:
- Add `__Host-` prefix to `slafurry_local_session` cookie in `signOut`/`sessionCookie`.
- Add `exp` claim (e.g. 1 hour) to local session JWT in `signSession`/`verifySession`.
- Enforce idle timeout server-side in `getSession`: compare `iat` against now; reject stale sessions.
Verify: `Set-Cookie` shows `__Host-slafurry_local_session=...; Path=/; HttpOnly; Secure; SameSite=Lax`; expired JWT rejected; old cookie rejected after new login.

## Task 5 — App-level rate limit on admin login

File: `lib/auth/actions.ts`
Lines: 24-28 (`signIn`)
Problem: Login endpoint has no application-layer rate limit (Supabase has its own, but no app-level brute-force guard).
Fix:
- Reuse `checkRateLimit` from `lib/actions/form-guards.ts` keyed by IP hash in `signIn`, max 5 per 15 minutes. Return `error: "Too many attempts. Try again later."` when limited.
Verify: 6 failed login attempts from same IP within window → rate-limited response, no Supabase call.

## Task 6 — Failed-login audit logging

File: `lib/auth/actions.ts`
Lines: 24-28 (`signIn`) and/or `lib/audit.ts`
Problem: AuditLog captures successful admin mutations only. Failed logins not recorded (OWASP A09).
Fix:
- Emit an audit-style record (or log to stdout with ipHash + timestamp + outcome) on every failed `signIn` attempt. Do not log passwords.
Verify: failed login produces a log/audit entry containing ipHash and timestamp, no plaintext password.

## Task 7 — Verify RLS production state (read-only)

No file edit. Read-only verification.
Problem: AGENTS.md says RLS enabled on all 15 tables via `prisma/migrations/rls_production_policies/migration.sql` applied to production Supabase only. Local migrations dir absent. Cannot verify locally.
Action:
- Confirm `relrowsecurity` and `relforcerowsecurity` true on all 15 tables in production Supabase (SQL Editor): `select relname, relrowsecurity, relforcerowsecurity from pg_class where relkind='r';`
- Confirm policies exist per table: `select * from pg_policies;`
- Confirm app never uses `createServiceRoleClient` for reads/writes except storage delete (server-only, intended).
Record result in task.md comments; no code change unless a table lacks RLS.

## Task 8 — Dependency audit

No file edit unless a fix is found.
Problem: `npm audit` / `osv-scanner` not run; dependency advisories unknown (OWASP A06).
Action:
- Run `npm audit --production` and `npx osv-scanner` (or equivalent). Record results. Upgrade any `high`/`critical` findings in a follow-up task.
Verify: command output saved; no unfixed critical vulnerabilities.

## Acceptance (all tasks)

- `npm run build` passes.
- `npm run lint` adds no new errors (baseline ~110 pre-existing).
- `npm test` passes.
- Task 1 payload test passes. Task 2 cross-origin 403 passes. Task 3 CSP header present in report-only. Task 4 cookie flags correct. Task 5 rate limit triggers. Task 6 failed-login logged. Task 7 RLS verified or remediation ticket filed. Task 8 audit recorded.

## Verification results (2026-11-12)

### Task 7 — RLS production state (read-only)

Queried production Supabase through `DIRECT_URL` with
`SET default_transaction_read_only=on`.

- 15/15 public tables report `relrowsecurity = true`.
- All 15 report `relforcerowsecurity = false`.
- 28 policies exist in schema `public` (matches
  `prisma/migrations/rls_production_policies/migration.sql`).
- `createServiceRoleClient` is used only for Supabase Storage upload/delete
  (`lib/storage/supabase.ts`, `lib/supabase/storage.ts`); no table reads or
  writes bypass RLS.
- Finding: RLS is enabled but not forced. The table owner (the Prisma/postgres
  role) bypasses RLS. Supabase `anon`/`authenticated` roles are not owners, so
  policies still apply to direct Supabase client access.
- Follow-up: decide whether to `FORCE ROW LEVEL SECURITY`; if so, Prisma must
  connect as a non-owner role or every query needs an RLS context.

### Task 8 — Dependency audit

- Before: `npm audit --production` reported 2 critical, 5 high.
- Upgraded `next` 16.3.3 → 16.4.6 and `dompurify` 3.4.14 → 3.4.17.
- Pinned `isomorphic-dompurify` 2.36.0 (jsdom 28) because 3.x pulls jsdom 30,
  which requires Node >= 22.22 and breaks the Node 22.14 local toolchain.
- After: 0 critical, 3 high (`prisma`, `@prisma/config`, `deepmerge-ts`). The
  available fix is Prisma 7.10.1, a major upgrade.
- Follow-up: plan the Prisma 7 migration; re-run the audit afterwards.
