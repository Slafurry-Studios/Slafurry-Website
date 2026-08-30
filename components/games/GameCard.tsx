import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";
import type { MockGame } from "@/lib/mock/games";

const STATUS_STYLE: Record<MockGame["status"], string> = {
  RELEASED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  UPCOMING: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  IN_DEVELOPMENT: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
};

function StatusBadge({ status }: { status: MockGame["status"] }) {
  const t = useTranslations("games");
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${STATUS_STYLE[status]}`}
    >
      {t(`status.${status}`)}
    </span>
  );
}

export function GameCard({
  game,
  featured = false,
}: {
  game: MockGame;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-neutral-300 transition-shadow hover:shadow-md dark:border-neutral-700"
    >
      <PlaceholderImage
        label={game.title}
        className={featured ? "aspect-[21/9] w-full" : "aspect-[16/9] w-full"}
      />
      <div className={featured ? "p-6" : "p-4"}>
        <h3 className={featured ? "font-heading text-3xl tracking-wide" : "font-heading text-2xl tracking-wide"}>
          {game.title}
        </h3>
        <div className="mt-1.5">
          <StatusBadge status={game.status} />
        </div>
        <p
          className={`mt-2 font-body text-neutral-600 dark:text-neutral-400 ${
            featured ? "text-sm" : "line-clamp-2 text-sm"
          }`}
        >
          {game.shortDesc}
        </p>
      </div>
    </Link>
  );
}
