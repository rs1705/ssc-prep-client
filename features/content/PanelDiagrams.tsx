"use client";

import type { ReactNode } from "react";
import { ArrowMarker, FIG, Svg, useSvgId } from "./figure";
import { cutsOnSheet, foldStages, SQUARE, unfold } from "./fold";
import { anchorPoint, DEFAULT_ARROW_LENGTH, DEFAULT_GLYPH_SIZE, defaultShapeSize, dirVector, shapePath, type Pt } from "./panel";
import { foldAlt, panelAlt } from "./plain";
import type { FoldDiagram, PanelCell, PanelDiagram, PanelItem, PanelLineEnd, PanelShape } from "./types";

/** Figure series, option figures and paper folding: square cells drawn in the shared figure style. */

const C = FIG.cell;
const PAD = 4;
/** Stroke width of marks inside cells. */
const ML = FIG.mark.line;

const add = (a: Pt, b: Pt, k = 1): Pt => [a[0] + b[0] * k, a[1] + b[1] * k];
const perp = ([x, y]: Pt): Pt => [-y, x];
const pts = (list: Pt[]) => list.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

/** A filled (or open) arrowhead with its tip at `tip`, pointing along unit vector `u`. */
function Head({ tip, u, len, hollow }: { tip: Pt; u: Pt; len: number; hollow?: boolean }) {
  const back = add(tip, u, -len), n = perp(u);
  const a = add(back, n, len * 0.55), b = add(back, n, -len * 0.55);
  return hollow ? (
    <polyline points={pts([a, tip, b])} className={FIG.cls.line} strokeWidth={ML} strokeLinejoin="round" strokeLinecap="round" />
  ) : (
    <polygon points={pts([tip, a, b])} className={FIG.cls.fill} />
  );
}

function EndCap({ at, u, cap }: { at: Pt; u: Pt; cap: PanelLineEnd }) {
  const s = C * FIG.mark.cap;
  if (cap === "bar") {
    const n = perp(u);
    const a = add(at, n, s), b = add(at, n, -s);
    return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={FIG.cls.line} strokeWidth={ML} strokeLinecap="round" />;
  }
  if (cap === "arrow") return <Head tip={at} u={u} len={C * FIG.mark.head} />;
  if (cap === "dot") return <circle cx={at[0]} cy={at[1]} r={C * FIG.mark.dot * 0.5} className={FIG.cls.fill} />;
  return null;
}

/** Position of an item in cell pixels. */
const px = (p: Pt): Pt => [p[0] * C, p[1] * C];
/**
 * A mark's centre kept far enough from the frame that the whole mark (of width `size`,
 * share of the cell) stays inside: papers never print marks across the cell border, and
 * a reading of "0,0" means "in the corner".
 */
const inside = (p: Pt, size: number): Pt => {
  const m = Math.min(0.5, size / 2 + 0.04);
  return [Math.min(1 - m, Math.max(m, p[0])), Math.min(1 - m, Math.max(m, p[1]))];
};

function ShapeItem({ it }: { it: PanelShape }) {
  const size = it.size ?? defaultShapeSize(it.shape);
  const p = it.cut ? px(anchorPoint(it.at) ?? [0.5, 0.5]) : px(inside(anchorPoint(it.at) ?? [0.5, 0.5], size));
  const filled = it.filled || it.shape === "dot";
  return (
    <path
      d={shapePath(it.shape, (it.size ?? defaultShapeSize(it.shape)) * C, it.aspect)}
      transform={`translate(${p[0].toFixed(2)} ${p[1].toFixed(2)})${it.rotate ? ` rotate(${it.rotate})` : ""}`}
      className={FIG.cls.line}
      style={filled ? { fill: "var(--cf-fg)" } : undefined}
      strokeWidth={ML}
      strokeLinejoin="round"
    />
  );
}

function Item({ it }: { it: PanelItem }): ReactNode {
  switch (it.type) {
    case "shape":
      return <ShapeItem it={it} />;
    case "arrow": {
      // From its two ends when given (exact length and place), else centre, direction and length.
      const ends = it.from !== undefined && it.to !== undefined ? [anchorPoint(it.from), anchorPoint(it.to)] : null;
      let tail: Pt, tip: Pt, u: Pt;
      if (ends?.[0] && ends[1]) {
        tail = px(ends[0]);
        tip = px(ends[1]);
        const len = Math.hypot(tip[0] - tail[0], tip[1] - tail[1]) || 1;
        u = [(tip[0] - tail[0]) / len, (tip[1] - tail[1]) / len];
      } else {
        const c = px(anchorPoint(it.at) ?? [0.5, 0.5]);
        u = dirVector(it.dir ?? 0);
        const L = (it.size ?? DEFAULT_ARROW_LENGTH) * C;
        tail = add(c, u, -L / 2);
        tip = add(c, u, L / 2);
      }
      const h = C * FIG.mark.head;
      const head = it.head ?? "single";
      const solidHead = head !== "hollow";
      const end = solidHead ? add(tip, u, -h * 0.8) : tip;
      const start = head === "double" ? add(tail, u, h * 0.8) : tail;
      const tailCap = it.tail ?? "none";
      return (
        <g>
          <line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} className={FIG.cls.line} strokeWidth={ML} strokeLinecap="round" />
          <Head tip={tip} u={u} len={h} hollow={head === "hollow"} />
          {head === "double" && <Head tip={tail} u={[-u[0], -u[1]]} len={h} />}
          {tailCap === "bar" && <EndCap at={tail} u={u} cap="bar" />}
          {tailCap === "double" && (
            <>
              <EndCap at={tail} u={u} cap="bar" />
              <EndCap at={add(tail, u, h * 0.6)} u={u} cap="bar" />
            </>
          )}
        </g>
      );
    }
    case "glyph": {
      const p = px(inside(anchorPoint(it.at) ?? [0.5, 0.5], it.size ?? DEFAULT_GLYPH_SIZE));
      const t = it.transform ?? "none";
      const flip =
        t === "mirror" ? " scale(-1 1)" : t === "water" ? " scale(1 -1)" : t.startsWith("rotate") ? ` rotate(${t.slice(6)})` : "";
      return (
        <text
          transform={`translate(${p[0].toFixed(2)} ${p[1].toFixed(2)})${flip}`}
          textAnchor="middle"
          dominantBaseline="central"
          className="fg cf-mark"
          style={{ fontSize: (it.size ?? DEFAULT_GLYPH_SIZE) * C, stroke: "none" }}
        >
          {it.text}
        </text>
      );
    }
    case "line": {
      const a = px(anchorPoint(it.from) ?? [0, 0]), b = px(anchorPoint(it.to) ?? [1, 1]);
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const u: Pt = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
      const [e0, e1] = it.ends ?? ["none", "none"];
      return (
        <g>
          <line
            x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
            className={FIG.cls.line}
            strokeWidth={ML}
            strokeLinecap="round"
            strokeDasharray={it.style === "dashed" ? FIG.dash : undefined}
          />
          <EndCap at={a} u={[-u[0], -u[1]]} cap={e0} />
          <EndCap at={b} u={u} cap={e1} />
        </g>
      );
    }
    case "arc": {
      const c = px(anchorPoint(it.at) ?? [0.5, 0.5]);
      const r = (it.r ?? 0.25) * C;
      const sweep = ((((it.end - it.start) % 360) + 360) % 360) || 360;
      const dash = it.style === "dashed" ? FIG.dash : undefined;
      if (sweep >= 359.9) return <circle cx={c[0]} cy={c[1]} r={r} className={FIG.cls.line} strokeWidth={ML} strokeDasharray={dash} />;
      const s = add(c, dirVector(it.start), r), e = add(c, dirVector(it.start + sweep), r);
      return (
        <path
          d={`M${s[0].toFixed(2)},${s[1].toFixed(2)} A${r},${r} 0 ${sweep > 180 ? 1 : 0},1 ${e[0].toFixed(2)},${e[1].toFixed(2)}`}
          className={FIG.cls.line}
          strokeWidth={ML}
          strokeLinecap="round"
          strokeDasharray={dash}
        />
      );
    }
  }
}

/**
 * A sheet with holes cut out: the paper (tinted) has the holes masked away, so a hole on
 * the edge reads as a notch, and each hole's outline is drawn inside the paper only.
 */
function CutSheet({ outline, holes, id, highlight = false }: { outline: ReactNode; holes: ReactNode[]; id: string; highlight?: boolean }) {
  return (
    <g>
      <defs>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x={-C} y={-C} width={3 * C} height={3 * C}>
          <rect x={-C} y={-C} width={3 * C} height={3 * C} fill="#fff" />
          <g fill="#000" stroke="#000" strokeWidth={1}>{holes}</g>
        </mask>
        <clipPath id={`${id}c`}>{outline}</clipPath>
      </defs>
      <g mask={`url(#${id}m)`}>
        <g className={FIG.cls.soft}>{outline}</g>
        <g className={highlight ? FIG.cls.answer : FIG.cls.line} strokeWidth={highlight ? FIG.bold : FIG.mark.frame} strokeLinejoin="round">{outline}</g>
      </g>
      <g clipPath={`url(#${id}c)`} className={FIG.cls.line} strokeWidth={ML} strokeLinejoin="round">{holes}</g>
    </g>
  );
}

/** A shape item's outline, for masks and hole outlines (no classes, so the mask's fill applies). */
function holePath(it: PanelShape, key: string) {
  const p = px(anchorPoint(it.at) ?? [0.5, 0.5]);
  return (
    <path
      key={key}
      d={shapePath(it.shape, (it.size ?? defaultShapeSize(it.shape)) * C, it.aspect)}
      transform={`translate(${p[0].toFixed(2)} ${p[1].toFixed(2)})${it.rotate ? ` rotate(${it.rotate})` : ""}`}
    />
  );
}

export function PanelCellView({ cell, frame, id }: { cell: PanelCell; frame: PanelDiagram["frame"]; id: string }) {
  const shape = frame ?? "square";
  const cls = cell.highlight ? FIG.cls.answer : FIG.cls.line;
  const sw = cell.highlight ? FIG.bold : FIG.mark.frame;
  const dash = cell.missing ? FIG.dash : undefined;
  const outline =
    shape === "circle" ? <circle cx={C / 2} cy={C / 2} r={C / 2} /> : <rect x={0} y={0} width={C} height={C} rx={FIG.radius} />;
  const items = cell.items ?? [];
  const cuts = items.filter((i): i is PanelShape => i.type === "shape" && !!i.cut);
  const rest = items.filter((i) => !(i.type === "shape" && i.cut));
  return (
    <g>
      <defs>
        <clipPath id={`${id}k`}>{outline}</clipPath>
      </defs>
      {cuts.length > 0 ? (
        <CutSheet outline={outline} holes={cuts.map((c, i) => holePath(c, `h${i}`))} id={id} highlight={cell.highlight} />
      ) : (
        shape !== "none" && (
          <g className={cls} strokeWidth={sw} strokeDasharray={dash}>{outline}</g>
        )
      )}
      <g clipPath={`url(#${id}k)`}>
        {rest.map((it, i) => <Item key={`i${i}`} it={it} />)}
      </g>
      {cell.missing && (
        <text x={C / 2} y={C / 2} textAnchor="middle" dominantBaseline="central" className="bold mono" style={{ fontSize: 30, fill: "var(--cf-brand)", stroke: "none" }}>
          ?
        </text>
      )}
    </g>
  );
}

export function Panel({ d }: { d: PanelDiagram }) {
  const id = useSvgId("pn");
  const cells = (d.cells ?? []).slice(0, 5);
  const n = Math.max(1, cells.length);
  const W = n * C + (n - 1) * FIG.gap + 2 * PAD, H = C + 2 * PAD;
  return (
    <Svg w={W} h={H} label={d.alt || panelAlt(d)}>
      {cells.map((cell, i) => (
        <g key={`c${i}`} transform={`translate(${PAD + i * (C + FIG.gap)} ${PAD})`}>
          <PanelCellView cell={cell} frame={d.frame} id={`${id}-${i}`} />
        </g>
      ))}
    </Svg>
  );
}

// ── Paper folding: one frame per fold, then the folded sheet with its cuts.

const M = 10;
/** Sheet (unit square) to frame pixels. */
const S = (p: Pt): Pt => [M + p[0] * (C - 2 * M), M + p[1] * (C - 2 * M)];
const centroid = (poly: Pt[]): Pt => [poly.reduce((a, p) => a + p[0], 0) / poly.length, poly.reduce((a, p) => a + p[1], 0) / poly.length];

export function Fold({ d }: { d: FoldDiagram }) {
  const id = useSvgId("fd");
  const stages = foldStages(d.steps ?? []);
  const sheet = stages.length ? stages[stages.length - 1].after : SQUARE;
  const cuts = cutsOnSheet(d);
  const frames = stages.length + 1 + (d.showUnfolded ? 1 : 0);
  const W = frames * C + (frames - 1) * FIG.gap + 2 * PAD, H = C + 2 * PAD;
  const xAt = (i: number) => PAD + i * (C + FIG.gap);
  const opened = d.showUnfolded ? unfold(d) : null;
  // The last frame zooms in on the folded sheet so it fills the frame: drawn at the full
  // sheet's scale, a quarter sheet's holes were only a few pixels wide.
  const xs = sheet.map((p) => p[0]), ys = sheet.map((p) => p[1]);
  const [minX, minY] = [Math.min(...xs), Math.min(...ys)];
  const side = Math.max(Math.max(...xs) - minX, Math.max(...ys) - minY) || 1;
  const off: Pt = [(side - (Math.max(...xs) - minX)) / 2, (side - (Math.max(...ys) - minY)) / 2];
  const Z = (p: Pt): Pt => S([(p[0] - minX + off[0]) / side, (p[1] - minY + off[1]) / side]);
  const scale = (C - 2 * M) / side;
  return (
    <Svg w={W} h={H} label={d.alt || foldAlt(d)}>
      <defs>
        <ArrowMarker id={`${id}a`} cls={FIG.cls.highlightFill} />
      </defs>
      {stages.map((st, i) => {
        const from = S(centroid(st.moved)), to = S(centroid(st.flap));
        // The arrow bows out sideways from the straight path, like a page turning.
        const mid: Pt = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
        const len = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
        const n: Pt = [-(to[1] - from[1]) / len, (to[0] - from[0]) / len];
        const ctrl = add(mid, n, len * 0.45);
        return (
          <g key={`s${i}`} transform={`translate(${xAt(i)} ${PAD})`}>
            <polygon points={pts(st.moved.map(S))} className={FIG.cls.muted} strokeWidth={FIG.thin} strokeDasharray={FIG.dash} />
            <polygon points={pts(st.after.map(S))} className={FIG.cls.soft} />
            <polygon points={pts(st.after.map(S))} className={FIG.cls.line} strokeWidth={FIG.line} strokeLinejoin="round" />
            <polygon points={pts(st.flap.map(S))} className={FIG.cls.line} strokeWidth={FIG.thin} strokeLinejoin="round" />
            <path
              d={`M${from[0].toFixed(2)},${from[1].toFixed(2)} Q${ctrl[0].toFixed(2)},${ctrl[1].toFixed(2)} ${to[0].toFixed(2)},${to[1].toFixed(2)}`}
              className={FIG.cls.highlight}
              strokeWidth={FIG.line}
              markerEnd={`url(#${id}a)`}
            />
          </g>
        );
      })}
      <g transform={`translate(${xAt(stages.length)} ${PAD})`}>
        <CutSheet
          id={`${id}f`}
          outline={<polygon points={pts(sheet.map(Z))} />}
          holes={cuts.map((c, i) => {
            const p = Z(c.at);
            return (
              <path
                key={`h${i}`}
                d={shapePath(c.shape, c.w * scale, c.aspect)}
                transform={`translate(${p[0].toFixed(2)} ${p[1].toFixed(2)})${c.rotate ? ` rotate(${c.rotate})` : ""}`}
              />
            );
          })}
        />
      </g>
      {opened && (
        <g transform={`translate(${xAt(stages.length + 1)} ${PAD})`}>
          <PanelCellView cell={{ ...opened, highlight: true }} frame="square" id={`${id}u`} />
        </g>
      )}
    </Svg>
  );
}
