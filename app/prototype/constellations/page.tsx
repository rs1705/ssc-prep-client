"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Crosshair, Play } from "lucide-react";
import { HUE, practiseHref, REVIEW, rng, SUBJECTS, useProgressMap, type LeafInfo } from "@/features/prototype/progress";
import { SUBJECT_LABEL } from "@/lib/subject-theme";

/**
 * PROTOTYPE: the constellation sky. Each subject is a stretch of sky, each topic a
 * constellation, each subtopic a star. Stars brighten as they are practised; a line between
 * two stars lights up once both are; a constellation's name glows when all its stars are lit.
 * Stars due for review flicker orange.
 */

const W = 1200;
const H = 720;
const TOP = 110;

export default function ConstellationsPrototype() {
  const [demo, setDemo] = useState(true);
  const { trees, leaves, share, loading } = useProgressMap(demo);
  const [picked, setPicked] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);

  /* Lay out the sky: four columns, one per subject; constellations in a loose grid inside. */
  const sky = useMemo(() => {
    return SUBJECTS.map((subject, si) => {
      const rand = rng(si * 131 + 7);
      const topics = trees[subject].filter((t) => t.count > 0);
      const colW = W / 4;
      const x0 = si * colW;
      const cols = topics.length > 4 ? 2 : 1;
      const rows = Math.max(1, Math.ceil(topics.length / cols));
      const cellW = colW / cols;
      const cellH = (H - TOP - 40) / rows;
      const groups = topics.map((topic, ti) => {
        const c = ti % cols;
        const r = Math.floor(ti / cols);
        // stagger the columns so it doesn't read as a grid
        const cx = x0 + cellW * (c + 0.5) + (rand() - 0.5) * cellW * 0.25;
        const cy = TOP + cellH * (r + 0.5) + (c === 1 ? cellH * 0.25 : 0) + (rand() - 0.5) * cellH * 0.15;
        const subs = topic.children.filter((s) => s.count > 0);
        const rad = Math.min(cellW, cellH) * 0.36;
        const stars = subs
          .map((sub, k) => {
            const a = (k / subs.length) * Math.PI * 2 + rand() * 0.9;
            const d = rad * (0.45 + rand() * 0.55);
            return { id: sub.id, x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 0.8, a };
          })
          .sort((p, q) => p.a - q.a);
        return { topic, cx, cy, rad, stars };
      });
      return { subject, x0, colW, groups };
    });
  }, [trees]);

  const dust = useMemo(() => {
    const r = rng(99);
    return Array.from({ length: 260 }, () => ({ x: r() * W, y: r() * H, s: 0.4 + r() * 1.1, o: 0.15 + r() * 0.5, d: r() * 5 }));
  }, []);

  const all = [...leaves.values()];
  const lit = (l?: LeafInfo) => !!l && l.status !== "bud";
  const counts = {
    lit: all.filter((l) => lit(l)).length,
    review: all.filter((l) => l.status === "review").length,
    total: all.length,
  };
  const complete = sky.flatMap((s) => s.groups).filter((g) => g.stars.length > 0 && g.stars.every((st) => lit(leaves.get(st.id)))).length;
  const next =
    (picked && leaves.get(picked)) ||
    all.find((l) => l.status === "review" && (!focus || l.subject === focus)) ||
    all.find((l) => l.status === "bud" && (!focus || l.subject === focus) && l.topic.children.some((s) => lit(leaves.get(s.id)))) ||
    all.find((l) => !focus || l.subject === focus);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6">
      <label className="inline-flex cursor-pointer items-center gap-2 self-end text-xs font-semibold text-muted-foreground">
        <input type="checkbox" checked={demo} onChange={(e) => setDemo(e.target.checked)} />
        Prototype: show sample progress
      </label>

      <div className="relative w-full overflow-hidden rounded-3xl bg-[#070914] text-white shadow-2xl">
        <div className="absolute left-6 top-5 z-10">
          <h1 className="font-display text-2xl font-bold tracking-tight">Your sky</h1>
          <p className="text-sm text-white/55">
            {counts.lit} of {counts.total} stars lit · {complete} constellations complete · {counts.review} need a look
          </p>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Constellation sky">
          <defs>
            <filter id="starglow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="nebula" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="40" />
            </filter>
            <linearGradient id="milky" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#1e1b4b" stopOpacity="0" />
              <stop offset="0.5" stopColor="#312e81" stopOpacity="0.35" />
              <stop offset="1" stopColor="#1e1b4b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="#070914" />
          <rect width={W} height={H} fill="url(#milky)" />

          {/* a soft nebula in each subject's colour, as bright as its progress */}
          {sky.map(({ subject, x0, colW }) => {
            const s = share(trees[subject].filter((t) => t.count > 0));
            return s > 0 ? <ellipse key={subject} cx={x0 + colW / 2} cy={H / 2 + 40} rx={colW * 0.45} ry={H * 0.32} fill={HUE[subject]} opacity={0.05 + s * 0.12} filter="url(#nebula)" /> : null;
          })}

          {/* background stars */}
          {dust.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.s} fill="#fff" opacity={d.o}>
              {i % 4 === 0 && <animate attributeName="opacity" values={`${d.o};${d.o * 0.2};${d.o}`} dur={`${3 + d.d}s`} begin={`${-d.d}s`} repeatCount="indefinite" />}
            </circle>
          ))}

          {sky.map(({ subject, groups }) => {
            const hue = HUE[subject];
            const dim = focus && focus !== subject;
            return (
              <g key={subject} opacity={dim ? 0.3 : 1} style={{ transition: "opacity .4s" }}>
                {groups.map(({ topic, cx, cy, rad, stars }) => {
                  const done = stars.length > 0 && stars.every((st) => lit(leaves.get(st.id)));
                  return (
                    <g key={topic.id}>
                      {/* lines: faint until both ends are lit */}
                      {stars.length > 1 &&
                        stars.map((st, k) => {
                          if (k === stars.length - 1 && stars.length < 4) return null;
                          const nx = stars[(k + 1) % stars.length];
                          const on = lit(leaves.get(st.id)) && lit(leaves.get(nx.id));
                          return (
                            <line
                              key={st.id}
                              x1={st.x}
                              y1={st.y}
                              x2={nx.x}
                              y2={nx.y}
                              stroke={on ? hue : "#fff"}
                              strokeOpacity={on ? 0.75 : 0.1}
                              strokeWidth={on ? 1.4 : 1}
                              strokeDasharray={on ? undefined : "3 5"}
                              filter={on ? "url(#starglow)" : undefined}
                            />
                          );
                        })}
                      {stars.map((st, k) => {
                        const l = leaves.get(st.id);
                        if (!l) return null;
                        const r = l.status === "mastered" ? 3.6 : l.status === "bud" ? 1.8 : 2.8;
                        const fill = l.status === "review" ? REVIEW : l.status === "bud" ? "#cbd5e1" : l.status === "mastered" ? "#fff" : hue;
                        return (
                          <g key={st.id} className="cursor-pointer" onClick={() => setPicked(st.id)} role="button" aria-label={`${l.sub.name}: ${l.status}`}>
                            <title>{`${l.sub.name} · ${topic.name}`}</title>
                            {l.status === "mastered" && <circle cx={st.x} cy={st.y} r="8" fill={hue} opacity=".35" filter="url(#starglow)" />}
                            <circle cx={st.x} cy={st.y} r={r} fill={fill} opacity={l.status === "bud" ? 0.45 : 1} filter={l.status === "bud" ? undefined : "url(#starglow)"}>
                              {l.status === "review" && <animate attributeName="opacity" values="1;.35;1" dur="1.6s" repeatCount="indefinite" />}
                              {l.status === "mastered" && <animate attributeName="r" values={`${r};${r * 1.25};${r}`} dur={`${2.5 + (k % 3)}s`} repeatCount="indefinite" />}
                            </circle>
                            {picked === st.id && <circle cx={st.x} cy={st.y} r="11" fill="none" stroke="#fff" strokeOpacity=".8" />}
                            <circle cx={st.x} cy={st.y} r="11" fill="transparent" />
                          </g>
                        );
                      })}
                      <text
                        x={cx}
                        y={cy + rad + 16}
                        textAnchor="middle"
                        className="text-[11px] font-semibold"
                        fill={done ? hue : "#fff"}
                        fillOpacity={done ? 1 : 0.4}
                        filter={done ? "url(#starglow)" : undefined}
                        letterSpacing="0.06em"
                      >
                        {topic.name.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {loading && <p className="absolute inset-x-0 top-1/2 text-center text-sm text-white/60">Mapping your sky…</p>}

        {/* subject pills above each stretch of sky */}
        <div className="absolute inset-x-0 top-[13%] z-10 grid grid-cols-4">
          {SUBJECTS.map((subject) => {
            const s = share(trees[subject].filter((t) => t.count > 0));
            const on = focus === subject;
            return (
              <div key={subject} className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setFocus(on ? null : subject);
                    setPicked(null);
                  }}
                  className="rounded-full border bg-[#0d1020]/80 px-3 py-1 text-xs font-semibold backdrop-blur transition-transform hover:scale-105 sm:text-sm"
                  style={{ borderColor: s > 0 ? HUE[subject] : "rgba(255,255,255,.2)", boxShadow: on ? `0 0 22px ${HUE[subject]}66` : undefined }}
                >
                  {SUBJECT_LABEL[subject]} <span style={{ color: HUE[subject] }}>{Math.round(s * 100)}%</span>
                </button>
              </div>
            );
          })}
        </div>

        {next && (
          <div className="absolute bottom-4 right-4 z-10 hidden w-[340px] rounded-2xl border border-indigo-300/25 bg-[#0d1020]/95 p-4 backdrop-blur sm:block">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: next.status === "review" ? REVIEW : "#a5b4fc" }}>
              {next.status === "review" ? "Fading star" : next.status === "bud" ? "Light the next star" : "Keep it bright"}
            </p>
            <p className="mt-0.5 text-base font-bold leading-snug">{next.sub.name}</p>
            <p className="text-xs text-white/55">
              {SUBJECT_LABEL[next.subject]} · {next.topic.name}
              {next.done > 0 && ` · ${Math.round((next.right / next.done) * 100)}% right`}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Link href={practiseHref(next)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/20 px-4 text-sm font-semibold hover:bg-white/10">
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                {next.status === "review" ? "Revise now" : "Practise"}
              </Link>
              <button type="button" onClick={() => setPicked(next.sub.id)} className="inline-flex items-center gap-1.5 text-sm text-white/65 hover:text-white">
                <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
                Show in sky
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
