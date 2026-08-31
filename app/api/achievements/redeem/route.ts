import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

type RedeemSuccess = {
  success: true;
  achievement: { key: string; title: string; description: string; icon: string };
};
type RedeemFailure = {
  success: false;
  error: string;
};
type RedeemResponse = RedeemSuccess | RedeemFailure;

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

function buildAttemptsCookie(count: number): string {
  const timestamp = Date.now();
  return `${count}|${timestamp}`;
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

    // --- Rate limiting via cookie ---
    const cookieStore = await import("next/headers").then((mod) => mod.cookies());
    const attemptCookie = cookieStore.get("redeem_attempts")?.value || "";
    const { count, timestamp } = parseAttemptsCookie(attemptCookie);

    const now = Date.now();
    let limited = false;
    let remaining = MAX_ATTEMPTS;
    let resetAt = now + RETA_WINDOW_MS;

    if (now - timestamp > RETA_WINDOW_MS) {
      limited = false;
      remaining = MAX_ATTEMPTS;
    } else {
      limited = count >= MAX_ATTEMPTS;
      remaining = MAX_ATTEMPTS - count;
    }

    // Helper to build a failure response with rate-limit headers
    function failureResp(message: string, status: number): NextResponse<RedeemFailure> {
      const resp = NextResponse.json<RedeemFailure>(
        { success: false, error: message },
        { status }
      );
      resp.cookies.set("redeem_attempts", `${count + 1}|${Date.now()}`, {
        httpOnly: false,
        maxAge: 60,
        path: "/",
        sameSite: "lax",
      });
      resp.headers.set("X-RateLimit-Remaining", String(MAX_ATTEMPTS - count - 1));
      resp.headers.set("X-RateLimit-Reset", new Date(resetAt).toISOString());
      return resp;
    }

    // Helper to build a success response with rate-limit headers
    function successResp(achievement: RedeemSuccess["achievement"]): NextResponse<RedeemSuccess> {
      const newCount = count + 1;
      const resp = NextResponse.json<RedeemSuccess>(
        { success: true, achievement },
        { status: 200 }
      );
      resp.cookies.set("redeem_attempts", `${newCount}|${Date.now()}`, {
        httpOnly: false,
        maxAge: 60,
        path: "/",
        sameSite: "lax",
      });
      resp.headers.set("X-RateLimit-Remaining", String(MAX_ATTEMPTS - newCount));
      resp.headers.set("X-RateLimit-Reset", new Date(Date.now() + RETA_WINDOW_MS).toISOString());
      return resp;
    }

    const codeHash = sha256(code);

    const achievement = await prisma.achievement.findFirst({
      where: {
        triggerType: "FLAG_CODE",
        isActive: true,
        flagHash: codeHash,
      },
      select: {
        id: true,
        key: true,
        title: true,
        description: true,
        icon: true,
      },
    });

    if (!achievement) {
      return failureResp("That code doesn't seem right.", 404);
    }

    return successResp({
      key: achievement.key,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
    });
  } catch (error) {
    console.error("Achievement redeem error:", error);
    return NextResponse.json<RedeemFailure>(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}