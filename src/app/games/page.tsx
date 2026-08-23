"use client";

import { useEffect, useState } from "react";
import type { Game, Prediction } from "@/lib/types";
import { WeekTabBar, type WeekTabBarItem } from "@/components/WeekTabBar";
import { Reveal } from "@/components/Reveal";
import { GameBox } from "@/components/GameBox";
import { authClient } from "@/lib/auth-client";
import { CURRENT_SEASON, formatSeasonLabel } from "@/lib/season";

const WEEKS = Array.from({ length: 18 }, (_, i) => i + 1);
const TAB_ITEMS: WeekTabBarItem[] = [
  { label: "Full Season", value: null },
  ...WEEKS.map((w) => ({ label: `Week ${w}`, value: w })),
];

export default function GamesPage() {
  const [week, setWeek] = useState<number | null>(null);
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
    const url = week
      ? `/api/games?season=${CURRENT_SEASON}&week=${week}`
      : `/api/games?season=${CURRENT_SEASON}`;

    fetch(url)
      .then((res) => res.json())
      .then(setGames);
  }, [week]);

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

  const season = games?.[0]?.season ?? CURRENT_SEASON;

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

  return (
    <div className="flex flex-col gap-16 p-4 pb-32">
      <Reveal mode="mount">
        <h1 className="text-center text-5xl font-semibold py-16">Game Schedules</h1>
        <p className="text-center text-lg text-white/70">Browse every game, by season and week</p>
        <p className="pt-2 text-center text-xs font-semibold uppercase tracking-wide text-white/40">
          Season {formatSeasonLabel(season)}
        </p>
        {session && (
          <p className="pt-2 text-center text-sm text-white/40">
            Tap the PICK circle on a game to choose your team before kickoff, picks can be changed up until the game starts
          </p>
        )}
      </Reveal>

      {!games ? (
        <ul className="mx-auto flex w-full max-w-2xl flex-col gap-3">
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
        <Reveal key={week ?? "full"} mode="mount">
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

      <WeekTabBar items={TAB_ITEMS} selected={week} onSelect={setWeek} />
    </div>
  );
}
