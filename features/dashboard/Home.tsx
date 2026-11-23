"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  Check,
  Flame,
  Gamepad2,
  Languages,
  Layers,
  Newspaper,
  Play,
  RotateCcw,
  Sigma,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { resumeHref, type Unfinished } from "@/features/games/unfinished";
import { CountUp, MistakeFlip } from "./Interactive";
import { HUE, practiseHref, type LeafInfo } from "@/features/pyq/topic-map";
import { pickForReview, subjectStats, timeAgo, type ActivityEntry, type MistakeEntry } from "@/lib/activity-log";
import { SUBJECT_LABEL, subjectTheme, type SubjectKey } from "@/lib/subject-theme";
import { isStepDone, useTodayPlan, type PlanStepId } from "@/lib/today-plan";
import { cn } from "@/lib/utils";
import type { PyqTopicNode } from "@/redux/PyqApi";

/**
 * The dashboard, built around one question: what should I do now?
 * Today's plan leads; review and "pick up where you left off" sit beside it; then each
 * subject's standing, the topics most worth practising, and the week at a glance.
 */

const SUBJECTS: { key: SubjectKey; icon: LucideIcon }[] = [
  { key: "maths", icon: Calculator },
  { key: "reasoning", icon: Sigma },
  { key: "english", icon: Languages },
  { key: "gk", icon: Newspaper },
];
const STEP_ICON: Record<PlanStepId, LucideIcon> = { drill: Zap, pyq: BookOpenCheck, cards: Layers, game: Gamepad2 };
const DAY = 86_400_000;

const card = "rounded-3xl border border-border bg-card p-5 sm:p-6";
const primaryBtn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-600";
const ghostBtn =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted";

function Ring({ value, size = 56, stroke = 6, className, color, children }: { value: number; size?: number; stroke?: number; className?: string; color?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(1, value))}
          className={cn("transition-[stroke-dashoffset] duration-700 ease-out", className)}
          style={color ? { stroke: color } : undefined}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/* ---------------- Today ---------------- */

export function TodayCard({ week }: { week: boolean[] }) {
  const { plan, progress, streak, done, total, next, minutesLeft } = useTodayPlan();
  const complete = done === total;
  const todayIdx = (new Date().getDay() + 6) % 7;
  return (
    <section aria-labelledby="today-heading" className={cn(card, "flex flex-col gap-5 lg:col-span-2")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Ring value={total ? done / total : 0} size={64} stroke={7} className={complete ? "stroke-emerald-500" : "stroke-brand-500"}>
            <span className="text-sm font-extrabold tabular-nums text-foreground">
              {done}/{total}
            </span>
          </Ring>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Today</p>
            <h2 id="today-heading" className="text-xl font-extrabold text-foreground sm:text-2xl">
              {complete ? "All done for today" : done === 0 ? "Your 15 minutes" : `${minutesLeft} min to go`}
            </h2>
          </div>
        </div>
        {/* streak and the week */}
        <div className="flex items-center gap-3 rounded-2xl bg-muted/60 px-3 py-2">
          <span className={cn("flex items-center gap-1 text-sm font-extrabold", streak > 0 ? "text-orange-500" : "text-muted-foreground")}>
            <Flame className={cn("h-4 w-4", streak > 0 && "motion-safe:animate-flicker")} aria-hidden="true" />
            <CountUp value={streak} />
          </span>
          <ol className="flex gap-1" aria-label="This week">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <li
                key={i}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                  week[i] ? "bg-orange-500 text-white" : i === todayIdx ? "border border-dashed border-orange-400 text-orange-500 motion-safe:animate-pulse" : "bg-card text-muted-foreground",
                )}
              >
                {week[i] ? <Check className="h-3 w-3" aria-label={`${d} practised`} /> : d}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ol className="grid gap-2 sm:grid-cols-2">
        {plan.map((step) => {
          const Icon = STEP_ICON[step.id];
          const isDone = isStepDone(step, progress);
          const isNext = next?.id === step.id;
          const count = Math.min(progress[step.id], step.target);
          return (
            <li key={step.id}>
              <Link
                href={step.href}
                className={cn(
                  "group flex h-full items-center gap-3 rounded-2xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm",
                  isDone ? "border-transparent bg-muted/50" : isNext ? "border-brand-500/50 bg-brand-500/5 hover:border-brand-500" : "border-border hover:bg-muted/60",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    isDone ? "bg-emerald-500 text-white" : isNext ? "bg-brand-500 text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="h-4 w-4 motion-safe:animate-pop" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate text-sm font-bold", isDone ? "text-muted-foreground line-through" : "text-foreground")}>{step.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {step.minutes} min{step.target > 1 && !isDone ? ` · ${count}/${step.target} ${step.unit}` : ""}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-auto">
        {next ? (
          <Link href={next.href} className={cn(primaryBtn, "w-full sm:w-auto")}>
            <Play className="h-4 w-4" aria-hidden="true" />
            {done === 0 ? "Start today's plan" : `Continue: ${next.title}`}
          </Link>
        ) : (
          <Link href="/practice" className={cn(ghostBtn, "w-full sm:w-auto")}>
            Keep practising
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}

/* ---------------- Review + resume ---------------- */

export function ReviewCard({ mistakes }: { mistakes: MistakeEntry[] }) {
  const due = pickForReview(mistakes, 999).length;
  const bySubject = SUBJECTS.map((s) => ({ ...s, n: mistakes.filter((m) => m.subject === s.key).length })).filter((s) => s.n > 0);
  return (
    <section className={cn(card, "flex flex-col gap-3")}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Review</p>
        <RotateCcw className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </div>
      {due > 0 ? (
        <>
          <p className="text-foreground">
            <CountUp value={due} className="text-3xl font-extrabold" />
            <span className="ml-2 text-sm font-semibold text-muted-foreground">mistakes to fix</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {bySubject.map((s) => (
              <span key={s.key} className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", subjectTheme(s.key).chip)}>
                {SUBJECT_LABEL[s.key]} {s.n}
              </span>
            ))}
          </div>
          <MistakeFlip due={pickForReview(mistakes, 10)} />
          <Link href="/review" className="mt-auto text-center text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Full review session
          </Link>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No mistakes waiting. Questions you get wrong land here so you can fix them.</p>
      )}
    </section>
  );
}

export function ResumeCard({ unfinished, activities, now }: { unfinished: Unfinished[]; activities: ActivityEntry[]; now: number }) {
  const u = unfinished[0];
  const last = activities[0];
  if (!u && !last) return null;
  return (
    <section className={cn(card, "flex flex-col gap-3")}>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{u ? "Pick up where you left off" : "Last time"}</p>
      {u ? (
        <>
          <div>
            <p className="font-bold text-foreground">{u.label}</p>
            <p className="text-xs text-muted-foreground">
              {SUBJECT_LABEL[u.subject]} · {u.done} of {u.total} · {timeAgo(u.at, now)}
            </p>
          </div>
          <span className="h-1.5 overflow-hidden rounded-full bg-muted">
            <span className={cn("block h-full rounded-full bg-gradient-to-r", subjectTheme(u.subject).bar)} style={{ width: `${(u.done / Math.max(u.total, 1)) * 100}%` }} />
          </span>
          <Link href={resumeHref(u.path)} className={cn(ghostBtn, "w-full")}>
            Resume
          </Link>
        </>
      ) : (
        <>
          <div>
            <p className="font-bold text-foreground">{last.label}</p>
            <p className="text-xs text-muted-foreground">
              {SUBJECT_LABEL[last.subject]} · {timeAgo(last.at, now)}
              {typeof last.total === "number" && typeof last.correct === "number" && ` · ${last.correct}/${last.total} right`}
            </p>
          </div>
          <Link href={last.href} className={cn(ghostBtn, "w-full")}>
            Do it again
          </Link>
        </>
      )}
    </section>
  );
}

/* ---------------- Subjects ---------------- */

export function SubjectsRow({
  activities,
  now,
  trees,
  share,
  leaves,
}: {
  activities: ActivityEntry[];
  now: number;
  trees: Record<SubjectKey, PyqTopicNode[]>;
  share: (nodes: PyqTopicNode[]) => number;
  leaves: Map<string, LeafInfo>;
}) {
  return (
    <section aria-labelledby="subjects-heading" className="lg:col-span-3">
      <h2 id="subjects-heading" className="mb-3 text-sm font-bold text-foreground">
        Your subjects
      </h2>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {SUBJECTS.map(({ key, icon: Icon }) => {
          const theme = subjectTheme(key);
          const pyqShare = share(trees[key]);
          const stats = subjectStats(activities, key, now);
          // Weakest topic: lowest accuracy among practised subtopics.
          const weak = [...leaves.values()]
            .filter((l) => l.subject === key && l.done >= 2)
            .sort((a, b) => a.right / a.done - b.right / b.done)[0];
          return (
            <li key={key}>
              <Link href={`/SSC/${key}`} className={cn(card, "group flex h-full flex-col gap-3 !p-4 transition-all hover:-translate-y-0.5 hover:shadow-md sm:!p-5", theme.hoverBorder)}>
                <div className="flex items-start justify-between gap-2">
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", theme.iconWrap)}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <Ring value={pyqShare} size={44} stroke={5} color={HUE[key]}>
                    <span className="text-[11px] font-extrabold tabular-nums text-foreground">{Math.round(pyqShare * 100)}%</span>
                  </Ring>
                </div>
                <div>
                  <p className="font-bold text-foreground">{SUBJECT_LABEL[key]}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.accuracy === null ? "Not practised this month" : `${stats.accuracy}% right · ${stats.questions} Qs this month`}
                  </p>
                </div>
                {weak && (
                  <p className="mt-auto truncate rounded-lg bg-muted/60 px-2 py-1 text-xs text-muted-foreground">
                    Weakest: <span className="font-semibold text-foreground">{weak.sub.name}</span>
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------------- Focus topics ---------------- */

export function FocusCard({ leaves, now }: { leaves: Map<string, LeafInfo>; now: number }) {
  const list = useMemo(() => {
    const all = [...leaves.values()];
    const due = all.filter((l) => l.status === "review").sort((a, b) => a.right / a.done - b.right / b.done);
    const shaky = all.filter((l) => l.status === "growing").sort((a, b) => a.right / a.done - b.right / b.done);
    const fresh = all.filter((l) => l.status === "bud").sort((a, b) => b.sub.count - a.sub.count);
    return [...due, ...shaky, ...fresh].slice(0, 5);
  }, [leaves]);
  return (
    <section aria-labelledby="focus-heading" className={cn(card, "flex flex-col gap-3 lg:col-span-3")}>
      <div className="flex items-center justify-between">
        <h2 id="focus-heading" className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Target className="h-4 w-4 text-brand-500" aria-hidden="true" />
          Topics to work on
        </h2>
        <span className="text-xs text-muted-foreground">From your past-year practice</span>
      </div>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Loading topics…</p>
      ) : (
        <ul className="-mx-2 flex flex-col">
          {list.map((l) => {
            const acc = l.done ? Math.round((l.right / l.done) * 100) : null;
            const days = l.lastAt ? Math.round((now - l.lastAt) / DAY) : null;
            const why =
              l.status === "review"
                ? acc !== null && acc < 60
                  ? `${acc}% right`
                  : `Not practised for ${days} days`
                : l.status === "growing"
                  ? `${acc}% right · ${Math.min(l.done, l.sub.count)}/${l.sub.count} done`
                  : `${l.sub.count} questions, not started`;
            return (
              <li key={l.sub.id}>
                <Link href={practiseHref(l)} className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60">
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", subjectTheme(l.subject).dot)} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-foreground">{l.sub.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {SUBJECT_LABEL[l.subject]} · {l.topic.name}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold sm:inline",
                      l.status === "review" ? "bg-amber-500/15 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {why}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/* ---------------- This week ---------------- */

export function WeekStatsCard({ activities, now }: { activities: ActivityEntry[]; now: number }) {
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
    <section aria-labelledby="week-heading" className={cn(card, "flex flex-col gap-4")}>
      <h2 id="week-heading" className="text-sm font-bold text-foreground">
        This week
      </h2>
      <div className="flex gap-6">
        <div>
          <CountUp value={q} className="block text-2xl font-extrabold text-foreground" />
          <p className="text-xs text-muted-foreground">questions</p>
        </div>
        <div>
          <p className="text-2xl font-extrabold tabular-nums text-foreground">{q ? `${Math.round((right / q) * 100)}%` : "–"}</p>
          <p className="text-xs text-muted-foreground">right</p>
        </div>
      </div>
      <div className="mt-auto flex h-24 items-end gap-2" role="img" aria-label="Questions per day this week">
        {days.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="relative w-full flex-1">
              <div
                className={cn("absolute inset-x-0 bottom-0 rounded-md transition-all", i === todayIdx ? "bg-brand-500" : d.q ? "bg-brand-500/40" : "bg-muted")}
                style={{ height: `${d.q ? Math.max(8, (d.q / max) * 100) : 6}%` }}
                title={`${d.q} questions`}
              />
            </div>
            <span className={cn("text-[10px] font-bold", i === todayIdx ? "text-foreground" : "text-muted-foreground")}>{"MTWTFSS"[i]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
