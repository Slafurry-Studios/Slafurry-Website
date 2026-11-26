import { describe, it, expect } from "vitest";

// Runs only against the local test database (`npm run db:up` + `npm run test:db`),
// never against whatever DATABASE_URL a developer's .env points at.
const isLocalTestDb = (process.env.DATABASE_URL ?? "").includes("localhost:5432/slafurry_test");

describe.skipIf(!isLocalTestDb)("postgres rate-limit store", async () => {
  const { postgresHit } = await import("@/lib/security/rate-limit");
  const key = () => `test:${Date.now()}-${Math.random().toString(36).slice(2)}`;

  it("counts up within a window", async () => {
    const k = key();
    const now = Date.now();
    expect((await postgresHit(k, 60_000, now)).count).toBe(1);
    expect((await postgresHit(k, 60_000, now + 1)).count).toBe(2);
    const third = await postgresHit(k, 60_000, now + 2);
    expect(third.count).toBe(3);
    expect(third.resetAtMs).toBe(now + 60_000);
  });

  it("starts a new window once the old one expires", async () => {
    const k = key();
    const now = Date.now();
    await postgresHit(k, 1_000, now);
    await postgresHit(k, 1_000, now + 10);
    const fresh = await postgresHit(k, 1_000, now + 1_000);
    expect(fresh.count).toBe(1);
    expect(fresh.resetAtMs).toBe(now + 2_000);
  });

  it("is atomic under concurrent hits", async () => {
    const k = key();
    const now = Date.now();
    const results = await Promise.all(Array.from({ length: 20 }, () => postgresHit(k, 60_000, now)));
    expect(results.map((r) => r.count).sort((a, b) => a - b)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });
});
