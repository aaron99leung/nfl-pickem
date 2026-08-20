"use client";

import { use, useEffect, useState } from "react";
import type { Game, Prediction } from "@/lib/types";
import { GameBox } from "@/components/GameBox";
import { Reveal } from "@/components/Reveal";
import { authClient } from "@/lib/auth-client";

const SEASON = 2026;

export default function TeamSchedulePage({
  params,
}: {
  params: Promise<{ abbreviation: string }>;
}) {
  const { abbreviation } = use(params);
  const [games, setGames] = useState<Game[] | null>(null);
  const [pickedTeamByGameId, setPickedTeamByGameId] = useState<Record<string, string>>({});
  const { data: session } = authClient.useSession();

  const hasSession = !!session;
  const [trackedHasSession, setTrackedHasSession] = useState(hasSession);
  if (hasSession !== trackedHasSession) {
    setTrackedHasSession(hasSession);
    if (!hasSession) {
      setPickedTeamByGameId({});
    }
  }

  useEffect(() => {
    fetch(`/api/games?season=${SEASON}&team=${abbreviation}`)
      .then((res) => res.json())
      .then(setGames);
  }, [abbreviation]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/predictions")
      .then((res) => (res.ok ? res.json() : []))
      .then((predictions: Prediction[]) => {
        const map: Record<string, string> = {};
        for (const prediction of predictions) {
          map[prediction.gameId] = prediction.pickedTeamId;
        }
        setPickedTeamByGameId(map);
      });
  }, [session]);

  const firstGame = games?.[0];
  const teamName = firstGame
    ? firstGame.homeTeam.abbreviation === abbreviation
      ? firstGame.homeTeam.name
      : firstGame.awayTeam.name
    : abbreviation;

  return (
    <div className="flex flex-col gap-16 p-4">
      <Reveal mode="mount">
        <h1 className="text-center text-5xl font-semibold py-16">{abbreviation} Schedule</h1>
        <p className="text-center text-lg text-white/70">Every game on the {teamName} schedule this season</p>
      </Reveal>

      {!games ? (
        <ul className="flex flex-col gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="flex flex-col gap-2 border p-3">
              <div className="skeleton h-4 w-1/2"></div>
              <div className="skeleton h-4 w-1/3"></div>
              <div className="skeleton h-4 w-1/4"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </li>
          ))}
        </ul>
      ) : (
        <Reveal key={abbreviation} mode="mount">
          <ul className="mx-auto flex w-full max-w-2xl flex-col gap-3">
            {games.map((game) => (
              <li key={game.id}>
                <GameBox game={game} pickedTeamId={pickedTeamByGameId[game.id]} />
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </div>
  );
}
