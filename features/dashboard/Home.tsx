"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, ArrowUpRight, Brain, Check, ClipboardCheck, Flame, Gamepad2, Layers, type LucideIcon } from "lucide-react";
import { resumeHref, type Unfinished } from "@/features/games/unfinished";
import { HUE, practiseHref, type LeafInfo } from "@/features/pyq/topic-map";
import { pickForReview, subjectStats, type ActivityEntry, type MistakeEntry } from "@/lib/activity-log";
import { SUBJECT_LABEL, type SubjectKey } from "@/lib/subject-theme";
import { isStepDone, useTodayPlan } from "@/lib/today-plan";
import { cn } from "@/lib/utils";
import type { PyqTopicNode } from "@/redux/PyqApi";
import { CountUp, MistakeFlip } from "./Interactive";

/**
 * The dashboard. One primary action (the hero's button); the main column is for doing,
 * the side rail for checking. Brand colour marks the action and progress only; subjects
 * are told apart by small dots.
 */

const SUBJECTS: SubjectKey[] = ["maths", "reasoning", "english", "gk"];
const DAY = 86_400_000;

/** Section label: small, uppercase, quiet. */
export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground", className)}>{children}</p>;
}

export const panel = "rounded-3xl border border-border/70 bg-card";

/* ---------------- Hero: today ---------------- */

export function Hero({ name, greeting, unfinished }: { name: string; greeting: string; unfinished: Unfinished[] }) {
  const { plan, progress, streak, done, total, next, minutesLeft } = useTodayPlan();
  const complete = done === total;
  const resume = unfinished[0];
  const status = complete
    ? "Today's plan is done. Anything more is a bonus."
    : done === 0
      ? `Four short steps, about ${minutesLeft} minutes.`
      : `${done} of ${total} done · about ${minutesLeft} minutes left.`;

  return (
    <section aria-labelledby="hero-heading" className={cn(panel, "relative overflow-hidden p-6 sm:p-8")}>
      {/* a soft wash of brand colour, nothing more */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" aria-hidden="true" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{greeting},</p>
          <h1 id="hero-heading" className="mt-0.5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {name}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>{status}</span>
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 font-semibold text-orange-600 dark:text-orange-400">
                <Flame className="h-4 w-4 motion-safe:animate-flicker" aria-hidden="true" />
                <CountUp value={streak} />-day streak
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          {next ? (
            <Link
              href={next.href}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-6 text-[15px] font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30"
            >
              {done === 0 ? "Start today's plan" : `Continue · ${next.title}`}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          ) : (
            <Link href="/practice" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 text-[15px] font-bold text-white hover:bg-emerald-600">
              Keep practising
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          {resume && (
            <Link href={resumeHref(resume.path)} className="text-center text-xs font-semibold text-muted-foreground hover:text-foreground sm:text-right">
              or resume {resume.label} ({resume.done}/{resume.total})
            </Link>
          )}
        </div>
      </div>

      {/* the plan as a quiet stepper: progress first, each step a link but not a button */}
      <ol className="relative mt-7 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
        {plan.map((step) => {
          const isDone = isStepDone(step, progress);
          const isNext = next?.id === step.id;
          const part = Math.min(1, progress[step.id] / step.target);
          return (
            <li key={step.id}>
              <Link href={step.href} className="group block">
                <span className="block h-1.5 overflow-hidden rounded-full bg-muted">
                  <span
                    className={cn("block h-full rounded-full transition-[width] duration-700", isDone ? "bg-emerald-500" : "bg-brand-500")}
                    style={{ width: `${(isDone ? 1 : part) * 100}%` }}
                  />
                </span>
                <span className="mt-2 flex items-center gap-1.5">
                  {isDone && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500 motion-safe:animate-pop" aria-hidden="true" />}
                  <span
                    className={cn(
                      "truncate text-sm font-semibold group-hover:underline",
                      isDone ? "text-muted-foreground" : isNext ? "text-foreground" : "text-foreground/70",
                    )}
                  >
                    {step.title}
                  </span>
                </span>
                <span className="block text-xs text-muted-foreground">
                  {isDone ? "Done" : `${step.minutes} min${step.target > 1 ? ` · ${Math.min(progress[step.id], step.target)}/${step.target}` : ""}`}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------------- Quick actions ---------------- */

const ACTIONS: { href: string; title: string; sub: string; icon: LucideIcon; tint: string }[] = [
  { href: "/mock-tests", title: "Mock test", sub: "Full paper, timed", icon: ClipboardCheck, tint: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300" },
  { href: "/SSC/english/flashcards", title: "Flashcards", sub: "Words & formulas", icon: Layers, tint: "bg-sky-500/10 text-sky-600 dark:text-sky-300" },
  { href: "/SSC/english/games", title: "Word games", sub: "Six quick games", icon: Gamepad2, tint: "bg-pink-500/10 text-pink-600 dark:text-pink-300" },
  { href: "/SSC/maths/mental-maths", title: "Mental maths", sub: "Speed drills", icon: Brain, tint: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
];

/** Shortcuts: quiet tiles, one tap each. */
export function QuickActions() {
  return (
    <nav aria-label="Quick actions" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACTIONS.map(({ href, title, sub, icon: Icon, tint }) => (
        <Link
          key={href}
          href={href}
          className={cn(panel, "group flex items-center gap-3 p-3.5 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md")}
        >
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110", tint)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-foreground">{title}</span>
            <span className="block truncate text-xs text-muted-foreground">{sub}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}

/* ---------------- Rail: review ---------------- */

export function ReviewPanel({ mistakes }: { mistakes: MistakeEntry[] }) {
  const due = pickForReview(mistakes, 999).length;
  return (
    <section aria-labelledby="review-heading" className={cn(panel, "flex flex-col gap-4 p-5")}>
      <div className="flex items-baseline justify-between">
        <Label>
          <span id="review-heading">Fix your mistakes</span>
        </Label>
        {due > 0 && (
          <span className="text-sm font-bold text-foreground">
            <CountUp value={due} /> <span className="font-medium text-muted-foreground">due</span>
          </span>
        )}
      </div>
      {due > 0 ? (
        <>
          <MistakeFlip due={pickForReview(mistakes, 10)} />
          <Link href="/review" className="inline-flex items-center gap-1 self-start text-sm font-semibold text-foreground hover:underline">
            Full review session
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Nothing to fix. Questions you get wrong come here.</p>
      )}
    </section>
  );
}

/* ---------------- Rail: subjects ---------------- */

export function SubjectsPanel({
  activities,
  now,
  trees,
  share,
}: {
  activities: ActivityEntry[];
  now: number;
  trees: Record<SubjectKey, PyqTopicNode[]>;
  share: (nodes: PyqTopicNode[]) => number;
}) {
  return (
    <section aria-labelledby="subjects-heading" className={cn(panel, "p-5")}>
      <Label>
        <span id="subjects-heading">Your progress</span>
      </Label>
      <Donut trees={trees} share={share} />
      <ul className="mt-3 flex flex-col">
        {SUBJECTS.map((key) => {
          const pct = Math.round(share(trees[key]) * 100);
          const stats = subjectStats(activities, key, now);
          return (
            <li key={key}>
              <Link href={`/SSC/${key}`} className="group -mx-2 flex flex-col gap-1.5 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: HUE[key] }} aria-hidden="true" />
                  <span className="flex-1 text-sm font-semibold text-foreground">{SUBJECT_LABEL[key]}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{stats.accuracy === null ? "–" : `${stats.accuracy}% right`}</span>
                  <span className="w-9 text-right text-sm font-bold tabular-nums text-foreground">{pct}%</span>
                </span>
                <span className="ml-4 block h-1 overflow-hidden rounded-full bg-muted">
                  <span className="block h-full rounded-full transition-[width] duration-700" style={{ width: `${Math.max(pct, pct > 0 ? 3 : 0)}%`, background: HUE[key] }} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">Share of past-year questions done · accuracy this month</p>
    </section>
  );
}

/** All past-year questions as one ring, each subject's done share in its colour. */
function Donut({ trees, share }: { trees: Record<SubjectKey, PyqTopicNode[]>; share: (nodes: PyqTopicNode[]) => number }) {
  const parts = SUBJECTS.map((key) => {
    const total = trees[key].reduce((n, t) => n + t.children.reduce((m, c) => m + c.count, 0), 0);
    return { key, total, done: share(trees[key]) * total };
  });
  const total = parts.reduce((n, p) => n + p.total, 0);
  const done = parts.reduce((n, p) => n + p.done, 0);
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="mt-3 flex items-center gap-5">
      <div className="relative h-32 w-32 shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`${Math.round((done / Math.max(total, 1)) * 100)}% of past-year questions done`}>
          <circle cx="60" cy="60" r={r} fill="none" strokeWidth="12" className="stroke-muted" />
          {parts.map((p) => {
            const len = total ? (p.done / total) * c : 0;
            const el = (
              <circle
                key={p.key}
                cx="60"
                cy="60"
                r={r}
                fill="none"
                strokeWidth="12"
                stroke={HUE[p.key]}
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                className="transition-all duration-700"
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold tabular-nums text-foreground">{Math.round((done / Math.max(total, 1)) * 100)}%</span>
          <span className="text-[10px] font-semibold text-muted-foreground">of all PYQs</span>
        </div>
      </div>
      <div className="text-sm">
        <p className="font-bold text-foreground">
          <CountUp value={Math.round(done)} /> <span className="font-medium text-muted-foreground">of {total}</span>
        </p>
        <p className="text-xs text-muted-foreground">past-year questions answered</p>
      </div>
    </div>
  );
}

/* ---------------- Rail: this week ---------------- */

export function WeekPanel({ activities, now }: { activities: ActivityEntry[]; now: number }) {
  const days = useMemo(() => {
    const d = new Date(now);
    const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)).getTime();
    const out = Array.from({ length: 7 }, () => ({ q: 0, right: 0 }));
    for (const a of activities) {
      if (a.at < monday || a.at > now) continue;
      const i = Math.floor((a.at - monday) / DAY);
      if (i < 0 || i > 6) continue;
      out[i].q += a.total ?? 1;
      out[i].right += a.correct ?? 0;
    }
    return out;
  }, [activities, now]);
  const q = days.reduce((n, d) => n + d.q, 0);
  const right = days.reduce((n, d) => n + d.right, 0);
  const max = Math.max(1, ...days.map((d) => d.q));
  const todayIdx = (new Date(now).getDay() + 6) % 7;
  return (
    <section aria-labelledby="week-heading" className={cn(panel, "p-5")}>
      <Label>
        <span id="week-heading">This week</span>
      </Label>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div className="flex gap-5">
          <div>
            <CountUp value={q} className="block text-2xl font-extrabold text-foreground" />
            <p className="text-xs text-muted-foreground">questions</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold tabular-nums text-foreground">{q ? `${Math.round((right / q) * 100)}%` : "–"}</p>
            <p className="text-xs text-muted-foreground">right</p>
          </div>
        </div>
        <div className="flex h-12 items-end gap-1" role="img" aria-label="Questions per day this week">
          {days.map((d, i) => (
            <div key={i} className="flex w-3 flex-col items-center gap-1">
              <div className="relative h-9 w-full">
                <div
                  className={cn("absolute inset-x-0 bottom-0 rounded-sm", i === todayIdx ? "bg-brand-500" : d.q ? "bg-brand-500/35" : "bg-muted")}
                  style={{ height: `${d.q ? Math.max(14, (d.q / max) * 100) : 10}%` }}
                />
              </div>
              <span className={cn("text-[9px] font-bold", i === todayIdx ? "text-foreground" : "text-muted-foreground")}>{"MTWTFSS"[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Main: topics to work on ---------------- */

export function FocusPanel({ leaves, now }: { leaves: Map<string, LeafInfo>; now: number }) {
  const list = useMemo(() => {
    const all = [...leaves.values()];
    const acc = (l: LeafInfo) => l.right / Math.max(l.done, 1);
    const due = all.filter((l) => l.status === "review").sort((a, b) => acc(a) - acc(b));
    const shaky = all.filter((l) => l.status === "growing").sort((a, b) => acc(a) - acc(b));
    const fresh = all.filter((l) => l.status === "bud").sort((a, b) => b.sub.count - a.sub.count);
    return [...due, ...shaky, ...fresh].slice(0, 5);
  }, [leaves]);
  if (list.length === 0) return null;
  return (
    <section aria-labelledby="focus-heading" className={cn(panel, "p-5 sm:p-6")}>
      <div className="flex items-baseline justify-between gap-2">
        <Label>
          <span id="focus-heading">Topics worth your time</span>
        </Label>
        <span className="text-xs text-muted-foreground">Based on your answers</span>
      </div>
      <ul className="mt-2 divide-y divide-border/70">
        {list.map((l) => {
          const acc = l.done ? Math.round((l.right / l.done) * 100) : null;
          const days = l.lastAt ? Math.round((now - l.lastAt) / DAY) : 0;
          const why =
            l.status === "review"
              ? acc !== null && acc < 60
                ? `${acc}% right`
                : `${days} days since you practised`
              : l.status === "growing"
                ? `${acc}% right so far`
                : `${l.sub.count} past-year questions`;
          return (
            <li key={l.sub.id}>
              <Link href={practiseHref(l)} className="group flex items-center gap-3 py-3">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: HUE[l.subject] }} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground group-hover:underline">{l.sub.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {SUBJECT_LABEL[l.subject]} · {l.topic.name}
                  </span>
                </span>
                <span className={cn("hidden shrink-0 text-xs sm:inline", l.status === "review" ? "font-semibold text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
                  {why}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
