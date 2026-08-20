export type GradedPick = {
  correct: boolean;
};

export type Stats = {
  currentStreak: number;
  longestStreak: number;
  accuracy: number;
};

export function computeStats(results: GradedPick[]): Stats {
  if (results.length === 0) {
    return { currentStreak: 0, longestStreak: 0, accuracy: 0 };
  }

  let longestStreak = 0;
  let runningStreak = 0;

  for (const result of results) {
    if (result.correct) {
      runningStreak += 1;
      longestStreak = Math.max(longestStreak, runningStreak);
    } else {
      runningStreak = 0;
    }
  }

  let currentStreak = 0;

  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].correct) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  const correctCount = results.filter((r) => r.correct).length;
  const accuracy = correctCount / results.length;

  return { currentStreak, longestStreak, accuracy };
}

export function formatAccuracy(accuracy: number): string {
  return `${Math.round(accuracy * 100)}%`;
}

export function findLongestStreakRange(
  results: GradedPick[]
): { startIndex: number; endIndex: number } | null {
  let bestStart = -1;
  let bestEnd = -1;
  let bestLength = 0;
  let currentStart = -1;
  let currentLength = 0;

  results.forEach((result, i) => {
    if (result.correct) {
      if (currentLength === 0) currentStart = i;
      currentLength += 1;
      if (currentLength > bestLength) {
        bestLength = currentLength;
        bestStart = currentStart;
        bestEnd = i;
      }
    } else {
      currentLength = 0;
    }
  });

  if (bestLength === 0) return null;
  return { startIndex: bestStart, endIndex: bestEnd };
}
