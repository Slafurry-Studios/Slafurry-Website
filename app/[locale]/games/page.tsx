import { useTranslations } from "next-intl";
import { IconChevronDown } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";
import { GameCard } from "@/components/games/GameCard";
import { mockGames, getGameBySlug } from "@/lib/mock/games";

const ACTIVE_GAME_STATUS = ["RELEASED", "UPCOMING"];

export default function GamesPage() {
  const t = useTranslations("games");
  const tPost = useTranslations("post");

  const activeGames = mockGames.filter(
    (g) => ACTIVE_GAME_STATUS.includes(g.status),
  );
  const sortedGames = activeGames.sort(
    (a, b) => a.order - b.order,
  );

  const featured = sortedGames.find((g) => g.featured) ?? sortedGames[0];
  const rest = sortedGames.filter((g) => g.slug !== featured.slug);

  return (
    <div className="px-6 py-16 md:px-10">
      <h1 className="text-center font-heading text-5xl tracking-wide">
        {t("heading")}
      </h1>

      <div className="mx-auto mt-10 max-w-4xl">
        <GameCard game={featured} featured />
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <PillButton icon={<IconChevronDown size={16} />} iconPosition="right">
          {tPost("more")}
        </PillButton>
      </div>
    </div>
  );
}
