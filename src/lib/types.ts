export interface Team {
  abbreviation: string;
  name: string;
  conference: string;
  division: string;
}

export interface Game {
  id: string;
  week: number;
  kickoffAt: string;
  status: "SCHEDULED" | "FINAL" | "CANCELLED";
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: Team;
  awayTeam: Team;
}

export interface Stats {
  currentStreak: number;
  longestStreak: number;
  accuracy: number;
}

export interface LeaderboardEntry extends Stats {
  userId: string;
  name: string;
}

export interface PublicUser extends Stats {
  id: string;
  name: string;
  favouriteTeam: string | null;
  favouritePlayer: string | null;
}
