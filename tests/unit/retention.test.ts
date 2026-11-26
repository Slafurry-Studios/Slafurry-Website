import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const pageViewDelete = vi.fn();
const rateLimitDelete = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    pageView: { deleteMany: pageViewDelete },
    rateLimit: { deleteMany: rateLimitDelete },
  },
}));

const { pageViewCutoff, runRetentionCleanup, PAGE_VIEW_RETENTION_MONTHS } = await import("@/lib/retention");
const { GET } = await import("@/app/api/cron/cleanup/route");

describe("retention", () => {
  beforeEach(() => {
    pageViewDelete.mockReset().mockResolvedValue({ count: 5 });
    rateLimitDelete.mockReset().mockResolvedValue({ count: 2 });
  });

  it("cuts page views off 13 months back", () => {
    expect(PAGE_VIEW_RETENTION_MONTHS).toBe(13);
    expect(pageViewCutoff(new Date("2026-11-26T03:00:00Z")).toISOString()).toBe("2025-10-26T03:00:00.000Z");
  });

  it("deletes only rows older than the cutoffs", async () => {
    const now = new Date("2026-11-26T03:00:00Z");
    await expect(runRetentionCleanup(now)).resolves.toEqual({ pageViewsDeleted: 5, rateLimitsDeleted: 2 });
    expect(pageViewDelete).toHaveBeenCalledWith({ where: { createdAt: { lt: new Date("2025-10-26T03:00:00Z") } } });
    expect(rateLimitDelete).toHaveBeenCalledWith({ where: { resetAt: { lt: new Date("2026-11-25T03:00:00Z") } } });
  });
});

describe("GET /api/cron/cleanup", () => {
  const original = process.env.CRON_SECRET;
  beforeEach(() => {
    pageViewDelete.mockReset().mockResolvedValue({ count: 0 });
    rateLimitDelete.mockReset().mockResolvedValue({ count: 0 });
  });
  afterEach(() => {
    process.env.CRON_SECRET = original;
  });

  const call = (auth?: string) =>
    GET(new Request("http://localhost/api/cron/cleanup", { headers: auth ? { authorization: auth } : {} }));

  it("refuses when CRON_SECRET is not configured, even with a header", async () => {
    delete process.env.CRON_SECRET;
    expect((await call("Bearer ")).status).toBe(401);
    expect((await call("Bearer undefined")).status).toBe(401);
    expect(pageViewDelete).not.toHaveBeenCalled();
  });

  it("refuses a missing or wrong secret", async () => {
    process.env.CRON_SECRET = "s3cret-value";
    expect((await call()).status).toBe(401);
    expect((await call("Bearer wrong")).status).toBe(401);
    expect(pageViewDelete).not.toHaveBeenCalled();
  });

  it("runs with the right secret", async () => {
    process.env.CRON_SECRET = "s3cret-value";
    const res = await call("Bearer s3cret-value");
    expect(res.status).toBe(200);
    expect(pageViewDelete).toHaveBeenCalledTimes(1);
  });
});
