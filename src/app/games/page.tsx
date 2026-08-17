"use client";

import { useEffect, useState } from "react";
import type { Game } from "@/lib/types";

const SEASON = 2026;
const WEEKS = Array.from({ length: 18 }, (_, i) => i + 1);

export default function GamesPage() {
  const [week, setWeek] = useState<number | null>(null); // null = full season
  const [games, setGames] = useState<Game[] | null>(null);

  useEffect(() => {
    const url = week
      ? `/api/games?season=${SEASON}&week=${week}`
      : `/api/games?season=${SEASON}`;

    fetch(url)
      .then((res) => res.json())
      .then(setGames);
  }, [week]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl">Game Schedules</h1>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setWeek(null)}
          className={`border px-3 py-1 ${week === null ? "bg-black text-white" : ""}`}
        >
          Full season
        </button>
        {WEEKS.map((w) => (
          <button
            key={w}
            onClick={() => setWeek(w)}
            className={`border px-3 py-1 ${week === w ? "bg-black text-white" : ""}`}
          >
            Week {w}
          </button>
        ))}
      </div>

      {!games ? (
        <ul className="flex flex-col gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="flex flex-col gap-2 border p-3">
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-4 w-1/3"></div>
              <div className="skeleton h-4 w-1/4"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col gap-3">
          {games.map((game) => (
            <li key={game.id} className="border p-3">
              <p>
                {game.awayTeam.name} ({game.awayTeam.abbreviation}) @{" "}
                {game.homeTeam.name} ({game.homeTeam.abbreviation})
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
