import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(body.content !== undefined && { content: body.content }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.coverImageAlt !== undefined && { coverImageAlt: body.coverImageAlt }),
        autosavedAt: new Date(),
      },
      select: { id: true, autosavedAt: true },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Autosave error:", error);
    return NextResponse.json(
      { error: "Autosave failed." },
      { status: 500 }
    );
  }
}
