import { describe, it, expect } from "vitest";
import { computeStats, toGradedPicks } from "./stats";

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
    expect(computeStats(results).accuracy).toBe(0.75);
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

  it("distinguishes current streak from longest streak", () => {
    const results = [
      { correct: true },
      { correct: true },
      { correct: true },
      { correct: true },
      { correct: false },
      { correct: true },
    ];
    const stats = computeStats(results);
    expect(stats.currentStreak).toBe(1);
    expect(stats.longestStreak).toBe(4);
  });
});

describe("toGradedPicks", () => {
  it("counts a missed game against you, exactly like a wrong pick", () => {
    const results = [
      { status: "correct" as const },
      { status: "missed" as const },
    ];
    expect(computeStats(toGradedPicks(results)).accuracy).toBe(0.5);
  });

  it("ignores games that cannot be graded yet", () => {
    const results = [
      { status: "correct" as const },
      { status: "scheduled" as const },
      { status: "unpicked" as const },
      { status: "cancelled" as const },
    ];
    expect(toGradedPicks(results)).toEqual([{ correct: true }]);
    expect(computeStats(toGradedPicks(results)).accuracy).toBe(1);
  });

  it("breaks the current streak on a missed game", () => {
    const results = [
      { status: "correct" as const },
      { status: "correct" as const },
      { status: "missed" as const },
    ];
    expect(computeStats(toGradedPicks(results)).currentStreak).toBe(0);
  });

  it("keeps a streak alive across a cancelled game", () => {
    const results = [
      { status: "correct" as const },
      { status: "cancelled" as const },
      { status: "correct" as const },
    ];
    expect(computeStats(toGradedPicks(results)).currentStreak).toBe(2);
  });
});
