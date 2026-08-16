// Location in your project: src/lib/stats.test.ts
//
// Vitest automatically finds any file ending in .test.ts — no manual
// registration needed. This sits right next to stats.ts on purpose,
// a common convention: the test lives beside the code it's testing.

import { describe, it, expect } from "vitest";
import { computeStats } from "./stats";

describe("computeStats", () => {
  it("returns all zeros for an empty history", () => {
    expect(computeStats([])).toEqual({
      currentStreak: 0,
      longestStreak: 0,
      accuracy: 0,
    });
  });

  it("calculates accuracy as a simple ratio", () => {
    const results = [
      { correct: true },
      { correct: true },
      { correct: false },
      { correct: true },
    ];
    expect(computeStats(results).accuracy).toBe(0.75); // 3 out of 4
  });

  it("treats an all-correct history as one continuous streak", () => {
    const results = [{ correct: true }, { correct: true }, { correct: true }];
    const stats = computeStats(results);
    expect(stats.currentStreak).toBe(3);
    expect(stats.longestStreak).toBe(3);
  });

  it("resets current streak to 0 when the most recent pick was wrong", () => {
    const results = [{ correct: true }, { correct: true }, { correct: false }];
    expect(computeStats(results).currentStreak).toBe(0);
  });

  // The exact scenario walked through earlier: a strong run in the middle
  // of the history, then a miss, then only one correct pick since.
  it("distinguishes current streak from longest streak", () => {
    const results = [
      { correct: true },
      { correct: true },
      { correct: true },
      { correct: true }, // longest streak: 4 correct in a row here
      { correct: false }, // breaks it
      { correct: true }, // only this one counts toward "current"
    ];
    const stats = computeStats(results);
    expect(stats.currentStreak).toBe(1);
    expect(stats.longestStreak).toBe(4);
  });
});
