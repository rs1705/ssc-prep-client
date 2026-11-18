"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The top of a results screen: a badge that pops in with a soft ring behind it, the
 * headline, and one encouraging line. The badge carries the screen's colour.
 */
export function ResultHero({
  icon: Icon,
  badgeClass,
  kicker,
  headline,
  line,
  ribbon,
}: {
  icon: LucideIcon;
  /** Solid background + text classes for the badge (subject tone, or brand for a new best). */
  badgeClass: string;
  kicker?: string;
  headline: string;
  line?: React.ReactNode;
  /** A small pill under the line, e.g. "New best score!". */
  ribbon?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col items-center gap-2 pt-1 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center">
        {!reduce && (
          <motion.span
            aria-hidden="true"
            className={cn("absolute inset-0 rounded-full opacity-20", badgeClass)}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.25, 1.1], opacity: [0, 0.25, 0.18] }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
        <motion.div
          initial={reduce ? false : { scale: 0.3, rotate: -18, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
          className={cn(
            "relative flex h-[76px] w-[76px] items-center justify-center rounded-[1.6rem] border-b-[6px] border-black/20 shadow-sm",
            badgeClass,
          )}
        >
          <Icon className="h-10 w-10" strokeWidth={2.2} aria-hidden="true" />
        </motion.div>
      </div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.3 }}
        className="flex flex-col items-center gap-1"
      >
        {kicker && <span className="section-label">{kicker}</span>}
        <h2 className="text-[1.65rem] font-extrabold leading-tight tracking-tight text-foreground">{headline}</h2>
        {line && <p className="max-w-xs text-sm font-medium leading-relaxed text-muted-foreground">{line}</p>}
        {ribbon}
      </motion.div>
    </div>
  );
}
