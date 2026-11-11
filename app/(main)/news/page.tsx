import { PostCategory } from "@prisma/client";
import { getFeaturedPosts, getPublishedPosts, getPostTags } from "@/lib/queries/posts";
import { NewsListClient } from "@/components/posts/NewsListClient";

// ISR: artikel baru muncul tanpa rebuild (maks. 60 detik).
export const revalidate = 10;

export default async function NewsPage() {
  
  const [featuredPosts, posts, tags] = await Promise.all([
    getFeaturedPosts(PostCategory.NEWS, 3),
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
      featuredPosts={featuredPosts}
    />
  );
}
