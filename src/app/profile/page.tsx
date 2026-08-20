"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { Stats } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { formatAccuracy } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faFire, faBullseye, faCircleXmark, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { CURRENT_SEASON, formatSeasonLabel } from "@/lib/season";

type PickHistoryStatus = "correct" | "incorrect" | "scheduled" | "cancelled";

type PickHistoryGame = {
  gameId: string;
  week: number;
  season: number;
  status: PickHistoryStatus;
  homeTeamAbbreviation: string;
  awayTeamAbbreviation: string;
};

type PickHistoryResponse = {
  games: PickHistoryGame[];
  longestStreakRange: { startIndex: number; endIndex: number } | null;
};

const STATUS_LABEL: Record<PickHistoryStatus, string> = {
  correct: "Correct",
  incorrect: "Incorrect",
  scheduled: "Scheduled",
  cancelled: "Cancelled",
};

const LEGEND = [
  { swatch: "bg-[#047857]", label: "Correct pick" },
  { swatch: "bg-[#b91c1c]", label: "Incorrect pick" },
  { swatch: "bg-[#facc15]", label: "Longest streak" },
  { swatch: "bg-[#3f3f46]", label: "Scheduled" },
  { swatch: "bg-[#8b5cf6]", label: "Cancelled" },
] as const;

// Grouped from the same `games` array GET /api/stats/history already returns —
// no API/stats/grading changes needed, this is purely a client-side rollup.
function computeWeeklyAccuracy(games: PickHistoryGame[]) {
  const byWeek = new Map<number, { correct: number; total: number }>();

  for (const game of games) {
    if (game.status !== "correct" && game.status !== "incorrect") continue;
    const entry = byWeek.get(game.week) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (game.status === "correct") entry.correct += 1;
    byWeek.set(game.week, entry);
  }

  return Array.from(byWeek.entries())
    .sort(([a], [b]) => a - b)
    .map(([week, { correct, total }]) => ({ week, accuracy: correct / total }));
}

function PickHistoryHeatmap({ games, longestStreakRange }: PickHistoryResponse) {
  if (games.length === 0) {
    return <p className="py-8 text-center text-sm text-white/40">No picks yet this season.</p>;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-[repeat(34,minmax(0,1fr))] gap-1">
        {games.map((game, i) => {
          const isStreak =
            game.status === "correct" &&
            !!longestStreakRange &&
            i >= longestStreakRange.startIndex &&
            i <= longestStreakRange.endIndex;

          return (
            <div key={game.gameId} className="group relative">
              <div
                className={cn(
                  "aspect-square rounded-sm",
                  isStreak
                    ? "bg-[#facc15]"
                    : game.status === "correct"
                      ? "bg-[#047857]"
                      : game.status === "incorrect"
                        ? "bg-[#b91c1c]"
                        : game.status === "cancelled"
                          ? "bg-[#8b5cf6]"
                          : "bg-[#3f3f46]"
                )}
              />
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-zinc-950 px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                Week {game.week} {game.homeTeamAbbreviation} vs {game.awayTeamAbbreviation} &mdash; {STATUS_LABEL[game.status]}
                {isStreak && <span className="block font-semibold text-yellow-400">Part of longest streak</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {LEGEND.map((entry) => (
          <div key={entry.label} className="flex items-center gap-1.5">
            <div className={cn("size-3 shrink-0 rounded-sm", entry.swatch)} />
            <span className="text-xs font-medium text-white/50">{entry.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyAccuracyChart({ games }: { games: PickHistoryGame[] }) {
  const weekly = computeWeeklyAccuracy(games);
  if (weekly.length === 0) {
    return (
      <div className="flex w-full flex-col gap-2 border-t border-white/10 pt-4">
        <p className="text-center text-xs font-medium text-white/50">Weekly Accuracy Trend</p>
        <p className="py-4 text-center text-sm text-white/40">No data available yet</p>
      </div>
    );
  }

  const width = 700;
  const height = 140;
  const padding = { top: 10, right: 10, bottom: 6, left: 10 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const points = weekly.map((entry, i) => ({
    ...entry,
    x: padding.left + (weekly.length === 1 ? innerWidth / 2 : (i / (weekly.length - 1)) * innerWidth),
    y: padding.top + (1 - entry.accuracy) * innerHeight,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`;

  return (
    <div className="flex w-full flex-col gap-2 border-t border-white/10 pt-4">
      <p className="text-center text-xs font-medium text-white/50">Weekly Accuracy Trend</p>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-32 w-full">
        <defs>
          <linearGradient id="weekly-accuracy-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + t * innerHeight}
            y2={padding.top + t * innerHeight}
            stroke="rgba(255,255,255,0.08)"
          />
        ))}
        <path d={areaPath} fill="url(#weekly-accuracy-fill)" />
        <path d={linePath} fill="none" stroke="#facc15" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p) => (
          <circle key={p.week} cx={p.x} cy={p.y} r={3} fill="#facc15" />
        ))}
      </svg>
      <div className="flex justify-between px-1 text-[9px] font-medium text-white/40">
        {weekly.map((entry) => (
          <span key={entry.week}>W{entry.week}</span>
        ))}
      </div>
    </div>
  );
}

function WinRateSparkline({ games }: { games: PickHistoryGame[] }) {
  const weekly = computeWeeklyAccuracy(games);
  if (weekly.length < 2) {
    return <p className="text-xs text-white/40">Not enough data yet</p>;
  }

  const width = 160;
  const height = 48;
  const points = weekly.map((entry, i) => ({
    x: (i / (weekly.length - 1)) * width,
    y: (1 - entry.accuracy) * height,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-12 w-full">
      <path d={linePath} fill="none" stroke="#facc15" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CorrectIncorrectBar({ correct, incorrect }: { correct: number; incorrect: number }) {
  const total = correct + incorrect;
  const correctPct = total > 0 ? (correct / total) * 100 : 0;
  const incorrectPct = total > 0 ? (incorrect / total) * 100 : 0;

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-center text-xs font-medium text-white/50">Correct vs Incorrect</p>
      <div className="flex h-6 w-full overflow-hidden rounded-full border border-white/10 bg-zinc-800">
        <div className="h-full bg-[#047857]" style={{ width: `${correctPct}%` }} />
        <div className="h-full bg-[#b91c1c]" style={{ width: `${incorrectPct}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs font-medium text-white/50">
        <span>
          Correct <span className="font-bold text-white">{correct}</span>
        </span>
        <span>
          Incorrect <span className="font-bold text-white">{incorrect}</span>
        </span>
      </div>
    </div>
  );
}

function AccuracyPercentDonut({ accuracy }: { accuracy: number }) {
  const size = 128;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, accuracy));

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(39 39 42)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#facc15"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${pct * circumference} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{formatAccuracy(accuracy)}</span>
      </div>
    </div>
  );
}

function StreakThermometer({
  currentStreak,
  longestStreak,
  showPercentage = false,
}: {
  currentStreak: number;
  longestStreak: number;
  showPercentage?: boolean;
}) {
  const fillPct = longestStreak > 0 ? Math.min(currentStreak / longestStreak, 1) * 100 : 0;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="h-6 w-full overflow-hidden rounded-full border border-white/10 bg-zinc-800">
        <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${fillPct}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs font-medium text-white/50">
        <span>
          Current Streak <span className="font-bold text-white">{currentStreak}</span>
        </span>
        {showPercentage && <span className="font-bold text-orange-500">{Math.round(fillPct)}%</span>}
        <span>
          Longest Streak <span className="font-bold text-white">{longestStreak}</span>
        </span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [pickHistory, setPickHistory] = useState<PickHistoryResponse | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats);
    fetch("/api/stats/history")
      .then((res) => res.json())
      .then(setPickHistory);
  }, [session]);

  if (isPending) {
    return (
      <div className="p-4">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }
  if (!session) return <p className="p-4">You must be signed in to view this page.</p>;

  const correctCount = pickHistory ? pickHistory.games.filter((g) => g.status === "correct").length : null;
  const incorrectCount = pickHistory ? pickHistory.games.filter((g) => g.status === "incorrect").length : null;
  const season = pickHistory?.games.at(-1)?.season ?? CURRENT_SEASON;

  return (
    <div className="flex flex-col gap-16 p-4">
      <Reveal mode="mount">
        <h1 className="text-center text-5xl font-semibold py-16">{session.user.name}</h1>
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-white/40">
          Season {formatSeasonLabel(season)}
        </p>
        <p className="text-center text-lg text-white/70">Your picks and streaks in one place, full analysis of your prediction performance</p>
      </Reveal>

      {!stats ? (
        <div className="mx-auto grid w-full max-w-3xl grid-cols-3 gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="skeleton h-[60px] w-full rounded-xl"></div>
          ))}
        </div>
      ) : (
        <Reveal mode="mount" delay={0.1} className="mx-auto grid w-full max-w-3xl grid-cols-3 gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3">
            <FontAwesomeIcon icon={faFire} className="text-2xl text-orange-500" />
            <div>
              <p className="text-xs font-medium text-white/50">Current Streak</p>
              <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3">
            <FontAwesomeIcon icon={faTrophy} className="text-2xl text-yellow-400" />
            <div>
              <p className="text-xs font-medium text-white/50">Longest Streak</p>
              <p className="text-2xl font-bold text-white">{stats.longestStreak}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3">
            <FontAwesomeIcon icon={faBullseye} className="text-2xl text-emerald-400" />
            <div>
              <p className="text-xs font-medium text-white/50">Accuracy</p>
              <p className="text-2xl font-bold text-white">{formatAccuracy(stats.accuracy)}</p>
            </div>
          </div>
        </Reveal>
      )}

      {stats && (
        <Reveal mode="mount" delay={0.2} className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          <h2 className="text-center text-xl font-semibold text-white">Stats Dashboard</h2>

          <div className="flex w-full flex-col gap-4 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-6">
            <p className="text-center text-xs font-medium text-white/50">Streak Progress</p>
            <StreakThermometer currentStreak={stats.currentStreak} longestStreak={stats.longestStreak} showPercentage />
          </div>

          <div className="flex w-full flex-col gap-4 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-6">
            <p className="text-center text-xs font-medium text-white/50">Accuracy Breakdown</p>
            {!pickHistory ? (
              <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-3">
                <div className="flex justify-center">
                  <div className="skeleton size-32 shrink-0 rounded-full"></div>
                </div>
                <div className="flex w-full flex-col items-center gap-3">
                  <div className="skeleton h-4 w-32 rounded"></div>
                  <div className="skeleton h-4 w-32 rounded"></div>
                  <div className="skeleton h-10 w-full rounded"></div>
                </div>
                <div className="flex w-full justify-center">
                  <div className="skeleton h-6 w-full max-w-[220px] rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-3">
                <div className="flex justify-center">
                  <AccuracyPercentDonut accuracy={stats.accuracy} />
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-lg text-emerald-500" />
                    <span className="text-xs font-medium text-white/50">Correct Picks</span>
                    <span className="text-sm font-bold text-white">{correctCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCircleXmark} className="text-lg text-red-500" />
                    <span className="text-xs font-medium text-white/50">Incorrect Picks</span>
                    <span className="text-sm font-bold text-white">{incorrectCount}</span>
                  </div>
                  <div className="flex w-full flex-col items-center gap-1 pt-1 text-center">
                    <p className="text-xs font-medium text-white/50">Win Rate Trend</p>
                    <WinRateSparkline games={pickHistory.games} />
                  </div>
                </div>

                <div className="flex w-full justify-center">
                  <div className="w-full max-w-[220px]">
                    <CorrectIncorrectBar correct={correctCount ?? 0} incorrect={incorrectCount ?? 0} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex w-full flex-col gap-4 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-6">
            <p className="text-center text-xs font-medium text-white/50">Pick History</p>
            {!pickHistory ? (
              <div className="flex w-full flex-col gap-4">
                <div className="grid grid-cols-[repeat(34,minmax(0,1fr))] gap-1">
                  {Array.from({ length: 68 }, (_, i) => (
                    <div key={i} className="skeleton aspect-square rounded-sm"></div>
                  ))}
                </div>
                <div className="skeleton h-32 w-full rounded"></div>
              </div>
            ) : (
              <>
                <PickHistoryHeatmap games={pickHistory.games} longestStreakRange={pickHistory.longestStreakRange} />
                <WeeklyAccuracyChart games={pickHistory.games} />
              </>
            )}
          </div>
        </Reveal>
      )}
    </div>
  );
}
