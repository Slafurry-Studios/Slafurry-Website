import { prisma } from "@/lib/prisma";

/**
 * How long page views are kept. The privacy page (app/(main)/privacy) states
 * this period, so change both together.
 */
export const PAGE_VIEW_RETENTION_MONTHS = 13;

/** Rate-limit rows whose window ended this long ago are no longer needed. */
const RATE_LIMIT_GRACE_MS = 24 * 60 * 60 * 1000;

export function pageViewCutoff(now = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - PAGE_VIEW_RETENTION_MONTHS);
  return cutoff;
}

/** Deletes data past its retention period. Run daily by /api/cron/cleanup. */
export async function runRetentionCleanup(now = new Date()) {
  const [pageViews, rateLimits] = await Promise.all([
    prisma.pageView.deleteMany({ where: { createdAt: { lt: pageViewCutoff(now) } } }),
    prisma.rateLimit.deleteMany({ where: { resetAt: { lt: new Date(now.getTime() - RATE_LIMIT_GRACE_MS) } } }),
  ]);
  return { pageViewsDeleted: pageViews.count, rateLimitsDeleted: rateLimits.count };
}
