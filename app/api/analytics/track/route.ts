import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/actions/form-guards";
import { CONSENT_COOKIE } from "@/lib/analytics/consent";
import { classifyDevice, isBot, isTrackedPath, normalizePath, referrerHost } from "@/lib/analytics/track";

const MAX_PER_HOUR = 100;

// Always answer 204 for skipped pings: the client doesn't care, and a uniform
// response doesn't tell scripts which check they failed.
const skipped = () => new NextResponse(null, { status: 204 });

export async function POST(request: Request) {
  try {
    // Consent is enforced here, not just in the browser.
    const cookieHeader = request.headers.get("cookie") ?? "";
    const consent = cookieHeader
      .split(/;\s*/)
      .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
      ?.split("=")[1];
    if (consent !== "granted") return skipped();

    const userAgent = request.headers.get("user-agent");
    if (isBot(userAgent)) return skipped();

    const body = (await request.json().catch(() => null)) as { path?: unknown; referrer?: unknown } | null;
    const path = normalizePath(String(body?.path ?? "").trim());
    if (!isTrackedPath(path)) return skipped();

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const limit = await checkRateLimit("track-visit", MAX_PER_HOUR, 60 * 60 * 1000, ip);
    if (!limit.allowed) return new NextResponse(null, { status: 429 });

    const siteHost = request.headers.get("host");
    const referrer = referrerHost(typeof body?.referrer === "string" ? body.referrer : "", siteHost);
    // Set by Vercel; absent locally.
    const country = request.headers.get("x-vercel-ip-country")?.slice(0, 2).toUpperCase() || null;

    await prisma.pageView.create({
      data: { path, referrer, country, device: classifyDevice(userAgent) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Analytics track error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
