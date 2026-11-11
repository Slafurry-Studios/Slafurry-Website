import { NextResponse } from "next/server";
import { createHash } from "crypto";

type RedeemSuccess = {
  success: true;
  achievement: { key: string; title: string; description: string; icon: string };
};
type RedeemFailure = {
  success: false;
  error: string;
};
type RedeemResponse = RedeemSuccess | RedeemFailure;

// Hardcoded flag code — no DB query needed.
const EXPECTED_HASH = "d69819f2523f6f081845590e45c1959a49307a8f51fbd7cbe4beeda1383853f1"; // sha256("slafury-flag-2024")
const ACHIEVEMENT = {
  key: "cheating",
  title: "Flag Hunter",
  description: "Find and redeem a hidden flag code.",
  icon: "/mascot-default.png",
};

const MAX_ATTEMPTS = 20;
const RETA_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function sha256(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

function parseAttemptsCookie(value: string | null) {
  if (!value) return { count: 0, timestamp: 0 };
  const parts = value.split("|");
  const count = parseInt(parts[0], 10) || 0;
  const timestamp = parseInt(parts[1], 10) || 0;
  return { count, timestamp };
}

function isRateLimited(count: number, timestamp: number) {
  const now = Date.now();
  if (now - timestamp > RETA_WINDOW_MS) {
    return { limited: false, remaining: MAX_ATTEMPTS };
  }
  return {
    limited: count >= MAX_ATTEMPTS,
    remaining: Math.max(0, MAX_ATTEMPTS - count),
  };
}

function setRateLimitHeaders(resp: NextResponse, newCount: number, resetAt: number) {
  resp.cookies.set("redeem_attempts", `${newCount}|${Date.now()}`, {
    httpOnly: false,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
  });
  resp.headers.set("X-RateLimit-Remaining", String(MAX_ATTEMPTS - newCount));
  resp.headers.set("X-RateLimit-Reset", new Date(resetAt).toISOString());
}

export async function POST(
  request: Request
): Promise<NextResponse<RedeemResponse>> {
  try {
    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!code) {
      return NextResponse.json<RedeemFailure>(
        { success: false, error: "No code provided." },
        { status: 400 }
      );
    }

    // Rate limiting via cookie
    const cookieStore = await import("next/headers").then((m) => m.cookies());
    const { count, timestamp } = parseAttemptsCookie(
      cookieStore.get("redeem_attempts")?.value ?? null
    );
    const now = Date.now();
    const rateInfo = isRateLimited(count, timestamp);

    if (rateInfo.limited) {
      const resp = NextResponse.json<RedeemFailure>(
        { success: false, error: "Too many attempts. Try again later." },
        { status: 429 }
      );
      setRateLimitHeaders(resp, count, now + RETA_WINDOW_MS);
      return resp;
    }

    // Pure hash check — no database query
    const codeHash = sha256(code);
    if (codeHash !== EXPECTED_HASH) {
      const resp = NextResponse.json<RedeemFailure>(
        { success: false, error: "That code doesn't seem right." },
        { status: 404 }
      );
      setRateLimitHeaders(resp, count + 1, now + RETA_WINDOW_MS);
      return resp;
    }

    // Code is valid — respond with achievement data
    // Client-side handles unlock() + pushAchievementToast()
    const resp = NextResponse.json<RedeemSuccess>(
      { success: true, achievement: ACHIEVEMENT },
      { status: 200 }
    );
    setRateLimitHeaders(resp, count + 1, now + RETA_WINDOW_MS);
    return resp;
  } catch (error) {
    console.error("Achievement redeem error:", error);
    return NextResponse.json<RedeemFailure>(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
