"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, FileText, Lock, Play, RotateCcw, Shuffle } from "lucide-react";
import { Loader } from "@/components/custom/loader";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import ErrorState from "@/components/custom/error-state";
import { Label, panel } from "@/features/dashboard/Home";
import { SECTION_SECONDS } from "@/features/mock/examSession";
import { reviewHref, useAttempts } from "@/features/mock/attempts";
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
  const sorted = [...(papers ?? [])].sort((x, y) => y.year - x.year || (y.date ?? "").localeCompare(x.date ?? ""));
  const now = Date.now();

  return (
    <TopicPageLayout title="Mock tests" description="Full SSC CGL Tier 1 papers in the real exam interface. Tests open full-screen.">
      <div className="flex w-full flex-col gap-6">
        {/* fresh mock: the one main action */}
        <section aria-labelledby="new-mock" className={cn(panel, "relative overflow-hidden")}>
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/12 text-brand-600 dark:text-brand-400">
                <Shuffle className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <Label>Recommended</Label>
                <h2 id="new-mock" className="mt-0.5 text-2xl font-extrabold tracking-tight text-foreground">
                  Full mock test
                </h2>
                <p className="mt-1 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  100 real past-year questions, picked fresh from every paper each time. The closest thing to exam day.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-2 lg:items-end">
              <Link
                href={attemptHref("new")}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-7 text-[15px] font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30"
              >
                Start a mock
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <span className="text-center text-xs text-muted-foreground lg:text-right">
                100 questions · {MINUTES * 4} min · +{MARKS_CORRECT} / {MARKS_WRONG}
              </span>
            </div>
          </div>

          {/* the four sections, in exam order */}
          <ol className="relative grid grid-cols-2 gap-px border-t border-border/70 bg-border/70 sm:grid-cols-4">
            {SECTIONS.map((s, i) => (
              <li key={s} className="flex flex-col gap-0.5 bg-card px-6 py-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Section {i + 1}</span>
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: HUE[s] }} aria-hidden="true" />
                  {s === "gk" ? "General Awareness" : SUBJECT_LABEL[s]}
                </span>
                <span className="text-xs text-muted-foreground">25 questions · {MINUTES} min</span>
              </li>
            ))}
          </ol>
        </section>

        {/* how it runs */}
        <ul className="flex flex-wrap gap-2">
          {[
            { icon: Clock, text: `${MINUTES} minutes per section, no carry-over` },
            { icon: Lock, text: "No going back to a finished section" },
            { icon: FileText, text: `+${MARKS_CORRECT} for right, ${MARKS_WRONG} for wrong` },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>

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
                  const b = best.get(paper.id);
                  const p = b ? Math.max(0, b.marks) / Math.max(b.max, 1) : null;
                  return (
                    <li key={paper.id}>
                      <Link
                        href={attemptHref(paper.id)}
                        className={cn(panel, "group flex h-full flex-col gap-4 p-4 transition-all hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-md")}
                      >
                        <div className="flex items-start gap-3">
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
