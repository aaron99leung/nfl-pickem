import Link from "next/link";
import { TEAMS } from "@/lib/teams";

export default function TeamsPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl">Team Schedules</h1>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {TEAMS.map((team) => (
          <Link
            key={team.abbreviation}
            href={`/teams/${team.abbreviation}`}
            className="border p-4 text-center"
          >
            {team.abbreviation}
          </Link>
        ))}
      </div>
    </div>
  );
}
