"use server";

import { prisma } from "@/lib/prisma";
import { ContactStatus, ContactCategory } from "@prisma/client";
import { checkHoneypot, checkRateLimit } from "@/lib/actions/form-guards";
import { headers } from "next/headers";
import { createHash } from "crypto";

type ContactResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

// Resend configuration — set NEXT_PUBLIC_RESEND_API_KEY and/or RESEND_API_KEY
// in your environment to enable email notifications.
const RES_API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY || process.env.RESEND_API_KEY;
const RES_SENDER = "Slafurry Studios <onboarding@resend.dev>";

// Map form categories to delivery email addresses
const CATEGORY_EMAILS: Record<ContactCategory, string> = {
  GENERAL: "hello@slafurrystudios.com",
  BUSINESS: "business@slafurrystudios.com",
  PRESS: "press@slafurrystudios.com",
};

export async function submitContactMessage(
  _prevState: ContactResult | null,
  formData: FormData
): Promise<ContactResult> {
  // ─── Honeypot check ───
  const honeypotResult = await checkHoneypot(formData, "company");
  if (honeypotResult.isBot) {
    return { ok: false, error: "Spam detected." };
  }

  // ─── Rate limit ───
  const rateLimit = await checkRateLimit("contact");
  if (!rateLimit.allowed) {
    return { ok: false, error: rateLimit.reason };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const category = String(formData.get("category") ?? "GENERAL").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || name.length > 100)
    return { ok: false, error: "Name is required (max 100 chars." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "A valid email is required." };
  if (!message || message.length > 2000)
    return { ok: false, error: "Message is required (max 2000 chars." };

  // Hash IP for abuse tracing (not identity)
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);

  // Persist to database
  await prisma.contactMessage.create({
    data: {
      name,
      email,
      category: category as ContactCategory,
      message,
      status: "NEW" as ContactStatus,
      ipHash,
    },
  });

  // Attempt email notification via Resend (best-effort — failure does not block submit)
  try {
    if (RES_API_KEY) {
      const targetEmail = CATEGORY_EMAILS[category as ContactCategory] || CATEGORY_EMAILS.GENERAL;

      await fetch(`https://api.resend.com/emails`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RES_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RES_SENDER,
          to: [targetEmail],
          subject: `New contact form — ${category}`,
          text: `
Name: ${name}
Email: ${email}
Category: ${category}
Message: ${message}
IP hash: ${ipHash}
          `,
        }),
      });
    }
  } catch (err) {
    // Resend failure is non-blocking — the message is still saved to the DB
    console.error("Resend email failed:", err);
  }

  return { ok: true, message: "Message submitted! It will be reviewed shortly." };
}