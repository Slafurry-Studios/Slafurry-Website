import { getTranslations } from "next-intl/server";

import { GameCard } from "@/components/games/GameCard";
import { GameListClient } from "@/components/games/GameListClient";
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

      <GameListClient games={rest} moreText={tPost("more")} />
    </div>
  );
}
