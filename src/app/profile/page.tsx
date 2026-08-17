"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { Stats } from "@/lib/types";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats);
  }, [session]);

  if (isPending) return <p className="p-4">Loading...</p>;
  if (!session) return <p className="p-4">You must be signed in to view this page.</p>;

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl">{session.user.name}</h1>

      {!stats ? (
        <span className="loading loading-infinity loading-xl"></span>
      ) : (
        <div className="flex flex-col gap-1">
          <p>Current streak: {stats.currentStreak}</p>
          <p>Longest streak: {stats.longestStreak}</p>
          <p>Accuracy: {stats.accuracy}</p>
        </div>
      )}

      {/* Keyed by user id so the form's local state re-initialises from the
          session if the signed-in user ever changes. */}
      <FavouritesForm
        key={session.user.id}
        initialFavouriteTeam={session.user.favouriteTeam ?? ""}
        initialFavouritePlayer={session.user.favouritePlayer ?? ""}
      />
    </div>
  );
}

function FavouritesForm({
  initialFavouriteTeam,
  initialFavouritePlayer,
}: {
  initialFavouriteTeam: string;
  initialFavouritePlayer: string;
}) {
  const [favouriteTeam, setFavouriteTeam] = useState(initialFavouriteTeam);
  const [favouritePlayer, setFavouritePlayer] = useState(initialFavouritePlayer);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setSaving(true);
    await authClient.updateUser({ favouriteTeam, favouritePlayer });
    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3 max-w-sm">
      <label className="flex flex-col gap-1">
        Favourite team
        <input
          type="text"
          value={favouriteTeam}
          onChange={(e) => setFavouriteTeam(e.target.value)}
          className="border p-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        Favourite player
        <input
          type="text"
          value={favouritePlayer}
          onChange={(e) => setFavouritePlayer(e.target.value)}
          className="border p-2"
        />
      </label>

      <button type="submit" disabled={saving} className="border p-2 w-fit">
        {saving ? (
          <span className="loading loading-infinity loading-xl"></span>
        ) : (
          "Save"
        )}
      </button>

      {saved && <p>Saved.</p>}
    </form>
  );
}
