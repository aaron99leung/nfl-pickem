"use client";

import { useState } from "react";
import type { Game } from "@/lib/types";
import { TEAM_COLORS } from "@/lib/teamColors";
import { cn } from "@/lib/utils";

const CANCELLED_HOME_BG = "#333333";
const CANCELLED_AWAY_BG = "#232323";
const CANCELLED_TEXT = "rgba(255,255,255,0.5)";

function formatKickoff(iso: string) {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const timePart = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${datePart} — ${timePart}`;
}

export function GameBox({
  game,
  pickedTeamId,
  onPick,
}: {
  game: Game;
  pickedTeamId?: string;
  onPick?: (gameId: string, teamId: string) => Promise<void>;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submittingTeamId, setSubmittingTeamId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const isCancelled = game.status === "CANCELLED";
  const hasScore = game.status === "FINAL" && game.homeScore !== null && game.awayScore !== null;
  const kickoffPassed = new Date() >= new Date(game.kickoffAt);
  const canPick = !!onPick && !isCancelled && !hasScore && !kickoffPassed;
  const isPending = !!pickedTeamId && !hasScore && !isCancelled;
  const isLocked = kickoffPassed && !hasScore && !isCancelled;

  const winningTeamId = hasScore
    ? game.homeScore! > game.awayScore!
      ? game.homeTeam.id
      : game.awayScore! > game.homeScore!
        ? game.awayTeam.id
        : null
    : null;
  const isCorrect = pickedTeamId && winningTeamId ? pickedTeamId === winningTeamId : null;

  const home = TEAM_COLORS[game.homeTeam.abbreviation];
  const away = TEAM_COLORS[game.awayTeam.abbreviation];

  const homeBg = isCancelled ? CANCELLED_HOME_BG : (home?.primary ?? "#1a1a1a");
  const awayBg = isCancelled ? CANCELLED_AWAY_BG : (away?.primary ?? "#1a1a1a");
  const homeText = isCancelled ? CANCELLED_TEXT : (home?.secondary ?? "#ffffff");
  const awayText = isCancelled ? CANCELLED_TEXT : (away?.secondary ?? "#ffffff");

  const pickedAbbreviation =
    pickedTeamId === game.homeTeam.id
      ? game.homeTeam.abbreviation
      : pickedTeamId === game.awayTeam.id
        ? game.awayTeam.abbreviation
        : null;

  async function handlePick(teamId: string) {
    if (!onPick) return;
    setSubmittingTeamId(teamId);
    setError(false);
    try {
      await onPick(game.id, teamId);
      setDrawerOpen(false);
    } catch {
      setError(true);
    } finally {
      setSubmittingTeamId(null);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">
        <span>Home</span>
        <span>Away</span>
      </div>
      <div className="relative">
      {isCorrect !== null && (
        <div
          className={cn(
            "absolute -top-2.5 right-4 z-[5] flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-md",
            isCorrect ? "bg-emerald-400 text-emerald-950" : "bg-red-400 text-red-950"
          )}
        >
          {isCorrect ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          )}
          {isCorrect ? "Correct" : "Missed"}
        </div>
      )}
      {isCorrect === null && isPending && (
        <div className="absolute -top-2.5 right-4 z-[5] flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-yellow-950 shadow-md">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Picked: {pickedAbbreviation}
        </div>
      )}
      <div
        className="relative flex h-[172px] w-full overflow-hidden rounded-xl"
        style={
          isCorrect === true
            ? { boxShadow: "0 0 0 3px #34d399, 0 6px 20px rgba(52,211,153,0.35)" }
            : isCorrect === false
              ? { boxShadow: "0 0 0 3px #f87171, 0 6px 20px rgba(248,113,113,0.35)" }
              : isCorrect === null && isPending
                ? { boxShadow: "0 0 0 3px #facc15, 0 6px 20px rgba(250,204,21,0.35)" }
                : undefined
        }
      >
      <div className="relative flex w-1/2 flex-col items-center justify-center gap-1" style={{ backgroundColor: homeBg }}>
        <div className="text-3xl font-bold" style={{ color: homeText, textShadow: "0 1px 3px rgba(0,0,0,0.35)" }}>
          {game.homeTeam.abbreviation}
        </div>
        <div
          className="px-2 text-center text-[11px] font-medium uppercase tracking-wide opacity-80"
          style={{ color: homeText }}
        >
          {game.homeTeam.name}
        </div>
      </div>

      <div className="relative flex w-1/2 flex-col items-center justify-center gap-1" style={{ backgroundColor: awayBg }}>
        <div className="text-3xl font-bold" style={{ color: awayText, textShadow: "0 1px 3px rgba(0,0,0,0.35)" }}>
          {game.awayTeam.abbreviation}
        </div>
        <div
          className="px-2 text-center text-[11px] font-medium uppercase tracking-wide opacity-80"
          style={{ color: awayText }}
        >
          {game.awayTeam.name}
        </div>
      </div>

      {hasScore && (
        <>
          <div
            className="absolute top-1/2 z-[2] -translate-y-1/2 text-2xl font-bold text-white"
            style={{ left: "calc(50% - 62px)", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
          >
            {game.homeScore}
          </div>
          <div
            className="absolute top-1/2 z-[2] -translate-y-1/2 text-2xl font-bold text-white"
            style={{ right: "calc(50% - 62px)", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
          >
            {game.awayScore}
          </div>
        </>
      )}

      {isCancelled ? (
        <div className="absolute inset-0 z-[4] flex items-center justify-center">
          <div className="-rotate-[8deg] rounded-lg border-[3px] border-white/90 bg-black/30 px-4 py-1 text-lg font-bold tracking-wide text-white/90">
            CANCELLED
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={canPick && !pickedTeamId ? () => setDrawerOpen((o) => !o) : undefined}
          className={cn(
            "absolute left-1/2 top-1/2 z-[3] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black text-xs font-bold text-white shadow-lg",
            canPick && !pickedTeamId ? "cursor-pointer animate-glow-pulse" : "cursor-default"
          )}
        >
          {canPick && !pickedTeamId ? (
            "PICK"
          ) : isLocked ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          ) : (
            "VS"
          )}
        </button>
      )}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex h-[30px] items-center justify-center gap-1.5 bg-black/45 text-[11px] font-medium tracking-wide",
          isCancelled ? "text-white/45 line-through" : "text-white/85"
        )}
      >
        {game.status} &middot; {formatKickoff(game.kickoffAt)}
      </div>
      </div>
      </div>

      {canPick && (
        <div
          className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
          style={{ maxHeight: drawerOpen ? 220 : 0, opacity: drawerOpen ? 1 : 0 }}
        >
          <div className="flex gap-2.5 pt-2">
            {[game.homeTeam, game.awayTeam].map((team) => {
              const colors = TEAM_COLORS[team.abbreviation];
              const isSubmitting = submittingTeamId === team.id;
              return (
                <button
                  key={team.id}
                  type="button"
                  disabled={!!submittingTeamId}
                  onClick={() => handlePick(team.id)}
                  className="flex h-[190px] w-1/2 flex-col items-center justify-center gap-2 rounded-xl transition-transform hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    background: `linear-gradient(160deg, ${colors?.primary ?? "#1a1a1a"}, rgba(0,0,0,0.65))`,
                  }}
                >
                  <div className="text-2xl font-bold" style={{ color: colors?.secondary ?? "#ffffff" }}>
                    {team.abbreviation}
                  </div>
                  <div className="text-[11px] font-medium opacity-85" style={{ color: colors?.secondary ?? "#ffffff" }}>
                    {team.name}
                  </div>
                  <div className="mt-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {isSubmitting ? (
                      <span className="loading loading-infinity loading-xs"></span>
                    ) : (
                      "Tap to pick"
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {error && (
            <p className="pt-2 text-center text-[11px] font-medium text-red-400">Couldn&apos;t save your pick — try again</p>
          )}
        </div>
      )}

      {canPick && pickedTeamId && (
        <button
          type="button"
          onClick={() => setDrawerOpen((o) => !o)}
          className="self-center text-xs font-medium text-white/80 underline"
        >
          Change pick
        </button>
      )}
    </div>
  );
}
