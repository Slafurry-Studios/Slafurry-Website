import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";
import { mockNewsPosts } from "@/lib/mock/home";

export function NewsPreview() {
  const t = useTranslations("home");
  const tPost = useTranslations("post");
  const [featured, ...rest] = mockNewsPosts;

  return (
    <section className="flex min-h-screen flex-col justify-center border-t border-neutral-200 px-6 py-16 dark:border-neutral-800 md:px-10">
      <h2 className="text-center font-heading text-4xl tracking-wide">{t("news")}</h2>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
        <NewsCard post={featured} tPost={tPost} large />
        <div className="grid gap-6">
          {rest.map((post) => (
            <NewsCard key={post.slug} post={post} tPost={tPost} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsCard({
  post,
  tPost,
  large,
}: {
  post: (typeof mockNewsPosts)[number];
  tPost: ReturnType<typeof useTranslations>;
  large?: boolean;
}) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-neutral-300 transition-shadow hover:shadow-md dark:border-neutral-700"
    >
      <PlaceholderImage
        label={post.title}
        className={large ? "aspect-[16/10] w-full" : "aspect-[16/9] w-full"}
      />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-body text-base font-semibold leading-snug">{post.title}</h3>
        <p className="mt-1 font-body text-xs text-neutral-500 dark:text-neutral-400">
          {tPost("by")} {post.author} | {post.date}
        </p>
        <p className="mt-2 line-clamp-3 font-body text-sm text-neutral-600 dark:text-neutral-400">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
