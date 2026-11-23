"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useAnswered, type Answered } from "@/features/pyq/answered";
import { SUBJECT_LABEL } from "@/lib/subject-theme";
import type { SubjectKey } from "@/lib/subject-theme";
import { useGetPyqTopicTreeQuery, type PyqTopicNode } from "@/redux/PyqApi";

/**
 * PROTOTYPE: the knowledge tree. Subjects are the boughs, topics the branches, subtopics the
 * leaves. A leaf's colour says how the student is doing; wilting leaves (low accuracy, or not
 * practised for a week) droop and turn yellow. Tap a leaf to practise it.
 */

type Status = "bud" | "growing" | "mastered" | "wilting";
interface LeafInfo {
  subject: SubjectKey;
  topic: PyqTopicNode;
  sub: PyqTopicNode;
  done: number;
  right: number;
  lastAt: number;
  status: Status;
}

const SUBJECTS: SubjectKey[] = ["english", "maths", "reasoning", "gk"];
const WEEK = 7 * 24 * 3600 * 1000;
const LEAF_COLOR: Record<Status, string> = {
  bud: "#b8c0cc",
  growing: "#7ccf8a",
  mastered: "#1f9d55",
  wilting: "#d9a441",
};
const LEAF_PATH = "M0 0 Q 7 -9 0 -20 Q -7 -9 0 0 Z";

/** Answers under a node: count, right, and when it was last practised. */
function statsFor(answered: Record<string, Answered>, nodeId: string) {
  let done = 0;
  let right = 0;
  let lastAt = 0;
  for (const a of Object.values(answered)) {
    if (!a.tags.some((t) => t === nodeId || t.startsWith(`${nodeId}.`))) continue;
    done++;
    if (a.ok) right++;
    lastAt = Math.max(lastAt, a.at);
  }
  return { done, right, lastAt };
}

function statusOf(done: number, right: number, lastAt: number, count: number, now: number): Status {
  if (done === 0) return "bud";
  const acc = right / done;
  if ((done >= 2 && acc < 0.6) || now - lastAt > WEEK) return "wilting";
  if (acc >= 0.8 && done / count >= 0.5) return "mastered";
  return "growing";
}

/** Made-up answers so the prototype shows every leaf colour (deterministic per subtopic). */
function sampleAnswers(...lists: (PyqTopicNode[] | undefined)[]): Record<string, Answered> {
  const out: Record<string, Answered> = {};
  const now = Date.now();
  let k = 0;
  for (const list of lists)
    for (const topic of list ?? [])
      for (const sub of topic.children) {
        if (sub.count === 0) continue;
        const kind = k++ % 5; // 0 bud, 1-2 growing/mastered, 3 wilting (wrong), 4 wilting (old)
        if (kind === 0) continue;
        for (let i = 0; i < Math.min(sub.count, 3); i++)
          out[`${sub.id}#${i}`] = {
            at: kind === 4 ? now - 12 * 86400000 : now - i * 3600000,
            ok: kind === 3 ? i === 0 : kind === 2 ? true : i !== 1,
            tags: [sub.id],
          };
      }
  return out;
}

/** A gentle back-and-forth around the group's own origin; nested groups sway together. */
function Sway({ deg, dur, delay = 0 }: { deg: number; dur: number; delay?: number }) {
  return (
    <animateTransform
      attributeName="transform"
      type="rotate"
      values={`${-deg} 0 0;${deg} 0 0;${-deg} 0 0`}
      dur={`${dur}s`}
      begin={`${delay}s`}
      repeatCount="indefinite"
      additive="sum"
      calcMode="spline"
      keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
    />
  );
}

export default function KnowledgeTreePrototype() {
  const english = useGetPyqTopicTreeQuery("english");
  const maths = useGetPyqTopicTreeQuery("maths");
  const reasoning = useGetPyqTopicTreeQuery("reasoning");
  const gk = useGetPyqTopicTreeQuery("gk");
  const realAnswered = useAnswered();
  const [demo, setDemo] = useState(false);
  const answered = useMemo(() => (demo ? sampleAnswers(english.data, maths.data, reasoning.data, gk.data) : realAnswered), [demo, realAnswered, english.data, maths.data, reasoning.data, gk.data]);
  const [picked, setPicked] = useState<LeafInfo | null>(null);
  const [now] = useState(() => Date.now());

  const trees: Record<SubjectKey, PyqTopicNode[]> = useMemo(
    () => ({ english: english.data ?? [], maths: maths.data ?? [], reasoning: reasoning.data ?? [], gk: gk.data ?? [] }),
    [english.data, maths.data, reasoning.data, gk.data],
  );

  // Every leaf (subtopic with questions), with its status.
  const leaves = useMemo(() => {
    const out = new Map<string, LeafInfo>();
    for (const subject of SUBJECTS) {
      for (const topic of trees[subject]) {
        for (const sub of topic.children) {
          if (sub.count === 0) continue;
          const s = statsFor(answered, sub.id);
          out.set(sub.id, { subject, topic, sub, ...s, status: statusOf(s.done, s.right, s.lastAt, sub.count, now) });
        }
      }
    }
    return out;
  }, [trees, answered, now]);

  const all = [...leaves.values()];
  const wilting = all.filter((l) => l.status === "wilting");
  const counts = {
    mastered: all.filter((l) => l.status === "mastered").length,
    growing: all.filter((l) => l.status === "growing").length,
    wilting: wilting.length,
    bud: all.filter((l) => l.status === "bud").length,
  };
  const loading = [english, maths, reasoning, gk].some((q) => q.isLoading);

  // Boughs fan out from the top of the trunk.
  const boughAngles = [-58, -20, 20, 58];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Prototype</p>
          <h1 className="font-display text-2xl font-extrabold text-foreground">Your knowledge tree</h1>
          <p className="text-sm text-muted-foreground">Every leaf is a subtopic. Tap one to practise it.</p>
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-muted-foreground">
            <input type="checkbox" checked={demo} onChange={(e) => setDemo(e.target.checked)} />
            Show sample progress
          </label>
        </div>
        <ul className="flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground">
          {(
            [
              ["mastered", "Mastered"],
              ["growing", "Growing"],
              ["wilting", "Wilting"],
              ["bud", "Not started"],
            ] as [Status, string][]
          ).map(([s, label]) => (
            <li key={s} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: LEAF_COLOR[s] }} />
              {label} <span className="text-foreground">{counts[s]}</span>
            </li>
          ))}
        </ul>
      </header>

      <div className="surface-card relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50 to-emerald-50/60 dark:from-slate-900 dark:to-emerald-950/30">
        {loading && <p className="absolute inset-x-0 top-6 text-center text-sm text-muted-foreground">Growing your tree…</p>}
        <svg viewBox="40 60 920 590" className="block h-auto w-full" role="img" aria-label="Knowledge tree">
          {/* ground */}
          <ellipse cx="500" cy="628" rx="300" ry="22" className="fill-emerald-200/70 dark:fill-emerald-900/50" />
          <g transform="translate(500 620)">
            <Sway deg={0.6} dur={9} />
            {/* trunk */}
            <path d="M-30 0 C -20 -70 -16 -120 -12 -175 L 12 -175 C 16 -120 20 -70 30 0 Z" fill="#8a5a3b" />
            {SUBJECTS.map((subject, si) => {
              const topics = trees[subject].filter((t) => t.count > 0);
              const len = 200 + Math.min(topics.length, 10) * 12;
              const angle = boughAngles[si];
              return (
                <g key={subject} transform={`translate(${(si - 1.5) * 6} -170) rotate(${angle})`}>
                  <Sway deg={1.4} dur={7 + si} delay={si * 0.7} />
                  <path d={`M-7 0 Q -3 ${-len / 2} -2 ${-len} L 2 ${-len} Q 3 ${-len / 2} 7 0 Z`} fill="#94613f" />
                  {/* subject name at the end of its bough, kept upright */}
                  <g transform={`translate(0 ${-len - 16}) rotate(${-angle})`}>
                    <text textAnchor="middle" className="fill-foreground text-[15px] font-extrabold">
                      {SUBJECT_LABEL[subject]}
                    </text>
                  </g>
                  {topics.map((topic, ti) => {
                    const at = 0.3 + (0.68 * (ti + 0.5)) / Math.max(topics.length, 1);
                    const side = ti % 2 === 0 ? 1 : -1;
                    const subs = topic.children.filter((s) => s.count > 0);
                    const tlen = 55 + Math.min(subs.length, 8) * 12;
                    const doneShare = subs.length
                      ? subs.reduce((n, s) => n + Math.min(leaves.get(s.id)?.done ?? 0, s.count), 0) / subs.reduce((n, s) => n + s.count, 0)
                      : 0;
                    return (
                      <g key={topic.id} transform={`translate(0 ${-len * at}) rotate(${side * (38 + (ti % 3) * 8)})`}>
                        <Sway deg={3} dur={4.5 + (ti % 4) * 0.6} delay={ti * 0.4} />
                        <line x1="0" y1="0" x2="0" y2={-tlen} stroke="#a0704d" strokeWidth={2.5 + doneShare * 3} strokeLinecap="round">
                          <title>{topic.name}</title>
                        </line>
                        {subs.map((sub, li) => {
                          const leaf = leaves.get(sub.id);
                          if (!leaf) return null;
                          const lt = subs.length === 1 ? 1 : 0.35 + (0.65 * li) / (subs.length - 1);
                          const lside = li % 2 === 0 ? 1 : -1;
                          const droop = leaf.status === "wilting" ? 120 : 0;
                          const isPicked = picked?.sub.id === sub.id;
                          return (
                            <g
                              key={sub.id}
                              transform={`translate(0 ${-tlen * lt}) rotate(${lside * (55 + droop)})`}
                              className="cursor-pointer"
                              onClick={() => setPicked(leaf)}
                              role="button"
                              aria-label={`${sub.name}: ${leaf.status}`}
                            >
                              <g transform="scale(1.4)">
                              <Sway deg={leaf.status === "wilting" ? 2 : 6} dur={2.6 + (li % 3) * 0.5} delay={li * 0.3} />
                              <title>{`${sub.name} · ${topic.name}`}</title>
                              {leaf.status === "bud" ? (
                                <circle cx="0" cy="-5" r="4.5" fill={LEAF_COLOR.bud} />
                              ) : (
                                <path
                                  d={LEAF_PATH}
                                  fill={LEAF_COLOR[leaf.status]}
                                  stroke={isPicked ? "#0f172a" : "none"}
                                  strokeWidth="1.5"
                                  transform={leaf.status === "mastered" ? "scale(1.25)" : undefined}
                                />
                              )}
                              {/* bigger tap target */}
                              <circle cx="0" cy="-9" r="12" fill="transparent" />
                              </g>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        </svg>

        {picked && (
          <div className="absolute bottom-4 left-4 right-4 mx-auto max-w-sm rounded-2xl border border-border bg-card p-4 shadow-xl sm:left-auto">
            <button type="button" onClick={() => setPicked(null)} aria-label="Close" className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {SUBJECT_LABEL[picked.subject]} · {picked.topic.name}
            </p>
            <h2 className="pr-6 text-lg font-extrabold text-foreground">{picked.sub.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {picked.done === 0
                ? `${picked.sub.count} questions waiting. Not started yet.`
                : `${Math.min(picked.done, picked.sub.count)} of ${picked.sub.count} done · ${Math.round((picked.right / picked.done) * 100)}% right · last practised ${Math.max(0, Math.round((now - picked.lastAt) / 86400000))} days ago`}
            </p>
            {picked.status === "wilting" && <p className="mt-1 text-sm font-semibold text-amber-600">This leaf is wilting. A quick round brings it back.</p>}
            <Link
              href={`/SSC/${picked.subject}/topic-pyqs?topic=${encodeURIComponent(picked.topic.id)}&sub=${encodeURIComponent(picked.sub.id)}`}
              className="mt-3 inline-flex h-10 items-center rounded-xl bg-brand-500 px-4 text-sm font-bold text-white hover:bg-brand-600"
            >
              {picked.status === "wilting" ? "Revive it" : picked.status === "bud" ? "Plant it" : "Practise"}
            </Link>
          </div>
        )}
      </div>

      {wilting.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-foreground">Wilting leaves</h2>
          <div className="flex flex-wrap gap-2">
            {wilting.map((l) => (
              <button
                key={l.sub.id}
                type="button"
                onClick={() => setPicked(l)}
                className="rounded-full border border-amber-400/60 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300"
              >
                🍂 {l.sub.name}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
