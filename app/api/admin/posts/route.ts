import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PostCategory } from "@prisma/client";
import { createHash } from "crypto";
import { withAudit } from "@/lib/audit";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generatePreviewToken(): string {
  return createHash("sha256")
    .update(`${Date.now()}-${Math.random().toString(36).slice(2)}`)
    .digest("hex")
    .slice(0, 24);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    const where =
      category === "DEVLOG" || category === "NEWS"
        ? { category: category as PostCategory }
        : undefined;

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        tags: true,
        _count: { select: { comments: true } },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("List posts error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export const POST = withAudit(
  async (request: Request) => {
    try {
      const body = await request.json();

      const title = typeof body.title === "string" ? body.title.trim() : "";
      if (!title) {
        return NextResponse.json({ error: "Title is required." }, { status: 400 });
      }

      const category = body.category === "NEWS" ? "NEWS" : "DEVLOG";

      const slug =
        typeof body.slug === "string" && body.slug.trim()
          ? body.slug.trim()
          : slugify(title);

      const existing = await prisma.post.findUnique({ where: { slug } });
      if (existing) {
        return NextResponse.json(
          { error: "A post with this slug already exists." },
          { status: 409 }
        );
      }

      const tags = Array.isArray(body.tags)
        ? body.tags.filter((t: unknown) => typeof t === "string" && t.trim())
        : [];

      const publishedAt = body.status === "PUBLISHED" ? new Date() : null;

      const post = await prisma.post.create({
        data: {
          slug,
          title,
          coverImage: body.coverImage || "",
          coverImageAlt: body.coverImageAlt || "",
          excerpt: body.excerpt || "",
          content: body.content || "",
          category,
          tags,
          authorName: body.authorName || "Slafurry Studios",
          status: body.status || "DRAFT",
          publishedAt,
          metaTitle: body.metaTitle || null,
          metaDescription: body.metaDescription || null,
          ogImage: body.ogImage || null,
          previewToken: generatePreviewToken(),
          prevPostId: body.prevPostId || null,
          nextPostId: body.nextPostId || null,
        },
        include: {
          prevPost: { select: { id: true, title: true, slug: true } },
          nextPost: { select: { id: true, title: true, slug: true } },
        },
      });

      return NextResponse.json(post, { status: 201 });
    } catch (error) {
      console.error("Create post error:", error);
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  },
  {
    action: "CREATE",
    entityType: "Post",
    getEntityId: () => null,
    getAfter: async (_id, body) => body as Record<string, unknown>,
  }
);
