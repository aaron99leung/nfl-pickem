"use client";

import { use, useEffect, useState } from "react";
import type { PublicUser } from "@/lib/types";
import { formatAccuracy } from "@/lib/stats";

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/users/${userId}`).then((res) => {
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      res.json().then(setUser);
    });
  }, [userId]);

  if (notFound) return <p className="p-4">User not found.</p>;
  if (!user) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="skeleton h-8 w-48"></div>
        <div className="flex flex-col gap-1">
          <div className="skeleton h-4 w-40"></div>
          <div className="skeleton h-4 w-40"></div>
          <div className="skeleton h-4 w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl">{user.name}</h1>

      <div className="grid w-full max-w-3xl grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3">
          <p className="text-xs font-medium text-white/50">Current Streak</p>
          <p className="text-2xl font-bold text-white">{user.currentStreak}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3">
          <p className="text-xs font-medium text-white/50">Longest Streak</p>
          <p className="text-2xl font-bold text-white">{user.longestStreak}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3">
          <p className="text-xs font-medium text-white/50">Accuracy</p>
          <p className="text-2xl font-bold text-white">{formatAccuracy(user.accuracy)}</p>
        </div>
      </div>
    </div>
  );
}
