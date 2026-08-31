"use server";

import { prisma } from "@/lib/prisma";
import { CommentStatus } from "@prisma/client";
import { checkHoneypot, checkRateLimit } from "@/lib/actions/form-guards";
import { headers } from "next/headers";
import { createHash } from "crypto";

type CommentResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function submitComment(
  _prevState: CommentResult | null,
  formData: FormData
): Promise<CommentResult> {
  // ─── Honeypot check ───
  const honeypotResult = await checkHoneypot(formData, "company");
  if (honeypotResult.isBot) {
    return { ok: false, error: "Spam detected." };
  }

  const postId = String(formData.get("postId") ?? "").trim() || undefined;
  const gameId = String(formData.get("gameId") ?? "").trim() || undefined;
  const authorName = String(formData.get("authorName") ?? "").trim();
  const authorEmail = String(formData.get("authorEmail") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!postId && !gameId) {
    return { ok: false, error: "Invalid comment target." };
  }
  if (postId && gameId) {
    return { ok: false, error: "Comment must target either a post or a game, not both." };
  }
  if (!authorName || authorName.length > 100)
    return { ok: false, error: "Name is required (max 100 chars)." };
  if (!authorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail))
    return { ok: false, error: "A valid email is required." };
  if (!content || content.length > 2000)
    return { ok: false, error: "Comment is required (max 2000 chars." };

  // ─── Rate limit ───
  const rateLimit = await checkRateLimit("comment");
  if (!rateLimit.allowed) {
    return { ok: false, error: rateLimit.reason };
  }

  // Validate target exists and is published
  if (postId) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.status !== "PUBLISHED") {
      return { ok: false, error: "Post not found." };
    }
  }
  if (gameId) {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return { ok: false, error: "Game not found." };
    }
  }

  // Hash IP for abuse tracing (not identity)
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);

  await prisma.comment.create({
    data: {
      targetType: postId ? "POST" : "GAME",
      postId: postId ?? null,
      gameId: gameId ?? null,
      authorName,
      authorEmail,
      content,
      ipHash,
      status: "PENDING",
    },
  });

  return { ok: true, message: "Comment submitted! It will appear after moderation." };
}