import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/auth/admin-guard";
import { getAnalyticsSummary, normalizePeriod } from "@/lib/queries/analytics";

export async function GET(request: Request) {
  const auth = await authorizeAdmin();
  if (!auth.ok) return auth.response;

  try {
    const period = normalizePeriod(new URL(request.url).searchParams.get("period"));
    return NextResponse.json(await getAnalyticsSummary(period));
  } catch (error) {
    console.error("Analytics dashboard error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
