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

      const existing = await prisma.montageVideo.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Video not found." }, { status: 404 });
      }

      const video = await prisma.montageVideo.update({
        where: { id },
        data: {
          label: body.label ?? existing.label,
          videoUrl: body.videoUrl ?? existing.videoUrl,
          gameId: body.gameId !== undefined ? (body.gameId || null) : existing.gameId,
          order: typeof body.order === "number" ? body.order : existing.order,
          isActive: typeof body.isActive === "boolean" ? body.isActive : existing.isActive,
        },
        include: { game: { select: { id: true, title: true } } },
      });

      return NextResponse.json(video);
    } catch (error) {
      console.error("Update montage video error:", error);
      return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
  },
  {
    action: "UPDATE",
    entityType: "MontageVideo",
    getEntityId: (req) => extractIdFromUrl(req),
    getBefore: async (id) => snapshot(prisma.montageVideo, { id }),
    getAfter: async (id) => snapshot(prisma.montageVideo, { id }),
  }
);

export const DELETE = withAudit(
  async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;

      const existing = await prisma.montageVideo.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Video not found." }, { status: 404 });
      }

      await prisma.montageVideo.delete({ where: { id } });
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Delete montage video error:", error);
      return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
  },
  {
    action: "DELETE",
    entityType: "MontageVideo",
    getEntityId: (req) => extractIdFromUrl(req),
    getBefore: async (id) => snapshot(prisma.montageVideo, { id }),
  }
);
