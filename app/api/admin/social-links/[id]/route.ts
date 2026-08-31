import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.socialLink.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Social link not found." }, { status: 404 });
    }

    const section =
      body.section && ["COMMUNITY", "CONTACT", "FOOTER"].includes(body.section)
        ? body.section
        : existing.section;

    const link = await prisma.socialLink.update({
      where: { id },
      data: {
        platform: body.platform ?? existing.platform,
        label: body.label ?? existing.label,
        url: body.url ?? existing.url,
        section,
        order: typeof body.order === "number" ? body.order : existing.order,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Update social link error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.socialLink.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Social link not found." }, { status: 404 });
    }

    await prisma.socialLink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete social link error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
