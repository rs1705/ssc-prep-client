"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Flag, Lock, Play, Trophy } from "lucide-react";
import { EXAM_DATE_KEY } from "@/components/custom/exam-countdown";
import { readStored } from "@/lib/storage";
import { SUBJECT_LABEL, type SubjectKey } from "@/lib/subject-theme";
import { HUE, SUBJECTS, useProgressMap } from "@/features/pyq/topic-map";
import type { PyqTopicNode } from "@/redux/PyqApi";

/**
 * PROTOTYPE: the exam journey. A winding road from today to exam day. Each stop is a topic
 * (taking turns between subjects) and every few stops a full mock, each with a target date
 * spread evenly up to the exam. The student's marker sits at the first stop not yet done;
 * the banner says whether they're on track for the date.
 */

type Stop =
  | { kind: "topic"; id: string; subject: SubjectKey; topic: PyqTopicNode; share: number; due: Date }
  | { kind: "mock"; id: string; n: number; due: Date };

const DONE_AT = 0.6; // a topic counts as done once 60% of its questions are answered
const DAY = 86400000;

export default function JourneyPrototype() {
  const [demo, setDemo] = useState(true);
  const { trees, share, loading } = useProgressMap(demo);
  const [examIso, setExamIso] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [today] = useState(() => new Date(new Date().toDateString()));
  const hereRef = useRef<HTMLLIElement>(null);

  useEffect(() => setExamIso(readStored<string | null>(EXAM_DATE_KEY, null)), []);
  const exam = examIso ? new Date(examIso) : new Date(today.getTime() + 60 * DAY);
  const daysLeft = Math.max(0, Math.round((exam.getTime() - today.getTime()) / DAY));

  // Topics take turns between subjects, biggest first within each; a mock after every 4.
  const stops = useMemo<Stop[]>(() => {
    const queues = SUBJECTS.map((s) => trees[s].filter((t) => t.count > 0).map((topic) => ({ subject: s, topic })));
    const order: { subject: SubjectKey; topic: PyqTopicNode }[] = [];
    while (queues.some((q) => q.length)) for (const q of queues) if (q.length) order.push(q.shift()!);
    const raw: (Omit<Extract<Stop, { kind: "topic" }>, "due"> | Omit<Extract<Stop, { kind: "mock" }>, "due">)[] = [];
    let mocks = 0;
    order.forEach((o, i) => {
      raw.push({ kind: "topic", id: o.topic.id, subject: o.subject, topic: o.topic, share: share([o.topic]) });
      if ((i + 1) % 4 === 0) raw.push({ kind: "mock", id: `mock-${++mocks}`, n: mocks });
    });
    const span = Math.max(1, daysLeft);
    return raw.map((s, i) => ({ ...s, due: new Date(today.getTime() + Math.round(((i + 1) / raw.length) * span) * DAY) }) as Stop);
  }, [trees, share, daysLeft, today]);

  const isDone = (s: Stop, i: number) => (s.kind === "topic" ? s.share >= DONE_AT : stops.slice(0, i).filter((x) => x.kind === "topic").every((x) => x.kind === "topic" && x.share >= DONE_AT));
  const hereIdx = Math.max(0, stops.findIndex((s, i) => !isDone(s, i)));
  const here = stops[hereIdx];
  const doneCount = stops.filter((s, i) => isDone(s, i)).length;
  // Where they should be today, against where they are.
  const expectedIdx = stops.findIndex((s) => s.due.getTime() >= today.getTime() + DAY);
  const behind = expectedIdx >= 0 ? expectedIdx - hereIdx : 0;

  useEffect(() => {
    if (!loading) hereRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [loading, hereIdx]);

  const fmt = (d: Date) => d.toLocaleDateString(undefined, { day: "numeric", month: "short" });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6">
      <label className="inline-flex cursor-pointer items-center gap-2 self-end text-xs font-semibold text-muted-foreground">
        <input type="checkbox" checked={demo} onChange={(e) => setDemo(e.target.checked)} />
        Prototype: show sample progress
      </label>

      {/* status banner */}
      <section className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Your road to the exam</p>
          <h1 className="font-display text-2xl font-extrabold text-foreground">
            {daysLeft} days to go{!examIso && <span className="text-base font-semibold text-muted-foreground"> (set your exam date)</span>}
          </h1>
          <p className={behind > 0 ? "text-sm font-semibold text-amber-600" : "text-sm font-semibold text-emerald-600"}>
            {behind > 0 ? `${behind} stop${behind === 1 ? "" : "s"} behind plan, about ${Math.ceil((behind * daysLeft) / Math.max(stops.length, 1))} days of work` : "On track for exam day"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-extrabold text-foreground">
              {doneCount}
              <span className="text-base text-muted-foreground">/{stops.length}</span>
            </p>
            <p className="text-xs text-muted-foreground">stops cleared</p>
          </div>
          {here && (
            <Link
              href={here.kind === "topic" ? `/SSC/${here.subject}/topic-pyqs?topic=${encodeURIComponent(here.topic.id)}` : "/mock-tests"}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-bold text-white hover:bg-brand-600"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Continue
            </Link>
          )}
        </div>
      </section>

      {loading && <p className="text-center text-sm text-muted-foreground">Drawing your road…</p>}

      {/* finish */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background">
          <Flag className="h-4 w-4" aria-hidden="true" />
          Exam day · {fmt(exam)}
        </span>
      </div>
      {/* the road: exam at the top, today at the bottom, winding left and right */}
      <ol className="relative flex flex-col-reverse py-6">
        {/* start line */}
        <li className="relative flex h-16 items-center justify-center">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">Start · {fmt(today)}</span>
        </li>
        {stops.map((s, i) => {
          const done = isDone(s, i);
          const isHere = i === hereIdx;
          const locked = !done && !isHere;
          const x = [50, 72, 80, 64, 36, 20, 28][i % 7];
          const nx = [50, 72, 80, 64, 36, 20, 28][(i + 1) % 7];
          const hue = s.kind === "topic" ? HUE[s.subject] : "#818cf8";
          const late = !done && s.due.getTime() < today.getTime();
          return (
            <li key={s.id} ref={isHere ? hereRef : undefined} className="relative h-28">
              {/* road segment to the next stop */}
              {i < stops.length - 1 && (
                <svg className="absolute inset-x-0 -top-14 h-28 w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path d={`M${x} 100 C ${x} 55 ${nx} 45 ${nx} 0`} fill="none" stroke="currentColor" className="text-border" strokeWidth="9" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                  <path
                    d={`M${x} 100 C ${x} 55 ${nx} 45 ${nx} 0`}
                    fill="none"
                    stroke={done ? "#10b981" : "transparent"}
                    strokeWidth="4"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeDasharray={done ? undefined : "1 10"}
                  />
                </svg>
              )}
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%` }}>
                <button
                  type="button"
                  onClick={() => setOpen(open === s.id ? null : s.id)}
                  className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 bg-card shadow-md transition-transform hover:scale-105"
                  style={{ borderColor: done ? "#10b981" : isHere ? hue : "var(--border)", boxShadow: isHere ? `0 0 0 6px ${hue}33` : undefined }}
                  aria-label={s.kind === "topic" ? s.topic.name : `Mock ${s.n}`}
                >
                  {done ? (
                    <Check className="h-6 w-6 text-emerald-500" />
                  ) : s.kind === "mock" ? (
                    <Trophy className={locked ? "h-5 w-5 text-muted-foreground" : "h-6 w-6 text-indigo-400"} />
                  ) : locked ? (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <span className="text-sm font-extrabold" style={{ color: hue }}>
                      {Math.round(s.share * 100)}%
                    </span>
                  )}
                  {isHere && (
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 animate-bounce whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold text-background">
                      You are here
                    </span>
                  )}
                </button>
              </div>
              {/* label on the roomier side */}
              <div
                className="absolute top-1/2 w-[38%] -translate-y-1/2"
                style={x >= 50 ? { right: `${100 - x + 9}%`, textAlign: "right" } : { left: `${x + 9}%` }}
              >
                <p className={locked ? "text-sm font-bold text-muted-foreground" : "text-sm font-bold text-foreground"}>
                  {s.kind === "topic" ? s.topic.name : `Full mock ${s.n}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.kind === "topic" ? SUBJECT_LABEL[s.subject] : "All four sections"} · by {fmt(s.due)}
                  {late && <span className="font-semibold text-amber-600"> · overdue</span>}
                </p>
                {open === s.id && (
                  <Link
                    href={s.kind === "topic" ? `/SSC/${s.subject}/topic-pyqs?topic=${encodeURIComponent(s.topic.id)}` : "/mock-tests"}
                    className="mt-1.5 inline-flex h-8 items-center gap-1 rounded-lg bg-brand-500 px-3 text-xs font-bold text-white hover:bg-brand-600"
                  >
                    <Play className="h-3 w-3" aria-hidden="true" />
                    {done ? "Practise again" : s.kind === "mock" ? "Take the mock" : "Start"}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
