export interface Team {
  id: string;
  abbreviation: string;
  name: string;
  conference: string;
  division: string;
}

export interface Game {
  id: string;
  season: number;
  week: number;
  kickoffAt: string;
  status: "SCHEDULED" | "FINAL" | "CANCELLED";
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: Team;
  awayTeam: Team;
}

export interface Prediction {
  id: string;
  userId: string;
  gameId: string;
  pickedTeamId: string;
  createdAt: string;
  updatedAt: string;
  game: Game;
  pickedTeam: Team;
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
