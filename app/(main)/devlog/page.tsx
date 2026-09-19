import { PostCategory } from "@prisma/client";
import { getPublishedPosts, getPostTags } from "@/lib/queries/posts";
import { PostListClient } from "@/components/posts/PostListClient";

export default async function DevlogPage() {
  
  const [posts, tags] = await Promise.all([
    getPublishedPosts(PostCategory.DEVLOG),
    getPostTags(PostCategory.DEVLOG),
  ]);

  return (
    <PostListClient
      posts={posts}
      tags={tags}
      heading="Devlog"
      intro="A semi-honest record of what we built, what we broke, and what we swore we'd fix &quot;next update.&quot;"
      subIntro="Progress not guaranteed, entertainment mostly guaranteed."
      searchPlaceholder="Search devlogs..."
    />
  );
}
