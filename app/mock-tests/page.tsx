"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Lock, Play, RotateCcw } from "lucide-react";
import { Loader } from "@/components/custom/loader";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import ErrorState from "@/components/custom/error-state";
import { Label, panel } from "@/features/dashboard/Home";
import { SECTION_SECONDS } from "@/features/mock/examSession";
import { reviewHref, useAttempts } from "@/features/mock/attempts";
import { usePaperLocks } from "@/features/mock/paperLocks";
import { lockText } from "@/lib/unlocks";
import { HUE } from "@/features/pyq/topic-map";
import { MARKS_CORRECT, MARKS_WRONG } from "@/features/pyq/session";
import { timeAgo } from "@/lib/activity-log";
import { SUBJECT_LABEL, type SubjectKey } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";
import { useGetMockPapersQuery } from "@/redux/PyqApi";

/**
 * Mock tests: start a fresh mock, pick a past paper, or reopen a recent attempt.
 * Scores and trends live on the analytics page.
 */

/** Tier 1 order. */
const SECTIONS: SubjectKey[] = ["reasoning", "gk", "maths", "english"];
const MINUTES = SECTION_SECONDS / 60;

const attemptHref = (paper: string) => `/mock-tests/attempt?paper=${encodeURIComponent(paper)}`;

/** How far along the way to unlocking (both the level and the practice count). */
const lockProgress = (l: { levelNeeded: number; questionsNeeded: number; level: number; questions: number }) => {
  const lv = l.level > 1 ? 1 - l.levelNeeded / l.level : 1;
  const q = l.questions > 0 ? 1 - l.questionsNeeded / l.questions : 1;
  return Math.max(0, Math.min(1, (lv + q) / 2));
};

const scoreTone = (p: number) =>
  p >= 0.6 ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" : p >= 0.4 ? "bg-amber-500/12 text-amber-700 dark:text-amber-300" : "bg-rose-500/12 text-rose-700 dark:text-rose-300";

export default function MockTestsPage() {
  const { data: papers, isLoading, isError, refetch } = useGetMockPapersQuery();
  const { attempts } = useAttempts((a) => a.kind !== "section");
  const best = new Map<string, { marks: number; max: number; at: number }>();
  for (const a of attempts) {
    if (!a.paperId) continue;
    const b = best.get(a.paperId);
    if (!b || a.marks > b.marks) best.set(a.paperId, { marks: a.marks, max: a.maxMarks, at: a.at });
  }
  const { sorted, locks } = usePaperLocks();
  const now = Date.now();

  return (
    <TopicPageLayout title="Mock tests" description="Full SSC CGL Tier 1 papers in the real exam interface. Tests open full-screen.">
      <div className="flex w-full flex-col gap-6">
        {/* fresh mock: the one main action, kept short */}
        <section aria-labelledby="new-mock" className={cn(panel, "relative overflow-hidden p-5 sm:p-6")}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 id="new-mock" className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                Full mock test
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">100 fresh past-year questions · {MINUTES * 4} min</p>
              {/* the four sections in exam order; details are in the tooltip */}
              <ul
                className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground"
                title={`${MINUTES} min per section, no carry-over · no going back to a finished section · +${MARKS_CORRECT} right, ${MARKS_WRONG} wrong`}
              >
                {SECTIONS.map((s) => (
                  <li key={s} className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: HUE[s] }} aria-hidden="true" />
                    {s === "gk" ? "GA" : SUBJECT_LABEL[s]}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={attemptHref("new")}
              className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 hover:bg-brand-600"
            >
              Start a mock
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
          <p className="relative mt-4 border-t border-border/70 pt-3 text-xs text-muted-foreground">
            {MINUTES} min per section · no going back · +{MARKS_CORRECT} right, {MARKS_WRONG} wrong
          </p>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* past papers */}
          <section aria-labelledby="past-papers" className="flex min-w-0 flex-col gap-3">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <h2 id="past-papers" className="text-lg font-extrabold text-foreground">
                  Previous year papers
                </h2>
                <p className="text-sm text-muted-foreground">The real paper, exactly as it was set. Questions that need a diagram are left out.</p>
              </div>
              {papers && papers.length > 0 && <span className="shrink-0 text-xs font-semibold text-muted-foreground">{papers.length} {papers.length === 1 ? "paper" : "papers"}</span>}
            </div>

            {isError ? (
              <ErrorState title="Couldn't load the papers" description="Please try again in a moment." onRetry={refetch} />
            ) : isLoading ? (
              <div className={cn(panel, "px-5 py-8")}>
                <Loader text="Loading papers" />
              </div>
            ) : sorted.length === 0 ? (
              <p className={cn(panel, "px-5 py-4 text-sm text-muted-foreground")}>No full papers yet.</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {sorted.map((paper) => {
                  const lock = locks.get(paper.id);
                  const b = best.get(paper.id);
                  const p = b ? Math.max(0, b.marks) / Math.max(b.max, 1) : null;
                  return (
                    lock && !lock.open ? (
                      <li key={paper.id}>
                        <div className={cn(panel, "flex h-full flex-col gap-4 border-dashed p-4")} aria-label={`${paper.shift ?? paper.year}: locked`}>
                          <div className="flex items-start gap-3 opacity-60">
                            <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-muted leading-none">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">CGL</span>
                              <span className="font-mono text-sm font-black text-foreground">{paper.year}</span>
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-bold text-foreground">{paper.shift ?? `SSC CGL ${paper.year}`}</span>
                              <span className="block truncate text-xs text-muted-foreground">
                                Tier 1 · {paper.questionCount} questions · {MINUTES * 4} min
                              </span>
                            </span>
                            <Lock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          </div>
                          <div className="mt-auto">
                            <p className="text-xs font-semibold text-foreground">{lockText(lock)} to unlock</p>
                            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-muted">
                              <span
                                className="block h-full rounded-full bg-amber-400"
                                style={{ width: `${Math.round(lockProgress(lock) * 100)}%` }}
                              />
                            </span>
                          </div>
                        </div>
                      </li>
                    ) : (
                    <li key={paper.id}>
                      <Link
                        href={attemptHref(paper.id)}
                        className={cn(panel, "group flex h-full flex-col gap-4 p-4 transition-all hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-md")}
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-500/12 leading-none ring-1 ring-inset ring-brand-500/20 transition-colors group-hover:bg-brand-500/18">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-600/80 dark:text-brand-300/80">CGL</span>
                            <span className="font-mono text-sm font-black text-brand-700 dark:text-brand-300">{paper.year}</span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-bold text-foreground">{paper.shift ?? `SSC CGL ${paper.year}`}</span>
                            <span className="block truncate text-xs text-muted-foreground">
                              Tier 1 · {paper.questionCount} questions · {MINUTES * 4} min
                            </span>
                          </span>
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-2">
                          {b && p !== null ? (
                            <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold tabular-nums", scoreTone(p))}>
                              Best {b.marks}/{b.max}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-muted-foreground">Not attempted</span>
                          )}
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition-transform group-hover:translate-x-0.5 dark:text-brand-400">
                            {b ? (
                              <>
                                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                                Retake
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                                Start
                              </>
                            )}
                          </span>
                        </div>
                      </Link>
                    </li>
                    )
                  );
                })}
              </ul>
            )}
          </section>

          {/* recent attempts, briefly; scores over time are on analytics */}
          <aside aria-labelledby="your-attempts" className={cn(panel, "p-5")}>
            <div className="flex items-baseline justify-between">
              <Label>
                <span id="your-attempts">Your attempts</span>
              </Label>
              <Link href="/analytics" className="inline-flex items-center gap-0.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
                Score trend
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
            {attempts.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Your finished mocks show up here, ready to review.</p>
            ) : (
              <ul className="mt-2 divide-y divide-border/70">
                {attempts.slice(0, 6).map((a) => {
                  const p = Math.max(0, a.marks) / Math.max(a.maxMarks, 1);
                  return (
                    <li key={a.id}>
                      <Link href={reviewHref(a)} className="group flex items-center gap-3 py-3">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground group-hover:underline">{a.title}</span>
                          <span className="block text-xs text-muted-foreground">
                            {a.correct} right · {a.wrong} wrong · {timeAgo(a.at, now)}
                          </span>
                        </span>
                        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums", scoreTone(p))}>
                          {a.marks}/{a.maxMarks}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </TopicPageLayout>
  );
}
