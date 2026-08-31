import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      prevPost: { select: { id: true, title: true, slug: true } },
      nextPost: { select: { id: true, title: true, slug: true } },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl tracking-tight">Edit Post</h1>
      <PostForm
        initial={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          coverImage: post.coverImage,
          coverImageAlt: post.coverImageAlt,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          authorName: post.authorName,
          status: post.status,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          ogImage: post.ogImage ?? "",
          prevPostId: post.prevPostId,
          nextPostId: post.nextPostId,
          previewToken: post.previewToken,
          autosavedAt: post.autosavedAt?.toISOString() ?? null,
        }}
      />
    </div>
  );
}
