"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LeaderboardEntry } from "@/lib/types";

const SORT_OPTIONS = [
  { value: "currentStreak", label: "Current Streak" },
  { value: "longestStreak", label: "Longest Streak" },
  { value: "accuracy", label: "Accuracy" },
] as const;

type SortBy = (typeof SORT_OPTIONS)[number]["value"];

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<SortBy>("currentStreak");
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    fetch(`/api/leaderboard?sortBy=${sortBy}`)
      .then((res) => res.json())
      .then(setEntries);
  }, [sortBy]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl">Predictions Leaderboard</h1>

      <div className="flex gap-2">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setSortBy(option.value)}
            className={`border px-3 py-1 ${sortBy === option.value ? "bg-black text-white" : ""}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {!entries ? (
        <p>Loading...</p>
      ) : (
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Current Streak</th>
              <th className="border p-2 text-left">Longest Streak</th>
              <th className="border p-2 text-left">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.userId}>
                <td className="border p-2">
                  <Link href={`/users/${entry.userId}`} className="underline">
                    {entry.name}
                  </Link>
                </td>
                <td className="border p-2">{entry.currentStreak}</td>
                <td className="border p-2">{entry.longestStreak}</td>
                <td className="border p-2">{entry.accuracy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
