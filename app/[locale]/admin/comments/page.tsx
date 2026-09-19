import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { CommentsList } from "@/components/admin/CommentsList";

export default async function AdminCommentsPage(props: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const { page, status: rawStatus, search } = await props.searchParams;
  const parsedPage = Number.parseInt(page ?? "1", 10);
  const currentPage = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
  const pageSize = 20;

  const activeStatus =
    rawStatus === "APPROVED" || rawStatus === "REJECTED" || rawStatus === "ALL"
      ? rawStatus
      : "PENDING";

  const where: Prisma.CommentWhereInput = {};
  if (activeStatus !== "ALL") where.status = activeStatus;
  if (search) {
    where.OR = [
      { authorName: { contains: search, mode: "insensitive" } },
      { authorEmail: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const [comments, counts, totalCount] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        post: { select: { id: true, title: true, slug: true } },
        game: { select: { id: true, title: true, slug: true } },
      },
    }),
    prisma.comment.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.comment.count({ where }),
  ]);

  const countMap = Object.fromEntries(
    counts.map((c) => [c.status, c._count.id])
  );
  const totalPages = Math.ceil(totalCount / pageSize);
  const absoluteTotal = Object.values(countMap).reduce((a, b) => a + b, 0);

  return (
    <CommentsList
      countMap={countMap}
      total={absoluteTotal}
      page={currentPage}
      totalPages={totalPages}
      activeStatus={activeStatus}
      searchQuery={search}
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

