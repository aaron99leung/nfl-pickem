"use client";

import { useEffect, useState } from "react";
import type { Game } from "@/lib/types";

export function UpcomingGames() {
  const [games, setGames] = useState<Game[] | null>(null);

  useEffect(() => {
    fetch("/api/games?season=2026")
      .then((res) => res.json())
      .then((allGames: Game[]) => {
        const upcoming = allGames.filter(
          (game) => new Date(game.kickoffAt) > new Date()
        );
        setGames(upcoming.slice(0, 3));
      });
  }, []);

  if (!games) return <p>Loading...</p>;
  if (games.length === 0) return <p>No upcoming games.</p>;

  return (
    <ul className="flex flex-col gap-3">
      {games.map((game) => (
        <li key={game.id} className="border p-3">
          <p>
            {game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation}
          </p>
          <p>{new Date(game.kickoffAt).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}
