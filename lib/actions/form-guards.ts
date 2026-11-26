// Plain server-only helpers. Deliberately not a "use server" module: that would
// expose checkRateLimit (which accepts an arbitrary IP) as a callable action.
import { createHash } from "crypto";
import { headers } from "next/headers";
import { hit } from "@/lib/security/rate-limit";


type HoneypotResult = { isBot: boolean; reason: string };
type RateLimitResult = { allowed: boolean; remaining: number; reset: number; reason: string };

/**
 * Honeypot check — returns true if the honeypot field was filled (likely a bot).
 * The form should have a hidden field named `company` (or whatever you pass as `honeypotField`).
 * It's positioned off-screen via CSS, so real users won't fill it,
 * but bots that auto-detect all form fields will.
 * 
 * @param formData - The FormData from the submitted form
 * @param honeypotField - The name attribute of the hidden honeypot field (default: "company")
 * @returns {HoneypotResult} - `isBot: true` if the honeypot was filled, otherwise `false`
 */
export async function checkHoneypot(
  formData: FormData,
  honeypotField = "company"
): Promise<HoneypotResult> {
  const value = formData.get(honeypotField)?.toString().trim();
  if (value && value !== "") {
    return { isBot: true, reason: "Honeypot field filled." };
  }
  return { isBot: false, reason: "" };
}

/**
 * Rate limiter keyed by `scope` + hashed client IP ("comment", "contact",
 * "admin-login", "track-visit" each get their own bucket). `max` attempts per
 * `windowMs`. Returns `{ allowed, remaining, reset, reason }`.
 *
 * Counts live in Postgres in production (shared across serverless instances)
 * and in memory in dev/tests; see lib/security/rate-limit.ts. Only the IP's
 * hash is used as a key, never the address itself.
 */
function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export async function checkRateLimit(
  key: string,
  max = 3,
  windowMs = 60 * 60 * 1000,
  ip?: string
): Promise<RateLimitResult> {
  let resolvedIp = ip;
  if (!resolvedIp) {
    try {
      const headersList = await headers();
      resolvedIp =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headersList.get("x-real-ip") ??
        "unknown";
    } catch {
      resolvedIp = "unknown";
    }
  }

  const bucketKey = `${key}:${hashIp(resolvedIp ?? "unknown")}`;
  const { count, resetAtMs } = await hit(bucketKey, max, windowMs);
  const allowed = count <= max;

  return {
    allowed,
    remaining: Math.max(0, max - count),
    reset: Math.floor(resetAtMs / 1000),
    reason: allowed ? "" : `Rate limited. Max ${max} per ${windowMs / 60000}min.`,
  };
}
