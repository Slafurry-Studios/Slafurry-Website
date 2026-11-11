import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import type { GameData } from "@/lib/queries/games";

const STATUS_STYLE: Record<GameData["status"], string> = {
  RELEASED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  UPCOMING: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  IN_DEVELOPMENT: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
};

function StatusBadge({ status }: { status: GameData["status"] }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 font-display text-xs font-medium ${STATUS_STYLE[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export function GameCard({
  game,
  featured = false,
}: {
  game: GameData;
  featured?: boolean;
}) {
  const youtubeEmbedUrl = getYoutubeEmbedUrl(game.playLinks);
  const hasYoutube = Boolean(youtubeEmbedUrl);

  return (
    <Link
      href={`/games/${game.slug}`}
      className="flex flex-col overflow-hidden pixel-border press-btn game-hover"
    >
      <div className="-m-2 overflow-hidden relative group">
        {/* Image — always rendered, mandatory fallback */}
        {game.coverImage ? (
          <img
            src={game.coverImage}
            alt={game.coverImageAlt}
            className={
              "w-full object-cover transition-opacity duration-300 " +
              (hasYoutube ? "group-hover:opacity-30" : "") +
              (featured ? "aspect-[21/9]" : "aspect-[16/9]")
            }
          />
        ) : (
          <PlaceholderImage
            label={game.title}
            className={
              "w-full transition-opacity duration-300 " +
              (hasYoutube ? "group-hover:opacity-30" : "") +
              (featured ? "aspect-[21/9]" : "aspect-[16/9]")
            }
          />
        )}

        {/* YouTube preview — optional, auto-plays on hover; image stays as fallback */}
        {hasYoutube && (
          <iframe
            className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in"
            src={`${youtubeEmbedUrl}?autoplay=1&mute=1&rel=0&modestbranding=1&showinfo=0${typeof window !== 'undefined' ? `&origin=${window.location.origin}` : ''}`}
            title={`${game.title} preview`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      <div className={featured ? "p-6" : "p-4"}>
        <h3 className={featured ? "font-display text-3xl tracking-wide" : "font-display text-2xl tracking-wide"}>
          {game.title}
        </h3>
        <div className="mt-1.5">
          <StatusBadge status={game.status} />
        </div>
        <p
          className={`mt-2 font-display text-neutral-600 dark:text-neutral-400 ${
            featured ? "text-xl" : "line-clamp-2 text-xl"
          }`}
        >
          {game.shortDesc}
        </p>
      </div>
    </Link>
  );
}
