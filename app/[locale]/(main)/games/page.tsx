import { getTranslations } from "next-intl/server";
import { IconChevronDown } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";
import { GameCard } from "@/components/games/GameCard";
import { getActiveGames } from "@/lib/queries/games";

export default async function GamesPage() {
  const t = await getTranslations("games");
  const tPost = await getTranslations("post");

  const games = await getActiveGames();

  const featured = games.find((g) => g.featured) ?? games[0];
  const rest = games.filter((g) => g.slug !== featured?.slug);

  return (
    <div className="px-6 py-16 md:px-10">
      <h1 className="text-center font-heading text-5xl tracking-wide">
        {t("heading")}
      </h1>

      <div className="mx-auto mt-10 max-w-4xl">
        {featured && <GameCard game={featured} featured />}
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((game) => (
          <GameCard key={game.id} game={game} />
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
