import type { Post } from "@prisma/client";
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";
import { formatDate } from "@/lib/format";

const CARD_WIDTH_BY_COUNT: Record<number, string> = {
  1: "w-full",
  2: "w-1/2",
  3: "w-1/3",
};

export function NewsPreview({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  const cards = posts.slice(0, 3);
  const count = cards.length;
  const cardWidth = CARD_WIDTH_BY_COUNT[count] ?? "w-full";

  return (
    <section className="flex min-h-screen flex-col justify-center px-6 py-16 md:px-10">
      <h2 className="text-center font-display text-4xl tracking-wide">News</h2>

      <div className="mx-auto mt-10 flex flex-row gap-6 max-w-7xl">
        {cards.map((post) => (
          <NewsCard key={post.id} post={post} cardWidth={cardWidth} />
        ))}
      </div>
    </section>
  );
}

function NewsCard({ post, cardWidth }: { post: Post; cardWidth: string }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className={`flex flex-col overflow-hidden pixel-border transition-all hover:scale-[1.02] hover:shadow-md ${cardWidth}`}
    >
      <div className="-mx-6 -mt-6 overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            className="aspect-[16/10] w-full object-cover"
          />
        ) : (
          <PlaceholderImage
            label={post.title}
            className="aspect-[16/10] w-full"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl font-semibold leading-snug">{post.title}</h3>
        <p className="mt-1 font-display text-xs text-neutral-500 dark:text-neutral-400">
          By {post.authorName}
          {post.publishedAt && ` | ${formatDate(post.publishedAt)}`}
        </p>
        <p className="mt-2 line-clamp-3 font-display text-xl text-neutral-600 dark:text-neutral-400">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
