"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DUO } from "@/features/games/buttons";
import { subjectTheme, type SubjectKey } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";
import { SNAPPY_EASE } from "./motion";
import { usePyqCounts } from "./usePyqCounts";

const SECTIONS: { key: SubjectKey; name: string }[] = [
  { key: "maths", name: "Quant" },
  { key: "reasoning", name: "Reasoning" },
  { key: "english", name: "English" },
  { key: "gk", name: "GK" },
];

/** Left side of the landing hero: the promise, the call to action and real numbers. */
export function HeroCopy() {
  const { total } = usePyqCounts();

  const stats = [
    { value: total ?? "Real", label: "past-paper PYQs" },
    { value: 21, label: "speed drills" },
    { value: 637, label: "flashcards" },
    { value: 6, label: "word games" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: SNAPPY_EASE }}
      className="flex flex-col items-start text-left"
    >
      <span className="mb-5 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground">
        <span className="hidden text-muted-foreground sm:inline">SSC CGL Tier 1</span>
        {SECTIONS.map(({ key, name }) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", subjectTheme(key).dot)} aria-hidden="true" />
            {name}
          </span>
        ))}
      </span>

      <h1 className="mb-4 text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Practice the questions{" "}
        <span className="relative whitespace-nowrap">
          <span className="relative z-10 bg-gradient-to-r from-brand-500 to-brand-alt-500 bg-clip-text text-transparent">
            SSC actually asks.
          </span>
          {/* Hand-drawn underline */}
          <svg
            viewBox="0 0 300 12"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute -bottom-1.5 left-0 h-3 w-full text-brand-500/35"
          >
            <path d="M2 9 C 80 2, 200 2, 298 7" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </span>
      </h1>

      <p className="mb-7 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
        Real Tier 1 questions with step-by-step answers, speed drills that make you faster, and mistakes that come back
        until you get them right. <span className="font-semibold text-foreground">All in 15 minutes a day.</span>
      </p>

      <div className="mb-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link href="/practice" className={cn(DUO.primary, "w-full px-7 text-sm sm:w-auto sm:text-base")}>
          Start practicing, free
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
        <Link href="/dashboard" className={cn(DUO.secondary, "w-full px-6 text-sm sm:w-auto sm:text-base")}>
          See today&apos;s plan
        </Link>
      </div>

      <dl className="grid w-full max-w-xl grid-cols-4 gap-2 border-t-2 border-border pt-5">
        {stats.map((s) => (
          <div key={s.label} className="min-w-0">
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-mono text-xl font-black tabular-nums text-foreground sm:text-2xl">{s.value}</dd>
            <dd className="text-xs leading-tight text-muted-foreground">{s.label}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}
