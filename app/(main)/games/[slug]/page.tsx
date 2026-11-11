import { notFound } from "next/navigation";
import { followStoredRedirect } from "@/lib/queries/redirects";
import Image from "next/image";
import { getGameBySlug } from "@/lib/queries/games";
import { getApprovedGameComments } from "@/lib/queries/comments";
import { getSiteSettings } from "@/lib/queries/home";
import Link from "next/link";
import { CommentForm } from "@/components/posts/CommentForm";
import { CommentList } from "@/components/posts/CommentList";

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    await followStoredRedirect(`/games/${slug}`);
    notFound();
  }

  const comments = await getApprovedGameComments(game.id);

  return (
    <div className="prose lg:prose-xl max-w-2xl mx-auto px-4 py-12">
      {game.coverImage && (
        <Image
          src={game.coverImage}
          alt={game.coverImageAlt}
          width={1200}
          height={675}
          className="aspect-[16/9] w-full rounded-xl object-cover"
        />
      )}

      <h1 className="text-3xl font-display tracking-wide mb-6 mt-8">
        {game.title}

        <span
          className={`inline-block rounded-full px-2.5 py-0.5 font-display text-xs font-medium ${
            game.status === "RELEASED"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
              : game.status === "UPCOMING"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                : "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          }`}
        >
          {game.status}
        </span>
      </h1>

      <div className="mt-8 space-y-5 font-display prose prose-neutral dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: game.longDesc || "" }} />

      {game.playLinks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-display mb-4">Play on</h2>
          <div className="grid grid-cols-2 gap-2">
            {game.playLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-md bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-xl font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                {link.label}
                <svg
                  className="ml-2 -mr-1.5 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/games"
          className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-xl font-medium text-white hover:bg-primary-700"
        >
          ← Back to game list
        </Link>
      </div>

      <CommentList comments={comments} />

      <CommentForm gameId={game.id} />
    </div>
  );
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    await followStoredRedirect(`/games/${slug}`);
    notFound();
  }

  const settings = await getSiteSettings();
  const ogImage = game.ogImage || (settings?.defaultOgImage || "/slafurry-logo.png");

  return {
    title: game.title,
    description: game.shortDesc,
    openGraph: {
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: game.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
};