// Single source of truth for which season the app queries by default.
// Pages that fetch season-tagged game data should prefer deriving the
// displayed label from that data (see games/page.tsx) so it reflects what
// the API actually returned; this constant is the fallback/default season
// query param and what pages with no season-tagged data of their own use.
export const CURRENT_SEASON = 2026;

// e.g. 2026 -> "26/27"
export function formatSeasonLabel(season: number): string {
  const startYY = season % 100;
  const endYY = (season + 1) % 100;
  return `${String(startYY).padStart(2, "0")}/${String(endYY).padStart(2, "0")}`;
}
