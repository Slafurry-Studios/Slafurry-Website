import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAudit } from "@/lib/audit";
import { authorizeAdmin } from "@/lib/auth/admin-guard";

export async function GET() {
  const auth = await authorizeAdmin();
  if (!auth.ok) return auth.response;

  try {
    const videos = await prisma.montageVideo.findMany({
      orderBy: { order: "asc" },
      include: { game: { select: { id: true, title: true } } },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("List montage videos error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export const POST = withAudit(
  async (request: Request) => {
    try {
      const body = await request.json();

      const label = typeof body.label === "string" ? body.label.trim() : "";
      const videoUrl = typeof body.videoUrl === "string" ? body.videoUrl.trim() : "";

      if (!label || !videoUrl) {
        return NextResponse.json(
          { error: "Label and video URL are required." },
          { status: 400 }
        );
      }

      const video = await prisma.montageVideo.create({
        data: {
          label,
          videoUrl,
          gameId: body.gameId || null,
          order: typeof body.order === "number" ? body.order : 0,
          isActive: typeof body.isActive === "boolean" ? body.isActive : true,
        },
        include: { game: { select: { id: true, title: true } } },
      });

      return NextResponse.json(video, { status: 201 });
    } catch (error) {
      console.error("Create montage video error:", error);
      return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
  },
  {
    action: "CREATE",
    entityType: "MontageVideo",
    getEntityId: () => null,
    getAfter: async (_id, body) => body as Record<string, unknown>,
  }
);
