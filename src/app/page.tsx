"use client";

import { type CSSProperties } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { UpcomingGames } from "@/components/UpcomingGames";
import { EmojiTrail } from "@/components/EmojiTrail";
import SplitFlapText from "@/components/SplitFlapText";
import RotatingText from "@/components/RotatingText";
import { RadialGlowButton } from "@/components/ui/radial-glow-button";
import { betrayed } from "@/lib/fonts";

const HERO_MOMENTS = ["Pick 6.", "Money Down.", "Hook and Ladder.", "Stiff Arm.", "Touchdown."];

export default function Home() {
  return (
    <div className="relative z-0 flex flex-col">
      <div className="relative z-10">
        <UpcomingGames />
      </div>

      <section className="pointer-events-none fixed inset-0 -z-10 flex flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 -z-10 bg-[url('/image/herobg/herobg.png')] bg-cover bg-center brightness-85" />

        <h1 className={`relative z-10 text-8xl font-bold text-yellow-100 ${betrayed.className}`}>
          Hail Mary
        </h1>
        <p className="relative z-10 mt-6 flex items-center gap-2 text-3xl text-white">
          Moments like
          <RotatingText
            texts={HERO_MOMENTS}
            mainClassName="justify-center overflow-hidden rounded-lg bg-zinc-900 px-2 py-0.5 text-white sm:px-2 sm:py-1 md:px-3 md:py-2"
            staggerFrom="first"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2400}
          />
        </p>

        <div className="relative z-10 pointer-events-auto mt-6 flex items-center gap-4">
          <RadialGlowButton>
            <span className="flex items-center gap-1.5">
              App Features
              <Info className="size-4" />
            </span>
          </RadialGlowButton>
          <RadialGlowButton
            className="rg-red"
            style={
              {
                "--rg-color-1": "#250000",
                "--rg-color-2": "#6e0606",
                "--rg-color-3": "#dd5252",
                "--rg-color-4": "#f1ffa5",
                "--rg-color-5": "hsl(0 40% 3%)",
              } as CSSProperties
            }
          >
            Join the League
          </RadialGlowButton>
          <style>{`
            .rg-button.rg-red:hover {
              --rg-pos-x: 0%;
              --rg-pos-y: 120%;
              --rg-spread-x: 110.24%;
              --rg-spread-y: 110.2%;
              --rg-color-1: #250000 !important;
              --rg-color-2: #f1ffa5 !important;
              --rg-color-3: #dd5252 !important;
              --rg-color-4: #6e0606 !important;
              --rg-color-5: hsl(0 40% 3%) !important;
              --rg-stop-1: 0%;
              --rg-stop-2: 10%;
              --rg-stop-3: 35.44%;
              --rg-stop-4: 71.34%;
              --rg-stop-5: 150%;
              --rg-border-angle: 190deg;
              --rg-border-color-1: hsla(0, 75%, 90%, 0.1);
              --rg-border-color-2: hsla(0, 50%, 90%, 0.35);
              --button-line-opacity: 1;
            }
          `}</style>
        </div>
      </section>

      {/* Reserves the scroll distance the fixed hero can't create itself. */}
      <div className="pointer-events-none h-screen" />

      <div className="relative z-10">
        <div className="absolute inset-0 -z-20 bg-[url('/image/herobg/bnw.jpg')] bg-no-repeat bg-cover bg-[center_15%]" />

        <EmojiTrail className="relative z-10 flex flex-col">
          <section className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4">
            <div className="flex flex-col items-center gap-3 rounded-xl bg-black/60 p-8">
              <SplitFlapText
                flipDuration={0.12}
                stagger={0.06}
                cycleDelay={2400}
                charset="alphanumeric"
                flipsPerChar={8}
                tileColor="#111827"
                textColor="#f8fafc"
                tileRadius={8}
                gap={6}
                fontSize={52}
                loop
                padTo={12}
              />
              <p>Football season. Cancel plans on Sunday.</p>
              <p>Join the club. Pick against others.</p>
              <p>Compete and see the results.</p>
              <Link href="/games" className="w-fit border px-4 py-2">
                This Season&apos;s Schedule
              </Link>
            </div>
          </section>

          <section className="flex min-h-[50vh] flex-col items-center justify-center gap-10 px-4">
            <div className="flex w-full max-w-xl flex-col gap-2">
              <h2 className="text-xl">Streaks &amp; predictions</h2>
              <p>
                Pick the winner of each game before kickoff. Correct picks build
                your current streak — your longest streak and overall accuracy are
                tracked across the whole season.
              </p>
            </div>

            <div className="flex w-full max-w-xl flex-col gap-2">
              <h2 className="text-xl">Compete with friends</h2>
              <p>
                Every user&apos;s streaks and accuracy are public on the{" "}
                <Link href="/leaderboard" className="underline">
                  leaderboard
                </Link>
                , so you can see where you rank.
              </p>
            </div>
          </section>
        </EmojiTrail>
      </div>
    </div>
  );
}
