import { NextResponse } from "next/server";

type CspReport = {
  "document-uri"?: string;
  "violated-directive"?: string;
  "effective-directive"?: string;
  "blocked-uri"?: string;
};

/**
 * Sink for `Content-Security-Policy-Report-Only` violations while the policy is
 * being rolled out. Logs a compact line; never throws back to the browser.
 */
export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as unknown;
    const candidate = Array.isArray(raw) ? raw[0] : raw;

    if (candidate && typeof candidate === "object") {
      const record = candidate as Record<string, unknown>;
      const report = (record["csp-report"] ?? record) as CspReport;
      console.warn(
        JSON.stringify({
          event: "csp_violation",
          directive: report["effective-directive"] ?? report["violated-directive"],
          blocked: report["blocked-uri"],
          document: report["document-uri"],
          timestamp: new Date().toISOString(),
        })
      );
    }
  } catch {
    // Ignore malformed reports.
  }

  return new NextResponse(null, { status: 204 });
}
