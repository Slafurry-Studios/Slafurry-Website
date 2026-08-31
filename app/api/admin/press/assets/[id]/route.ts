import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAudit, snapshot, extractIdFromUrl } from "@/lib/audit";

export const PUT = withAudit(
  async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;
      const body = await request.json();

      const existing = await prisma.pressKitAsset.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Asset not found." }, { status: 404 });
      }

      const type =
        body.type && ["LOGO", "BANNER", "CHARACTER"].includes(body.type)
          ? body.type
          : existing.type;

      const asset = await prisma.pressKitAsset.update({
        where: { id },
        data: {
          label: body.label ?? existing.label,
          type,
          fileUrl: body.fileUrl ?? existing.fileUrl,
          gameId: body.gameId !== undefined ? (body.gameId || null) : existing.gameId,
        },
        include: { game: { select: { id: true, title: true } } },
      });

      return NextResponse.json(asset);
    } catch (error) {
      console.error("Update press kit asset error:", error);
      return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
  },
  {
    action: "UPDATE",
    entityType: "PressKitAsset",
    getEntityId: (req) => extractIdFromUrl(req),
    getBefore: async (id) => snapshot(prisma.pressKitAsset, { id }),
    getAfter: async (id) => snapshot(prisma.pressKitAsset, { id }),
  }
);

export const DELETE = withAudit(
  async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;

      const existing = await prisma.pressKitAsset.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Asset not found." }, { status: 404 });
      }

      await prisma.pressKitAsset.delete({ where: { id } });
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Delete press kit asset error:", error);
      return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
  },
  {
    action: "DELETE",
    entityType: "PressKitAsset",
    getEntityId: (req) => extractIdFromUrl(req),
    getBefore: async (id) => snapshot(prisma.pressKitAsset, { id }),
  }
);
