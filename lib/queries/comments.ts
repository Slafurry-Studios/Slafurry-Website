import { prisma } from "@/lib/prisma";

export type PublicComment = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
};

/** Fetch approved comments for a post. */
export async function getApprovedPostComments(
  postId: string
): Promise<PublicComment[]> {
  const rows = await prisma.comment.findMany({
    where: { postId, targetType: "POST", status: "APPROVED" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      authorName: true,
      content: true,
      createdAt: true,
    },
  });
  return rows.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    content: r.content,
    createdAt: r.createdAt.toISOString(),
  }));
}

/** Fetch approved comments for a game. */
export async function getApprovedGameComments(
  gameId: string
): Promise<PublicComment[]> {
  const rows = await prisma.comment.findMany({
    where: { gameId, targetType: "GAME", status: "APPROVED" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      authorName: true,
      content: true,
      createdAt: true,
    },
  });
  return rows.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    content: r.content,
    createdAt: r.createdAt.toISOString(),
  }));
}
