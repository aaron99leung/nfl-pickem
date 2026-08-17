"use client";

import { use, useEffect, useState } from "react";
import type { PublicUser } from "@/lib/types";

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
  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl">{user.name}</h1>

      <div className="flex flex-col gap-1">
        <p>Favourite team: {user.favouriteTeam ?? "Not set"}</p>
        <p>Favourite player: {user.favouritePlayer ?? "Not set"}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p>Current streak: {user.currentStreak}</p>
        <p>Longest streak: {user.longestStreak}</p>
        <p>Accuracy: {user.accuracy}</p>
      </div>
    </div>
  );
}
