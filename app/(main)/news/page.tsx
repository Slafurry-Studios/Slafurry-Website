import { PostCategory } from "@prisma/client";
import { getPublishedPosts, getPostTags } from "@/lib/queries/posts";
import { NewsListClient } from "@/components/posts/NewsListClient";

export default async function NewsPage() {
  
  const [posts, tags] = await Promise.all([
    getPublishedPosts(PostCategory.NEWS),
    getPostTags(PostCategory.NEWS),
  ]);

  return (
    <NewsListClient
      posts={posts}
      tags={tags}
      heading="News & Articles"
      intro="Official updates, unofficial rambling, and the occasional announcement we probably should have made sooner."
      subIntro="Read at your own risk."
      searchPlaceholder="Search news..."
    />
  );
}
