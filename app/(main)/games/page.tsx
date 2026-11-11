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

  if (games.length === 0) {
    return (
      <div className="px-6 py-16 md:px-10">
        <h1 className="text-center font-display text-5xl tracking-wide">
          Check Out Our Games
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center font-display text-xl text-neutral-500 dark:text-neutral-400">
          No games available yet. Check out our{" "}
          <a
            href="https://slafurrystudios.itch.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 hover:text-neutral-950 dark:text-white dark:hover:text-neutral-100 underline underline-offset-2"
          >
            itch.io catalog
          </a>
          for playable builds.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-16 md:px-10">
      <h1 className="text-center font-display text-5xl tracking-wide">
        Check Out Our Games
      </h1>

      <div className="mx-auto mt-10 max-w-7xl">
        {featured && <GameCard game={featured} featured />}
      </div>

      <GameListClient games={rest} moreText="More" />
    </div>
  );
}
