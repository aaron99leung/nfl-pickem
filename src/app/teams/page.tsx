"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Team } from "@/lib/types";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[] | null>(null);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then(setTeams);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl">Team Schedules</h1>

      {!teams ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {teams.map((team) => (
            <Link
              key={team.abbreviation}
              href={`/teams/${team.abbreviation}`}
              className="border p-4 text-center"
            >
              {team.abbreviation}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
