"use client";

import { use, useEffect, useState } from "react";
import type { Game } from "@/lib/types";

const SEASON = 2026;

export default function TeamSchedulePage({
  params,
}: {
  params: Promise<{ abbreviation: string }>;
}) {
  const { abbreviation } = use(params);
  const [games, setGames] = useState<Game[] | null>(null);

  useEffect(() => {
    fetch(`/api/games?season=${SEASON}&team=${abbreviation}`)
      .then((res) => res.json())
      .then(setGames);
  }, [abbreviation]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl">{abbreviation} Schedule</h1>

      {!games ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {games.map((game) => (
            <li key={game.id} className="border p-3">
              <p>
                {game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation}
              </p>
              <p>
                Score:{" "}
                {game.status === "SCHEDULED"
                  ? "TBD"
                  : `${game.awayScore} - ${game.homeScore}`}
              </p>
              <p>Status: {game.status}</p>
              <p>Kickoff: {new Date(game.kickoffAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
