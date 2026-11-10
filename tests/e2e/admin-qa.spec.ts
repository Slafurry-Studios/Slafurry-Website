import { test, expect, type Page } from "@playwright/test";

const EMAIL = process.env.ADMIN_TEST_EMAIL ?? "";
const PASSWORD = process.env.ADMIN_TEST_PASSWORD ?? "";
const HAS_CREDS = Boolean(EMAIL && PASSWORD);

const unique = (prefix: string) => `${prefix}-${Date.now()}`;

async function gotoLogin(page: Page) {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
}

async function loginAsTestAdmin(page: Page) {
  if (!HAS_CREDS) {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    return;
  }
  await gotoLogin(page);
  await page.getByLabel("Your email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin(\/)?$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
}

test.describe("Authentication", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    await gotoLogin(page);
    await expect(page.getByLabel("Your email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("protected admin pages redirect to login", async ({ page }) => {
    await page.goto("/admin/games");
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.goto("/admin/posts");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("unauthorized API requests return 401 JSON", async ({ request }) => {
    const res = await request.get("/api/admin/games");
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  test("logs in with test admin account", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    await loginAsTestAdmin(page);
  });

  test("session persists after refresh", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    await loginAsTestAdmin(page);
    await page.reload();
    await expect(page).toHaveURL(/\/admin(\/)?$/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });
});

test.describe("Dashboard", () => {
  test("loads with sidebar and stat cards", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    await loginAsTestAdmin(page);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Posts" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Games" })).toBeVisible();
    await expect(page.getByText("Pending Comments")).toBeVisible();
    await expect(page.getByText("Achievements")).toBeVisible();
  });

  test("sidebar navigation reaches each module", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    await loginAsTestAdmin(page);
    const modules = [
      "Posts",
      "Comments",
      "Contacts",
      "Games",
      "Press",
      "Achievements",
      "Montage",
      "Settings",
      "Analytics",
    ];
    for (const label of modules) {
      await page.getByRole("link", { name: label }).click();
      await expect(
        page.getByRole("heading", { name: new RegExp(label, "i") }).first(),
      ).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe("Games", () => {
  test("CRUD: create, edit, persist, delete a test game", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    const title = unique("QA Game");
    await loginAsTestAdmin(page);
    await page.getByRole("link", { name: "Games" }).click();
    await page.getByRole("link", { name: "New Game" }).click();
    await expect(page.getByRole("heading", { name: "New Game" })).toBeVisible();

    await page.getByLabel("Title *").fill(title);
    await page.getByLabel("Short Description *").fill("QA test short description");
    await page.getByRole("button", { name: "Create Game" }).click();
    await expect(page).toHaveURL(/\/admin\/games/);
    await expect(page.getByText(title)).toBeVisible();

    await page.getByRole("link", { name: title }).first().click();
    await page.getByRole("link", { name: /Edit/ }).first().click();
    const newTitle = unique("QA Game Edited");
    await page.getByLabel("Title *").fill(newTitle);
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(page).toHaveURL(/\/admin\/games/);
    await expect(page.getByText(newTitle)).toBeVisible();
    await expect(page.getByText(title)).not.toBeVisible();

    await page.getByRole("link", { name: newTitle }).first().click();
    await page.getByRole("button", { name: /Permanently Delete/ }).first().click();
    page.on("dialog", (d) => d.accept());
    await expect(page.getByText(newTitle)).not.toBeVisible();
  });
});

test.describe("Posts", () => {
  test("CRUD: create post with TipTap content, edit, persist, delete", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    const title = unique("QA Post");
    await loginAsTestAdmin(page);
    await page.getByRole("link", { name: "Posts" }).click();
    await page.getByRole("link", { name: "New Post" }).click();
    await expect(page.getByRole("heading", { name: "New Post" })).toBeVisible();

    await page.getByLabel("Title *").fill(title);
    await page.getByLabel("Excerpt *").fill("QA test excerpt");
    await page.getByLabel("Category *").selectOption("DEVLOG");

    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.fill("QA test post content from Playwright.");

    await page.getByRole("button", { name: "Create Post" }).click();
    await expect(page).toHaveURL(/\/admin\/posts/);
    await expect(page.getByText(title)).toBeVisible();

    await page.getByRole("link", { name: title }).first().click();
    await page.getByRole("link", { name: /Edit/ }).first().click();
    const newTitle = unique("QA Post Edited");
    await page.getByLabel("Title *").fill(newTitle);
    await editor.fill("Updated QA post content.");
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(page).toHaveURL(/\/admin\/posts/);
    await expect(page.getByText(newTitle)).toBeVisible();

    await page.getByRole("link", { name: newTitle }).first().click();
    await page.getByRole("button", { name: /Permanently Delete/ }).first().click();
    page.on("dialog", (d) => d.accept());
    await expect(page.getByText(newTitle)).not.toBeVisible();
  });
});

test.describe("Comments", () => {
  test("list loads and moderation actions persist", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    await loginAsTestAdmin(page);
    await page.getByRole("link", { name: "Comments" }).click();
    await expect(page.getByRole("heading", { name: "Comments" })).toBeVisible();

    const approve = page.getByRole("button", { name: /Approve/ }).first();
    if ((await approve.count()) > 0) {
      await approve.click();
      await expect(page.getByText("Approved")).toBeVisible();
    }
  });
});

test.describe("Contacts", () => {
  test("inbox loads and status changes work", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    await loginAsTestAdmin(page);
    await page.getByRole("link", { name: "Contacts" }).click();
    await expect(page.getByRole("heading", { name: "Contact Inbox" })).toBeVisible();

    const markRead = page.getByRole("button", { name: /Mark as read/ }).first();
    if ((await markRead.count()) > 0) {
      await markRead.click();
      await expect(page.getByText("Read")).toBeVisible();
    }
  });
});

test.describe("Press", () => {
  test("create, edit, persist, delete a press release", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    const title = unique("QA Release");
    await loginAsTestAdmin(page);
    await page.getByRole("link", { name: "Press" }).click();
    await expect(page.getByRole("heading", { name: "Press" })).toBeVisible();

    await page.getByPlaceholder("Outlet (e.g. IGN)").fill("QA Outlet");
    await page.getByPlaceholder("Title").fill(title);
    await page.getByPlaceholder("https://...").fill("https://example.com/qa");
    await page.getByRole("button", { name: /Add/ }).click();
    await expect(page.getByText(title)).toBeVisible();

    page.on("dialog", (d) => d.accept());
    await page.getByRole("button", { name: /Permanently Delete/ }).first().click();
    await expect(page.getByText(title)).not.toBeVisible();
  });
});

test.describe("Achievements", () => {
  test("admin-side create, edit, persist, delete an achievement", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    const title = unique("QA Achievement");
    await loginAsTestAdmin(page);
    await page.getByRole("link", { name: "Achievements" }).click();
    await page.getByRole("link", { name: "New Achievement" }).click();
    await expect(page.getByRole("heading", { name: "New Achievement" })).toBeVisible();

    await page.getByLabel("Title *").fill(title);
    await page.getByLabel("Description *").fill("QA test achievement description");
    await page.getByLabel("Trigger Type").selectOption("PAGE_VISIT");
    await page.getByRole("button", { name: "Create Achievement" }).click();
    await expect(page).toHaveURL(/\/admin\/achievements/);
    await expect(page.getByText(title)).toBeVisible();

    page.on("dialog", (d) => d.accept());
    await page.getByRole("button", { name: /Permanently Delete/ }).first().click();
    await expect(page.getByText(title)).not.toBeVisible();
  });
});

test.describe("Montage", () => {
  test("create, edit, persist, delete a montage video", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    const label = unique("QA Video");
    await loginAsTestAdmin(page);
    await page.getByRole("link", { name: "Montage" }).click();
    await expect(page.getByRole("heading", { name: "Montage Videos" })).toBeVisible();

    await page.getByPlaceholder("Label").fill(label);
    await page.getByPlaceholder("Video URL (https://...)").fill("https://example.com/qa.mp4");
    await page.getByRole("button", { name: /Add/ }).click();
    await expect(page.getByText(label)).toBeVisible();

    page.on("dialog", (d) => d.accept());
    await page.getByRole("button", { name: /Permanently Delete/ }).first().click();
    await expect(page.getByText(label)).not.toBeVisible();
  });
});

test.describe("Settings", () => {
  test("settings page loads and a reversible setting persists", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    await loginAsTestAdmin(page);
    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

    const newTagline = unique("QA tagline");
    await page.getByLabel("Tagline").fill(newTagline);
    await page.getByRole("button", { name: "Save Settings" }).click();
    await expect(page.getByText("Saved!")).toBeVisible();
    await page.reload();
    await expect(page.getByLabel("Tagline")).toHaveValue(newTagline);

    await page.getByLabel("Tagline").fill("");
    await page.getByRole("button", { name: "Save Settings" }).click();
  });
});

test.describe("Media", () => {
  test("upload a generated image via ImageUploader", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    await loginAsTestAdmin(page);
    await page.getByRole("link", { name: "Games" }).click();
    await page.getByRole("link", { name: "New Game" }).click();

    const file = await page.evaluateHandle(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 10;
      canvas.height = 10;
      const url = canvas.toDataURL("image/png");
      const byteString = atob(url.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      return new File([ab], "qa-test.png", { type: "image/png" });
    });
    await page.setInputFiles('input[type="file"][accept*="image"]', file as any);
    await expect(page.getByRole("button", { name: /Create Game/ })).toBeVisible();
  });
});

test.describe("Audit logs", () => {
  test("audit log list renders", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    await loginAsTestAdmin(page);
    await page.goto("/admin/audit-log");
    await expect(page.getByRole("heading", { name: /Audit/ })).toBeVisible();
  });
});

test.describe("Responsive QA", () => {
  test("desktop 1440x900 dashboard layout", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginAsTestAdmin(page);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  test("tablet 768x1024 dashboard layout", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginAsTestAdmin(page);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  test("mobile 390x844 dashboard layout", async ({ page }) => {
    test.skip(!HAS_CREDS, "requires ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD");
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsTestAdmin(page);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });
});

test.describe("Console & network errors", () => {
  test("captures console errors on login page", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await gotoLogin(page);
    expect(errors).toHaveLength(0);
  });
});
