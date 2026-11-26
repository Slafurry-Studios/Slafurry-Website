import { test, expect } from "@playwright/test";

// Missing pages must return a real 404, not a 200 soft-404. A route-group
// `loading.tsx` (or any rendered <Suspense> fallback above the page) starts
// streaming before notFound() runs and locks the status to 200.
for (const path of [
  "/this-page-does-not-exist",
  "/games/no-such-game",
  "/news/no-such-post",
  "/devlog/no-such-post",
]) {
  test(`${path} returns 404`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
  });
}
