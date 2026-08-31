import { notFound } from "next/navigation";
import { PostCategory } from "@prisma/client";
import { ArticleReader } from "@/components/posts/ArticleReader";
import { getPostBySlug, getAdjacentPosts } from "@/lib/queries/posts";
import { getApprovedPostComments } from "@/lib/queries/comments";

export default async function DevlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, { prev, next }] = await Promise.all([
    getPostBySlug(slug, PostCategory.DEVLOG),
    getAdjacentPosts(slug, PostCategory.DEVLOG),
  ]);

  if (!post) notFound();

  const comments = await getApprovedPostComments(post.id);

  return (
    <ArticleReader
      post={post}
      prevPost={prev}
      nextPost={next}
      basePath="/devlog"
      comments={comments}
    />
  );
}
