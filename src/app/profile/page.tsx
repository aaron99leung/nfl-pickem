"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { Stats } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { formatAccuracy } from "@/lib/stats";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats);
  }, [session]);

  if (isPending) {
    return (
      <div className="p-4">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }
  if (!session) return <p className="p-4">You must be signed in to view this page.</p>;

  return (
    <div className="flex flex-col gap-16 p-4">
      <Reveal mode="mount">
        <h1 className="text-center text-5xl font-semibold py-16">{session.user.name}</h1>
        <p className="text-center text-lg text-white/70">Your picks and streaks in one place, full analysis of your prediction performance</p>
      </Reveal>

      {!stats ? (
        <span className="loading loading-infinity loading-xl"></span>
      ) : (
        <div className="mx-auto grid w-full max-w-3xl grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3">
            <p className="text-xs font-medium text-white/50">Current Streak</p>
            <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3">
            <p className="text-xs font-medium text-white/50">Longest Streak</p>
            <p className="text-2xl font-bold text-white">{stats.longestStreak}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3">
            <p className="text-xs font-medium text-white/50">Accuracy</p>
            <p className="text-2xl font-bold text-white">{formatAccuracy(stats.accuracy)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
