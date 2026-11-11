"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Flame, PartyPopper, X } from "lucide-react";
import { DUO } from "@/features/games/buttons";
import { playFeedback } from "@/features/games/feedback";
import { readPreferences } from "@/lib/preferences";
import { PLAN_STEP_DONE_EVENT, type PlanStepDoneDetail } from "@/lib/today-plan";
import { cn } from "@/lib/utils";

const STEP_MS = 7000;
const COMPLETE_MS = 10000;

/**
 * Tells the student, wherever they are, that they just finished a step of
 * today's plan, and offers the next one. Finishing the last step gets a bigger
 * celebration. Mounted once in the app layout.
 */
export function PlanStepToast() {
  const [info, setInfo] = useState<PlanStepDoneDetail | null>(null);
  const timer = useRef<number | null>(null);

  const close = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setInfo(null);
  }, []);

  useEffect(() => {
    const onDone = (e: Event) => {
      const detail = (e as CustomEvent<PlanStepDoneDetail>).detail;
      if (!detail) return;
      setInfo(detail);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setInfo(null), detail.complete ? COMPLETE_MS : STEP_MS);
      const rm = readPreferences().reducedMotion;
      const calm = rm === "on" || (rm === "system" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      if (detail.complete && !calm) {
        // Let the game's own results confetti go first.
        window.setTimeout(() => confetti({ particleCount: 140, spread: 90, origin: { y: 0.75 } }), 600);
      }
      if (detail.complete) window.setTimeout(() => playFeedback("finish"), 600);
    };
    window.addEventListener(PLAN_STEP_DONE_EVENT, onDone);
    return () => {
      window.removeEventListener(PLAN_STEP_DONE_EVENT, onDone);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-auto md:top-20 md:justify-end md:px-6"
    >
      <AnimatePresence>
        {info && (
          <motion.div
            key={`${info.step.id}-${info.done}`}
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={cn(
              "pointer-events-auto w-full max-w-sm rounded-3xl border-2 border-b-[5px] bg-card p-4 shadow-xl",
              info.complete ? "border-emerald-600" : "border-emerald-500/70",
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white",
                  info.complete ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-emerald-500",
                )}
              >
                {info.complete ? <PartyPopper className="h-5 w-5" aria-hidden="true" /> : <Check className="h-6 w-6" aria-hidden="true" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  {info.complete ? "Today's plan complete" : `Step ${info.done} of ${info.total} done`}
                </p>
                <p className="mt-0.5 font-extrabold text-foreground">
                  {info.complete ? "All four steps finished. Brilliant work!" : info.step.title}
                </p>
                {info.complete && info.streak > 0 && (
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 dark:text-brand-300">
                    <Flame className="h-4 w-4" aria-hidden="true" />
                    {info.streak}-day plan streak
                  </p>
                )}
                {/* Progress pips */}
                <div className="mt-2 flex gap-1" aria-hidden="true">
                  {Array.from({ length: info.total }, (_, i) => (
                    <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < info.done ? "bg-emerald-500" : "bg-muted")} />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Dismiss"
                className="-m-1 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <Link
              href={info.next ? info.next.href : "/dashboard"}
              onClick={close}
              className={cn(info.complete ? DUO.success : DUO.primary, "mt-3 min-h-11 w-full text-xs")}
            >
              {info.next ? `Next: ${info.next.title}` : "See your dashboard"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
