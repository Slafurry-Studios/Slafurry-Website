import type { Post } from "@prisma/client";
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";
import { formatDate } from "@/lib/format";

export function NewsPreview({ posts }: { posts: Post[] }) {
  
  // Belum ada Post kategori NEWS yang PUBLISHED — sembunyiin section
  // daripada nampilin grid kosong.
  if (posts.length === 0) return null;

  // 2x2 — ambil max 4 post, kartu seragam tanpa featured gede.
  const cards = posts.slice(0, 2);

  return (
    <section className="flex min-h-screen flex-col justify-center px-6 py-16 md:px-10">
      <h2 className="text-center font-heading text-4xl tracking-wide">News</h2>

      <div className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-2">
        {cards.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

function NewsCard({ post }: { post: Post }) {

  return (
    <Link
      href={`/news/${post.slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-neutral-300 transition-all hover:scale-[1.02] hover:shadow-md dark:border-neutral-700"
    >
      <PlaceholderImage
        label={post.title}
        className="aspect-[16/10] w-full"
      />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-body text-xl font-semibold leading-snug">{post.title}</h3>
        <p className="mt-1 font-body text-xs text-neutral-500 dark:text-neutral-400">
          By {post.authorName}
          {post.publishedAt && ` | ${formatDate(post.publishedAt)}`}
        </p>
        <p className="mt-2 line-clamp-3 font-body text-xl text-neutral-600 dark:text-neutral-400">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
