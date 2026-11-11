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
 * Cookie-based rate limiter.
 * Keys can be "comment" or "contact" — each gets its own cookie.
 * `max` = max attempts, `windowMs` = time window in milliseconds.
 * Returns `{ allowed, remaining, reset, reason }`.
 * 
 * The cookie format: `form-rate-{key}-{hash}` where hash is a short IP hash
 * so we can rate-limit per visitor without tracking them identitively.
 */
export async function checkRateLimit(
  key: string,
  max = 3,
  windowMs = 60 * 60 * 1000
): Promise<RateLimitResult> {
  "use server";
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipShort = createHash("sha256").update(ip).digest("hex").slice(0, 8);
  const cookieName = `form-rate-${key}-${ipShort}`;

  const cookies = hdrs.get("cookie") || "";
  const cookieMatch = cookies.match(new RegExp(`${cookieName}=([^;]+)`));
  const existingCount = cookieMatch ? parseInt(cookieMatch[1], 10) : 0;

  const now = Date.now();
  // Reset if past the window
  const resetAt = now - windowMs;
  const shouldReset = existingCount > 0 && existingCount <= resetAt;

  let allowed: boolean;
  let remaining: number;
  let reason = "";

  if (shouldReset) {
    // Window expired, start fresh
    allowed = max > 0;
    remaining = allowed ? max - 1 : 0;
  } else {
    const count = existingCount;
    allowed = count < max;
    remaining = max - 1 - count;
    if (!allowed) {
      reason = `Rate limited. Max ${max} per ${windowMs / 60000}min.`;
    }
  }

  const resetTime = Math.floor((now + windowMs) / 1000);

  // Set the cookie if allowed
  if (allowed) {
    const expires = new Date(Date.now() + windowMs).toUTCString();
    const newCookie = `form-rate-${key}-${ipShort}=${existingCount + 1}; Expires=${expires}; Path=/; SameSite=Strict; Secure`;
    hdrs.set("set-cookie", newCookie);
  }

  return { allowed, remaining, reset: resetTime, reason };
}