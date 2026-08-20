"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Team } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { TEAM_COLORS } from "@/lib/teamColors";

const GRID_COLS = "grid-cols-[repeat(4,7rem)] sm:grid-cols-[repeat(4,9.5rem)] lg:grid-cols-[repeat(4,12rem)]";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[] | null>(null);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then(setTeams);
  }, []);

  return (
    <div className="flex flex-col gap-16 p-4">
      <Reveal mode="mount">
        <h1 className="text-center text-5xl font-semibold py-16">Team Schedules</h1>
        <p className="text-center text-lg text-white/70">Find each team&apos;s full season schedule</p>
      </Reveal>

      {!teams ? (
        <div className="flex flex-col items-center gap-4">
          <div className={`grid ${GRID_COLS} justify-center gap-4`}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="skeleton h-24 w-28 sm:h-32 sm:w-[9.5rem] lg:h-40 lg:w-48"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex flex-col items-center gap-4">
            {Array.from({ length: Math.ceil(teams.length / 4) }, (_, rowIndex) => (
              <Reveal
                key={rowIndex}
                mode="mount"
                delay={rowIndex * 0.08}
                className={`grid ${GRID_COLS} justify-center gap-4`}
              >
                {teams.slice(rowIndex * 4, rowIndex * 4 + 4).map((team) => {
                  const colors = TEAM_COLORS[team.abbreviation];
                  return (
                    <Link
                      key={team.abbreviation}
                      href={`/teams/${team.abbreviation}`}
                      style={colors ? { backgroundColor: colors.primary, color: colors.secondary } : undefined}
                      className="flex h-24 w-28 items-center justify-center border border-white/10 text-2xl font-semibold transition-all duration-200 hover:scale-110 sm:h-32 sm:w-[9.5rem] sm:text-3xl lg:h-40 lg:w-48 lg:text-4xl"
                    >
                      {team.abbreviation}
                    </Link>
                  );
                })}
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
