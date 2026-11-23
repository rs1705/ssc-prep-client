"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Crosshair, Play } from "lucide-react";
import { useAnswered, type Answered } from "@/features/pyq/answered";
import { SUBJECT_LABEL } from "@/lib/subject-theme";
import type { SubjectKey } from "@/lib/subject-theme";
import { useGetPyqTopicTreeQuery, type PyqTopicNode } from "@/redux/PyqApi";

/**
 * PROTOTYPE: the knowledge tree. A full, softly swaying tree at night. Each subject is a bough,
 * each topic a twig, and each subtopic one of the leaves. Progress glows: a subject's bough
 * lights up in its colour as questions are done, practised leaves take the colour, and leaves
 * due for review glow orange. Tap a glowing leaf, or a subject, to pick what to do next.
 */

type Status = "bud" | "growing" | "mastered" | "review";
type P = { x: number; y: number };
interface LeafInfo {
  subject: SubjectKey;
  topic: PyqTopicNode;
  sub: PyqTopicNode;
  done: number;
  right: number;
  lastAt: number;
  status: Status;
}

const W = 1200;
const H = 760;
const FORK: P = { x: 600, y: 510 };
const GROUND = 715;
const WEEK = 7 * 24 * 3600 * 1000;
const SUBJECTS: SubjectKey[] = ["maths", "reasoning", "english", "gk"];
const HUE: Record<SubjectKey, string> = { maths: "#f6c453", reasoning: "#a78bfa", english: "#f472b6", gk: "#5eead4" };
const REVIEW = "#fb923c";
const BARK = "#a3968c";
const LEAF = "#7c7068";
// Boughs: angle (deg, 0 = right, -90 = up) and length.
const BOUGHS = [
  { a: -164, l: 450 },
  { a: -122, l: 300 },
  { a: -58, l: 300 },
  { a: -16, l: 450 },
];
const LEAF_PATH = "M0 0 C 4.5 -4 4.5 -11 0 -16 C -4.5 -11 -4.5 -4 0 0 Z";

/* ---------- geometry ---------- */

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const add = (a: P, b: P): P => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: P, k: number): P => ({ x: a.x * k, y: a.y * k });
const dirOf = (deg: number): P => ({ x: Math.cos((deg * Math.PI) / 180), y: Math.sin((deg * Math.PI) / 180) });
const angOf = (p: P) => (Math.atan2(p.y, p.x) * 180) / Math.PI;

interface Curve {
  p0: P;
  c1: P;
  c2: P;
  p3: P;
}
function at(c: Curve, t: number): P {
  const u = 1 - t;
  return {
    x: u * u * u * c.p0.x + 3 * u * u * t * c.c1.x + 3 * u * t * t * c.c2.x + t * t * t * c.p3.x,
    y: u * u * u * c.p0.y + 3 * u * u * t * c.c1.y + 3 * u * t * t * c.c2.y + t * t * t * c.p3.y,
  };
}
function tangent(c: Curve, t: number): P {
  const a = at(c, Math.max(0, t - 0.01));
  const b = at(c, Math.min(1, t + 0.01));
  const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: (b.x - a.x) / d, y: (b.y - a.y) / d };
}
const curveD = (c: Curve) => `M${c.p0.x} ${c.p0.y} C${c.c1.x} ${c.c1.y} ${c.c2.x} ${c.c2.y} ${c.p3.x} ${c.p3.y}`;
/** A filled branch that tapers from w0 to w1. */
function taper(c: Curve, w0: number, w1: number): string {
  const n = 18;
  const left: P[] = [];
  const right: P[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = at(c, t);
    const d = tangent(c, t);
    const w = (w0 + (w1 - w0) * t) / 2;
    left.push({ x: p.x - d.y * w, y: p.y + d.x * w });
    right.push({ x: p.x + d.y * w, y: p.y - d.x * w });
  }
  const pts = [...left, ...right.reverse()];
  return `M${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L")} Z`;
}

/* ---------- progress ---------- */

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
  if ((done >= 2 && acc < 0.6) || now - lastAt > WEEK) return "review";
  if (acc >= 0.8 && done / count >= 0.5) return "mastered";
  return "growing";
}

/** Made-up answers so the prototype shows every state (the same every time). */
function sampleAnswers(lists: PyqTopicNode[][]): Record<string, Answered> {
  const out: Record<string, Answered> = {};
  const now = Date.now();
  let k = 0;
  lists.forEach((list, li) => {
    for (const topic of list)
      for (const sub of topic.children) {
        if (sub.count === 0) continue;
        k++;
        // Each subject gets a different amount done, so the boughs glow by different amounts.
        if ((k * 7 + li * 3) % 10 >= 3 + li * 2) continue;
        const kind = k % 6; // 0 review (wrong), 1 review (old), else growing / mastered
        for (let i = 0; i < Math.min(sub.count, 3); i++)
          out[`${sub.id}#${i}`] = {
            at: kind === 1 ? now - 12 * 86400000 : now - i * 3600000,
            ok: kind === 0 ? i === 0 : kind >= 4 ? true : i !== 1,
            tags: [sub.id],
          };
      }
  });
  return out;
}

/* ---------- the scene ---------- */

function Sway({ deg, dur, c, delay = 0 }: { deg: number; dur: number; c: P; delay?: number }) {
  return (
    <animateTransform
      attributeName="transform"
      type="rotate"
      values={`${-deg} ${c.x} ${c.y};${deg} ${c.x} ${c.y};${-deg} ${c.x} ${c.y}`}
      dur={`${dur}s`}
      begin={`${-delay}s`}
      repeatCount="indefinite"
      calcMode="spline"
      keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
    />
  );
}

function Ring({ value, color }: { value: number; color: string }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 -rotate-90" aria-hidden="true">
      <circle cx="12" cy="12" r={r} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="3" />
      <circle cx="12" cy="12" r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${Math.max(value, 0.02) * c} ${c}`} />
    </svg>
  );
}

export default function KnowledgeTreePrototype() {
  const maths = useGetPyqTopicTreeQuery("maths");
  const reasoning = useGetPyqTopicTreeQuery("reasoning");
  const english = useGetPyqTopicTreeQuery("english");
  const gk = useGetPyqTopicTreeQuery("gk");
  const realAnswered = useAnswered();
  const [demo, setDemo] = useState(true);
  const [now] = useState(() => Date.now());
  const [picked, setPicked] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);

  const trees = useMemo(
    () => ({ maths: maths.data ?? [], reasoning: reasoning.data ?? [], english: english.data ?? [], gk: gk.data ?? [] }) as Record<SubjectKey, PyqTopicNode[]>,
    [maths.data, reasoning.data, english.data, gk.data],
  );
  const answered = useMemo(() => (demo ? sampleAnswers(SUBJECTS.map((s) => trees[s])) : realAnswered), [demo, trees, realAnswered]);

  const leaves = useMemo(() => {
    const out = new Map<string, LeafInfo>();
    for (const subject of SUBJECTS)
      for (const topic of trees[subject])
        for (const sub of topic.children) {
          if (sub.count === 0) continue;
          const s = statsFor(answered, sub.id);
          out.set(sub.id, { subject, topic, sub, ...s, status: statusOf(s.done, s.right, s.lastAt, sub.count, now) });
        }
    return out;
  }, [trees, answered, now]);

  // Share of each subject's and topic's questions done.
  const share = (nodes: PyqTopicNode[]) => {
    let total = 0;
    let done = 0;
    for (const n of nodes)
      for (const s of n.children) {
        total += s.count;
        done += Math.min(leaves.get(s.id)?.done ?? 0, s.count);
      }
    return total ? done / total : 0;
  };

  /* Build the tree once per topic list: boughs, twigs, and leaf spots (some carry a subtopic). */
  const scene = useMemo(() => {
    return SUBJECTS.map((subject, si) => {
      const rand = rng(si * 977 + 13);
      const b = BOUGHS[si];
      const d = dirOf(b.a);
      const end = add(FORK, mul(d, b.l));
      const bough: Curve = {
        p0: FORK,
        c1: { x: FORK.x + d.x * 40, y: FORK.y - 70 },
        c2: { x: FORK.x + d.x * b.l * 0.55, y: end.y + 40 + Math.abs(d.x) * 40 },
        p3: end,
      };
      const topics = trees[subject].filter((t) => t.count > 0);
      // At least seven twigs, so a subject with few topics still looks full.
      const n = Math.max(7, topics.length);
      const twigs = Array.from({ length: n }, (_, i) => {
        const topic = topics[i] as PyqTopicNode | undefined;
        const t = 0.28 + (0.7 * (i + 0.5)) / n;
        const base = at(bough, t);
        const tan = tangent(bough, t);
        const side = i % 2 === 0 ? 1 : -1;
        let dir = dirOf(angOf(tan) + side * (32 + rand() * 18));
        if (dir.y > 0.2) dir = dirOf(angOf(tan) - side * (32 + rand() * 18)); // keep twigs reaching up
        const len = 95 + rand() * 70 - t * 20;
        const tip = add(base, mul(dir, len));
        const curve: Curve = {
          p0: base,
          c1: add(base, mul(dir, len * 0.35)),
          c2: add(tip, { x: -dir.x * len * 0.3, y: -dir.y * len * 0.3 + 14 }),
          p3: { x: tip.x, y: tip.y - 18 },
        };
        const subs = topic ? topic.children.filter((s) => s.count > 0) : [];
        // Leaf spots along the twig, both sides; the first few carry the topic's subtopics.
        const spots = Array.from({ length: 16 }, (_, k) => {
          const lt = 0.2 + (0.8 * k) / 15;
          const p = at(curve, lt);
          const tg = angOf(tangent(curve, lt));
          const s = k % 2 === 0 ? 1 : -1;
          return { p, rot: tg + 90 + s * (48 + rand() * 20), scale: 0.8 + rand() * 0.45 };
        });
        const subAt = new Map<number, string>();
        subs.forEach((s, j) => subAt.set(Math.min(15, 3 + Math.round((j * 12) / Math.max(subs.length - 1, 1))), s.id));
        return { topic, curve, spots, subAt, w: 5 - t * 2 };
      });
      // Loose leaves near the bough's end.
      const tipLeaves = Array.from({ length: 14 }, (_, k) => {
        const lt = 0.55 + (0.45 * k) / 13;
        const p = at(bough, lt);
        const s = k % 2 === 0 ? 1 : -1;
        return { p, rot: angOf(tangent(bough, lt)) + 90 + s * 55, scale: 0.9 + rand() * 0.3 };
      });
      return { subject, bough, end, twigs, tipLeaves };
    });
  }, [trees]);

  const all = [...leaves.values()];
  const counts = {
    mastered: all.filter((l) => l.status === "mastered").length,
    growing: all.filter((l) => l.status === "growing").length,
    review: all.filter((l) => l.status === "review").length,
  };
  const next =
    (picked && leaves.get(picked)) ||
    all.find((l) => l.status === "review" && (!focus || l.subject === focus)) ||
    all.find((l) => l.status === "growing" && (!focus || l.subject === focus)) ||
    all.find((l) => !focus || l.subject === focus);
  const loading = [maths, reasoning, english, gk].some((q) => q.isLoading);

  const grass = useMemo(() => {
    const r = rng(42);
    return Array.from({ length: 150 }, () => ({ x: r() * W, h: 6 + r() * 12, lean: (r() - 0.5) * 8 }));
  }, []);
  const flies = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 14 }, () => ({ x: 150 + r() * 900, y: 180 + r() * 460, dx: (r() - 0.5) * 60, dy: (r() - 0.5) * 50, dur: 6 + r() * 6, d: r() * 6 }));
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6">
      <label className="inline-flex cursor-pointer items-center gap-2 self-end text-xs font-semibold text-muted-foreground">
        <input type="checkbox" checked={demo} onChange={(e) => setDemo(e.target.checked)} />
        Prototype: show sample progress
      </label>

      <div className="relative w-full overflow-hidden rounded-3xl bg-[#0e1012] text-white shadow-2xl">
        {/* title */}
        <div className="absolute left-6 top-5 z-10">
          <h1 className="font-display text-2xl font-bold tracking-tight">Your knowledge tree</h1>
          <p className="text-sm text-white/55">
            {counts.mastered} mastered · {counts.growing} growing · {counts.review} due for review
          </p>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Knowledge tree">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="haze" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="28" />
            </filter>
            <linearGradient id="trunk" x1="0" x2="1">
              <stop offset="0" stopColor="#8e8178" />
              <stop offset="0.5" stopColor="#b3a59b" />
              <stop offset="1" stopColor="#857870" />
            </linearGradient>
            <radialGradient id="sky" cx="0.5" cy="0.45" r="0.7">
              <stop offset="0" stopColor="#1b1f22" />
              <stop offset="1" stopColor="#0e1012" />
            </radialGradient>
          </defs>
          <rect width={W} height={H} fill="url(#sky)" />

          {/* ground and grass */}
          <path d={`M0 ${GROUND} Q ${W / 2} ${GROUND - 18} ${W} ${GROUND} L ${W} ${H} L 0 ${H} Z`} fill="#16191b" />
          {grass.map((g, i) => (
            <path key={i} d={`M${g.x} ${GROUND + 4} q ${g.lean / 2} ${-g.h / 2} ${g.lean} ${-g.h}`} stroke="#2b302f" strokeWidth="1.4" fill="none" />
          ))}

          {/* trunk */}
          <path d={`M${FORK.x - 46} ${GROUND + 2} C ${FORK.x - 22} ${GROUND - 90} ${FORK.x - 26} ${FORK.y + 90} ${FORK.x - 16} ${FORK.y} L ${FORK.x + 16} ${FORK.y} C ${FORK.x + 26} ${FORK.y + 90} ${FORK.x + 22} ${GROUND - 90} ${FORK.x + 46} ${GROUND + 2} Z`} fill="url(#trunk)" />

          {scene.map(({ subject, bough, twigs, tipLeaves }, si) => {
            const hue = HUE[subject];
            const sShare = share(trees[subject].filter((t) => t.count > 0));
            const dim = focus && focus !== subject;
            return (
              <g key={subject} opacity={dim ? 0.45 : 1} style={{ transition: "opacity .4s" }}>
                <Sway deg={0.9} dur={9 + si * 1.3} c={FORK} delay={si * 2} />
                {/* soft colour haze where the subject has progress */}
                {sShare > 0 && <circle cx={at(bough, 0.6).x} cy={at(bough, 0.6).y} r={60 + sShare * 140} fill={hue} opacity={0.08 + sShare * 0.12} filter="url(#haze)" />}
                <path d={taper(bough, 22, 4)} fill={BARK} />
                {twigs.map((tw, ti) => {
                  const tShare = tw.topic ? share([tw.topic]) : 0;
                  return (
                    <g key={ti}>
                      <Sway deg={2.2} dur={4.5 + (ti % 4) * 0.7} c={tw.curve.p0} delay={ti * 0.6} />
                      <path d={taper(tw.curve, tw.w, 1)} fill={BARK} />
                      {tShare > 0 && <path d={curveD(tw.curve)} stroke={hue} strokeWidth="2" fill="none" strokeLinecap="round" filter="url(#glow)" pathLength={1} strokeDasharray={`${Math.max(tShare, 0.25)} 1`} />}
                      {tw.spots.map((sp, k) => {
                        const subId = tw.subAt.get(k);
                        const leaf = subId ? leaves.get(subId) : undefined;
                        const lit = leaf && leaf.status !== "bud";
                        const color = !leaf || leaf.status === "bud" ? LEAF : leaf.status === "review" ? REVIEW : hue;
                        return (
                          <g
                            key={k}
                            transform={`translate(${sp.p.x} ${sp.p.y}) rotate(${sp.rot}) scale(${sp.scale * (leaf ? 1.15 : 1)})`}
                            className={leaf ? "cursor-pointer" : undefined}
                            onClick={leaf ? () => setPicked(leaf.sub.id) : undefined}
                            role={leaf ? "button" : undefined}
                            aria-label={leaf ? `${leaf.sub.name}: ${leaf.status}` : undefined}
                          >
                            {leaf && <title>{`${leaf.sub.name} · ${leaf.topic.name}`}</title>}
                            <path d={LEAF_PATH} fill={color} opacity={lit ? 1 : 0.85} filter={lit ? "url(#glow)" : undefined}>
                              {leaf?.status === "review" && <animate attributeName="opacity" values="1;.55;1" dur="2.4s" repeatCount="indefinite" />}
                            </path>
                            {picked === subId && <circle cy="-8" r="13" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".9" />}
                            {leaf && <circle cy="-8" r="12" fill="transparent" />}
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
                {tipLeaves.map((l, k) => (
                  <path key={k} d={LEAF_PATH} transform={`translate(${l.p.x} ${l.p.y}) rotate(${l.rot}) scale(${l.scale})`} fill={LEAF} opacity=".85" />
                ))}
                {/* the bough lights up from the fork as the subject is done */}
                {sShare > 0 && (
                  <path d={curveD(bough)} stroke={hue} strokeWidth="4" fill="none" strokeLinecap="round" filter="url(#glow)" pathLength={1} strokeDasharray={`${Math.max(sShare, 0.12)} 1`} />
                )}
              </g>
            );
          })}

          {/* fireflies */}
          {flies.map((f, i) => (
            <circle key={i} cx={f.x} cy={f.y} r="2.2" fill="#f6d77a" filter="url(#glow)">
              <animate attributeName="cx" values={`${f.x};${f.x + f.dx};${f.x}`} dur={`${f.dur}s`} begin={`${-f.d}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${f.y};${f.y + f.dy};${f.y}`} dur={`${f.dur * 1.3}s`} begin={`${-f.d}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;.9;0" dur={`${f.dur / 2}s`} begin={`${-f.d}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>

        {loading && <p className="absolute inset-x-0 top-1/2 text-center text-sm text-white/60">Growing your tree…</p>}

        {/* subject pills at the end of each bough */}
        {scene.map(({ subject, end }) => {
          const sShare = share(trees[subject].filter((t) => t.count > 0));
          const pct = Math.round(sShare * 100);
          const started = sShare > 0;
          const on = focus === subject;
          return (
            <button
              key={subject}
              type="button"
              onClick={() => {
                setFocus(on ? null : subject);
                setPicked(null);
              }}
              className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border bg-[#15181b]/90 py-1.5 pl-1.5 pr-3.5 text-sm font-semibold backdrop-blur transition-transform hover:scale-105"
              style={{
                left: `${(end.x / W) * 100}%`,
                top: `${((end.y - 40) / H) * 100}%`,
                borderColor: started ? HUE[subject] : "rgba(255,255,255,.18)",
                borderStyle: started ? "solid" : "dashed",
                boxShadow: on ? `0 0 24px ${HUE[subject]}66` : undefined,
              }}
            >
              <Ring value={sShare} color={HUE[subject]} />
              {SUBJECT_LABEL[subject]}
              <span style={{ color: HUE[subject] }}>{started ? (pct < 1 ? "<1%" : `${pct}%`) : "Start"}</span>
            </button>
          );
        })}

        {/* legend */}
        <ul className="absolute bottom-4 left-6 z-10 hidden gap-4 text-xs text-white/60 sm:flex">
          <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: LEAF }} />Not started</li>
          <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-300" />Under way</li>
          <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />Mastered</li>
          <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: REVIEW }} />Review due</li>
        </ul>

        {/* what to do next */}
        {next && (
          <div className="absolute bottom-4 right-4 z-10 w-[min(360px,calc(100%-2rem))] rounded-2xl border border-emerald-400/30 bg-[#121518]/95 p-4 backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: next.status === "review" ? REVIEW : "#6ee7b7" }}>
              {next.status === "review" ? "Review due" : next.status === "bud" ? "Start here" : "Continue"}
            </p>
            <p className="mt-0.5 text-base font-bold leading-snug">{next.sub.name}</p>
            <p className="text-xs text-white/55">
              {SUBJECT_LABEL[next.subject]} · {next.topic.name}
              {next.done > 0 && ` · ${Math.min(next.done, next.sub.count)}/${next.sub.count} done · ${Math.round((next.right / next.done) * 100)}% right`}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href={`/SSC/${next.subject}/topic-pyqs?topic=${encodeURIComponent(next.topic.id)}&sub=${encodeURIComponent(next.sub.id)}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/20 px-4 text-sm font-semibold hover:bg-white/10"
              >
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                {next.status === "review" ? "Revise now" : "Practise"}
              </Link>
              <button type="button" onClick={() => setPicked(next.sub.id)} className="inline-flex items-center gap-1.5 text-sm text-white/65 hover:text-white">
                <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
                Show on tree
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
