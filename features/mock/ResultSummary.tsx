"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleSlash, Target, XCircle } from "lucide-react";
import { SUBJECT_LABEL, subjectTheme, type SubjectKey } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";
import type { Pyq } from "@/redux/PyqApi";

/**
 * The top of a test's result: a score ring, the four headline numbers, a card per
 * section and the topics that cost the most marks. Pure display: the review screen
 * passes in the questions, the answers and how sections split the list.
 */

export interface SectionResult {
  subject: SubjectKey;
  start: number;
  correct: number;
  wrong: number;
  skipped: number;
  marks: number;
  maxMarks: number;
}

/** A ring that fills to `value / max`. */
function ScoreRing({ value, max }: { value: number; max: number }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const share = max > 0 ? Math.max(0, value) / max : 0;
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="12" className="stroke-muted" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${c * share} ${c}`}
          className="stroke-brand-600 transition-[stroke-dasharray] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold tabular-nums text-foreground">{value}</span>
        <span className="font-mono text-sm font-semibold text-muted-foreground">of {max}</span>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Target; label: string; value: string | number; tone: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-3.5 py-3">
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", tone)}>
        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <span>
        <span className="block font-mono text-xl font-bold tabular-nums text-foreground">{value}</span>
        <span className="block text-xs font-medium text-muted-foreground">{label}</span>
      </span>
    </div>
  );
}

export function ScoreHero({
  marks,
  maxMarks,
  correct,
  wrong,
  skipped,
  accuracy,
  actions,
}: {
  marks: number;
  maxMarks: number;
  correct: number;
  wrong: number;
  skipped: number;
  accuracy: number;
  actions: React.ReactNode;
}) {
  const attempted = correct + wrong;
  const total = attempted + skipped;
  const verdict =
    attempted === 0
      ? "You didn't answer any questions this time."
      : attempted < total * 0.5
        ? `You attempted ${attempted} of ${total}. Try to attempt more next time.`
        : accuracy >= 85
        ? "Sharp work. Your accuracy is excellent."
        : accuracy >= 65
          ? "Good attempt. A few slips cost marks."
          : "Accuracy needs work. Review the wrong answers below.";
  return (
    <section aria-label="Your score" className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-5">
          <ScoreRing value={marks} max={maxMarks} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Your score</p>
            <p className="mt-1 text-lg font-extrabold leading-snug text-foreground">{verdict}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {attempted} of {attempted + skipped} attempted · +2 right, −0.5 wrong
            </p>
            <div className="mt-4 flex flex-wrap gap-2">{actions}</div>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Stat icon={CheckCircle2} label="Right" value={correct} tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" />
          <Stat icon={XCircle} label="Wrong" value={wrong} tone="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" />
          <Stat icon={CircleSlash} label="Not answered" value={skipped} tone="bg-muted text-muted-foreground" />
          <Stat icon={Target} label="Accuracy" value={`${accuracy}%`} tone="bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300" />
        </div>
      </div>
    </section>
  );
}

/** One card per section: marks, and a bar split into right / wrong / not answered. */
export function SectionCards({ sections, onOpen }: { sections: SectionResult[]; onOpen: (start: number) => void }) {
  return (
    <section aria-label="Sections" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {sections.map((s) => {
        const total = s.correct + s.wrong + s.skipped || 1;
        const theme = subjectTheme(s.subject);
        return (
          <button
            key={s.subject}
            type="button"
            onClick={() => onOpen(s.start)}
            className={cn("group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md", theme.hoverBorder)}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                <span className={cn("h-2.5 w-2.5 rounded-full", theme.dot)} aria-hidden="true" />
                {SUBJECT_LABEL[s.subject]}
              </span>
              <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                {s.marks}
                <span className="text-xs font-semibold text-muted-foreground">/{s.maxMarks}</span>
              </span>
            </div>
            <div className="flex h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <span className="bg-emerald-500" style={{ width: `${(s.correct / total) * 100}%` }} />
              <span className="bg-rose-500" style={{ width: `${(s.wrong / total) * 100}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">{s.correct} right</span> ·{" "}
              <span className="font-semibold text-rose-700 dark:text-rose-300">{s.wrong} wrong</span> · {s.skipped} not answered
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400">
              Review section <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </button>
        );
      })}
    </section>
  );
}

/**
 * Topics ranked by how they went: where marks were lost (wrong or left) and where the
 * student was strongest. Each weak topic links to its practice page.
 */
export function TopicInsights({
  questions,
  answers,
  subjectOf,
}: {
  questions: Pyq[];
  answers: Record<string, string>;
  subjectOf: (index: number) => SubjectKey;
}) {
  const byTopic = new Map<string, { subject: SubjectKey; total: number; right: number; wrong: number }>();
  questions.forEach((q, i) => {
    // The subtopic says exactly what to revise ("Synonyms", not "Vocabulary").
    const key = `${subjectOf(i)}|${q.subtopics?.[0] || q.topic || "General"}`;
    const row = byTopic.get(key) ?? { subject: subjectOf(i), total: 0, right: 0, wrong: 0 };
    row.total++;
    const a = answers[q.id];
    if (a) a === q.answer ? row.right++ : row.wrong++;
    byTopic.set(key, row);
  });
  const rows = [...byTopic].map(([key, r]) => ({ topic: key.split("|")[1], ...r, lost: r.total - r.right }));
  const weak = rows.filter((r) => r.lost > 0).sort((a, b) => b.wrong - a.wrong || b.lost - a.lost).slice(0, 5);
  const strong = rows.filter((r) => r.right > 0).sort((a, b) => b.right / b.total - a.right / a.total || b.right - a.right).slice(0, 5);
  if (!rows.length) return null;

  const Row = ({ r, tone }: { r: (typeof rows)[number]; tone: "weak" | "strong" }) => (
    <li className="flex items-center gap-3 py-2">
      <span className={cn("h-2 w-2 shrink-0 rounded-full", subjectTheme(r.subject).dot)} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{r.topic}</span>
        <span className="block text-xs text-muted-foreground">
          {r.right} of {r.total} right{r.wrong ? ` · ${r.wrong} wrong` : ""}
        </span>
      </span>
      {tone === "weak" ? (
        <Link href={`/SSC/${r.subject}/topic-pyqs`} className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-bold text-brand-700 hover:border-brand-500 dark:text-brand-400">
          Practise
        </Link>
      ) : (
        <span className="shrink-0 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">{Math.round((r.right / r.total) * 100)}%</span>
      )}
    </li>
  );

  return (
    <section aria-label="Topics" className="grid gap-3 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-sm font-extrabold text-foreground">Where you lost marks</h2>
        <p className="text-xs text-muted-foreground">Topics with wrong or unanswered questions</p>
        {weak.length ? <ul className="mt-2 divide-y divide-border">{weak.map((r) => <Row key={r.subject + r.topic} r={r} tone="weak" />)}</ul> : <p className="mt-3 text-sm text-muted-foreground">Nothing lost. Every question right.</p>}
      </div>
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-sm font-extrabold text-foreground">Your strongest topics</h2>
        <p className="text-xs text-muted-foreground">Best accuracy in this test</p>
        {strong.length ? <ul className="mt-2 divide-y divide-border">{strong.map((r) => <Row key={r.subject + r.topic} r={r} tone="strong" />)}</ul> : <p className="mt-3 text-sm text-muted-foreground">Answer a few questions to see your strengths.</p>}
      </div>
    </section>
  );
}
