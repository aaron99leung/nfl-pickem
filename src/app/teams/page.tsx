"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Team } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { TEAM_COLORS } from "@/lib/teamColors";
import { CURRENT_SEASON, formatSeasonLabel } from "@/lib/season";

const GRID_COLS = "grid-cols-4 w-full max-w-xs sm:max-w-2xl lg:max-w-4xl";

function groupByConferenceAndDivision(teams: Team[]): [string, [string, Team[]][]][] {
  const byConference = new Map<string, Map<string, Team[]>>();

  for (const team of teams) {
    const divisions = byConference.get(team.conference) ?? new Map<string, Team[]>();
    const divisionTeams = divisions.get(team.division) ?? [];
    divisionTeams.push(team);
    divisions.set(team.division, divisionTeams);
    byConference.set(team.conference, divisions);
  }

  return Array.from(byConference.entries()).map(([conference, divisions]) => [
    conference,
    Array.from(divisions.entries()),
  ]);
}

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
        <div className="flex flex-col items-center gap-10">
          {Array.from({ length: 2 }, (_, groupIndex) => (
            <div key={groupIndex} className="flex flex-col items-center gap-6">
              <div className="skeleton h-6 w-16 rounded"></div>
              {Array.from({ length: 4 }, (_, rowIndex) => (
                <div key={rowIndex} className={`mx-auto grid ${GRID_COLS} gap-3 sm:gap-4`}>
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="skeleton aspect-[7/6] w-full"></div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-12">
          {groupByConferenceAndDivision(teams).map(([conference, divisions], groupIndex) => (
            <div key={conference} className="flex w-full flex-col items-center gap-6">
              <Reveal mode="mount" delay={groupIndex * 0.1}>
                <h2 className="text-center text-2xl font-bold uppercase tracking-wide text-white">{conference}</h2>
              </Reveal>
              {divisions.map(([division, divisionTeams], divisionIndex) => (
                <div key={division} className="flex w-full flex-col items-center gap-3">
                  <Reveal mode="mount" delay={groupIndex * 0.1 + divisionIndex * 0.05}>
                    <span className="text-center text-sm font-semibold uppercase tracking-wide text-white/40">
                      {division}
                    </span>
                  </Reveal>
                  <Reveal
                    mode="mount"
                    delay={groupIndex * 0.1 + divisionIndex * 0.05}
                    className={`mx-auto grid ${GRID_COLS} gap-3 sm:gap-4`}
                  >
                    {divisionTeams.map((team) => {
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
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
