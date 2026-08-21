# Hail Mary — NFL Pick'em

A full-stack NFL predictions app: pick a winner for every game, build a streak, and climb a public leaderboard against other players. Built as a portfolio project to practice shipping a complete product — real auth, a real external data source, scheduled background jobs, and a production deployment — not just a CRUD demo.

**Live app:** https://nfl-pickem-weld.vercel.app

<!-- Add 2–4 screenshots or a short GIF here: home page, games page with a pick made, profile stats, leaderboard -->

## What it does

- Sign up with email/password or Google, then pick a winner for any upcoming game.
- Picks lock automatically at kickoff — no changing your mind once a game starts.
- Once a game finishes, picks are graded automatically and roll up into per-user stats: current streak, longest streak, and accuracy.
- A public leaderboard ranks every player by accuracy, current streak, or longest streak.
- A profile page shows a full pick history heatmap, a weekly accuracy trend chart, and a breakdown of correct vs. incorrect picks.
- The full NFL schedule and live scores are kept in sync automatically — no one has to enter game data by hand.

## Tech stack

**Frontend**
- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + daisyUI
- Framer Motion for reveal/entry animations

**Backend**
- PostgreSQL (hosted on Neon) via Prisma ORM, using Prisma's Neon driver adapter for serverless-friendly connections
- Better Auth for authentication (email/password + Google OAuth), backed by its own Prisma-managed tables
- Next.js Route Handlers as the API layer

**Infrastructure**
- Deployed on Vercel
- Vercel Cron triggers a scheduled route daily to pull fresh game data and scores
- Game data sourced from ESPN's public scoreboard endpoint (unofficial/undocumented — see [Architecture](#architecture--how-it-works))

## Features

- **Pick submission with kickoff locking** — the API rejects a pick the moment a game's kickoff time has passed, checked server-side, not just hidden in the UI.
- **Automatic grading** — no admin step. A prediction's result is derived on read by comparing the pick against the game's final score.
- **Streaks & accuracy** — current streak, longest streak (with the exact streak highlighted on the pick-history heatmap), and accuracy, all computed from the same underlying grading logic shared between the profile page and the leaderboard.
- **Leaderboard** — sortable by accuracy, current streak, or longest streak; deliberately has no auth requirement, since standings are meant to be public.
- **Season-aware labels** — pages display the current season (e.g. "26/27"), derived from real game data rather than hardcoded per page.
- **Scheduled data sync** — a cron-triggered route re-syncs the current and previous week's games daily, so scores update without anyone visiting the site.

## Architecture / how it works

**Data flow for scores and grading:**

```
Vercel Cron (daily)
  → GET /api/cron/sync-games (secret-protected)
    → fetchWeekGames() — ESPN's scoreboard endpoint
    → upsert into the Game table (score, status, kickoff time)

User visits their profile / the leaderboard
  → getGameResultsForUser() joins each Prediction with its Game
    → compares pickedTeamId against the winning team
    → returns each pick as "correct" | "incorrect" | "scheduled" | "cancelled"
  → computeStats() reduces that into currentStreak / longestStreak / accuracy
```

A few decisions worth calling out:

- **Grading isn't stored — it's computed on every read.** A `Prediction` row only ever stores which team the user picked. Whether that pick was correct is derived at request time from the linked `Game`'s final score. This avoids ever having a prediction and a grade fall out of sync, at the cost of a bit more computation per request.
- **The ESPN integration is isolated to one file.** ESPN doesn't offer an official public API — the scoreboard endpoint used here is unofficial and undocumented. All of that risk is contained in `src/lib/espn.ts`; nothing else in the app touches ESPN's response shape directly, so if the endpoint ever changes, only one file needs to change.
- **The cron route only re-syncs two weeks, not the whole season.** A full-season backfill makes 18 sequential API calls — too slow for a serverless function with a short timeout. The daily cron job instead re-syncs just the current week and the one before it (to catch any late-finishing games), which is enough to keep live scores accurate without re-checking weeks that are already final.
- **Streak highlighting has to survive gaps.** The pick-history heatmap needs to highlight the user's longest streak, but the "longest streak" is computed only over graded (correct/incorrect) picks — scheduled and cancelled games sit in between them in the real chronological sequence. The API translates streak indices from the graded-only subsequence back into indices on the full game list, so the highlight lands on the right games even with gaps.

## Getting started locally

```bash
git clone <repo-url>
cd nfl-pickem
npm install
```

Create a `.env` file with:

```
DATABASE_URL=            # Postgres connection string (Neon or any Postgres works)
BETTER_AUTH_SECRET=      # random secret, e.g. `openssl rand -hex 32`
BETTER_AUTH_URL=         # http://localhost:3000 for local dev
GOOGLE_CLIENT_ID=        # from Google Cloud Console OAuth credentials
GOOGLE_CLIENT_SECRET=
CRON_SECRET=             # only needed to test the cron route locally
```

Set up the database and seed the 32 NFL teams:

```bash
npx prisma migrate dev
npx tsx prisma/seed.ts
```

Pull in the current season's schedule:

```bash
npx tsx prisma/sync-games.ts
```

Then run the dev server:

```bash
npm run dev
```

## What I learned

- **Working against an undocumented third-party API.** ESPN's scoreboard endpoint isn't an official public API, so there's no guaranteed stability — this pushed me to isolate all of that risk behind one function (`fetchWeekGames`) rather than letting ESPN's response shape leak into the rest of the app.
- **Designing around eventual consistency.** Game results, and therefore grading, change on ESPN's schedule, not the user's. Computing grades on read instead of storing them turned out to be simpler to reason about than trying to keep a cached "correct/incorrect" field in sync via webhooks or triggers.
- **Auth configuration is environment-specific in ways that aren't obvious until deployed.** Getting Google OAuth working locally doesn't guarantee it works in production — the redirect URI, `BETTER_AUTH_URL`, and the OAuth client's authorized origins all have to agree, and Vercel's preview vs. production URLs made this a real thing to get right rather than a formality.
- **Serverless functions have real constraints.** A naive "resync the whole season" cron job would run 18 sequential external API calls — comfortably past a serverless function's timeout. Scoping the cron job to just the current and previous week was a direct response to that constraint, not a premature optimization.

## Roadmap

- Weekly email/notification digest of picks and results
- Playoff bracket support (currently regular season only)
- Head-to-head comparison view between two users
