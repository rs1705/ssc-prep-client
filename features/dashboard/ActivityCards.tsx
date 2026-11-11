"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Calculator,
  Check,
  Gamepad2,
  History,
  Languages,
  Layers,
  Newspaper,
  Play,
  RotateCcw,
  Sigma,
  Sparkles,
  Target,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { DUO } from "@/features/games/buttons";
import { cn } from "@/lib/utils";
import { subjectTheme, type SubjectKey } from "@/lib/subject-theme";
import {
  dismissMistake,
  readMastered,
  startOfWeek,
  subjectStats,
  timeAgo,
  weekStats,
  type ActivityEntry,
  type ActivityKind,
  type MistakeEntry,
} from "@/lib/activity-log";
import { resumeHref, type Unfinished } from "@/features/games/unfinished";

const KIND_ICON: Record<ActivityKind, LucideIcon> = {
  drill: Zap,
  pyq: BookOpenCheck,
  cards: Layers,
  game: Gamepad2,
};

const SUBJECTS: { key: SubjectKey; name: string; icon: LucideIcon; href: string; blurb: string }[] = [
  { key: "maths", name: "Quant", icon: Calculator, href: "/SSC/maths", blurb: "Drills, formulas, cards and PYQs" },
  { key: "reasoning", name: "Reasoning", icon: Sigma, href: "/SSC/reasoning", blurb: "Speed drills, Match and PYQs" },
  { key: "english", name: "English", icon: Languages, href: "/SSC/english", blurb: "Flashcards, 6 games and PYQs" },
  { key: "gk", name: "GK / GS", icon: Newspaper, href: "/SSC/gk", blurb: "Topic-wise and sectional PYQs" },
];

const SUBJECT_NAME: Record<SubjectKey, string> = { maths: "Quant", reasoning: "Reasoning", english: "English", gk: "GK / GS" };

const score = (a: { correct?: number; total?: number }) =>
  typeof a.correct === "number" && typeof a.total === "number" && a.total > 0
    ? `${a.correct}/${a.total} · ${Math.round((a.correct / a.total) * 100)}%`
    : null;

function CardShell({
  label,
  icon: Icon,
  action,
  children,
  className,
}: {
  label: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section aria-label={label} className={cn("surface-card flex flex-col gap-4 rounded-3xl p-5 sm:p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="section-label flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          {label}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyNote({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border px-4 py-6 text-center">
      <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      <p className="font-bold text-foreground">{title}</p>
      <p className="max-w-xs text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Continue where you left off                                          */
/* ------------------------------------------------------------------ */

export function ContinueCard({
  activities,
  unfinished = [],
  now,
}: {
  activities: ActivityEntry[];
  unfinished?: Unfinished[];
  now: number;
}) {
  const [latest, ...rest] = activities;
  const earlier = rest.slice(0, unfinished.length > 0 ? 2 : 3);

  return (
    <CardShell label="Pick up where you left off" icon={History}>
      {unfinished.slice(0, 2).map((u) => (
        <div
          key={u.path}
          className="flex flex-col gap-3 rounded-2xl border-2 border-brand-500/50 bg-[color-mix(in_oklab,var(--brand-500)_8%,var(--card))] p-3"
        >
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs font-bold text-white">Unfinished</span>
            <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{timeAgo(u.at, now)}</span>
          </div>
          <div>
            <p className="truncate font-bold text-foreground">{u.label}</p>
            <p className="text-xs text-muted-foreground">
              {u.done} of {u.total} answered
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${(u.done / u.total) * 100}%` }} />
            </div>
          </div>
          <Link href={resumeHref(u.path)} className={cn(DUO.primary, "min-h-11 w-full")}>
            <Play className="h-4 w-4" aria-hidden="true" />
            Resume
          </Link>
        </div>
      ))}
      {!latest && unfinished.length === 0 ? (
        <EmptyNote icon={History} title="Nothing here yet">
          Finish a drill, game or PYQ set and it shows up here, so you can jump straight back in.
        </EmptyNote>
      ) : !latest ? null : (
        <>
          <ActivityRow entry={latest} now={now} big />
          <Link href={latest.href} className={cn(unfinished.length > 0 ? DUO.secondary : DUO.primary, "w-full")}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Go again
          </Link>
          {earlier.length > 0 && (
            <div className="flex flex-col gap-1 border-t-2 border-border pt-3">
              <p className="text-xs font-bold text-muted-foreground">Earlier</p>
              {earlier.map((e) => (
                <ActivityRow key={e.id} entry={e} now={now} />
              ))}
            </div>
          )}
        </>
      )}
    </CardShell>
  );
}

function ActivityRow({ entry, now, big = false }: { entry: ActivityEntry; now: number; big?: boolean }) {
  const Icon = KIND_ICON[entry.kind];
  const theme = subjectTheme(entry.subject);
  const result = score(entry);
  const body = (
    <>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl ring-1 ring-border/40",
          theme.iconWrap,
          big ? "h-12 w-12" : "h-9 w-9",
        )}
      >
        <Icon className={big ? "h-5 w-5" : "h-4 w-4"} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate font-bold text-foreground", big ? "text-lg" : "text-sm")}>{entry.label}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {SUBJECT_NAME[entry.subject]} · {timeAgo(entry.at, now)}
        </span>
        {big && result && <span className="mt-0.5 block font-mono text-sm font-bold tabular-nums text-foreground">{result}</span>}
      </span>
      {!big && result && (
        <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-foreground">
          {result}
        </span>
      )}
    </>
  );
  if (big) return <div className="flex items-center gap-3">{body}</div>;
  return (
    <Link href={entry.href} className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-muted">
      {body}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* This week                                                            */
/* ------------------------------------------------------------------ */

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function WeekCard({ activities, now }: { activities: ActivityEntry[]; now: number }) {
  const stats = weekStats(activities, new Date(now));
  const todayIndex = (new Date(now).getDay() + 6) % 7;
  const activeCount = stats.activeDays.filter(Boolean).length;

  const tiles = [
    { label: "Sessions", value: String(stats.sessions) },
    { label: "Questions", value: String(stats.questions) },
    { label: "Accuracy", value: stats.accuracy === null ? "–" : `${stats.accuracy}%` },
  ];

  return (
    <CardShell
      label="This week"
      icon={Sparkles}
      action={<span className="text-xs font-semibold text-muted-foreground">{activeCount} of 7 days active</span>}
    >
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl border-2 border-border bg-card px-3 py-3 text-center">
            <div className="font-mono text-2xl font-black tabular-nums text-foreground">{t.value}</div>
            <div className="text-xs font-semibold text-muted-foreground">{t.label}</div>
          </div>
        ))}
      </div>

      <ol className="grid grid-cols-7 gap-1.5" aria-label="Days practised this week">
        {stats.activeDays.map((active, i) => {
          const future = i > todayIndex;
          return (
            <li key={i} className="flex flex-col items-center gap-1.5">
              <span
                title={`${DAY_NAMES[i]}: ${future ? "still to come" : active ? "practised" : "no practice"}`}
                className={cn(
                  "flex aspect-square w-full max-w-11 items-center justify-center rounded-xl border-2",
                  active
                    ? "border-emerald-600 bg-emerald-500 text-white"
                    : future
                      ? "border-dashed border-border bg-card"
                      : "border-border bg-muted",
                  i === todayIndex && !active && "border-brand-500",
                )}
              >
                {active && <Check className="h-4 w-4" aria-hidden="true" />}
                <span className="sr-only">
                  {DAY_NAMES[i]}: {future ? "still to come" : active ? "practised" : "no practice"}
                </span>
              </span>
              <span
                className={cn(
                  "text-xs font-bold",
                  i === todayIndex ? "text-brand-700 dark:text-brand-300" : "text-muted-foreground",
                )}
                aria-hidden="true"
              >
                {DAY_LETTERS[i]}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="text-xs text-muted-foreground">
        {stats.sessions === 0
          ? "No practice yet this week. One finished session lights up today."
          : stats.accuracy !== null && stats.accuracy < 60
            ? "Accuracy is under 60%. Slow down a little and read each option."
            : "Counts finished drills, games and PYQ sets on this device."}
      </p>
    </CardShell>
  );
}

/* ------------------------------------------------------------------ */
/* Subjects: where you stand                                            */
/* ------------------------------------------------------------------ */

export function SubjectsStanding({ activities, now }: { activities: ActivityEntry[]; now: number }) {
  return (
    <section aria-labelledby="subjects-heading" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 id="subjects-heading" className="section-label">
          Where you stand <span className="hidden normal-case tracking-normal sm:inline">(last 30 days)</span>
        </h2>
        <Link
          href="/practice"
          className="flex items-center gap-1 py-2 text-xs font-bold uppercase tracking-widest text-brand-700 transition-colors hover:text-brand-600 dark:text-brand-400"
        >
          All practice <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SUBJECTS.map((s) => {
          const theme = subjectTheme(s.key);
          const st = subjectStats(activities, s.key, now);
          const weak = st.accuracy !== null && st.accuracy < 70;
          return (
            <div
              key={s.key}
              className={cn("surface-card flex flex-col gap-3 rounded-3xl p-5 transition-colors", theme.hoverBorder)}
            >
              <Link href={s.href} className="group flex items-start gap-3">
                <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-border/40", theme.iconWrap)}>
                  <s.icon className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 font-extrabold text-foreground group-hover:underline">
                    {s.name}
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{s.blurb}</span>
                </span>
              </Link>

              {st.sessions === 0 ? (
                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t-2 border-border pt-3">
                  <p className="whitespace-nowrap text-sm text-muted-foreground">Not started yet</p>
                  <Link
                    href={s.href}
                    className={cn("group/start ml-auto inline-flex items-center gap-1 whitespace-nowrap text-sm font-bold", theme.text)}
                  >
                    Start {s.name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/start:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-1 flex-col justify-end gap-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-2xl font-black tabular-nums text-foreground">
                      {st.accuracy === null ? "–" : `${st.accuracy}%`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {st.sessions} session{st.sessions === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div
                    className="h-2.5 overflow-hidden rounded-full bg-muted"
                    role="meter"
                    aria-label={`${s.name} accuracy`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={st.accuracy ?? 0}
                  >
                    <div
                      className={cn("h-full rounded-full bg-gradient-to-r", weak ? "from-amber-400 to-amber-500" : theme.bar)}
                      style={{ width: `${st.accuracy ?? 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-muted-foreground">
                      {st.lastAt ? `Last: ${timeAgo(st.lastAt, now)}` : `${st.questions} questions`}
                    </span>
                    {weak ? (
                      <Link
                        href={`/SSC/${s.key}/topic-pyqs`}
                        className="group/fix inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300"
                      >
                        Fix it
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/fix:translate-x-1" aria-hidden="true" />
                      </Link>
                    ) : (
                      <span className="font-semibold text-muted-foreground">{st.questions} Qs</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Mistakes to review                                                   */
/* ------------------------------------------------------------------ */

export function MistakesCard({ mistakes, now }: { mistakes: MistakeEntry[]; now: number }) {
  const weekStart = startOfWeek(new Date(now)).getTime();
  const thisWeek = mistakes.filter((m) => m.at >= weekStart).length;
  const masteredThisWeek = readMastered().filter((t) => t >= weekStart).length;
  const shown = mistakes.slice(0, 5);

  return (
    <CardShell
      label="Mistakes to review"
      icon={RotateCcw}
      action={
        mistakes.length > 0 || masteredThisWeek > 0 ? (
          <span className="text-xs font-semibold text-muted-foreground">
            {mistakes.length} to review · {thisWeek} new this week
            {masteredThisWeek > 0 && (
              <span className="text-emerald-700 dark:text-emerald-300"> · {masteredThisWeek} mastered</span>
            )}
          </span>
        ) : undefined
      }
    >
      {shown.length === 0 ? (
        <EmptyNote icon={Check} title="No mistakes saved">
          Wrong answers from games, drills and PYQ sets are kept here with the right answer, so you can go over them.
        </EmptyNote>
      ) : (
        <>
        <Link href="/review" className={cn(DUO.primary, "w-full sm:w-auto sm:self-start")}>
          <Target className="h-4 w-4" aria-hidden="true" />
          Review {Math.min(mistakes.length, 10)} now
        </Link>
        <ul className="grid gap-2 lg:grid-cols-2">
          {shown.map((m) => {
            const theme = subjectTheme(m.subject);
            return (
              <li key={m.id} className="flex gap-3 rounded-2xl border-2 border-border bg-card p-3">
                <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", theme.dot)} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {m.source} · {timeAgo(m.at, now)}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground">{m.prompt}</p>
                  <p className="mt-1 text-sm">
                    <span className="text-muted-foreground">Answer: </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">{m.answer}</span>
                  </p>
                  {m.detail && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{m.detail}</p>}
                  <Link
                    href={m.href}
                    className="group/again mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400"
                  >
                    Practise again
                    <ArrowRight className="h-3 w-3 transition-transform group-hover/again:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => dismissMistake(m.id)}
                  aria-label="Remove from review list"
                  title="Got it, remove"
                  className="-m-1 h-8 w-8 shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-full w-full" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
        </>
      )}
    </CardShell>
  );
}
