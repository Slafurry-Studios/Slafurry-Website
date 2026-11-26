import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { runRetentionCleanup } from "@/lib/retention";

/** Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when that env var is set. */
function isAuthorized(header: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || !header) return false; // fail closed when not configured
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Scheduled in vercel.json. Never cached: every call must run the cleanup.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAuthorized(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runRetentionCleanup();
    console.log(JSON.stringify({ event: "retention_cleanup", ...result }));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Retention cleanup failed:", error);
    return NextResponse.json({ error: "Cleanup failed." }, { status: 500 });
  }
}
