import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PERIOD_DAYS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const periodParam = searchParams.get("period") || "30d";
    const period = PERIOD_DAYS[periodParam] ? periodParam : "30d";
    const days = PERIOD_DAYS[period];

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const dateFilter = { createdAt: { gte: since } };

    // Top 10 pages by total views
    const topPages = await prisma.pageView.groupBy({
      by: ["path"],
      where: dateFilter,
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    });

    // Top referrers
    const topReferrers = await prisma.pageView.groupBy({
      by: ["referrer"],
      where: { ...dateFilter, referrer: { not: null } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    });

    // Device breakdown
    const deviceBreakdown = await prisma.pageView.groupBy({
      by: ["device"],
      where: dateFilter,
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 6,
    });

    const deviceLabels: Record<string, string> = {
      desktop: "Desktop",
      mobile: "Mobile",
      tablet: "Tablet",
      "": "Other",
    };

    const formattedDeviceBreakdown = (deviceBreakdown as any[]).map((row: any) => ({
      device: deviceLabels[row.device] || row.device || "Other",
      count: row._count.path,
    }));

    return NextResponse.json({
      topPages: topPages.map((row: any) => ({
        path: row.path,
        views: row._count.path,
      })),
      topReferrers: topReferrers.map((row: any) => ({
        referrer: row.referrer,
        views: row._count.path,
      })),
      deviceBreakdown: formattedDeviceBreakdown,
      period,
    });
  } catch (error) {
    console.error("Analytics dashboard error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}