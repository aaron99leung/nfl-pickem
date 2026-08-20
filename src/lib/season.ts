export const CURRENT_SEASON = 2026;

export function formatSeasonLabel(season: number): string {
  const startYY = season % 100;
  const endYY = (season + 1) % 100;
  return `${String(startYY).padStart(2, "0")}/${String(endYY).padStart(2, "0")}`;
}
