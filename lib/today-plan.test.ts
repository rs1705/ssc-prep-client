import { beforeEach, describe, expect, it } from "vitest";
import { PLAN_STEP_DONE_EVENT, buildPlan, dayKey, isStepDone, readProgress, readStreak, recordPlanActivity, type PlanStepDoneDetail } from "./today-plan";

// Minimal browser stand-ins: the plan only needs localStorage and events.
const store = new Map<string, string>();
const events: Event[] = [];
const stepDone = () =>
  events.filter((e) => e.type === PLAN_STEP_DONE_EVENT).map((e) => (e as CustomEvent<PlanStepDoneDetail>).detail);
Object.assign(globalThis, {
  window: {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    },
    dispatchEvent: (e: Event) => {
      events.push(e);
      return true;
    },
  },
});

const DAY = new Date(2026, 10, 11, 9, 0); // 11 Nov 2026, local time
const nextDay = (d: Date, n = 1) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 9, 0);

function finishAll(date: Date) {
  recordPlanActivity("drill", 1, date);
  recordPlanActivity("pyq", 1, date);
  recordPlanActivity("cards", 10, date);
  recordPlanActivity("game", 1, date);
}

beforeEach(() => {
  store.clear();
  events.length = 0;
});

describe("buildPlan", () => {
  it("is the same all day and changes the next day", () => {
    const morning = buildPlan(new Date(2026, 10, 11, 6));
    const night = buildPlan(new Date(2026, 10, 11, 23));
    expect(night).toEqual(morning);
    expect(buildPlan(nextDay(DAY)).map((s) => s.href)).not.toEqual(morning.map((s) => s.href));
  });

  it("always has the four steps in order, about 15 minutes in total", () => {
    for (let i = 0; i < 30; i++) {
      const plan = buildPlan(nextDay(DAY, i));
      expect(plan.map((s) => s.id)).toEqual(["drill", "pyq", "cards", "game"]);
      expect(plan.reduce((m, s) => m + s.minutes, 0)).toBe(15);
    }
  });

  it("uses a local-time day key", () => {
    expect(dayKey(DAY)).toBe("2026-11-11");
  });
});

describe("progress", () => {
  it("ticks steps off as activity is recorded", () => {
    const plan = buildPlan(DAY);
    recordPlanActivity("cards", 4, DAY);
    const cards = plan.find((s) => s.id === "cards")!;
    expect(readProgress(DAY).cards).toBe(4);
    expect(isStepDone(cards, readProgress(DAY))).toBe(false);
    recordPlanActivity("cards", 6, DAY);
    expect(isStepDone(cards, readProgress(DAY))).toBe(true);
  });

  it("keeps each day's progress separate", () => {
    recordPlanActivity("drill", 1, DAY);
    expect(readProgress(nextDay(DAY)).drill).toBe(0);
  });
});

describe("plan streak", () => {
  it("starts at 1 when the whole plan is finished, and only then", () => {
    recordPlanActivity("drill", 1, DAY);
    expect(readStreak(DAY)).toBe(0);
    finishAll(DAY);
    expect(readStreak(DAY)).toBe(1);
  });

  it("grows on consecutive days and survives until the end of the next day", () => {
    finishAll(DAY);
    finishAll(nextDay(DAY));
    expect(readStreak(nextDay(DAY))).toBe(2);
    expect(readStreak(nextDay(DAY, 2))).toBe(2); // not done yet today, still alive
  });

  it("resets after a missed day", () => {
    finishAll(DAY);
    expect(readStreak(nextDay(DAY, 2))).toBe(0);
    finishAll(nextDay(DAY, 2));
    expect(readStreak(nextDay(DAY, 2))).toBe(1);
  });

  it("doesn't double-count extra practice on a finished day", () => {
    finishAll(DAY);
    recordPlanActivity("game", 1, DAY);
    finishAll(DAY);
    expect(readStreak(DAY)).toBe(1);
  });
});

describe("step-done announcement", () => {
  it("fires once when a step is completed, with the next step", () => {
    recordPlanActivity("cards", 4, DAY);
    expect(stepDone()).toHaveLength(0);
    recordPlanActivity("cards", 6, DAY);
    const [d] = stepDone();
    expect(d.step.id).toBe("cards");
    expect(d.done).toBe(1);
    expect(d.next?.id).toBe("drill");
    expect(d.complete).toBe(false);
    recordPlanActivity("cards", 3, DAY); // extra practice: no second announcement
    expect(stepDone()).toHaveLength(1);
  });

  it("marks the last step as completing the plan, with the streak", () => {
    finishAll(DAY);
    const all = stepDone();
    expect(all).toHaveLength(4);
    const last = all[3];
    expect(last.complete).toBe(true);
    expect(last.next).toBeNull();
    expect(last.streak).toBe(1);
  });
});
