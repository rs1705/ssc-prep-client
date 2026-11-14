"use client";

import { useId, type ReactNode } from "react";
import { GEO_H, GEO_W, layoutGeometry } from "./geometry";
import { placeLabels, type Pt } from "./labels";
import type {
  BarDiagram,
  Diagram,
  GeometryDiagram,
  NumberLineDiagram,
  PathDiagram,
  PieDiagram,
  SeatingDiagram,
  TreeDiagram,
  VennDiagram,
} from "./types";

/** Diagram renderers, ported from design/diagram-lab.html. Colours come from content.css tokens. */

function Svg({ w, h, label, children }: { w: number; h: number; label: string; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="cf-dg" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function Arrow({ id, cls }: { id: string; cls: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" className={cls} />
    </marker>
  );
}

/** A DOM-safe id for SVG markers (useId returns colons). */
function useSvgId(prefix: string) {
  return `${prefix}${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

// Geometry: points in maths coordinates (y up), circles, segments, right angles, labels.
function Geometry({ d }: { d: GeometryDiagram }) {
  const g = layoutGeometry(d);
  return (
    <Svg w={GEO_W} h={GEO_H} label={d.alt || "Geometry figure"}>
      {g.circles.map((c, i) => (
        <circle key={`c${i}`} cx={c.cx} cy={c.cy} r={c.r} className="ink" strokeWidth={1.6} />
      ))}
      {g.segments.map((s, i) => (
        <line
          key={`s${i}`}
          x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          className={s.highlight ? "brand" : "ink"}
          strokeWidth={s.highlight ? 3 : 1.8}
          strokeLinecap="round"
        />
      ))}
      {g.rightAngles.map((r, i) => (
        <polyline key={`r${i}`} points={r.points.map((p) => p.join(",")).join(" ")} className={r.highlight ? "right" : "brand"} strokeWidth={2} />
      ))}
      {g.dimensions.map((m, i) => (
        <g key={`m${i}`}>
          <line x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} className="ink" strokeWidth={1.1} strokeDasharray="4 3" />
          {m.ticks.map(([a, b], j) => (
            <line key={j} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="ink" strokeWidth={1.4} />
          ))}
        </g>
      ))}
      {g.lengthLabels.map((l, i) => (
        <g key={`l${i}`}>
          <rect x={l.x - l.w / 2} y={l.y - l.h / 2} width={l.w} height={l.h} rx={4} className="card-fill" />
          <text x={l.x} y={l.y + 4} textAnchor="middle" className="mono bold">{l.text}</text>
        </g>
      ))}
      {g.points.map((p) => (
        <g key={`p${p.name}`}>
          <circle cx={p.x} cy={p.y} r={3.2} className="ink-fill" />
          <text x={p.labelX} y={p.labelY + 5} textAnchor="middle" className="bold">{p.name}</text>
        </g>
      ))}
    </Svg>
  );
}

function roundTop(x: number, y: number, w: number, hgt: number, r: number) {
  r = Math.min(r, hgt, w / 2);
  return `M${x},${y + hgt} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + hgt} Z`;
}

// Bar chart with a single scale; one optional highlighted (answer) bar.
function Bar({ d }: { d: BarDiagram }) {
  const W = 420, H = 250, L = 46, R = 14, T = 22, B = 34;
  const max = Math.max(...d.values, 0);
  const step = d.tick || niceTick(max);
  const top = Math.max(step, Math.ceil(max / step) * step);
  const y = (v: number) => T + (H - T - B) * (1 - v / top);
  const ticks: number[] = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(round(v));
  const n = d.values.length, slot = (W - L - R) / n, bw = Math.min(46, slot * 0.6);
  return (
    <Svg w={W} h={H} label={d.alt || "Bar chart"}>
      {ticks.map((v) => (
        <g key={`t${v}`}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className={v === 0 ? "muted" : "grid"} strokeWidth={1} />
          <text x={L - 8} y={y(v) + 4} textAnchor="end" className="small mono">{v}</text>
        </g>
      ))}
      {d.values.map((v, i) => {
        const x = L + slot * i + (slot - bw) / 2;
        const on = d.highlight === i;
        return (
          <g key={`b${i}`}>
            {/* One series, one colour (Quant sky); only the answer bar changes. */}
            <path d={roundTop(x, y(v), bw, y(0) - y(v), 4)} fill={on ? "var(--cf-right)" : "var(--cf-bar)"} />
            <text x={x + bw / 2} y={y(v) - 6} textAnchor="middle" className="small mono">{v}</text>
            <text x={x + bw / 2} y={H - 12} textAnchor="middle" className="small">{d.labels[i]}</text>
          </g>
        );
      })}
      {d.unit && <text x={L - 40} y={12} className="small">{d.unit}</text>}
    </Svg>
  );
}

/** About five gridlines: 1, 2 or 5 × a power of ten. */
function niceTick(max: number) {
  if (max <= 0) return 1;
  const raw = max / 5, p = 10 ** Math.floor(Math.log10(raw)), m = raw / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}
const round = (v: number) => Math.round(v * 1e6) / 1e6;

// Pie: one distinct colour per slice in the validated order; 2px gaps; names and
// percentages in the legend. A highlighted slice is pulled out and the rest fade.
function Pie({ d }: { d: PieDiagram }) {
  const W = 400, cx = 120, cy = 120, r = 92;
  const H = Math.max(240, 34 + d.slices.length * 34);
  const colour = (i: number) => `var(--cf-series-${(i % 5) + 1})`;
  const hasHl = typeof d.highlight === "number";
  // Start and end angle of each slice, clockwise from 12 o'clock.
  const angles = d.slices.reduce<[number, number][]>((acc, sl) => {
    const start = acc.length ? acc[acc.length - 1][1] : -Math.PI / 2;
    acc.push([start, start + (sl.value / 100) * Math.PI * 2]);
    return acc;
  }, []);
  return (
    <Svg w={W} h={H} label={d.alt || "Pie chart"}>
      {d.slices.map((sl, i) => {
        const [start, a1] = angles[i];
        const large = a1 - start > Math.PI ? 1 : 0;
        const on = d.highlight === i;
        const am = (start + a1) / 2;
        const push = on ? 9 : 0;
        const ox = cx + push * Math.cos(am), oy = cy + push * Math.sin(am);
        const path =
          sl.value >= 99.999
            ? `M${ox - r},${oy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`
            : `M${ox},${oy} L${ox + r * Math.cos(start)},${oy + r * Math.sin(start)} A${r},${r} 0 ${large} 1 ${ox + r * Math.cos(a1)},${oy + r * Math.sin(a1)} Z`;
        const ly = 34 + i * 34;
        const fade = hasHl && !on ? 0.35 : 1;
        return (
          <g key={`s${i}`}>
            <path d={path} fill={colour(i)} stroke="var(--cf-card)" strokeWidth={2} opacity={fade} />
            <rect x={240} y={ly - 10} width={12} height={12} rx={3} fill={colour(i)} opacity={fade} />
            <text x={260} y={ly} className={on ? "bold" : undefined}>{sl.label}</text>
            <text x={260} y={ly + 15} className={on ? "small mono bold" : "small mono"}>{`${sl.value}%`}</text>
          </g>
        );
      })}
    </Svg>
  );
}

// Venn: sets placed from their relation to an earlier set (inside / overlapping / separate).
function Venn({ d }: { d: VennDiagram }) {
  // Sets unrelated to the others ("separate") get their own space: to the right, or to
  // the left when an overlapping set already uses the right, so no circle touches them.
  const separate = d.sets.slice(1).filter((s) => !s.within && !s.overlaps);
  const separateLeft = separate.length > 0 && d.sets.some((s) => s.overlaps);
  const W = separateLeft ? 440 : 360, H = 230;
  const baseX = separateLeft ? 240 : 160;
  const placed: Record<string, { cx: number; cy: number; r: number }> = {};
  const base = d.sets[0];
  placed[base.id] = { cx: baseX, cy: 118, r: 82 };
  const slots = separateLeft
    ? separate.length > 1 ? [{ cx: 72, cy: 70, r: 40 }, { cx: 72, cy: 166, r: 40 }] : [{ cx: 72, cy: 118, r: 46 }]
    : separate.length > 1 ? [{ cx: 300, cy: 70, r: 40 }, { cx: 300, cy: 166, r: 40 }] : [{ cx: 300, cy: 118, r: 46 }];
  let nextSlot = 0;
  for (const set of d.sets.slice(1)) {
    if (set.within && placed[set.within]) {
      const p = placed[set.within];
      placed[set.id] = { cx: p.cx - p.r * 0.32, cy: p.cy + 6, r: p.r * 0.44 };
    } else if (set.overlaps && placed[set.overlaps]) {
      const p = placed[set.overlaps];
      placed[set.id] = { cx: p.cx + p.r * 1.15, cy: p.cy, r: p.r * 0.62 };
    } else {
      placed[set.id] = slots[Math.min(nextSlot++, slots.length - 1)];
    }
  }
  const b0 = placed[base.id];
  let region: ReactNode = null;
  if (d.region) {
    const a = placed[d.region.between[0]], b = placed[d.region.between[1]];
    if (a && b) {
      const mx = (a.cx + a.r + b.cx - b.r) / 2;
      region = (
        <g>
          <circle cx={mx} cy={a.cy + 34} r={5} className="right-fill" />
          <text x={mx} y={a.cy + 58} textAnchor="middle" className="small">{d.region.label}</text>
        </g>
      );
    }
  }
  return (
    <Svg w={W} h={H} label={d.alt || "Venn diagram"}>
      <circle cx={b0.cx} cy={b0.cy} r={b0.r} className="soft" />
      {d.sets.map((set) => {
        const p = placed[set.id];
        return <circle key={`c${set.id}`} cx={p.cx} cy={p.cy} r={p.r} className={set.highlight ? "brand" : "ink"} strokeWidth={set.highlight ? 2.6 : 1.6} fill="none" />;
      })}
      {d.sets.map((set) => {
        const p = placed[set.id];
        const ty = set.within || set.overlaps ? p.cy + 5 : p.cy - p.r + 22;
        // An overlapping set's name goes in the part of its circle outside the other set.
        const tx = set.overlaps ? p.cx + p.r * 0.48 : p.cx;
        return <text key={`t${set.id}`} x={tx} y={ty} textAnchor="middle" className="bold">{set.label}</text>;
      })}
      {region}
    </Svg>
  );
}

// Family tree: generations from parent edges; square = male, circle = female.
function Tree({ d }: { d: TreeDiagram }) {
  const W = 380, rowH = 82, top = 36;
  const depth: Record<string, number> = {};
  const children: Record<string, string[]> = {};
  for (const [p, c] of d.edges) (children[p] ||= []).push(c);
  const roots = d.nodes.filter((n) => !d.edges.some(([, c]) => c === n.id));
  const walk = (id: string, dep: number) => {
    depth[id] = Math.max(depth[id] ?? 0, dep);
    for (const c of children[id] || []) walk(c, dep + 1);
  };
  roots.forEach((r) => walk(r.id, 0));
  const maxD = Math.max(0, ...Object.values(depth));
  const H = top + rowH * maxD + 50;
  const pos: Record<string, [number, number]> = {};
  for (let lv = 0; lv <= maxD; lv++) {
    const row = d.nodes.filter((n) => (depth[n.id] ?? 0) === lv);
    row.forEach((n, i) => {
      pos[n.id] = [((i + 1) * W) / (row.length + 1), top + lv * rowH];
    });
  }
  return (
    <Svg w={W} h={H} label={d.alt || "Family tree"}>
      {d.edges.map(([p, c]) => {
        const [x1, y1] = pos[p], [x2, y2] = pos[c];
        const midY = (y1 + y2) / 2;
        return <path key={`e${p}-${c}`} d={`M${x1},${y1 + 16} V${midY} H${x2} V${y2 - 16}`} className="muted" strokeWidth={1.6} />;
      })}
      {d.nodes.map((n) => {
        const [x, y] = pos[n.id];
        const cls = n.highlight === "answer" ? "right" : n.highlight ? "brand" : "ink";
        return (
          <g key={`n${n.id}`}>
            {n.gender === "f" ? (
              <circle cx={x} cy={y} r={15} className={cls} strokeWidth={2} fill="none" />
            ) : (
              <rect x={x - 15} y={y - 15} width={30} height={30} rx={3} className={cls} strokeWidth={2} fill="none" />
            )}
            <text x={x} y={y + 4} textAnchor="middle" className="bold small fg">{n.short || ""}</text>
            <text x={x} y={y + 33} textAnchor="middle" className={n.highlight ? "bold" : undefined}>{n.label}</text>
          </g>
        );
      })}
    </Svg>
  );
}

// Direction path: steps on a grid, distance labels, start/end, dashed displacement.
function PathFigure({ d }: { d: PathDiagram }) {
  const W = 360, H = 300, P = 44;
  const arrowId = useSvgId("arr");
  const arrowRight = useSvgId("arrR");
  const dirs = { N: [0, 1], S: [0, -1], E: [1, 0], W: [-1, 0] } as const;
  const pts: [number, number][] = [[0, 0]];
  for (const st of d.steps) {
    const [x, y] = pts[pts.length - 1];
    const [dx, dy] = dirs[st.dir];
    pts.push([x + dx * st.dist, y + dy * st.dist]);
  }
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs) - 1, maxX = Math.max(...xs) + 1, minY = Math.min(...ys) - 1, maxY = Math.max(...ys) + 1;
  const k = Math.min((W - 2 * P) / (maxX - minX), (H - 2 * P) / (maxY - minY));
  const X = (x: number) => P + (x - minX) * k + ((W - 2 * P) - (maxX - minX) * k) / 2;
  const Y = (y: number) => H - P - (y - minY) * k - ((H - 2 * P) - (maxY - minY) * k) / 2;
  const unit = d.unit ?? "km";
  // Grid lines every unit, or thinned out for long walks.
  const every = Math.max(1, Math.ceil(Math.max(maxX - minX, maxY - minY) / 16));
  const gridX: number[] = [], gridY: number[] = [];
  for (let gx = Math.ceil(minX); gx <= maxX; gx++) if (gx % every === 0) gridX.push(gx);
  for (let gy = Math.ceil(minY); gy <= maxY; gy++) if (gy % every === 0) gridY.push(gy);
  const [ex, ey] = pts[pts.length - 1];
  const cx = W - 26, cy = 30;

  // Labels keep clear of every line, the Start/End dots and each other.
  const stepSegs: [Pt, Pt][] = d.steps.map((_, i) => [[X(pts[i][0]), Y(pts[i][1])], [X(pts[i + 1][0]), Y(pts[i + 1][1])]]);
  const dispSeg: [Pt, Pt] = [[X(0), Y(0)], [X(ex), Y(ey)]];
  const labels = placeLabels(
    [
      ...d.steps.map((st, i) => ({ text: `${st.dist} ${unit}`, along: stepSegs[i], charWidth: 6.7 })),
      ...(d.showDisplacement && d.displacementLabel ? [{ text: d.displacementLabel, along: dispSeg, charWidth: 6.4 }] : []),
    ],
    {
      segments: [...stepSegs, ...(d.showDisplacement ? [dispSeg] : []), [[cx, cy + 14], [cx, cy - 12]]],
      // Start/End dots, their words, and the compass "N".
      dots: [
        { at: [X(0), Y(0)], r: 6 },
        { at: [X(ex), Y(ey)], r: 6 },
        { at: [X(0) - 24, Y(0)], r: 15 },
        { at: [X(ex) + 22, Y(ey)], r: 13 },
        { at: [cx, cy - 20], r: 6 },
      ],
    },
    W,
    H,
  );
  const stepLabels = labels.slice(0, d.steps.length);
  const disp = d.showDisplacement && d.displacementLabel ? labels[d.steps.length] : null;
  return (
    <Svg w={W} h={H} label={d.alt || "Direction path"}>
      <defs>
        <Arrow id={arrowId} cls="brand-fill" />
        <Arrow id={arrowRight} cls="right-fill" />
      </defs>
      {gridX.map((gx) => <line key={`gx${gx}`} x1={X(gx)} x2={X(gx)} y1={Y(minY)} y2={Y(maxY)} className="grid" />)}
      {gridY.map((gy) => <line key={`gy${gy}`} x1={X(minX)} x2={X(maxX)} y1={Y(gy)} y2={Y(gy)} className="grid" />)}
      {d.steps.map((st, i) => {
        const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
        const l = stepLabels[i];
        return (
          <g key={`st${i}`}>
            <line x1={X(x1)} y1={Y(y1)} x2={X(x2)} y2={Y(y2)} className="brand" strokeWidth={2.4} markerEnd={`url(#${arrowId})`} />
            <text x={l.x} y={l.y + 4} textAnchor="middle" className="mono bold small fg">
              {l.text}
            </text>
          </g>
        );
      })}
      {d.showDisplacement && (
        <line x1={X(0)} y1={Y(0)} x2={X(ex)} y2={Y(ey)} className="right" strokeWidth={2} strokeDasharray="6 5" markerEnd={`url(#${arrowRight})`} />
      )}
      {disp && (
        <text x={disp.x} y={disp.y + 4} textAnchor="middle" className="small bold right-text">
          {disp.text}
        </text>
      )}
      <circle cx={X(0)} cy={Y(0)} r={6} className="ink-fill" />
      <text x={X(0) - 10} y={Y(0) + 4} textAnchor="end" className="bold small fg">Start</text>
      <circle cx={X(ex)} cy={Y(ey)} r={6} className="right-fill" />
      <text x={X(ex) + 10} y={Y(ey) + 4} className="bold small fg">End</text>
      <line x1={cx} y1={cy + 14} x2={cx} y2={cy - 12} className="ink" strokeWidth={1.6} markerEnd={`url(#${arrowId})`} />
      <text x={cx} y={cy - 16} textAnchor="middle" className="bold small fg">N</text>
    </Svg>
  );
}

// Circular seating: seats listed anticlockwise from the bottom, everyone facing the centre.
function Seating({ d }: { d: SeatingDiagram }) {
  const W = 320, H = 290, cx = 160, cy = 140, R = 92;
  const n = d.seats.length;
  return (
    <Svg w={W} h={H} label={d.alt || "Circular seating arrangement"}>
      <circle cx={cx} cy={cy} r={R - 34} className="soft" />
      <circle cx={cx} cy={cy} r={R - 34} className="muted" strokeWidth={1.2} />
      <text x={cx} y={cy + 4} textAnchor="middle" className="small">table</text>
      {d.seats.map((name, k) => {
        const ang = (Math.PI / 180) * (90 - (360 / n) * k);
        const x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
        const hlv = (d.highlight || {})[name];
        const ix = cx + (R - 24) * Math.cos(ang), iy = cy + (R - 24) * Math.sin(ang);
        return (
          <g key={`seat${k}`}>
            <circle cx={x} cy={y} r={17} className={hlv === "answer" ? "right-fill" : hlv ? "brand-fill" : "card-fill"} />
            <circle cx={x} cy={y} r={17} className={hlv === "answer" ? "right" : hlv ? "brand" : "ink"} strokeWidth={1.6} />
            <text x={x} y={y + 5} textAnchor="middle" className={hlv ? "on-brand" : "bold"}>{name}</text>
            <line x1={cx + (R - 19) * Math.cos(ang)} y1={cy + (R - 19) * Math.sin(ang)} x2={ix} y2={iy} className="muted" strokeWidth={1.4} />
          </g>
        );
      })}
      <text x={cx} y={H - 10} textAnchor="middle" className="small">{d.note || "All face the centre"}</text>
    </Svg>
  );
}

/** "5, 6, 7" for marks [5, 6, 7]. */
function sameAsMarks(label: string, marks: number[]) {
  return label.replace(/\s+/g, "") === marks.join(",");
}

// Number line with open / closed ends and a shaded range.
function NumberLine({ d }: { d: NumberLineDiagram }) {
  const W = 420, L = 24, R = 24;
  const extraLabel = !!d.marksLabel && (d.marks?.length ?? 0) > 0 && !sameAsMarks(d.marksLabel, d.marks ?? []);
  const yv = extraLabel ? 60 : 46, H = yv + 50;
  const arrowId = useSvgId("nl");
  const X = (v: number) => L + ((v - d.min) / (d.max - d.min)) * (W - L - R);
  const ticks: number[] = [];
  for (let v = Math.ceil(d.min); v <= d.max; v++) ticks.push(v);
  const marks = d.marks ?? [];
  return (
    <Svg w={W} h={H} label={d.alt || "Number line"}>
      <defs>
        <Arrow id={arrowId} cls="ink-fill" />
      </defs>
      <line x1={L - 12} x2={W - R + 12} y1={yv} y2={yv} className="ink" strokeWidth={1.6} markerEnd={`url(#${arrowId})`} markerStart={`url(#${arrowId})`} />
      {ticks.map((v) => (
        <g key={`t${v}`}>
          <line x1={X(v)} x2={X(v)} y1={yv - 6} y2={yv + 6} className="ink" strokeWidth={1.2} />
          <text x={X(v)} y={yv + 24} textAnchor="middle" className="small mono">{v}</text>
        </g>
      ))}
      {(d.ranges ?? []).map((r, i) => (
        <g key={`r${i}`}>
          <line x1={X(r.from)} x2={X(r.to)} y1={yv} y2={yv} className="brand" strokeWidth={6} strokeLinecap="butt" opacity={0.85} />
          <circle cx={X(r.from)} cy={yv} r={6.5} className={r.fromClosed ? "brand-fill" : "card-fill"} stroke="var(--cf-brand)" strokeWidth={2.4} />
          <circle cx={X(r.to)} cy={yv} r={6.5} className={r.toClosed ? "brand-fill" : "card-fill"} stroke="var(--cf-brand)" strokeWidth={2.4} />
        </g>
      ))}
      {/* Each marked value is named right above its own dot, so the numbers line up. */}
      {marks.map((m) => (
        <g key={`m${m}`}>
          <circle cx={X(m)} cy={yv - 20} r={4} className="right-fill" />
          <text x={X(m)} y={yv - 29} textAnchor="middle" className="small mono bold right-text">{m}</text>
        </g>
      ))}
      {/* A label that only repeats the numbers adds nothing; anything else goes above them. */}
      {d.marksLabel && marks.length > 0 && !sameAsMarks(d.marksLabel, marks) && (
        <text x={X((marks[0] + marks[marks.length - 1]) / 2)} y={yv - 44} textAnchor="middle" className="small bold right-text">
          {d.marksLabel}
        </text>
      )}
    </Svg>
  );
}

export function DiagramView({ d }: { d: Diagram }) {
  switch (d.kind) {
    case "geometry": return <Geometry d={d} />;
    case "bar": return <Bar d={d} />;
    case "pie": return <Pie d={d} />;
    case "venn": return <Venn d={d} />;
    case "tree": return <Tree d={d} />;
    case "path": return <PathFigure d={d} />;
    case "seating": return <Seating d={d} />;
    case "numberline": return <NumberLine d={d} />;
  }
}
