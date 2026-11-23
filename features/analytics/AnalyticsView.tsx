"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, RotateCcw } from "lucide-react";
import { CountUp } from "@/features/dashboard/Interactive";
import { Label, panel } from "@/features/dashboard/Home";
import { RecentPanel } from "@/features/dashboard/Recent";
import { reviewHref, useAttempts } from "@/features/mock/attempts";
import { HUE, SUBJECTS, practiseHref, useProgressMap, type LeafInfo } from "@/features/pyq/topic-map";
import { plainText, timeAgo, useActivityLog } from "@/lib/activity-log";
import { SUBJECT_LABEL, type SubjectKey } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";

/**
 * Analytics: how you're doing, by subject and topic. Headline numbers, the last two weeks,
 * a map of every topic, your weak spots, test scores and mistakes. Everything links to the
 * practice that fixes it.
 */

const DAY = 86_400_000;
type Filter = SubjectKey | "all";
const isSubject = (s: string | null): s is SubjectKey => !!s && (SUBJECTS as string[]).includes(s);

/** Accuracy colour bands used everywhere on this page. */
function band(acc: number | null) {
  if (acc === null) return { cell: "bg-muted", text: "text-muted-foreground", label: "Not started" };
  if (acc >= 0.75) return { cell: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", label: "Strong" };
  if (acc >= 0.5) return { cell: "bg-amber-400", text: "text-amber-600 dark:text-amber-400", label: "Getting there" };
  return { cell: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", label: "Weak" };
}

export function AnalyticsView() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const q = params.get("subject");
  const filter: Filter = isSubject(q) ? q : "all";
  const setFilter = (f: Filter) => router.replace(f === "all" ? path : `${path}?subject=${f}`, { scroll: false });

  const { activities, mistakes } = useActivityLog();
  const { attempts } = useAttempts();
  const { trees, leaves, loading } = useProgressMap(false);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), [activities]);

  const subjects = filter === "all" ? SUBJECTS : [filter];
  const inFilter = (s: string | null) => filter === "all" || s === filter;
  const myLeaves = useMemo(() => [...leaves.values()].filter((l) => inFilter(l.subject)), [leaves, filter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Headline numbers.
  const answered = myLeaves.reduce((n, l) => n + Math.min(l.done, l.sub.count), 0);
  const right = myLeaves.reduce((n, l) => n + l.right, 0);
  const done = myLeaves.reduce((n, l) => n + l.done, 0);
  const total = myLeaves.reduce((n, l) => n + l.sub.count, 0);
  const acc = done ? right / done : null;
  const activeDays = now ? new Set(activities.filter((a) => inFilter(a.subject) && a.at > now - 30 * DAY).map((a) => new Date(a.at).toDateString())).size : 0;

  // The last 14 days.
  const days = useMemo(() => {
    if (!now) return [];
    const end = new Date(new Date(now).toDateString()).getTime() + DAY;
    return Array.from({ length: 14 }, (_, i) => {
      const from = end - (14 - i) * DAY;
      let qn = 0;
      let rt = 0;
      for (const a of activities) {
        if (a.at < from || a.at >= from + DAY || !inFilter(a.subject)) continue;
        qn += a.total ?? 0;
        rt += a.correct ?? 0;
      }
      return { from, q: qn, acc: qn ? rt / qn : null };
    });
  }, [activities, now, filter]); // eslint-disable-line react-hooks/exhaustive-deps
  const maxQ = Math.max(1, ...days.map((d) => d.q));

  const weak = myLeaves
    .filter((l) => l.done >= 2)
    .sort((a, b) => a.right / a.done - b.right / b.done)
    .slice(0, 5);
  const tests = attempts.filter((a) => (filter === "all" ? true : a.subject === filter));
  const myMistakes = mistakes.filter((m) => inFilter(m.subject));

  const tabs: Filter[] = ["all", ...SUBJECTS];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div>
          <Label>Analytics</Label>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">How you&apos;re doing</h1>
        </div>
        <div role="tablist" aria-label="Subject" className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={filter === t}
              onClick={() => setFilter(t)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                filter === t ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t !== "all" && <span className="h-2 w-2 rounded-full" style={{ background: HUE[t] }} aria-hidden="true" />}
              {t === "all" ? "All subjects" : SUBJECT_LABEL[t]}
            </button>
          ))}
        </div>
      </header>

      {/* headline numbers */}
      <section aria-label="Summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Questions answered", value: <CountUp value={answered} />, sub: `of ${total} past-year questions` },
          { label: "Accuracy", value: acc === null ? "–" : `${Math.round(acc * 100)}%`, sub: acc === null ? "Answer a few to see it" : band(acc).label, tone: acc === null ? undefined : band(acc).text },
          { label: "Syllabus covered", value: `${total ? Math.round((answered / total) * 100) : 0}%`, sub: "of past-year questions" },
          { label: "Active days", value: <CountUp value={activeDays} />, sub: "in the last 30 days" },
        ].map((k) => (
          <div key={k.label} className={cn(panel, "p-4 sm:p-5")}>
            <Label>{k.label}</Label>
            <p className={cn("mt-2 text-3xl font-extrabold tabular-nums text-foreground", k.tone)}>{k.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          {/* last two weeks */}
          <section aria-labelledby="trend-heading" className={cn(panel, "p-5 sm:p-6")}>
            <div className="flex items-baseline justify-between gap-2">
              <Label>
                <span id="trend-heading">Last 14 days</span>
              </Label>
              <span className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-500" />75%+</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-amber-400" />50–74%</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-rose-500" />under 50%</span>
              </span>
            </div>
            <div className="mt-4 flex h-36 gap-1.5" role="img" aria-label="Questions per day, coloured by accuracy">
              {days.map((d, i) => (
                <div key={d.from} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="relative w-full flex-1">
                    <div
                      className={cn("absolute inset-x-0 bottom-0 rounded-md transition-all duration-700", d.q ? band(d.acc).cell : "bg-muted")}
                      style={{ height: `${d.q ? Math.max(8, (d.q / maxQ) * 100) : 4}%` }}
                      title={`${new Date(d.from).toLocaleDateString(undefined, { day: "numeric", month: "short" })}: ${d.q} questions${d.acc !== null ? `, ${Math.round(d.acc * 100)}% right` : ""}`}
                    />
                  </div>
                  <span className={cn("text-[10px] font-semibold", i === 13 ? "text-foreground" : "text-muted-foreground")}>
                    {new Date(d.from).toLocaleDateString(undefined, { weekday: "narrow" })}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* every topic */}
          <section aria-labelledby="map-heading" className={cn(panel, "p-5 sm:p-6")}>
            <div className="flex items-baseline justify-between gap-2">
              <Label>
                <span id="map-heading">Topic map</span>
              </Label>
              <span className="text-xs text-muted-foreground">Each square is a subtopic. Tap one to practise it.</span>
            </div>
            {loading && <p className="mt-3 text-sm text-muted-foreground">Loading topics…</p>}
            <div className="mt-4 flex flex-col gap-6">
              {subjects.map((s) => {
                const topics = trees[s].filter((t) => t.count > 0);
                if (topics.length === 0) return null;
                return (
                  <div key={s}>
                    {filter === "all" && (
                      <p className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                        <span className="h-2 w-2 rounded-full" style={{ background: HUE[s] }} aria-hidden="true" />
                        {SUBJECT_LABEL[s]}
                      </p>
                    )}
                    <ul className="flex flex-col gap-2.5">
                      {topics.map((t) => {
                        const subs = t.children.map((c) => leaves.get(c.id)).filter((l): l is LeafInfo => !!l);
                        const tDone = subs.reduce((n, l) => n + l.done, 0);
                        const tRight = subs.reduce((n, l) => n + l.right, 0);
                        const tAcc = tDone ? tRight / tDone : null;
                        return (
                          <li key={t.id} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 sm:grid-cols-[minmax(0,14rem)_1fr_auto]">
                            <Link href={`/SSC/${s}/topic-pyqs?topic=${encodeURIComponent(t.id)}`} className="truncate text-sm font-medium text-foreground hover:underline">
                              {t.name}
                            </Link>
                            <span className="flex flex-wrap gap-1">
                              {subs.map((l) => {
                                const a = l.done ? l.right / l.done : null;
                                return (
                                  <Link
                                    key={l.sub.id}
                                    href={practiseHref(l)}
                                    title={`${l.sub.name}: ${l.done ? `${Math.round((a ?? 0) * 100)}% right, ${Math.min(l.done, l.sub.count)}/${l.sub.count} done` : `${l.sub.count} questions, not started`}`}
                                    className={cn("h-5 w-5 rounded-[5px] transition-transform hover:scale-125", band(a).cell, l.status === "review" && "ring-2 ring-orange-400 ring-offset-1 ring-offset-card")}
                                  >
                                    <span className="sr-only">{l.sub.name}</span>
                                  </Link>
                                );
                              })}
                            </span>
                            <span className={cn("w-10 text-right text-xs font-bold tabular-nums", band(tAcc).text)}>{tAcc === null ? "–" : `${Math.round(tAcc * 100)}%`}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-3 w-3 rounded-[4px] ring-2 ring-orange-400 ring-offset-1 ring-offset-card" /> due for review (low accuracy or not practised for a week)
            </p>
          </section>

          {now && <RecentPanel activities={activities.filter((a) => inFilter(a.subject))} attempts={tests} now={now} limit={10} />}
        </div>

        <aside className="flex flex-col gap-6" aria-label="Where to improve">
          {/* weak spots */}
          <section aria-labelledby="weak-heading" className={cn(panel, "p-5")}>
            <Label>
              <span id="weak-heading">Weak spots</span>
            </Label>
            {weak.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Answer at least two questions in a subtopic and your weakest ones show up here.</p>
            ) : (
              <ul className="mt-2 divide-y divide-border/70">
                {weak.map((l) => {
                  const a = l.right / l.done;
                  return (
                    <li key={l.sub.id}>
                      <Link href={practiseHref(l)} className="group flex items-center gap-3 py-2.5">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground group-hover:underline">{l.sub.name}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {SUBJECT_LABEL[l.subject]} · {l.topic.name}
                          </span>
                        </span>
                        <span className={cn("text-sm font-bold tabular-nums", band(a).text)}>{Math.round(a * 100)}%</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* tests */}
          <section aria-labelledby="tests-heading" className={cn(panel, "p-5")}>
            <div className="flex items-baseline justify-between">
              <Label>
                <span id="tests-heading">Test scores</span>
              </Label>
              <Link href="/mock-tests" className="text-xs font-semibold text-muted-foreground hover:text-foreground">
                Take a test
              </Link>
            </div>
            {tests.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No tests yet. Your mock and sectional scores will appear here.</p>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  Best <span className="font-bold text-foreground">{Math.max(...tests.map((t) => Math.round((t.marks / Math.max(t.maxMarks, 1)) * 100)))}%</span> · average{" "}
                  <span className="font-bold text-foreground">{Math.round((tests.reduce((n, t) => n + t.marks / Math.max(t.maxMarks, 1), 0) / tests.length) * 100)}%</span>
                </p>
                <ul className="mt-2 flex flex-col gap-3">
                  {tests.slice(0, 5).map((t) => {
                    const p = t.marks / Math.max(t.maxMarks, 1);
                    return (
                      <li key={t.id}>
                        <Link href={reviewHref(t)} className="group block">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-foreground group-hover:underline">{t.title}</span>
                            <span className="shrink-0 text-xs font-bold tabular-nums text-foreground">
                              {t.marks}/{t.maxMarks}
                            </span>
                          </span>
                          <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted">
                            <span className={cn("block h-full rounded-full", band(p).cell)} style={{ width: `${Math.max(0, p) * 100}%` }} />
                          </span>
                          <span className="mt-0.5 block text-[11px] text-muted-foreground">
                            {t.correct} right · {t.wrong} wrong · {now ? timeAgo(t.at, now) : ""}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </section>

          {/* mistakes */}
          <section aria-labelledby="mistakes-heading" className={cn(panel, "p-5")}>
            <div className="flex items-baseline justify-between">
              <Label>
                <span id="mistakes-heading">Your mistakes</span>
              </Label>
              <span className="text-sm font-bold text-foreground">{myMistakes.length}</span>
            </div>
            {myMistakes.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No mistakes saved. Wrong answers land here so you can fix them.</p>
            ) : (
              <>
                <ul className="mt-2 flex flex-col gap-2">
                  {myMistakes.slice(0, 4).map((m) => (
                    <li key={m.id} className="rounded-xl bg-muted/50 p-2.5">
                      <p className="line-clamp-2 text-xs text-foreground">{plainText(m.prompt, 120)}</p>
                      <p className="mt-1 text-xs">
                        <span className="text-muted-foreground">Answer: </span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">{m.answer}</span>
                      </p>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/review"
                  className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-foreground text-sm font-bold text-background transition-opacity hover:opacity-90"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Review {Math.min(myMistakes.length, 10)} mistakes
                </Link>
              </>
            )}
          </section>

          <Link href="/practice" className="inline-flex items-center gap-1 self-start text-sm font-semibold text-muted-foreground hover:text-foreground">
            All practice
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
