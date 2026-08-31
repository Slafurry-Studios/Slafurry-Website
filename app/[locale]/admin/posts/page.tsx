import { prisma } from "@/lib/prisma";
import { PostsList } from "@/components/admin/PostsList";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeTab = category === "NEWS" ? "NEWS" : "DEVLOG";

  const posts = await prisma.post.findMany({
    where: { category: activeTab },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <PostsList
      activeTab={activeTab}
      posts={posts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        category: p.category,
        publishedAt: p.publishedAt?.toISOString() ?? null,
        tags: p.tags,
        commentCount: p._count.comments,
      }))}
    />
  );
}
