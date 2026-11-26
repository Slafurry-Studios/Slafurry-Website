import { prisma } from "@/lib/prisma";

export const ANALYTICS_PERIODS = { "7d": 7, "30d": 30, "90d": 90 } as const;
export type AnalyticsPeriod = keyof typeof ANALYTICS_PERIODS;

export function normalizePeriod(value: string | null | undefined): AnalyticsPeriod {
  return value && value in ANALYTICS_PERIODS ? (value as AnalyticsPeriod) : "30d";
}

export type AnalyticsSummary = {
  period: AnalyticsPeriod;
  totalViews: number;
  topPages: { path: string; views: number }[];
  /** Referring site hostname; null means direct / internal / unknown. */
  topReferrers: { referrer: string | null; views: number }[];
  deviceBreakdown: { device: string; count: number }[];
};

const DEVICE_LABELS: Record<string, string> = { desktop: "Desktop", mobile: "Mobile", tablet: "Tablet" };

/** Admin-only data: callers must have passed authorizeAdmin()/requireAdminPage(). */
export async function getAnalyticsSummary(period: AnalyticsPeriod): Promise<AnalyticsSummary> {
  const since = new Date(Date.now() - ANALYTICS_PERIODS[period] * 24 * 60 * 60 * 1000);
  const where = { createdAt: { gte: since } };

  const [totalViews, topPages, topReferrers, devices] = await Promise.all([
    prisma.pageView.count({ where }),
    prisma.pageView.groupBy({
      by: ["path"],
      where,
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ["referrer"],
      where,
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ["device"],
      where,
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
    }),
  ]);

  return {
    period,
    totalViews,
    topPages: topPages.map((r) => ({ path: r.path, views: r._count.path })),
    topReferrers: topReferrers.map((r) => ({ referrer: r.referrer, views: r._count.path })),
    deviceBreakdown: devices.map((r) => ({
      device: DEVICE_LABELS[r.device ?? ""] ?? "Other",
      count: r._count.path,
    })),
  };
}
