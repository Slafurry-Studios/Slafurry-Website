import { useTranslations, useLocale } from "next-intl";
import { IconChevronLeft, IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";
import { formatDate } from "@/lib/format";
import type { MockPost } from "@/lib/mock/posts";

export function ArticleReader({
  post,
  prevPost,
  nextPost,
  basePath,
}: {
  post: MockPost;
  prevPost: MockPost | null;
  nextPost: MockPost | null;
  basePath: string;
}) {
  const t = useTranslations("post");
  const locale = useLocale();

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:px-10">
      <Link
        href={basePath}
        aria-label="Back"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-900 text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-neutral-900"
      >
        <IconChevronLeft size={20} />
      </Link>

      <h1 className="mt-6 font-heading text-4xl tracking-wide sm:text-5xl">
        {post.title}
      </h1>

      <p className="mt-2 font-body text-xs text-neutral-500 dark:text-neutral-400">
        {t("by")} {post.authorName} | {formatDate(post.publishedAt, locale)} |{" "}
        {post.tags[0] ?? "update"} | {post.commentCount} {t("comments")}
      </p>

      <div className="mt-6 overflow-hidden rounded-xl">
        <PlaceholderImage label={post.title} className="aspect-[16/9] w-full" />
      </div>
      <p className="mt-3 font-body text-xs italic text-neutral-500 dark:text-neutral-400">
        {post.imageCaption}
      </p>

      <div className="mt-8 space-y-5 font-body text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {post.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <NavCard
          post={prevPost}
          basePath={basePath}
          direction="prev"
          label={t("previous")}
        />
        <NavCard
          post={nextPost}
          basePath={basePath}
          direction="next"
          label={t("next")}
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
  post: MockPost | null;
  basePath: string;
  direction: "prev" | "next";
  label: string;
}) {
  if (!post) {
    // Placeholder kosong biar grid gak "loncat" pas di ujung awal/akhir list.
    return <div />;
  }

  const isNext = direction === "next";

  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className={`flex flex-col rounded-full border border-neutral-900 px-6 py-3 transition-colors hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900 ${
        isNext ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <span className="flex items-center gap-1.5 font-body text-xs text-neutral-500 dark:text-neutral-400">
        {!isNext && <IconArrowLeft size={14} />}
        {label}
        {isNext && <IconArrowRight size={14} />}
      </span>
      <span className="line-clamp-1 font-body text-sm font-semibold">
        {post.title}
      </span>
    </Link>
  );
}
