"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, Check, Flame, Gamepad2, Layers, PartyPopper, Zap, type LucideIcon } from "lucide-react";
import { DUO } from "@/features/games/buttons";
import { cn } from "@/lib/utils";
import { isStepDone, useTodayPlan, type PlanStepId } from "@/lib/today-plan";

const STEP_ICON: Record<PlanStepId, LucideIcon> = {
  drill: Zap,
  pyq: BookOpenCheck,
  cards: Layers,
  game: Gamepad2,
};

function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const ratio = total ? done / total : 0;
  return (
    <div className="relative h-32 w-32 shrink-0" role="img" aria-label={`${done} of ${total} steps done`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="12" className="stroke-muted" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - ratio)}
          className={cn("transition-[stroke-dashoffset] duration-700 ease-out", ratio === 1 ? "stroke-emerald-500" : "stroke-brand-500")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold tabular-nums text-foreground">
          {done}/{total}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">steps</span>
      </div>
    </div>
  );
}

/** Dashboard hero: today's short plan, ticking itself off as the student practises. */
export function TodayPlanHero() {
  const { plan, progress, streak, done, total, next, minutesLeft } = useTodayPlan();
  const complete = done === total;
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const heading = complete ? "Plan complete!" : done === 0 ? "Your 15 minutes for today" : `${done} of ${total} done`;
  const sub = complete
    ? "Great work. Come back tomorrow for a fresh plan, or keep practising."
    : done === 0
      ? "Four short steps across the paper. Each one ticks itself off when you finish it."
      : `About ${minutesLeft} minutes left. Keep going.`;

  return (
    <section
      aria-labelledby="today-plan-heading"
      className="surface-card grid gap-6 rounded-3xl p-5 sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-8"
    >
      {/* Ring, streak */}
      <div className="flex items-center gap-5 lg:flex-col lg:justify-center lg:gap-4 lg:border-r-2 lg:border-border lg:pr-8">
        <ProgressRing done={done} total={total} />
        <div className="flex flex-col gap-2 lg:items-center lg:text-center">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 self-start rounded-full border-2 px-3 py-1 text-xs font-bold lg:self-center",
              streak > 0
                ? "border-brand-500/40 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] text-brand-700 dark:text-brand-300"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
            {streak > 0 ? `${streak}-day plan streak` : "Start a streak today"}
          </span>
          <span className="text-xs text-muted-foreground">{today}</span>
        </div>
      </div>

      {/* Plan */}
      <div className="flex min-w-0 flex-col gap-4">
        <div>
          <p className="section-label">Today&apos;s plan</p>
          <h2 id="today-plan-heading" className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-foreground">
            {heading}
            {complete && <PartyPopper className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
        </div>

        <ol className="grid gap-2 sm:grid-cols-2">
          {plan.map((step, i) => {
            const Icon = STEP_ICON[step.id];
            const isDone = isStepDone(step, progress);
            const isNext = next?.id === step.id;
            const count = Math.min(progress[step.id], step.target);
            return (
              <li key={step.id}>
                <Link
                  href={step.href}
                  className={cn(
                    "group flex h-full items-center gap-3 rounded-2xl border-2 p-3 transition-colors",
                    isDone
                      ? "border-emerald-500/40 bg-[color-mix(in_oklab,var(--color-emerald-500)_8%,var(--card))]"
                      : isNext
                        ? "border-brand-500/60 bg-[color-mix(in_oklab,var(--brand-500)_8%,var(--card))] hover:border-brand-500"
                        : "border-border bg-card hover:bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2",
                      isDone
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : isNext
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {isDone ? <Check className="h-5 w-5" aria-hidden="true" /> : <Icon className="h-5 w-5" aria-hidden="true" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">Step {i + 1}</span>
                      <span className="text-xs text-muted-foreground">· {step.minutes} min</span>
                    </span>
                    <span className={cn("block truncate font-bold", isDone ? "text-muted-foreground line-through" : "text-foreground")}>
                      {step.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {step.target > 1 && !isDone ? `${count}/${step.target} ${step.unit} · ` : ""}
                      {step.detail}
                    </span>
                  </span>
                  {!isDone && (
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  )}
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {next ? (
            <Link href={next.href} className={cn(DUO.primary, "w-full sm:w-auto")}>
              {done === 0 ? "Start today's plan" : `Next: ${next.title}`}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <Link href="/practice" className={cn(DUO.success, "w-full sm:w-auto")}>
              Keep practising
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          <span className="text-center text-xs text-muted-foreground sm:text-left">Saved on this device</span>
        </div>
      </div>
    </section>
  );
}
