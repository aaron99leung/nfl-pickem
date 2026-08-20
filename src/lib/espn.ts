export type EspnGame = {
  externalId: string;
  season: number;
  week: number;
  kickoffAt: Date;
  homeAbbreviation: string;
  awayAbbreviation: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "SCHEDULED" | "FINAL" | "CANCELLED";
};

function mapStatus(statusTypeName: string, completed: boolean): EspnGame["status"] {
  if (completed) return "FINAL";
  if (statusTypeName === "STATUS_CANCELED") return "CANCELLED";
  return "SCHEDULED";
}

export async function fetchWeekGames(season: number, week: number): Promise<EspnGame[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&week=${week}&dates=${season}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`ESPN request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  return data.events.map((event: any) => {
    const competition = event.competitions[0];
    const home = competition.competitors.find((c: any) => c.homeAway === "home");
    const away = competition.competitors.find((c: any) => c.homeAway === "away");
    const completed: boolean = competition.status.type.completed;

    return {
      externalId: event.id,
      season: event.season.year,
      week: event.week.number,
      kickoffAt: new Date(event.date),
      homeAbbreviation: home.team.abbreviation,
      awayAbbreviation: away.team.abbreviation,
      homeScore: completed ? Number(home.score) : null,
      awayScore: completed ? Number(away.score) : null,
      status: mapStatus(competition.status.type.name, completed),
    };
  });
}
