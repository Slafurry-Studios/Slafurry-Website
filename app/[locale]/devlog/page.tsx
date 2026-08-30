import { useTranslations } from "next-intl";
import { IconChevronDown } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";
import { PostCard } from "@/components/posts/PostCard";
import { mockPosts } from "@/lib/mock/posts";

export default function DevlogPage() {
  const t = useTranslations("devlog");
  const tPost = useTranslations("post");
  const posts = mockPosts.filter((p) => p.category === "DEVLOG");

  return (
    <div className="px-6 py-16 md:px-10">
      <h1 className="text-center font-heading text-5xl tracking-wide">{t("heading")}</h1>
      <p className="mx-auto mt-4 max-w-xl text-center font-body text-sm text-neutral-600 dark:text-neutral-400">
        {t("intro")}
      </p>
      <p className="mx-auto mt-3 max-w-xl text-center font-body text-sm text-neutral-500 dark:text-neutral-500">
        {t("subIntro")}
      </p>

      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-8">
        {posts.map((post) => (
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
