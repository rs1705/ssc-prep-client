import type { StatSignal } from "@/features/games/StatTile";

/** A short headline for the end of a drill, from accuracy (0–100) and how many were tried. */
export function drillHeadline(accuracy: number, attempted: number): string {
  if (attempted === 0) return "Give it a go";
  if (accuracy === 100) return attempted >= 5 ? "Flawless!" : "Perfect start";
  if (accuracy >= 90) return "Brilliant work";
  if (accuracy >= 75) return "Great run";
  if (accuracy >= 50) return "Good effort";
  return "Keep at it";
}

/** The longest run of right answers in a row. */
export function bestStreak(history: { status: string }[]): number {
  let best = 0;
  let run = 0;
  for (const h of history) {
    run = h.status === "correct" ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

/** Average seconds per answer against the drill's target: at or under is good, up to 1.5× needs work. */
export function paceSignal(avgSeconds: number, targetSeconds: number): StatSignal {
  if (avgSeconds <= 0) return "okay";
  if (avgSeconds <= targetSeconds) return "good";
  return avgSeconds <= targetSeconds * 1.5 ? "okay" : "poor";
}

/** Storage key for a drill's best score: each topic, mode, length and level has its own. */
export function drillBestKey(topic: string, mode: string, limit: number | null, difficulty: string): string {
  return `ssc:maths:${topic}:${mode}-${limit ?? 0}-${difficulty}:best`;
}
