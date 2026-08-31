import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CommentStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const status = body.status as CommentStatus | undefined;
    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be APPROVED or REJECTED." },
        { status: 400 }
      );
    }

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Comment not found." }, { status: 404 });
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { status },
      select: { id: true, status: true },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Update comment error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Comment not found." }, { status: 404 });
    }

    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
