import { getTranslations } from "next-intl/server";
import { PostCategory } from "@prisma/client";
import { getPublishedPosts, getPostTags } from "@/lib/queries/posts";
import { PostListClient } from "@/components/posts/PostListClient";

export default async function DevlogPage() {
  const t = await getTranslations("devlog");

  const [posts, tags] = await Promise.all([
    getPublishedPosts(PostCategory.DEVLOG),
    getPostTags(PostCategory.DEVLOG),
  ]);

  return (
    <PostListClient
      posts={posts}
      tags={tags}
      heading={t("heading")}
      intro={t("intro")}
      subIntro={t("subIntro")}
      searchPlaceholder={t("searchPlaceholder")}
    />
  );
}
