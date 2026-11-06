import { test, expect } from "@playwright/test";

test("homepage renders without error", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("body")).not.toBeEmpty();
  await expect(page.locator("h1, h2, h3").first()).toBeVisible();
});
