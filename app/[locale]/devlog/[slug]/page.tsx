import { notFound } from "next/navigation";
import { ArticleReader } from "@/components/posts/ArticleReader";
import { getPostBySlug, getAdjacentPosts } from "@/lib/mock/posts";

export default async function DevlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (
    !post ||
    post.category !== "DEVLOG" ||
    post.status !== "PUBLISHED"
  ) {
    notFound();
  }

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <ArticleReader post={post} prevPost={prev} nextPost={next} basePath="/devlog" />
  );
}
