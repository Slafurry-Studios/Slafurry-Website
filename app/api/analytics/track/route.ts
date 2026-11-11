import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { cookies } from "next/headers";
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

const MAX_FIELD_LEN = 512;
function clip(value: string | undefined, max = MAX_FIELD_LEN) {
  return value ? value.slice(0, max) : value;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const path = String(body?.path ?? "").trim();
    const referrer = clip(String(body?.referrer ?? "").trim() || undefined);
    const country = clip(body?.country ? String(body.country).trim() : undefined, 8);
    const device = clip(body?.device ? String(body.device).trim() : undefined, 32);

    if (!path) {
      return NextResponse.json({ error: "Path is required." }, { status: 400 });
    }

    if (!isWhitelisted(path)) {
      return NextResponse.json({ error: "Path not tracked." }, { status: 403 });
    }

    // Rate limit: max 100 pings per IP per hour
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);

    const rateKey = `track-visit-${ipHash}`;
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxAttempts = 100;

    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(rateKey)?.value;
    const cookieCount = cookieValue ? parseInt(cookieValue, 10) : 0;

    const allowed = cookieCount < maxAttempts;
    const reason = allowed ? "" : "Rate limited.";

    if (allowed) {
      await prisma.pageView.create({
        data: { path, referrer, country, device },
      });
    }

    const newCount = allowed ? cookieCount + 1 : cookieCount;
    const remaining = Math.max(0, maxAttempts - newCount);

    const response = NextResponse.json(
      { ok: allowed, remaining, reason },
      { status: allowed ? 200 : 429 }
    );

    // Set/refresh the counter cookie directly on the response.
    response.cookies.set(rateKey, String(newCount), {
      expires: new Date(Date.now() + windowMs),
      path: "/",
      sameSite: "strict",
      secure: true,
      httpOnly: true, // client JS doesn't need to read this
    });

    return response;
  } catch (error) {
    console.error("Analytics track error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}