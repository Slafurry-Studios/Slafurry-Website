import { getTranslations } from "next-intl/server";
import { PostCategory } from "@prisma/client";
import { getPublishedPosts, getPostTags } from "@/lib/queries/posts";
import { NewsListClient } from "@/components/posts/NewsListClient";

export default async function NewsPage() {
  const t = await getTranslations("news");

  const [posts, tags] = await Promise.all([
    getPublishedPosts(PostCategory.NEWS),
    getPostTags(PostCategory.NEWS),
  ]);

  return (
    <NewsListClient
      posts={posts}
      tags={tags}
      heading={t("heading")}
      intro={t("intro")}
      subIntro={t("readAtOwnRisk")}
      searchPlaceholder={t("searchPlaceholder")}
    />
  );
}
