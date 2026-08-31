import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

export async function POST(request: Request) {
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
}
