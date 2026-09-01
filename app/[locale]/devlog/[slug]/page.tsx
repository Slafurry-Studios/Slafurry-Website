import { notFound } from "next/navigation";
import { PostCategory } from "@prisma/client";
import { ArticleReader } from "@/components/posts/ArticleReader";
import { getPostBySlug, getAdjacentPosts } from "@/lib/queries/posts";
import { getApprovedPostComments } from "@/lib/queries/comments";
import { getSiteSettings } from "@/lib/queries/home";

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

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const [post, settings] = await Promise.all([
    getPostBySlug(slug, PostCategory.DEVLOG),
    getSiteSettings(),
  ]);

  if (!post) {
    return {
      title: "Slafurry Studios - Devlog Article",
      description: "Development blog for Slafurry Studios games",
      openGraph: {
        images: [
          {
            url: "/og/default-banner.png",
            width: 1200,
            height: 630,
            alt: "Slafurry Studios",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
      },
    };
  }

  const ogImage = post.ogImage || settings?.defaultOgImage || "/og/default-banner.png";

  return {
    title: post.title,
    description: post.excerpt || (post.content?.substring(0, 200) || ""),
    openGraph: {
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
};