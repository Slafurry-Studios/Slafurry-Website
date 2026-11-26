import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin } from "@/lib/auth/admin-guard";

export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { draggedId, targetId } = await request.json();

    const draggedPost = await prisma.post.findUnique({
      where: { id: draggedId },
    });
    const targetPost = await prisma.post.findUnique({
      where: { id: targetId },
    });

    if (!draggedPost || !targetPost) {
      return NextResponse.json({ error: "Posts not found." }, { status: 404 });
    }

    // Move dragged item to target position
    const draggedOrder = draggedPost.order;
    const targetOrder = targetPost.order;

    // Determine direction of movement
    const isMovingDown = draggedOrder < targetOrder;

    // Update all posts between dragged and target positions
    if (isMovingDown) {
      // Moving down: shift posts between dragged+1 and target up by 1
      await prisma.post.updateMany({
        where: {
          order: { gte: draggedOrder + 1, lte: targetOrder },
        },
        data: { order: { decrement: 1 } },
      });
    } else {
      // Moving up: shift posts between target and dragged-1 down by 1
      await prisma.post.updateMany({
        where: {
          order: { gte: targetOrder, lt: draggedOrder },
        },
        data: { order: { increment: 1 } },
      });
    }

    // Set dragged item to target position
    await prisma.post.update({
      where: { id: draggedId },
      data: { order: targetOrder },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder posts." },
      { status: 500 }
    );
  }
}
