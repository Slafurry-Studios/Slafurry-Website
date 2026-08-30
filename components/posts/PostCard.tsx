import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";
import { formatDate } from "@/lib/format";
import type { MockPost } from "@/lib/mock/posts";

export function PostCard({
  post,
  compact = false,
}: {
  post: MockPost;
  compact?: boolean;
}) {
  const t = useTranslations("post");
  const locale = useLocale();
  const basePath = post.category === "DEVLOG" ? "/devlog" : "/news";

  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className="block overflow-hidden rounded-xl border border-neutral-300 transition-shadow hover:shadow-md dark:border-neutral-700"
    >
      <PlaceholderImage
        label={post.title}
        className={compact ? "aspect-[16/9] w-full" : "aspect-[21/9] w-full"}
      />
      <div className={compact ? "p-3" : "p-5"}>
        <h3
          className={
            compact
              ? "font-body text-sm font-semibold leading-snug"
              : "font-body text-lg font-semibold leading-snug"
          }
        >
          {post.title}
        </h3>
        <p className="mt-1 font-body text-xs text-neutral-500 dark:text-neutral-400">
          {t("by")} {post.authorName} | {formatDate(post.publishedAt, locale)} |{" "}
          {post.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xxs font-body mr-1">
              {tag}
            </span>
          ))} | {post.commentCount} {t("comments")}
        </p>
        <p
          className={
            compact
              ? "mt-1.5 line-clamp-2 font-body text-xs text-neutral-600 dark:text-neutral-400"
              : "mt-2 line-clamp-2 font-body text-sm text-neutral-600 dark:text-neutral-400"
          }
        >
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
