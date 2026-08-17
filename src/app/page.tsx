import Link from "next/link";
import { UpcomingGames } from "@/components/UpcomingGames";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 p-4">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl">NFL Pick&apos;em</h1>
        <p>Pick a winner for every NFL game, and see how you stack up.</p>
        <Link href="/games" className="w-fit border px-4 py-2">
          View this week&apos;s games
        </Link>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl">Streaks &amp; predictions</h2>
        <p>
          Pick the winner of each game before kickoff. Correct picks build
          your current streak — your longest streak and overall accuracy are
          tracked across the whole season.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl">Compete with friends</h2>
        <p>
          Every user&apos;s streaks and accuracy are public on the{" "}
          <Link href="/leaderboard" className="underline">
            leaderboard
          </Link>
          , so you can see where you rank.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl">Next 3 upcoming games</h2>
        <UpcomingGames />
      </section>
    </div>
  );
}
