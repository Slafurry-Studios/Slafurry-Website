"use server";

import { prisma } from "@/lib/prisma";
import { CommentStatus } from "@prisma/client";
import { createHash } from "crypto";
import { headers } from "next/headers";

type CommentResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function submitComment(
  _prevState: CommentResult | null,
  formData: FormData
): Promise<CommentResult> {
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
    return { ok: false, error: "Comment is required (max 2000 chars)." };

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

  // Simple rate limit: max 3 pending/approved comments per IP per target
  const rateWhere = {
    ipHash,
    status: { in: [CommentStatus.PENDING, CommentStatus.APPROVED] },
    createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
    ...(postId ? { postId } : { gameId }),
  };
  const recentCount = await prisma.comment.count({ where: rateWhere });
  if (recentCount >= 3) {
    return {
      ok: false,
      error: "Too many comments. Please try again later.",
    };
  }

  await prisma.comment.create({
    data: {
      targetType: postId ? "POST" : "GAME",
      postId: postId ?? null,
      gameId: gameId ?? null,
      authorName,
      authorEmail,
      content,
      ipHash,
    },
  });

  return { ok: true, message: "Comment submitted! It will appear after moderation." };
}
