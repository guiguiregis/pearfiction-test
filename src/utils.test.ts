import { describe, expect, it } from "vitest";
import { evaluateSpin } from "./utils";

describe("evaluateSpin", () => {
  it("matches exercise: 0, 11, 1, 10, 14 → total 6, paylines 2 and 5", () => {
    const r = evaluateSpin([0, 11, 1, 10, 14]);
    expect(r.totalWins).toBe(6);
    expect(r.winDetails).toEqual([
      { paylineId: 2, symbolId: "hv2", count: 3, payout: 5 },
      { paylineId: 5, symbolId: "lv3", count: 3, payout: 1 },
    ]);
  });

  it("matches exercise: 0, 0, 0, 0, 0 → total 1, payline 3", () => {
    const r = evaluateSpin([0, 0, 0, 0, 0]);
    expect(r.totalWins).toBe(1);
    expect(r.winDetails).toEqual([
      { paylineId: 3, symbolId: "lv3", count: 3, payout: 1 },
    ]);
  });

  it("matches exercise: 5, 14, 9, 9, 16 → total 7, paylines 6 and 7", () => {
    const r = evaluateSpin([5, 14, 9, 9, 16]);
    expect(r.totalWins).toBe(7);
    expect(r.winDetails).toEqual([
      { paylineId: 6, symbolId: "lv1", count: 4, payout: 5 },
      { paylineId: 7, symbolId: "lv1", count: 3, payout: 2 },
    ]);
  });

  it("matches exercise: 1, 16, 2, 15, 0 → no wins", () => {
    const r = evaluateSpin([1, 16, 2, 15, 0]);
    expect(r.totalWins).toBe(0);
    expect(r.winDetails).toEqual([]);
  });

  it("matches exercise: 18, 9, 2, 0, 12 → no wins", () => {
    const r = evaluateSpin([18, 9, 2, 0, 12]);
    expect(r.totalWins).toBe(0);
    expect(r.winDetails).toEqual([]);
  });

  it("returns empty result when position count is wrong", () => {
    expect(evaluateSpin([0, 0, 0]).totalWins).toBe(0);
    expect(evaluateSpin([0, 0, 0, 0, 0, 0]).totalWins).toBe(0);
  });
});
