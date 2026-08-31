import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug.trim()
        : slugify(title);

    // Ensure slug is unique
    const existing = await prisma.game.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "A game with this slug already exists." }, { status: 409 });
    }

    const game = await prisma.game.create({
      data: {
        slug,
        title,
        coverImage: body.coverImage || "",
        coverImageAlt: body.coverImageAlt || "",
        shortDesc: body.shortDesc || "",
        longDesc: body.longDesc || "",
        status: body.status || "IN_DEVELOPMENT",
        featured: Boolean(body.featured),
        order: typeof body.order === "number" ? body.order : 0,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        ogImage: body.ogImage || null,
        playLinks: {
          create: Array.isArray(body.playLinks)
            ? body.playLinks
                .filter((pl: { label?: string; url?: string }) => pl.label && pl.url)
                .map((pl: { label: string; url: string }) => ({
                  label: pl.label,
                  url: pl.url,
                }))
            : [],
        },
      },
      include: { playLinks: true },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error("Create game error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
