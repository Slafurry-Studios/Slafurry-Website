"use client";

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";
import { GameCard } from "@/components/games/GameCard";
import type { GameData } from "@/lib/queries/games";

export function GameListClient({
  games,
  moreText,
}: {
  games: GameData[];
  moreText: string;
}) {
  // Tampilkan maksimal 6 game secara default
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleGames = games.slice(0, visibleCount);
  const hasMore = visibleCount < games.length;

  return (
    <>
      <div className="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <PillButton
            icon={<IconChevronDown size={16} />}
            iconPosition="right"
            onClick={() => setVisibleCount((prev) => prev + 6)}
          >
            {moreText}
          </PillButton>
        </div>
      )}
    </>
  );
}
