"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Eye, RefreshCw, Sparkles, X } from "lucide-react";
import { recordAnswers } from "@/features/pyq/answered";
import { RichText } from "@/features/pyq/RichText";
import { logActivity, logMistakes, plainText, recordReview, type MistakeEntry } from "@/lib/activity-log";
import { SUBJECT_LABEL, type SubjectKey } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";
import { useLazyGetPyqSetQuery, type Pyq } from "@/redux/PyqApi";

/** Small things a student can do right on the dashboard. */

/* ---------------- count-up number ---------------- */

export function CountUp({ value, className }: { value: number; className?: string }) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 600);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(a + (value - a) * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className={cn("tabular-nums", className)}>{shown}</span>;
}

/* ---------------- quick question ---------------- */

const ROTATION: SubjectKey[] = ["maths", "reasoning", "english", "gk"];

/** One real past-year question, answered with a tap. Counts like any other practice. */
export function QuickQuestion() {
  const [fetchSet] = useLazyGetPyqSetQuery();
  const [subjectIdx, setSubjectIdx] = useState(() => new Date().getDate() % ROTATION.length);
  const [q, setQ] = useState<Pyq | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const subject = ROTATION[subjectIdx];

  const load = useCallback(
    async (s: SubjectKey) => {
      setLoading(true);
      setPicked(null);
      const res = await fetchSet({ subject: s, limit: 12 });
      // Short, text-only questions read best in a small card.
      const fit = (res.data ?? []).filter((x) => !x.passage && !x.questionBlocks && x.question.length < 260 && x.options.every((o) => !o.blocks && o.text.length < 80));
      setQ(fit[0] ?? res.data?.[0] ?? null);
      setLoading(false);
    },
    [fetchSet],
  );

  useEffect(() => {
    void load(subject);
  }, [load, subject]);

  const answer = (label: string) => {
    if (!q || picked) return;
    setPicked(label);
    const right = label === q.answer;
    setStreak((n) => (right ? n + 1 : 0));
    const href = `/SSC/${subject}/topic-pyqs`;
    recordAnswers([q], { [q.id]: label });
    logActivity({ kind: "pyq", subject, label: "Quick question", href, correct: right ? 1 : 0, total: 1 });
    if (!right)
      logMistakes([
        {
          subject,
          source: "Quick question",
          prompt: plainText(q.question),
          answer: plainText(q.options.find((o) => o.label === q.answer)?.text ?? q.answer, 80),
          detail: q.topic,
          href,
          options: q.options.map((o) => plainText(o.text, 80)),
        },
      ]);
  };

  const next = () => setSubjectIdx((i) => (i + 1) % ROTATION.length);
  const right = picked && q ? picked === q.answer : null;

  return (
    <section aria-labelledby="quick-heading" className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 id="quick-heading" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          One quick question
          <span className="font-semibold normal-case tracking-normal">· {SUBJECT_LABEL[subject]}</span>
        </h2>
        {streak > 1 && (
          <span key={streak} className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-700 motion-safe:animate-pop dark:text-emerald-300">
            {streak} in a row
          </span>
        )}
      </div>

      {loading || !q ? (
        <div className="flex flex-col gap-2" aria-hidden="true">
          <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-5 w-3/5 animate-pulse rounded bg-muted" />
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-11 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <RichText text={q.question} className="text-[15px] font-semibold leading-relaxed text-foreground" />
          <ul className={cn("grid gap-2 sm:grid-cols-2", right === false && "motion-safe:animate-shake")}>
            {q.options.map((o) => {
              const isAnswer = o.label === q.answer;
              const isPicked = o.label === picked;
              return (
                <li key={o.label} className="relative">
                  <button
                    type="button"
                    onClick={() => answer(o.label)}
                    disabled={!!picked}
                    className={cn(
                      "flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-all",
                      !picked && "border-border hover:-translate-y-0.5 hover:border-brand-500/60 hover:shadow-sm active:translate-y-0",
                      picked && isAnswer && "border-emerald-500 bg-emerald-500/10 font-semibold text-foreground",
                      picked && isPicked && !isAnswer && "border-rose-500 bg-rose-500/10 text-foreground",
                      picked && !isAnswer && !isPicked && "border-border opacity-50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                        picked && isAnswer ? "border-emerald-500 bg-emerald-500 text-white motion-safe:animate-pop" : picked && isPicked ? "border-rose-500 bg-rose-500 text-white" : "border-border text-muted-foreground",
                      )}
                    >
                      {picked && isAnswer ? <Check className="h-3.5 w-3.5" /> : picked && isPicked ? <X className="h-3.5 w-3.5" /> : o.label.toUpperCase()}
                    </span>
                    <RichText inline text={o.text} />
                  </button>
                  {picked && isPicked && isAnswer && (
                    <span className="pointer-events-none absolute -top-2 right-3 text-sm font-extrabold text-emerald-500 motion-safe:animate-float-up">+1</span>
                  )}
                </li>
              );
            })}
          </ul>
          {picked && (
            <div className="flex flex-wrap items-center justify-between gap-3 motion-safe:animate-pop">
              <p className={cn("text-sm font-semibold", right ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                {right ? "Correct!" : "Not quite. Saved to your review list."}
                <span className="ml-1 font-normal text-muted-foreground">{q.source ? `From ${q.source}` : ""}</span>
              </p>
              <div className="flex items-center gap-4">
                <Link href={`/SSC/${subject}/topic-pyqs`} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
                  More like this
                </Link>
                <button type="button" onClick={next} className="group inline-flex items-center gap-1 text-sm font-bold text-foreground hover:underline">
                  Another one
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

/* ---------------- flip a mistake ---------------- */

/** One mistake at a time: read it, flip to the answer, say whether you knew it. */
export function MistakeFlip({ due }: { due: MistakeEntry[] }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cleared, setCleared] = useState(0);
  const m = due[i];

  const grade = (knew: boolean) => {
    if (!m) return;
    recordReview(m.id, knew);
    if (knew) setCleared((n) => n + 1);
    setFlipped(false);
    setI((n) => n + 1);
  };

  if (!m)
    return (
      <div className="flex flex-col items-center gap-1 rounded-2xl bg-emerald-500/10 p-4 text-center motion-safe:animate-pop">
        <Check className="h-6 w-6 text-emerald-500" aria-hidden="true" />
        <p className="text-sm font-bold text-foreground">{cleared > 0 ? `${cleared} fixed. Nice!` : "All caught up"}</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      <div className="[perspective:1000px]">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "Show the question" : "Show the answer"}
          className="relative block h-36 w-full text-left [transform-style:preserve-3d] motion-safe:transition-transform motion-safe:duration-500"
          style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
        >
          <span className="absolute inset-0 flex flex-col gap-1.5 overflow-hidden rounded-2xl border border-border bg-muted/40 p-3 [backface-visibility:hidden]">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {SUBJECT_LABEL[m.subject]} · {m.source}
            </span>
            <span className="line-clamp-3 text-sm font-semibold text-foreground">{m.prompt}</span>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              Tap to see the answer
            </span>
          </span>
          <span className="absolute inset-0 flex flex-col gap-1.5 overflow-hidden rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Answer</span>
            <span className="line-clamp-3 text-base font-bold text-foreground">{m.answer}</span>
            {m.detail && <span className="mt-auto text-xs text-muted-foreground">{m.detail}</span>}
          </span>
        </button>
      </div>
      {flipped ? (
        <div className="grid grid-cols-2 gap-2 motion-safe:animate-pop">
          <button type="button" onClick={() => grade(false)} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Still unsure
          </button>
          <button type="button" onClick={() => grade(true)} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-sm font-bold text-white hover:bg-emerald-600">
            <Check className="h-4 w-4" aria-hidden="true" />
            Got it
          </button>
        </div>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          {i + 1} of {due.length}
        </p>
      )}
    </div>
  );
}
