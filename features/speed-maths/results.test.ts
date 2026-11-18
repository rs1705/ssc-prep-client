import { describe, expect, it } from "vitest";
import { bestStreak, drillBestKey, drillHeadline, paceSignal } from "./results";
import { countUpValue, easeOut } from "@/features/games/useCountUp";
import { splitNumber } from "@/features/games/ResultSummary";
import { accuracySignal } from "@/features/games/StatTile";

describe("drill results", () => {
  it("picks a headline from accuracy", () => {
    expect(drillHeadline(100, 20)).toBe("Flawless!");
    expect(drillHeadline(100, 2)).toBe("Perfect start");
    expect(drillHeadline(92, 20)).toBe("Brilliant work");
    expect(drillHeadline(60, 20)).toBe("Good effort");
    expect(drillHeadline(20, 20)).toBe("Keep at it");
    expect(drillHeadline(0, 0)).toBe("Give it a go");
  });

  it("finds the longest run of right answers", () => {
    const h = ["correct", "correct", "wrong", "correct", "correct", "correct", "skipped"].map((status) => ({ status }));
    expect(bestStreak(h)).toBe(3);
    expect(bestStreak([])).toBe(0);
  });

  it("rates pace against the target", () => {
    expect(paceSignal(4, 5)).toBe("good");
    expect(paceSignal(7, 5)).toBe("okay");
    expect(paceSignal(9, 5)).toBe("poor");
    expect(accuracySignal(85)).toBe("good");
    expect(accuracySignal(60)).toBe("okay");
    expect(accuracySignal(30)).toBe("poor");
  });

  it("keeps a separate best per drill setup", () => {
    expect(drillBestKey("addition", "timed", 60, "easy")).toBe("ssc:maths:addition:timed-60-easy:best");
    expect(drillBestKey("addition", "timed", 90, "easy")).not.toBe(drillBestKey("addition", "timed", 60, "easy"));
  });
});

describe("count-up and stat parsing", () => {
  it("eases to the exact value", () => {
    expect(easeOut(0)).toBe(0);
    expect(easeOut(1)).toBe(1);
    expect(countUpValue(80, 0, 900)).toBe(0);
    expect(countUpValue(80, 900, 900)).toBe(80);
    expect(countUpValue(80, 450, 900)).toBeGreaterThan(40);
    expect(countUpValue(2.5, 2000, 900, 1)).toBe(2.5);
  });

  it("splits a stat into its number and the rest", () => {
    expect(splitNumber("8/10")).toEqual({ value: 8, suffix: "/10" });
    expect(splitNumber("80%")).toEqual({ value: 80, suffix: "%" });
    expect(splitNumber("2.5s")).toEqual({ value: 2.5, suffix: "s" });
    expect(splitNumber("—")).toEqual({ value: null, suffix: "" });
  });
});
