import { test, expect, type Page } from "@playwright/test";

// A signed-in account that is NOT in the AdminUser table / ADMIN_EMAILS.
// proxy.ts lets any session through, so these checks prove the per-route
// allowlist (lib/auth/admin-guard.ts) is doing its job.
const EMAIL = process.env.NON_ADMIN_TEST_EMAIL ?? "";
const PASSWORD = process.env.NON_ADMIN_TEST_PASSWORD ?? "";
const HAS_CREDS = Boolean(EMAIL && PASSWORD);
const SKIP_REASON = "requires NON_ADMIN_TEST_EMAIL / NON_ADMIN_TEST_PASSWORD (a non-admin account)";

// Ids that don't exist: if a guard ever regresses, these requests hit a 404
// instead of modifying real data.
const MISSING_ID = "e2e-authz-nonexistent";

async function loginAsNonAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Your email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  // Sign-in succeeds (it's a real account), but the dashboard must not render.
  await page.waitForURL(/\/admin(\/|$)/);
}

test.describe("Admin API without a session", () => {
  test("admin and analytics APIs return 401", async ({ request }) => {
    for (const path of ["/api/admin/settings", "/api/admin/posts", "/api/analytics"]) {
      expect((await request.get(path)).status(), path).toBe(401);
    }
  });
});

test.describe("Signed-in non-admin", () => {
  test.skip(!HAS_CREDS, SKIP_REASON);

  test.beforeEach(async ({ page }) => {
    await loginAsNonAdmin(page);
  });

  test("admin pages return 404 and show no admin content", async ({ page }) => {
    for (const path of ["/admin", "/admin/contacts", "/admin/audit-log", "/admin/analytics"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.getByRole("heading", { name: "Dashboard" })).toHaveCount(0);
    }
  });

  test("admin read APIs return 403", async ({ page }) => {
    for (const path of [
      "/api/admin/settings",
      "/api/admin/posts",
      "/api/admin/audit-log",
      "/api/admin/social-links",
      "/api/analytics",
    ]) {
      expect((await page.request.get(path)).status(), path).toBe(403);
    }
  });

  test("admin write APIs return 403", async ({ page }) => {
    const r = page.request;
    const checks: [string, Promise<{ status(): number }>][] = [
      ["autosave", r.patch(`/api/admin/posts/${MISSING_ID}/autosave`, { data: { content: "<p>x</p>" } })],
      ["settings", r.put("/api/admin/settings", { data: {} })],
      ["social link", r.delete(`/api/admin/social-links/${MISSING_ID}`)],
      ["reorder", r.post("/api/admin/games/reorder", { data: { draggedId: MISSING_ID, targetId: MISSING_ID } })],
      ["audited delete", r.delete(`/api/admin/games/${MISSING_ID}`)],
      ["upload", r.post("/api/admin/upload", { multipart: { bucket: "post-covers" } })],
    ];
    for (const [name, pending] of checks) {
      expect((await pending).status(), name).toBe(403);
    }
  });
});
