import { prisma } from "@/lib/prisma";
import { CommentStatus } from "@prisma/client";
import { CommentsList } from "@/components/admin/CommentsList";

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeTab =
    status === "APPROVED" || status === "REJECTED" || status === "ALL"
      ? status
      : "PENDING";

  const where =
    activeTab === "ALL" ? undefined : { status: activeTab as CommentStatus };

  const [comments, counts] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        post: { select: { id: true, title: true, slug: true } },
        game: { select: { id: true, title: true, slug: true } },
      },
    }),
    prisma.comment.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const countMap = Object.fromEntries(
    counts.map((c) => [c.status, c._count.id])
  );
  const total = Object.values(countMap).reduce((a, b) => a + b, 0);

  return (
    <CommentsList
      activeTab={activeTab}
      countMap={countMap}
      total={total}
      comments={comments.map((c) => ({
        id: c.id,
        targetType: c.targetType,
        authorName: c.authorName,
        authorEmail: c.authorEmail,
        content: c.content,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
        postId: c.postId,
        postTitle: c.post?.title ?? null,
        gameId: c.gameId,
        gameTitle: c.game?.title ?? null,
      }))}
    />
  );
}
