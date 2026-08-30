import { useTranslations } from "next-intl";
import { IconChevronDown } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";
import { PostCard } from "@/components/posts/PostCard";
import { mockPosts } from "@/lib/mock/posts";

export default function NewsPage() {
  const t = useTranslations("news");
  const tPost = useTranslations("post");
  const posts = mockPosts.filter((p) => p.category === "NEWS");
  const [featured, ...rest] = posts;

  return (
    <div className="px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1fr_280px] md:items-start">
        <div>
          <h1 className="font-heading text-5xl tracking-wide">{t("heading")}</h1>
          <p className="mt-4 font-body text-sm text-neutral-600 dark:text-neutral-400">
            {t("intro")}
          </p>
          <p className="mt-3 font-body text-sm text-neutral-500 dark:text-neutral-500">
            {t("readAtOwnRisk")}
          </p>
        </div>

        {featured && <PostCard post={featured} compact />}
      </div>

      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-8 border-t border-neutral-200 pt-10 dark:border-neutral-800">
        {rest.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <PillButton icon={<IconChevronDown size={16} />} iconPosition="right">
          {tPost("more")}
        </PillButton>
      </div>
    </div>
  );
}
