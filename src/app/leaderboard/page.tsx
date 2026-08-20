"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Flame } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { formatAccuracy } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { betrayed } from "@/lib/fonts";

const SORT_OPTIONS = [
  { value: "currentStreak", label: "Current Streak" },
  { value: "longestStreak", label: "Longest Streak" },
  { value: "accuracy", label: "Accuracy" },
] as const;

type SortBy = (typeof SORT_OPTIONS)[number]["value"];

const MEDAL_STYLES = {
  1: "border-yellow-400 bg-yellow-400 text-yellow-950",
  2: "border-white/20 bg-white/85 text-zinc-900",
  3: "border-amber-700/40 bg-amber-600 text-amber-950",
} as const;

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<SortBy>("currentStreak");
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [podiumEntries, setPodiumEntries] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    fetch(`/api/leaderboard?sortBy=${sortBy}`)
      .then((res) => res.json())
      .then(setEntries);
  }, [sortBy]);

  // The podium always ranks by current streak, independent of the table's own sort.
  useEffect(() => {
    fetch("/api/leaderboard?sortBy=currentStreak")
      .then((res) => res.json())
      .then((data: LeaderboardEntry[]) => setPodiumEntries(data.slice(0, 3)));
  }, []);

  const podium = podiumEntries
    ? [
        { rank: 2 as const, entry: podiumEntries[1] },
        { rank: 1 as const, entry: podiumEntries[0] },
        { rank: 3 as const, entry: podiumEntries[2] },
      ].filter((slot) => slot.entry)
    : [];

  return (
    <div className="flex flex-col gap-16 p-4">
      <Reveal mode="mount">
        <h1 className="text-center text-5xl font-semibold py-16">
          <span className={`${betrayed.className} text-yellow-100`}>Hail Mary</span> League
        </h1>
        <p className="text-center text-lg text-white/70">Rankings of the top performers in the league, by 3 categories</p>
      </Reveal>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-wide text-white/50">Rank by</span>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={cn(
                "border px-3 py-1 transition-colors",
                sortBy === option.value
                  ? "border-white bg-white font-bold text-black"
                  : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {!entries ? (
        <span className="loading loading-infinity loading-xl"></span>
      ) : (
        <div className="mx-auto w-full max-w-3xl overflow-hidden bg-zinc-900/60">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr>
                <th className="border border-white/10 p-2 text-left">Player</th>
                {SORT_OPTIONS.map((option) => (
                  <th key={option.value} className="border border-white/10 p-2 text-left">
                    <button
                      type="button"
                      onClick={() => setSortBy(option.value)}
                      className="inline-flex items-center gap-1 hover:text-yellow-400"
                    >
                      {option.value === "accuracy" ? "Accuracy %" : option.label}
                      {sortBy === option.value && <ChevronDown className="size-4 text-yellow-400" />}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.userId}>
                  <td className="border border-white/10 p-2">
                    <Link href={`/users/${entry.userId}`} className="underline">
                      {entry.name}
                    </Link>
                  </td>
                  <td className="border border-white/10 p-2">{entry.currentStreak}</td>
                  <td className="border border-white/10 p-2">{entry.longestStreak}</td>
                  <td className="border border-white/10 p-2">{formatAccuracy(entry.accuracy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 lg:max-w-6xl">
        <h2 className="text-center text-2xl font-semibold lg:text-3xl">Current Leaders</h2>

        {!podiumEntries ? (
          <span className="loading loading-infinity loading-xl self-center"></span>
        ) : (
          <div className="flex items-end justify-center gap-4 lg:gap-12">
            {podium.map(({ rank, entry }) => (
              <div
                key={entry.userId}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/60 px-6 lg:w-72 lg:gap-4 lg:px-8",
                  rank === 1
                    ? "py-8 shadow-lg shadow-yellow-400/20 ring-2 ring-yellow-400 lg:py-16"
                    : "py-5 lg:py-12"
                )}
              >
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide lg:px-5 lg:py-1.5 lg:text-base",
                    MEDAL_STYLES[rank]
                  )}
                >
                  {rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"}
                </span>

                <span
                  className={cn(
                    "flex items-center justify-center rounded-full font-bold text-white/85",
                    rank === 1
                      ? "size-12 bg-yellow-400 text-base text-yellow-950 lg:size-32 lg:text-4xl"
                      : "size-10 bg-zinc-800 text-sm lg:size-24 lg:text-2xl"
                  )}
                >
                  {getInitials(entry.name)}
                </span>

                <Link href={`/users/${entry.userId}`} className="text-sm font-medium text-white underline lg:text-2xl">
                  {entry.name}
                </Link>

                <span className="flex items-center gap-1 text-2xl font-bold text-yellow-400 lg:gap-3 lg:text-6xl">
                  <Flame className="size-5 lg:size-12" />
                  {entry.currentStreak}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-white/40 lg:text-sm">Current Streak</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
