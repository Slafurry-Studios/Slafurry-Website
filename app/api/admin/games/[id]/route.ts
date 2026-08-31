import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.game.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }

    const title = typeof body.title === "string" ? body.title.trim() : existing.title;
    let slug = typeof body.slug === "string" && body.slug.trim()
      ? body.slug.trim()
      : existing.slug;

    // If title changed and slug wasn't explicitly provided, re-slugify
    if (body.title && !body.slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Ensure slug is unique (excluding current game)
    if (slug !== existing.slug) {
      const slugTaken = await prisma.game.findUnique({ where: { slug } });
      if (slugTaken) {
        return NextResponse.json({ error: "A game with this slug already exists." }, { status: 409 });
      }
    }

    // Handle play links: sync — delete existing, recreate from payload
    const playLinksData = Array.isArray(body.playLinks)
      ? body.playLinks
          .filter((pl: { label?: string; url?: string }) => pl.label && pl.url)
          .map((pl: { id?: string; label: string; url: string }) => ({
            label: pl.label,
            url: pl.url,
          }))
      : undefined;

    const game = await prisma.$transaction(async (tx) => {
      // Replace play links if provided
      if (playLinksData !== undefined) {
        await tx.playLink.deleteMany({ where: { gameId: id } });
      }

      const updated = await tx.game.update({
        where: { id },
        data: {
          slug,
          title,
          coverImage: body.coverImage ?? existing.coverImage,
          coverImageAlt: body.coverImageAlt ?? existing.coverImageAlt,
          shortDesc: body.shortDesc ?? existing.shortDesc,
          longDesc: body.longDesc ?? existing.longDesc,
          status: body.status ?? existing.status,
          featured: typeof body.featured === "boolean" ? body.featured : existing.featured,
          order: typeof body.order === "number" ? body.order : existing.order,
          metaTitle: body.metaTitle !== undefined ? body.metaTitle || null : existing.metaTitle,
          metaDescription: body.metaDescription !== undefined ? body.metaDescription || null : existing.metaDescription,
          ogImage: body.ogImage !== undefined ? body.ogImage || null : existing.ogImage,
          ...(playLinksData !== undefined && {
            playLinks: { create: playLinksData },
          }),
        },
        include: { playLinks: true },
      });

      return updated;
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("Update game error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.game.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }

    // PlayLinks cascade-delete via onDelete: Cascade in schema
    await prisma.game.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete game error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
