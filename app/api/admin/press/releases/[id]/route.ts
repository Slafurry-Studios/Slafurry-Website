import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.pressRelease.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Press release not found." }, { status: 404 });
    }

    const release = await prisma.pressRelease.update({
      where: { id },
      data: {
        outlet: body.outlet ?? existing.outlet,
        title: body.title ?? existing.title,
        url: body.url ?? existing.url,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : existing.publishedAt,
      },
    });

    return NextResponse.json(release);
  } catch (error) {
    console.error("Update press release error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.pressRelease.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Press release not found." }, { status: 404 });
    }

    await prisma.pressRelease.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete press release error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
