import Link from "next/link";
import { UpcomingGames } from "@/components/UpcomingGames";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center gap-4 bg-gradient-to-r from-blue-700 to-red-700 px-4 py-24 text-center text-white">
        <h1 className="text-4xl font-bold">NFL Pick&apos;em</h1>
        <p className="text-lg">
          Make your picks. Build your streak. Beat your friends.
        </p>
      </section>

      <section className="flex flex-col gap-2 px-4 pb-4">
        <h2 className="text-xl">Next 3 upcoming games</h2>
        <UpcomingGames />
      </section>

      <section className="flex flex-col gap-3 px-4">
        <p>Pick a winner for every NFL game, and see how you stack up.</p>
        <Link href="/games" className="w-fit border px-4 py-2">
          This Season&apos;s Schedule
        </Link>
      </section>

      <section className="flex flex-col gap-2 px-4">
        <h2 className="text-xl">Streaks &amp; predictions</h2>
        <p>
          Pick the winner of each game before kickoff. Correct picks build
          your current streak — your longest streak and overall accuracy are
          tracked across the whole season.
        </p>
      </section>

      <section className="flex flex-col gap-2 px-4">
        <h2 className="text-xl">Compete with friends</h2>
        <p>
          Every user&apos;s streaks and accuracy are public on the{" "}
          <Link href="/leaderboard" className="underline">
            leaderboard
          </Link>
          , so you can see where you rank.
        </p>
      </section>
    </div>
  );
}
