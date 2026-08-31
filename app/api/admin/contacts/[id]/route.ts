import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const status = body.status as ContactStatus | undefined;
    if (!status || !["NEW", "READ", "REPLIED"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be NEW, READ, or REPLIED." },
        { status: 400 }
      );
    }

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
      select: { id: true, status: true },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Update contact error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete contact error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
