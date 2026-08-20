"use client";

import { useEffect, useState } from "react";
import type { Game } from "@/lib/types";

const MARQUEE_GAME_COUNT = 10;

export function UpcomingGames() {
  const [games, setGames] = useState<Game[] | null>(null);

  useEffect(() => {
    fetch("/api/games?season=2026")
      .then((res) => res.json())
      .then((allGames: Game[]) => {
        const upcoming = allGames.filter(
          (game) => new Date(game.kickoffAt) > new Date()
        );
        setGames(upcoming.slice(0, MARQUEE_GAME_COUNT));
      });
  }, []);

  if (!games) {
    return (
      <div className="w-full overflow-hidden border-y border-white/20 bg-zinc-900 py-3">
        <div className="flex w-full gap-10 px-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton h-4 w-40 shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }
  if (games.length === 0) return <p>No upcoming games.</p>;

  const track = [...games, ...games];

  return (
    <div className="w-full overflow-hidden border-y border-white/20 bg-zinc-900 py-3">
      <div className="animate-marquee flex w-max gap-10">
        {track.map((game, i) => (
          <span key={`${game.id}-${i}`} className="whitespace-nowrap text-sm">
            {`${game.awayTeam.abbreviation} @ ${game.homeTeam.abbreviation} W${game.week}, ${new Date(game.kickoffAt).toLocaleDateString()}`}
          </span>
        ))}
      </div>
    </div>
  );
}
