// Static list of the 32 NFL teams, used to render the team schedules grid.
// This mirrors prisma/seed.ts — it's display data for the frontend, not a
// database query, so it's kept separate from the backend.

export interface TeamListing {
  abbreviation: string;
  name: string;
}

export const TEAMS: TeamListing[] = [
  { abbreviation: "BUF", name: "Buffalo Bills" },
  { abbreviation: "MIA", name: "Miami Dolphins" },
  { abbreviation: "NE", name: "New England Patriots" },
  { abbreviation: "NYJ", name: "New York Jets" },

  { abbreviation: "BAL", name: "Baltimore Ravens" },
  { abbreviation: "CIN", name: "Cincinnati Bengals" },
  { abbreviation: "CLE", name: "Cleveland Browns" },
  { abbreviation: "PIT", name: "Pittsburgh Steelers" },

  { abbreviation: "HOU", name: "Houston Texans" },
  { abbreviation: "IND", name: "Indianapolis Colts" },
  { abbreviation: "JAX", name: "Jacksonville Jaguars" },
  { abbreviation: "TEN", name: "Tennessee Titans" },

  { abbreviation: "DEN", name: "Denver Broncos" },
  { abbreviation: "KC", name: "Kansas City Chiefs" },
  { abbreviation: "LV", name: "Las Vegas Raiders" },
  { abbreviation: "LAC", name: "Los Angeles Chargers" },

  { abbreviation: "DAL", name: "Dallas Cowboys" },
  { abbreviation: "NYG", name: "New York Giants" },
  { abbreviation: "PHI", name: "Philadelphia Eagles" },
  { abbreviation: "WAS", name: "Washington Commanders" },

  { abbreviation: "CHI", name: "Chicago Bears" },
  { abbreviation: "DET", name: "Detroit Lions" },
  { abbreviation: "GB", name: "Green Bay Packers" },
  { abbreviation: "MIN", name: "Minnesota Vikings" },

  { abbreviation: "ATL", name: "Atlanta Falcons" },
  { abbreviation: "CAR", name: "Carolina Panthers" },
  { abbreviation: "NO", name: "New Orleans Saints" },
  { abbreviation: "TB", name: "Tampa Bay Buccaneers" },

  { abbreviation: "ARI", name: "Arizona Cardinals" },
  { abbreviation: "LAR", name: "Los Angeles Rams" },
  { abbreviation: "SF", name: "San Francisco 49ers" },
  { abbreviation: "SEA", name: "Seattle Seahawks" },
];
