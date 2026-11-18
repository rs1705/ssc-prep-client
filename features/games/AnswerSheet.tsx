"use client";

import { ArrowRight, Check, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CTA } from "./buttons";

/**
 * What appears after an answer: a tinted panel that rises from the bottom of the game
 * with the verdict, the right answer when it was missed, an optional line of detail, and
 * one big Continue button in the verdict's colour. Enter or the button moves on.
 */
export function AnswerSheet({
  correct,
  answer,
  detail,
  continueLabel = "Continue",
  onContinue,
  verdict,
  bleed = true,
}: {
  correct: boolean;
  /** The right answer, shown when the player missed it. */
  answer?: React.ReactNode;
  detail?: React.ReactNode;
  continueLabel?: string;
  onContinue: () => void;
  /** Replaces "Correct!" / "Not quite" (e.g. "Solved! +30"). */
  verdict?: React.ReactNode;
  /** Run to the edges of the game card (default). Off: a rounded panel inside the game. */
  bleed?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={cn(
        "mt-auto flex shrink-0 flex-col gap-3 rounded-3xl",
        bleed
          ? "-mx-4 -mb-4 border-t-2 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:-mb-6 sm:px-6 sm:pb-6"
          : "border-2 p-3.5",
        correct
          ? "border-emerald-500/50 bg-[color-mix(in_oklab,var(--color-emerald-500)_12%,var(--card))]"
          : "border-rose-500/50 bg-[color-mix(in_oklab,var(--color-rose-500)_12%,var(--card))]",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white",
            correct ? "bg-emerald-500" : "bg-rose-500",
          )}
          aria-hidden="true"
        >
          {correct ? <Check className="h-5 w-5" strokeWidth={3} /> : <X className="h-5 w-5" strokeWidth={3} />}
        </span>
        <div className="min-w-0 flex-1" role="status" aria-live="polite">
          <p
            className={cn(
              "text-lg font-extrabold leading-tight",
              correct ? "text-emerald-800 dark:text-emerald-200" : "text-rose-800 dark:text-rose-200",
            )}
          >
            {verdict ?? (correct ? "Correct!" : "Not quite")}
          </p>
          {!correct && answer && (
            <p className="mt-0.5 text-sm font-semibold text-rose-900/90 dark:text-rose-100/90">
              Answer: <span className="font-extrabold">{answer}</span>
            </p>
          )}
          {detail && <div className="mt-1.5 text-sm leading-relaxed text-foreground/85">{detail}</div>}
        </div>
      </div>
      <button type="button" onClick={onContinue} autoFocus className={correct ? CTA.correct : CTA.wrong}>
        {continueLabel}
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </motion.div>
  );
}
