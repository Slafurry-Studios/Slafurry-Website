import { IconChevronLeft, IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";
import { formatDate } from "@/lib/format";
import { CommentForm } from "@/components/posts/CommentForm";
import { CommentList } from "@/components/posts/CommentList";
import type { PostArticleData, PostCardData } from "@/lib/queries/posts";
import type { PublicComment } from "@/lib/queries/comments";

export function ArticleReader({
  post,
  prevPost,
  nextPost,
  basePath,
  comments,
}: {
  post: PostArticleData;
  prevPost: PostCardData | null;
  nextPost: PostCardData | null;
  basePath: string;
  comments: PublicComment[];
}) {
      return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:px-10">
      <Link
        href={basePath}
        aria-label="Back"
        className="flex h-11 w-11 items-center justify-center pixel-border-sm text-neutral-900 transition-colors dark:text-white"
      >
        <IconChevronLeft size={20} />
      </Link>

      <h1 className="mt-6 font-display text-4xl tracking-wide sm:text-5xl">
        {post.title}
      </h1>

      <p className="mt-2 font-display text-xs text-neutral-500 dark:text-neutral-400">
        "by" {post.authorName} |{" "}
        {post.publishedAt ? formatDate(post.publishedAt) : ""} |{" "}
        {post.tags[0] ?? "update"} | {post.commentCount} "Comments"
      </p>

      <div className="mt-6 overflow-hidden rounded-xl">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.coverImageAlt}
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          <PlaceholderImage label={post.title} className="aspect-[16/9] w-full" />
        )}
      </div>
      {post.coverImageAlt && (
        <p className="mt-3 font-display text-xs italic text-neutral-500 dark:text-neutral-400 text-center">
          {post.coverImageAlt}
        </p>
      )}

      <div
        className="mt-8 space-y-5 font-display prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <CommentList comments={comments} />

      <CommentForm postId={post.id} />

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <NavCard
          post={prevPost}
          basePath={basePath}
          direction="prev"
          label="Previous"
        />
        <NavCard
          post={nextPost}
          basePath={basePath}
          direction="next"
          label="Next"
        />
      </div>
    </article>
  );
}

function NavCard({
  post,
  basePath,
  direction,
  label,
}: {
  post: PostCardData | null;
  basePath: string;
  direction: "prev" | "next";
  label: string;
}) {
  if (!post) {
    return <div />;
  }

  const isNext = direction === "next";

  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className={`flex flex-col pixel-border px-6 py-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900 ${
        isNext ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <span className="flex items-center gap-1.5 font-display text-xs text-neutral-500 dark:text-neutral-400">
        {!isNext && <IconArrowLeft size={14} />}
        {label}
        {isNext && <IconArrowRight size={14} />}
      </span>
      <span className="line-clamp-1 font-display text-xl font-semibold">
        {post.title}
      </span>
    </Link>
  );
}
