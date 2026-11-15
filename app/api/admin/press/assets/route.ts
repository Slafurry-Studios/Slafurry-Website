import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAudit } from "@/lib/audit";

export async function GET() {
  try {
    const assets = await prisma.pressKitAsset.findMany({
      orderBy: [{ order: "asc" }, { label: "asc" }],
      include: { game: { select: { id: true, title: true } } },
    });
    return NextResponse.json(assets);
  } catch (error) {
    console.error("List press kit assets error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

async function getNextAssetOrder(): Promise<number> {
  const max = await prisma.pressKitAsset.aggregate({
    _max: { order: true },
  });
  return (max._max.order ?? -1) + 1;
}

export const POST = withAudit(
  async (request: Request) => {
    try {
      const body = await request.json();

      const label = typeof body.label === "string" ? body.label.trim() : "";
      const fileUrl = typeof body.fileUrl === "string" ? body.fileUrl.trim() : "";

      if (!label || !fileUrl) {
        return NextResponse.json(
          { error: "Label and file URL are required." },
          { status: 400 }
        );
      }

      const type = ["LOGO", "BANNER", "CHARACTER"].includes(body.type)
        ? body.type
        : "LOGO";

      const asset = await prisma.pressKitAsset.create({
        data: {
          label,
          type,
          fileUrl,
          gameId: body.gameId || null,
          order: await getNextAssetOrder(),
        },
        include: { game: { select: { id: true, title: true } } },
      });

      return NextResponse.json(asset, { status: 201 });
    } catch (error) {
      console.error("Create press kit asset error:", error);
      return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
  },
  {
    action: "CREATE",
    entityType: "PressKitAsset",
    getEntityId: () => null,
    getAfter: async (_id, body) => body as Record<string, unknown>,
  }
);
