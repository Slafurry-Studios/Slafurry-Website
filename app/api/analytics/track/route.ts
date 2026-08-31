import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

const WHITELISTED_PATHS = [
  "/en/games",
  "/en/devlog",
  "/en/devlog/",
  "/en/news",
  "/en/news/",
  "/en/games/",
  "/",
  "/en",
];

function isWhitelisted(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "");
  return WHITELISTED_PATHS.some((p) => p.replace(/\/+$/, "") === normalized);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const path = (body?.path || "").trim();
    const referrer = (body?.referrer || "").trim() || undefined;
    const country = body?.country ? String(body.country).trim() : undefined;
    const device = body?.device ? String(body.device).trim() : undefined;

    if (!path) {
      return NextResponse.json(
        { error: "Path is required." },
        { status: 400 }
      );
    }

    // Whitelist check
    if (!isWhitelisted(path)) {
      return NextResponse.json(
        { error: "Path not tracked." },
        { status: 403 }
      );
    }

    // Rate limit: max 100 pings per IP per hour
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);

    const rateKey = `track-visit-${ipHash}`;
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxAttempts = 100;

    const cookieStore = await import("next/headers").then((m) => m.cookies);
    const cookies = await cookieStore();
    const cookieValue = cookies.get(rateKey)?.value;
    const cookieCount = cookieValue ? parseInt(cookieValue, 10) : 0;

    let allowed = true;
    let remaining = maxAttempts - cookieCount;
    let reason = "";

    if (cookieCount >= maxAttempts) {
      allowed = false;
      reason = "Rate limited.";
    }

    if (allowed) {
      // Increment counter via cookie
      const newCount = cookieCount + 1;
      const expires = new Date(Date.now() + windowMs).toUTCString();
      const newCookie = `${rateKey}=${newCount}; Expires=${expires}; Path=/; SameSite=Strict; Secure`;
      const headers = new Headers(request.headers);
      headers.set("set-cookie", newCookie);

      // Write PageView row
      await prisma.pageView.create({
        data: {
          path,
          referrer,
          country,
          device,
        },
      });
    }

    return NextResponse.json({
      ok: allowed,
      remaining,
      reason,
    });
  } catch (error) {
    console.error("Analytics track error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}