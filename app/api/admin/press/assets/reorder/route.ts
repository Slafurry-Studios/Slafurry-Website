import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { draggedId, targetId } = await request.json();

    const draggedAsset = await prisma.pressKitAsset.findUnique({
      where: { id: draggedId },
    });
    const targetAsset = await prisma.pressKitAsset.findUnique({
      where: { id: targetId },
    });

    if (!draggedAsset || !targetAsset) {
      return NextResponse.json({ error: "Press kit assets not found." }, { status: 404 });
    }

    // Move dragged item to target position
    const draggedOrder = draggedAsset.order;
    const targetOrder = targetAsset.order;

    // Determine direction of movement
    const isMovingDown = draggedOrder < targetOrder;

    // Update all assets between dragged and target positions
    if (isMovingDown) {
      // Moving down: shift assets between dragged+1 and target up by 1
      await prisma.pressKitAsset.updateMany({
        where: {
          order: { gte: draggedOrder + 1, lte: targetOrder },
        },
        data: { order: { decrement: 1 } },
      });
    } else {
      // Moving up: shift assets between target and dragged-1 down by 1
      await prisma.pressKitAsset.updateMany({
        where: {
          order: { gte: targetOrder, lt: draggedOrder },
        },
        data: { order: { increment: 1 } },
      });
    }

    // Set dragged item to target position
    await prisma.pressKitAsset.update({
      where: { id: draggedId },
      data: { order: targetOrder },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder press kit assets." },
      { status: 500 }
    );
  }
}
