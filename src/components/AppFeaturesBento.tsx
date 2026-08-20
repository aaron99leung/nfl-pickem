import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/Reveal";
import { Shield, Users, UserRound, ChevronRight } from "lucide-react";
import { GoogleIcon } from "@/components/GoogleIcon";
import { FlickerSpinner } from "flicker-dot";
import type { FlickerGrids } from "flicker-dot";

// Made with Flicker · flicker.laurie.fyi
const ACCURACY_TREND_GRIDS: FlickerGrids = [
  [
    false, false, false, true, false, false, false, false,
    false, false, true, false, false, false, false, false,
    false, true, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false,
  ],
  [
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, true, false, false, false, false, false, false,
    true, false, false, false, false, false, false, true,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false,
  ],
  [
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, true, false,
    false, false, false, false, true, true, true, false,
    false,
  ],
  [
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, true, true, true, true, true,
    false,
  ],
  [
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, true, false, false, false, false,
    false, true, true, true, true, true, true, true,
    true,
  ],
  [
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, true, false, false, false,
    false, false, true, true, true, false, false, false,
    false, true, true, true, true, true, true, true,
    true,
  ],
  [
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, true, true, false, false,
    false, false, false, true, true, true, false, false,
    false, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true, true,
    true,
  ],
  [
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, true, true, true, false, true,
    false, true, true, true, true, true, true, false,
    true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true, true,
    true,
  ],
  [
    false, false, false, false, false, true, false, false,
    false, false, true, false, true, false, false, false,
    false, true, true, true, true, true, false, true,
    true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true, true,
    true,
  ],
];

export function AppFeaturesBento() {
  return (
    <section className="bg-gray-50 py-10 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
        <Reveal>
          <h2 className="mb-10 text-center text-3xl font-semibold md:text-4xl">
            Built by enthusiasts, loved by football fans
          </h2>
        </Reveal>
        <div className="relative">
          <div className="relative z-10 grid grid-cols-6 gap-3">
            <Reveal className="col-span-full lg:col-span-2">
            <Card className="relative flex overflow-hidden">
              <CardContent className="relative m-auto text-center size-fit pt-6">
                <div className="relative flex h-16 w-40 items-center sm:h-24 sm:w-56">
                  <svg className="text-muted absolute inset-0 size-full" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="mx-auto block w-fit text-3xl font-semibold sm:text-5xl">272</span>
                </div>
                <h2 className="mt-4 text-center text-xl font-semibold sm:mt-6 sm:text-3xl">
                  Every regular season game, tracked from Week 1 to Week 18
                </h2>
              </CardContent>
            </Card>
            </Reveal>

            <Reveal className="col-span-full sm:col-span-3 lg:col-span-2" delay={0.1}>
            <Card className="relative flex h-full flex-col justify-center overflow-hidden">
              <CardContent className="pt-6">
                <div className="relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                  <GoogleIcon className="m-auto h-12 w-12" />
                </div>
                <div className="relative z-10 mt-6 space-y-2 text-center">
                  <h2 className="group-hover:text-secondary-950 text-lg font-medium transition dark:text-white">Sign in via Google and email</h2>
                  <p className="text-foreground">A few clicks and you&apos;re in. Sessions are always secured properly</p>
                </div>
              </CardContent>
            </Card>
            </Reveal>

            <Reveal className="col-span-full sm:col-span-3 lg:col-span-2" delay={0.2}>
            <Card className="relative h-full overflow-hidden">
              <CardContent className="pt-6">
                <div className="pt-6 lg:px-6">
                  <svg className="w-full" viewBox="0 0 386 123" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 100L64 88L125 92L186 68L247 55L308 32L383 10V123H3V100Z"
                      fill="url(#paint0_linear_ascending)"
                    />
                    <path
                      className="text-primary-600 dark:text-primary-500"
                      d="M3 100L64 88L125 92L186 68L247 55L308 32L383 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="paint0_linear_ascending" x1="193" y1="10" x2="193" y2="123" gradientUnits="userSpaceOnUse">
                        <stop className="text-primary/15 dark:text-primary/35" stopColor="currentColor" />
                        <stop className="text-transparent" offset="1" stopColor="currentColor" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="relative z-10 mt-14 space-y-2 text-center">
                  <h2 className="text-lg font-medium transition">Every pick, graded</h2>
                  <p className="text-foreground">
                    Streaks and accuracy update automatically once results come in — no manual tallying, win and have fun
                  </p>
                </div>
              </CardContent>
            </Card>
            </Reveal>

            <Reveal className="col-span-full lg:col-span-3">
            <Card className="relative overflow-hidden">
              <CardContent className="grid pt-6 sm:grid-cols-2">
                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                  <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <Shield className="m-auto size-5" strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="group-hover:text-secondary-950 text-lg font-medium text-zinc-800 transition dark:text-white">Watch your accuracy trend</h2>
                    <p className="text-foreground">
                      See how your picks have performed week over week, all season long. Calculated by your current,
                      longest streak and percentage accuracy
                    </p>
                  </div>
                </div>
                <div className="rounded-tl-(--radius) relative -mb-6 -mr-6 mt-6 flex h-fit items-center justify-center border-l border-t p-6 py-6 sm:ml-6">
                  <div className="absolute left-3 top-2 flex gap-1">
                    <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                    <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                    <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                  </div>
                  <FlickerSpinner grids={ACCURACY_TREND_GRIDS} onColor="#038A00" offColor="#1A1A1A" size={140} title="Accuracy trend" />
                </div>
              </CardContent>
            </Card>
            </Reveal>

            <Reveal className="col-span-full lg:col-span-3" delay={0.1}>
            <Card className="relative overflow-hidden">
              <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                  <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <Users className="m-auto size-6" strokeWidth={1} />
                  </div>
                  <div className="space-y-[10px]">
                    <h2 className="text-lg font-medium transition">Rank up</h2>
                    <p className="text-foreground">
                      Earn consecutive correct picks against members. All stats are public on the leaderboard, climb the ladder
                    </p>
                    <Link
                      href="/leaderboard"
                      className="group relative inline-flex h-10 w-fit items-center overflow-hidden rounded-full bg-zinc-800 pl-5 pr-11 text-sm font-medium text-white"
                    >
                      <span className="relative z-10 transition-opacity duration-300 group-hover:opacity-0">
                        See Rank
                      </span>
                      <span className="absolute inset-y-1 left-[calc(100%-2.25rem)] right-1 flex items-center justify-center rounded-full bg-white transition-[left] duration-300 ease-out group-hover:left-1">
                        <ChevronRight className="size-4 shrink-0 text-black" />
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="before:bg-(--color-border) relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px sm:-my-6 sm:-mr-6">
                  <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                    <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                      <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">#1</span>
                      <div className="ring-background flex size-7 items-center justify-center rounded-full bg-zinc-700 ring-4">
                        <UserRound className="size-4 text-white" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="relative ml-[calc(50%-1rem)] flex items-center gap-2">
                      <div className="ring-background flex size-8 items-center justify-center rounded-full bg-zinc-700 ring-4">
                        <UserRound className="size-4 text-white" strokeWidth={1.5} />
                      </div>
                      <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">#2</span>
                    </div>
                    <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                      <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">#3</span>
                      <div className="ring-background flex size-7 items-center justify-center rounded-full bg-zinc-700 ring-4">
                        <UserRound className="size-4 text-white" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
