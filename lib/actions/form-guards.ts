"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";

import { ContactCategory } from "@prisma/client";

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
  "use server";
  const value = formData.get(honeypotField)?.toString().trim();
  if (value && value !== "") {
    return { isBot: true, reason: "Honeypot field filled." };
  }
  return { isBot: false, reason: "" };
}

/**
 * In-memory sliding-window rate limiter keyed by `scope` + hashed client IP.
 * Keys can be "comment", "contact" or "admin-login" — each has its own bucket.
 * `max` = max attempts, `windowMs` = time window in milliseconds.
 * Returns `{ allowed, remaining, reset, reason }`.
 *
 * The IP is hashed so buckets are per visitor without storing the address.
 * Per-instance only: behind multiple serverless instances the effective limit
 * is per instance, which is still a brute-force guard.
 */
const rateLimitBuckets = new Map<string, number[]>();

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export async function checkRateLimit(
  key: string,
  max = 3,
  windowMs = 60 * 60 * 1000,
  ip?: string
): Promise<RateLimitResult> {
  "use server";
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
  const now = Date.now();
  const cutoff = now - windowMs;
  const hits = (rateLimitBuckets.get(bucketKey) ?? []).filter((t) => t > cutoff);

  const allowed = hits.length < max;
  if (allowed) hits.push(now);
  rateLimitBuckets.set(bucketKey, hits);

  if (rateLimitBuckets.size > 10_000) {
    for (const [bucket, timestamps] of rateLimitBuckets) {
      const kept = timestamps.filter((t) => t > cutoff);
      if (kept.length === 0) rateLimitBuckets.delete(bucket);
      else rateLimitBuckets.set(bucket, kept);
    }
  }

  const oldest = hits[0] ?? now;
  return {
    allowed,
    remaining: Math.max(0, max - hits.length),
    reset: Math.floor((oldest + windowMs) / 1000),
    reason: allowed ? "" : `Rate limited. Max ${max} per ${windowMs / 60000}min.`,
  };
}