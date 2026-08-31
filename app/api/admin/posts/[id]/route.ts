import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAudit, snapshot, extractIdFromUrl } from "@/lib/audit";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const PUT = withAudit(
  async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;
      const body = await request.json();

      const existing = await prisma.post.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Post not found." }, { status: 404 });
      }

      const title =
        typeof body.title === "string" ? body.title.trim() : existing.title;
      let slug =
        typeof body.slug === "string" && body.slug.trim()
          ? body.slug.trim()
          : existing.slug;

      if (body.title && !body.slug) {
        slug = slugify(title);
      }

      if (slug !== existing.slug) {
        const slugTaken = await prisma.post.findUnique({ where: { slug } });
        if (slugTaken) {
          return NextResponse.json(
            { error: "A post with this slug already exists." },
            { status: 409 }
          );
        }
      }

      const tags =
        body.tags !== undefined
          ? Array.isArray(body.tags)
            ? body.tags.filter((t: unknown) => typeof t === "string" && t.trim())
            : existing.tags
          : undefined;

      let publishedAt = existing.publishedAt;
      if (body.status === "PUBLISHED" && existing.status === "DRAFT") {
        publishedAt = new Date();
      } else if (body.status === "DRAFT") {
        publishedAt = null;
      }

      const post = await prisma.post.update({
        where: { id },
        data: {
          slug,
          title,
          coverImage: body.coverImage ?? existing.coverImage,
          coverImageAlt: body.coverImageAlt ?? existing.coverImageAlt,
          excerpt: body.excerpt ?? existing.excerpt,
          content: body.content ?? existing.content,
          category: body.category ?? existing.category,
          ...(tags !== undefined && { tags }),
          authorName: body.authorName ?? existing.authorName,
          status: body.status ?? existing.status,
          publishedAt,
          metaTitle:
            body.metaTitle !== undefined ? body.metaTitle || null : existing.metaTitle,
          metaDescription:
            body.metaDescription !== undefined
              ? body.metaDescription || null
              : existing.metaDescription,
          ogImage:
            body.ogImage !== undefined ? body.ogImage || null : existing.ogImage,
          prevPostId:
            body.prevPostId !== undefined
              ? body.prevPostId || null
              : existing.prevPostId,
          nextPostId:
            body.nextPostId !== undefined
              ? body.nextPostId || null
              : existing.nextPostId,
        },
        include: {
          prevPost: { select: { id: true, title: true, slug: true } },
          nextPost: { select: { id: true, title: true, slug: true } },
        },
      });

      return NextResponse.json(post);
    } catch (error) {
      console.error("Update post error:", error);
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  },
  {
    action: "UPDATE",
    entityType: "Post",
    getEntityId: (req) => extractIdFromUrl(req),
    getBefore: async (id) => snapshot(prisma.post, { id }),
    getAfter: async (id) => snapshot(prisma.post, { id }),
  }
);

export const DELETE = withAudit(
  async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;

      const existing = await prisma.post.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Post not found." }, { status: 404 });
      }

      await prisma.post.delete({ where: { id } });
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Delete post error:", error);
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  },
  {
    action: "DELETE",
    entityType: "Post",
    getEntityId: (req) => extractIdFromUrl(req),
    getBefore: async (id) => snapshot(prisma.post, { id }),
  }
);
