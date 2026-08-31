"use server";

import { prisma } from "@/lib/prisma";
import { ContactStatus, ContactCategory } from "@prisma/client";
import { checkHoneypot, checkRateLimit } from "@/lib/actions/form-guards";
import { headers } from "next/headers";
import { createHash } from "crypto";

type ContactResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

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

  return { ok: true, message: "Message submitted! It will be reviewed shortly." };
}