"use client";

import { useRef, useState, type CSSProperties } from "react";
import { Info, Calendar, Table2 } from "lucide-react";
import { UpcomingGames } from "@/components/UpcomingGames";
import { EmojiTrail } from "@/components/EmojiTrail";
import SplitFlapText from "@/components/SplitFlapText";
import RotatingText from "@/components/RotatingText";
import { AppFeaturesBento } from "@/components/AppFeaturesBento";
import { Reveal } from "@/components/Reveal";
import { RadialGlowButton } from "@/components/ui/radial-glow-button";
import { AuthModal } from "@/components/AuthModal";
import { authClient } from "@/lib/auth-client";
import { betrayed } from "@/lib/fonts";

const HERO_MOMENTS = ["Pick 6.", "Money Down.", "Lateral.", "One Hand.", "Stiff Arm.", "Touchdown."];

export default function Home() {
  const bentoSectionRef = useRef<HTMLElement>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const { data: session } = authClient.useSession();

  return (
    <div className="relative z-0 flex flex-col">
      <div className="relative z-10">
        <UpcomingGames />
      </div>

      <section className="pointer-events-none fixed inset-0 -z-10 flex flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 -z-10 bg-[url('/image/herobg/herobg.png')] bg-cover bg-center brightness-85" />

        <Reveal mode="mount">
          <h1 className={`relative z-10 text-8xl font-bold text-yellow-100 ${betrayed.className}`}>
            Hail Mary
          </h1>
        </Reveal>
        <Reveal mode="mount" delay={0.15}>
          <p className="relative z-10 mt-6 flex items-center gap-2 text-3xl text-white">
            Moments like
            <RotatingText
              texts={HERO_MOMENTS}
              mainClassName="justify-center overflow-hidden rounded-lg bg-zinc-900 px-2 py-0.5 text-yellow-100 sm:px-2 sm:py-1 md:px-3 md:py-2"
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
        </Reveal>

        <Reveal mode="mount" delay={0.3} className="relative z-10 pointer-events-auto mt-6 flex items-center gap-4">
          <RadialGlowButton
            onClick={() => bentoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            <span className="flex items-center gap-1.5">
              App Features
              <Info className="size-4" />
            </span>
          </RadialGlowButton>
          {!session && (
            <>
              <RadialGlowButton
                className="rg-red"
                onClick={() => setAuthOpen(true)}
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
            </>
          )}
        </Reveal>
      </section>

      {/* Reserves the scroll distance the fixed hero can't create itself. */}
      <div className="pointer-events-none h-screen" />

      <div className="relative z-10">
        <div className="absolute inset-0 -z-20 bg-[url('/image/herobg/bnwdither.png')] bg-no-repeat bg-cover bg-[center_65%]" />

        <EmojiTrail className="relative z-10 flex flex-col">
          <section className="flex min-h-0 flex-col items-center justify-center gap-3 px-4 sm:min-h-[50vh]">
            <Reveal className="flex flex-col items-center gap-3 rounded-xl bg-black/60 p-5 sm:p-8">
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
                fontSize="clamp(1.1rem, 5vw, 3.25rem)"
                loop
                padTo={12}
              />
              <p>Football season. Cancel plans on Sunday.</p>
              <p>Join the club. Pick against others.</p>
              <p>Compete and see the results.</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
                <RadialGlowButton
                  href="/games"
                  className="rg-amber"
                  style={
                    {
                      "--rg-color-1": "#1f1206",
                      "--rg-color-2": "#92400e",
                      "--rg-color-3": "#f59e0b",
                      "--rg-color-4": "#f1ffa5",
                      "--rg-color-5": "hsl(30 70% 3%)",
                    } as CSSProperties
                  }
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    Full Season Overview
                  </span>
                </RadialGlowButton>
                <RadialGlowButton
                  href="/teams"
                  className="rg-violet"
                  style={
                    {
                      "--rg-color-1": "#14061f",
                      "--rg-color-2": "#4c1d95",
                      "--rg-color-3": "#8b5cf6",
                      "--rg-color-4": "#f1ffa5",
                      "--rg-color-5": "hsl(266 70% 3%)",
                    } as CSSProperties
                  }
                >
                  <span className="flex items-center gap-2">
                    <Table2 className="size-4" />
                    Team Schedule Overview
                  </span>
                </RadialGlowButton>
                <style>{`
                  .rg-button.rg-amber:hover {
                    --rg-pos-x: 0%;
                    --rg-pos-y: 120%;
                    --rg-spread-x: 110.24%;
                    --rg-spread-y: 110.2%;
                    --rg-color-1: #1f1206 !important;
                    --rg-color-2: #f1ffa5 !important;
                    --rg-color-3: #f59e0b !important;
                    --rg-color-4: #92400e !important;
                    --rg-color-5: hsl(30 70% 3%) !important;
                    --rg-stop-1: 0%;
                    --rg-stop-2: 10%;
                    --rg-stop-3: 35.44%;
                    --rg-stop-4: 71.34%;
                    --rg-stop-5: 150%;
                    --rg-border-angle: 190deg;
                    --rg-border-color-1: hsla(35, 75%, 90%, 0.1);
                    --rg-border-color-2: hsla(35, 50%, 90%, 0.35);
                    --button-line-opacity: 1;
                  }
                  .rg-button.rg-violet:hover {
                    --rg-pos-x: 0%;
                    --rg-pos-y: 120%;
                    --rg-spread-x: 110.24%;
                    --rg-spread-y: 110.2%;
                    --rg-color-1: #14061f !important;
                    --rg-color-2: #f1ffa5 !important;
                    --rg-color-3: #8b5cf6 !important;
                    --rg-color-4: #4c1d95 !important;
                    --rg-color-5: hsl(266 70% 3%) !important;
                    --rg-stop-1: 0%;
                    --rg-stop-2: 10%;
                    --rg-stop-3: 35.44%;
                    --rg-stop-4: 71.34%;
                    --rg-stop-5: 150%;
                    --rg-border-angle: 190deg;
                    --rg-border-color-1: hsla(280, 75%, 90%, 0.1);
                    --rg-border-color-2: hsla(280, 50%, 90%, 0.35);
                    --button-line-opacity: 1;
                  }
                `}</style>
              </div>
            </Reveal>
          </section>

          <section ref={bentoSectionRef} className="flex flex-col items-center justify-center px-4">
            <AppFeaturesBento />
          </section>
        </EmojiTrail>
      </div>

      <AuthModal open={authOpen} initialTab="signup" onClose={() => setAuthOpen(false)} />
    </div>
  );
}
