"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCountUp } from "./useCountUp";

/** What a stat means, for its label band: the subject colour, or a right/needs-work/wrong signal. */
export type StatSignal = "good" | "okay" | "poor";

const SIGNAL_BAND: Record<StatSignal, string> = {
  good: "bg-[#58cc02] text-white [text-shadow:0_1px_0_rgb(0_0_0/0.18)]",
  okay: "bg-amber-500 text-amber-950",
  poor: "bg-rose-600 text-white",
};

/** Label band for streak and combo tiles: a warm flame orange that stands out. */
export const STREAK_BAND = "bg-orange-500 text-white";

/** Accuracy as a signal: 80%+ good, 50–79% needs work, below 50% poor. */
export function accuracySignal(percent: number): StatSignal {
  return percent >= 80 ? "good" : percent >= 50 ? "okay" : "poor";
}

/**
 * One results tile: a coloured label band on top (the tile's one coloured element),
 * the number counting up below it, and a short note.
 */
export function StatTile({
  label,
  value,
  suffix = "",
  decimals = 0,
  icon: Icon,
  band,
  signal,
  note,
  index = 0,
  display,
}: {
  label: string;
  /** Counted up from zero. */
  value: number;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  /** Band classes for a subject tile (TONE_BAND); ignored when `signal` is set. */
  band?: string;
  signal?: StatSignal;
  note?: string;
  /** Position in the row, for a staggered entrance. */
  index?: number;
  /** Text to show instead of the number (e.g. "—" when there is nothing to measure). */
  display?: string;
}) {
  const reduce = useReducedMotion();
  const shown = useCountUp(value, { delay: 250 + index * 120, decimals });
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.15 + index * 0.12, type: "spring", stiffness: 320, damping: 24 }}
      className="flex min-w-0 flex-col overflow-hidden rounded-2xl border-2 border-b-4 border-border bg-card"
    >
      <div
        className={cn(
          "flex items-center justify-center gap-1 px-1.5 py-1 text-[11px] font-extrabold uppercase tracking-wide",
          signal ? SIGNAL_BAND[signal] : band ?? "bg-muted text-foreground",
        )}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{label}</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-1.5 py-2.5">
        <span className="text-2xl font-extrabold tabular-nums leading-none text-foreground">
          {display ?? `${decimals > 0 ? shown.toFixed(decimals) : shown}${suffix}`}
        </span>
        {note && <span className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">{note}</span>}
      </div>
    </motion.div>
  );
}
