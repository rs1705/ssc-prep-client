"use client";

import { describeRoute, logActivity, logMistakes } from "@/lib/activity-log";
import { recordPlanActivity } from "@/lib/today-plan";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  BookOpen,
  CheckCircle2,
  Crown,
  Flame,
  LayoutGrid,
  Repeat,
  RotateCcw,
  Sprout,
  Star,
  Target,
  ThumbsUp,
  Timer,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { replayHref } from "./sessionSet";
import { CTA, DUO } from "./buttons";
import { TONE_BAND, type GameTone } from "./tone";
import { ActionBar } from "./ActionBar";
import { ResultHero } from "./ResultHero";
import { STREAK_BAND, StatTile, accuracySignal } from "./StatTile";

export interface ResultStat {
  label: string;
  value: string;
}

interface ResultSummaryProps {
  kicker: string;
  rank: string;
  score: number;
  best: number;
  isNewBest: boolean;
  stats: ResultStat[];
  /** Scrollable detail below the stats (e.g. words to review). */
  children?: React.ReactNode;
  onPlayAgain: () => void;
  tone?: GameTone;
  allHref?: string;
  allLabel?: string;
  /** Extra line under the score, e.g. a bonus. */
  note?: string;
  /** Fire confetti even without a new best (e.g. a perfect run). */
  celebrate?: boolean;
  /** Right answers out of total, for the dashboard. */
  result?: { correct: number; total: number };
  /** What the player got wrong, saved for the dashboard's mistakes card. */
  mistakes?: { prompt: string; answer: string; detail?: string; options?: string[] }[];
  /** Replays the exact same set (shuffled). Shows "Same set again". */
  onReplaySet?: () => void;
  /** Replays only what was missed. Shows "Retry N mistakes" when N > 0. */
  onRetryMistakes?: () => void;
  /** How many items "Retry mistakes" will bring back. */
  retryCount?: number;
}

export function ResultSummary({
  kicker,
  rank,
  score,
  best,
  isNewBest,
  stats,
  children,
  onPlayAgain,
  tone = "english",
  allHref = "/SSC/english/games",
  allLabel = "All games",
  note,
  celebrate = false,
  result,
  mistakes = [],
  onReplaySet,
  onRetryMistakes,
  retryCount = 0,
}: ResultSummaryProps) {
  // A finished game counts towards today's plan, exactly once per results screen.
  const counted = useRef(false);
  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    const path = window.location.pathname;
    recordPlanActivity("game", path);
    const route = describeRoute(path);
    // With a saved set, the dashboard's "Go again" reopens this exact set.
    const href = onReplaySet ? replayHref(path) : path;
    logActivity({ kind: "game", subject: route.subject, label: route.label, href, ...result });
    logMistakes(mistakes.map((m) => ({ ...m, subject: route.subject, source: route.label, href: path })));
    // Logged once, when the results first appear.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isNewBest && !celebrate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.4 } });
  }, [isNewBest, celebrate]);

  const tiles = [{ label: "Score", value: String(score) }, ...stats].slice(0, 4);
  const main = onRetryMistakes && retryCount > 0 ? "retry" : onReplaySet ? "replay" : "again";
  // Buttons under the main one; an odd last one spans the row on phones.
  const secondaryCount = 1 + (main !== "again" ? 1 : 0) + (main === "retry" && onReplaySet ? 1 : 0);
  const BadgeIcon = isNewBest ? Trophy : celebrate ? Crown : accuracyOf(stats) >= 80 ? Star : accuracyOf(stats) >= 50 ? ThumbsUp : Sprout;

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pb-1 [scrollbar-width:none]">
        <ResultHero
          icon={BadgeIcon}
          badgeClass={isNewBest ? "bg-brand-500 text-white" : TONE_BAND[tone]}
          headline={rank}
          line={
            <>
              {kicker}
              {note && <span className="block text-xs font-bold text-emerald-700 dark:text-emerald-400">{note}</span>}
            </>
          }
          ribbon={
            isNewBest ? (
              <span className="mt-1 flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
                <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                New best score
              </span>
            ) : best > 0 ? (
              <span className="mt-1 text-xs font-semibold text-muted-foreground">
                Your best: <span className="tabular-nums text-foreground">{best}</span>
              </span>
            ) : null
          }
        />

        <dl className={cn("grid gap-2", tiles.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")} aria-label="Your results">
          {tiles.map((t, i) => {
            const { value, suffix } = splitNumber(t.value);
            const isAccuracy = /accuracy/i.test(t.label);
            return (
              <div key={t.label} className="contents">
                <dt className="sr-only">{t.label}</dt>
                <dd className="contents">
                  <StatTile
                    label={t.label}
                    value={value ?? 0}
                    suffix={suffix}
                    display={value === null ? t.value : undefined}
                    icon={iconFor(t.label)}
                    band={i === 0 ? TONE_BAND[tone] : /streak|combo/i.test(t.label) ? STREAK_BAND : "bg-brand-600 text-white"}
                    signal={isAccuracy && value !== null ? accuracySignal(value) : undefined}
                    index={i}
                  />
                </dd>
              </div>
            );
          })}
        </dl>

        {children && <div className="flex flex-col gap-2">{children}</div>}
      </div>

      <ActionBar>
        {main === "retry" && (
          <button type="button" onClick={onRetryMistakes} autoFocus className={CTA.primary}>
            <Target className="h-5 w-5" aria-hidden="true" />
            Retry {retryCount} {retryCount === 1 ? "mistake" : "mistakes"}
          </button>
        )}
        {main === "replay" && (
          <button type="button" onClick={onReplaySet} autoFocus className={CTA.primary}>
            <Repeat className="h-5 w-5" aria-hidden="true" />
            Same set again
          </button>
        )}
        {main === "again" && (
          <button type="button" onClick={onPlayAgain} autoFocus className={CTA.primary}>
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            Play again
          </button>
        )}
        {/* One even row: icon above label, so every icon lines up. */}
        <div className={cn("grid gap-2.5", secondaryCount === 3 ? "grid-cols-3" : secondaryCount === 2 ? "grid-cols-2" : "grid-cols-1")}>
          {main === "retry" && onReplaySet && (
            <button type="button" onClick={onReplaySet} className={SECONDARY}>
              <Repeat className="h-5 w-5" aria-hidden="true" />
              Same set
            </button>
          )}
          {main !== "again" && (
            <button type="button" onClick={onPlayAgain} className={SECONDARY}>
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              {onReplaySet ? "New set" : "Play again"}
            </button>
          )}
          <Link href={allHref} className={SECONDARY}>
            <LayoutGrid className="h-5 w-5" aria-hidden="true" />
            {allLabel}
          </Link>
        </div>
      </ActionBar>
    </div>
  );
}

/** Small results buttons: icon stacked over a one-line label, all the same size. */
const SECONDARY = cn(DUO.secondary, "min-h-16 flex-col gap-1 px-1 py-2 text-[11px] leading-none whitespace-nowrap");

/** "8/10" → 8 and "/10"; "80%" → 80 and "%"; anything without a leading number → null. */
export function splitNumber(text: string): { value: number | null; suffix: string } {
  const m = /^(\d+(?:\.\d+)?)(.*)$/.exec(text.trim());
  return m ? { value: Number(m[1]), suffix: m[2] } : { value: null, suffix: "" };
}

/** The accuracy among the stats, as a number (0 when there is none). */
function accuracyOf(stats: ResultStat[]): number {
  const s = stats.find((x) => /accuracy/i.test(x.label));
  return s ? (splitNumber(s.value).value ?? 0) : 0;
}

function iconFor(label: string): LucideIcon {
  if (/score/i.test(label)) return Zap;
  if (/accuracy/i.test(label)) return Target;
  if (/correct|right|solved|found/i.test(label)) return CheckCircle2;
  if (/streak|combo/i.test(label)) return Flame;
  if (/time|pace|sec/i.test(label)) return Timer;
  if (/word|card|letter/i.test(label)) return BookOpen;
  return Star;
}
