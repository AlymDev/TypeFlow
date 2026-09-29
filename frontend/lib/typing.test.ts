import { describe, expect, it } from "vitest";

import { calculateAccuracy, calculateWpm } from "./typing";

describe("typing metrics", () => {
  it("calculates accuracy as a percentage of correct characters", () => {
    expect(calculateAccuracy(20, 25)).toBeCloseTo(80, 2);
  });

  it("returns zero accuracy when nothing has been typed", () => {
    expect(calculateAccuracy(0, 0)).toBe(0);
  });

  it("calculates WPM from correct characters and elapsed time", () => {
    expect(calculateWpm(60, 30)).toBeCloseTo(24, 2);
  });

  it("returns zero WPM when elapsed time is zero", () => {
    expect(calculateWpm(50, 0)).toBe(0);
  });
});
