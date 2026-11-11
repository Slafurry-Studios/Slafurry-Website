import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkHoneypot, checkRateLimit } from "@/lib/actions/form-guards";
import { headers } from "next/headers";
import { createHash } from "crypto";

export async function POST(request: Request) {
  try {
    // Headers must be read before any other awaits (Next.js restriction).
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);

    const formData = await request.formData();

    // Honeypot check
    const honeypotResult = await checkHoneypot(formData, "company");
    if (honeypotResult.isBot) {
      return NextResponse.json({ error: "Spam detected." }, { status: 400 });
    }

    const postId = String(formData.get("postId") ?? "").trim() || undefined;
    const gameId = String(formData.get("gameId") ?? "").trim() || undefined;
    const authorName = String(formData.get("authorName") ?? "").trim();
    const authorEmail = String(formData.get("authorEmail") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    if (!postId && !gameId) {
      return NextResponse.json({ error: "Invalid comment target." }, { status: 400 });
    }
    if (postId && gameId) {
      return NextResponse.json({ error: "Comment must target either a post or a game, not both." }, { status: 400 });
    }
    if (!authorName || authorName.length > 100) {
      return NextResponse.json({ error: "Name is required (max 100 chars)." }, { status: 400 });
    }
    if (!authorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }
    if (!content || content.length > 2000) {
      return NextResponse.json({ error: "Comment is required (max 2000 chars)." }, { status: 400 });
    }

    // Rate limit
    const rateLimit = await checkRateLimit("comment", 3, 60 * 60 * 1000, ip);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: rateLimit.reason }, { status: 429 });
    }

    // Validate target exists and is published
    if (postId) {
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post || post.status !== "PUBLISHED") {
        return NextResponse.json({ error: "Post not found." }, { status: 404 });
      }
    }
    if (gameId) {
      const game = await prisma.game.findUnique({ where: { id: gameId } });
      if (!game) {
        return NextResponse.json({ error: "Game not found." }, { status: 404 });
      }
    }

    const comment = await prisma.comment.create({
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

    return NextResponse.json({ success: true, commentId: comment.id }, { status: 201 });
  } catch (error: any) {
    console.error("Comment submit error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong." }, { status: 500 });
  }
}
