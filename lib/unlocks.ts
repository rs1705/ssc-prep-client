/**
 * What XP unlocks. Practice always stays open; past-year papers open one by one.
 *
 * Papers are taken newest first. The newest is free; each older one needs one more level
 * and 30 more questions practised in all. The rule only looks at totals that never go
 * down, so a paper never locks again once open, and one already attempted is always open.
 */

export const PAPER_QUESTIONS_STEP = 30;

export interface PaperLock {
  open: boolean;
  /** What is still needed (0 when met). */
  levelNeeded: number;
  questionsNeeded: number;
  /** The targets, for the progress bar. */
  level: number;
  questions: number;
}

export function paperLock(index: number, ctx: { level: number; answered: number; attempted: boolean }): PaperLock {
  const level = index + 1;
  const questions = index * PAPER_QUESTIONS_STEP;
  const levelNeeded = Math.max(0, level - ctx.level);
  const questionsNeeded = Math.max(0, questions - ctx.answered);
  return {
    open: index === 0 || ctx.attempted || (levelNeeded === 0 && questionsNeeded === 0),
    levelNeeded,
    questionsNeeded,
    level,
    questions,
  };
}

/** "Reach level 3 and answer 20 more questions" — what's left, in words. */
export function lockText(l: PaperLock): string {
  const parts: string[] = [];
  if (l.levelNeeded > 0) parts.push(`reach level ${l.level}`);
  if (l.questionsNeeded > 0) parts.push(`answer ${l.questionsNeeded} more question${l.questionsNeeded === 1 ? "" : "s"}`);
  const s = parts.join(" and ");
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}
