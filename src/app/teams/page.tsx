"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Team } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { TEAM_COLORS } from "@/lib/teamColors";
import { CURRENT_SEASON, formatSeasonLabel } from "@/lib/season";

const GRID_COLS = "grid-cols-4 w-full max-w-xs sm:max-w-2xl lg:max-w-4xl";

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
        <p className="pt-2 text-center text-xs font-semibold uppercase tracking-wide text-white/40">
          Season {formatSeasonLabel(CURRENT_SEASON)}
        </p>
      </Reveal>

      {!teams ? (
        <div className="flex flex-col items-center gap-4">
          <div className={`mx-auto grid ${GRID_COLS} gap-3 sm:gap-4`}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="skeleton aspect-[7/6] w-full"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {Array.from({ length: Math.ceil(teams.length / 4) }, (_, rowIndex) => (
            <Reveal
              key={rowIndex}
              mode="mount"
              delay={rowIndex * 0.08}
              className={`mx-auto grid ${GRID_COLS} gap-3 sm:gap-4`}
            >
              {teams.slice(rowIndex * 4, rowIndex * 4 + 4).map((team) => {
                const colors = TEAM_COLORS[team.abbreviation];
                return (
                  <Link
                    key={team.abbreviation}
                    href={`/teams/${team.abbreviation}`}
                    style={colors ? { backgroundColor: colors.primary, color: colors.secondary } : undefined}
                    className="flex aspect-[7/6] w-full items-center justify-center border border-white/10 text-lg font-semibold transition-all duration-200 hover:scale-110 sm:text-3xl lg:text-4xl"
                  >
                    {team.abbreviation}
                  </Link>
                );
              })}
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
