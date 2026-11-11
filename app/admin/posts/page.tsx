import { prisma } from "@/lib/prisma";
import { PostsList } from "@/components/admin/PostsList";

// Admin halaman ini memerlukan sesi (dilindungi middleware), jangan
// di-prerender statis waktu build agar tidak memanggil database tanpa DB
// tersedia (CI / build tanpa live DB). Dirender per-request dengan sesi.
export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <PostsList
      posts={posts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        category: p.category,
        publishedAt: p.publishedAt?.toISOString() ?? null,
        tags: p.tags,
        isHidden: p.isHidden,
        commentCount: p._count.comments,
      }))}
    />
  );
}

