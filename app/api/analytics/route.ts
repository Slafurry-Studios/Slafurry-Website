import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    // Top 10 pages by total views
    const topPages = await prisma.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    });

    // Top referrers
    const topReferrers = await prisma.pageView.groupBy({
      by: ["referrer"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
      where: { referrer: { not: null } },
    });

    // Device breakdown
    const deviceBreakdown = await prisma.pageView.groupBy({
      by: ["device"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 6,
    });

    // Convert device codes to readable labels
    const deviceLabels: Record<string, string> = {
      desktop: "Desktop",
      mobile: "Mobile",
      tablet: "Tablet",
      "": "Other",
    };

    const formattedDeviceBreakdown = (deviceBreakdown as any[]).map(
      (row: any) => ({
        device: deviceLabels[row.device] || row.device || "Other",
        count: row._count.path,
      })
    );

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
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}