"use client";

import { use, useEffect, useState } from "react";
import type { Game, Prediction } from "@/lib/types";
import { GameBox } from "@/components/GameBox";
import { Reveal } from "@/components/Reveal";
import { authClient } from "@/lib/auth-client";
import { CURRENT_SEASON, formatSeasonLabel } from "@/lib/season";

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
    fetch(`/api/games?season=${CURRENT_SEASON}&team=${abbreviation}`)
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

  async function handlePick(gameId: string, pickedTeamId: string) {
    const res = await fetch("/api/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, pickedTeamId }),
    });
    if (!res.ok) throw new Error("Failed to save pick");
    setPickedTeamByGameId((prev) => ({ ...prev, [gameId]: pickedTeamId }));
  }

  async function handleClearPick(gameId: string) {
    const res = await fetch(`/api/predictions?gameId=${gameId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to clear pick");
    setPickedTeamByGameId((prev) => {
      const next = { ...prev };
      delete next[gameId];
      return next;
    });
  }

  const firstGame = games?.[0];
  const teamName = firstGame
    ? firstGame.homeTeam.abbreviation === abbreviation
      ? firstGame.homeTeam.name
      : firstGame.awayTeam.name
    : abbreviation;
  const season = firstGame?.season ?? CURRENT_SEASON;

  return (
    <div className="flex flex-col gap-16 p-4">
      <Reveal mode="mount">
        <h1 className="text-center text-5xl font-semibold py-16">{abbreviation} Schedule</h1>
        <p className="text-center text-lg text-white/70">Every game on the {teamName} schedule this season</p>
        <p className="pt-2 text-center text-xs font-semibold uppercase tracking-wide text-white/40">
          Season {formatSeasonLabel(season)}
        </p>
        {session && (
          <p className="pt-2 text-center text-sm text-white/40">
            Tap the yellow PICK circle on a game to choose your team before kickoff. Picks can be changed up until the game starts.
          </p>
        )}
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
                <GameBox
                  game={game}
                  pickedTeamId={pickedTeamByGameId[game.id]}
                  onPick={session ? handlePick : undefined}
                  onClear={session ? handleClearPick : undefined}
                />
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </div>
  );
}
