import { GameCard } from "@/components/games/GameCard";
import { GameListClient } from "@/components/games/GameListClient";
import { getActiveGames } from "@/lib/queries/games";

// ISR: data DB, halaman static — tanpa ini, game baru/ubah status baru
// kelihatan setelah rebuild (lihat catatan di app/(main)/page.tsx).
export const revalidate = 60;

export default async function GamesPage() {
  const games = await getActiveGames();

  const featured = games.find((g) => g.featured) ?? games[0];
  const rest = games.filter((g) => g.slug !== featured?.slug);

  return (
    <div className="px-6 py-16 md:px-10">
      <h1 className="text-center font-heading text-5xl tracking-wide">
        Check Out Our Games
      </h1>

      <div className="mx-auto mt-10 max-w-7xl">
        {featured && <GameCard game={featured} featured />}
      </div>

      <GameListClient games={rest} moreText="More" />
    </div>
  );
}
