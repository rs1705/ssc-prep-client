"use client";

import { useMemo, type ReactNode } from "react";
import { FIG, Svg } from "./figure";
import { mirrorAlt, puzzleAlt, regionsAlt } from "./plain";
import { layoutRegions } from "./regions";
import { patternCircles, RELATION_PATTERNS, REL_H, REL_W, relationLabelSpots, relationSays } from "./relations";
import type { MirrorDiagram, PuzzleDiagram, PuzzleFigure, RegionsDiagram, RelationDiagram } from "./types";

/** Reasoning figures drawn from data: number puzzles, mirror images of text, numbers in regions, circle relations. */

/** A number on a figure; "?" in brand colour, a highlighted value on a brand disc. */
function Value({ x, y, value, hl, size = 16 }: { x: number; y: number; value: string; hl: boolean; size?: number }) {
  const missing = value.trim() === "?";
  return (
    <g>
      {hl && <circle cx={x} cy={y} r={value.length > 2 ? 17 : 14} className="brand-fill" />}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className={hl ? "on-brand mono" : "bold mono fg"}
        style={{ fontSize: value.length > 3 ? size - 3 : size, fill: missing && !hl ? "var(--cf-brand)" : undefined }}
      >
        {value}
      </text>
    </g>
  );
}

// ── Number puzzles: numbers at the corners / in the sectors / in the cells of simple figures.

const PZ = 150;

function figureSize(f: PuzzleFigure): [number, number] {
  if (f.shape === "grid") {
    const rows = f.rows ?? [];
    const cols = Math.max(1, ...rows.map((r) => r.length));
    return [cols * 44 + 4, Math.max(1, rows.length) * 44 + 4];
  }
  return [PZ, PZ];
}

function PuzzleShape({ f, highlight }: { f: PuzzleFigure; highlight?: string }) {
  const v = f.values ?? [];
  const at = (x: number, y: number, value: string | undefined, key: string) =>
    value === undefined || value === "" ? null : <Value key={key} x={x} y={y} value={value} hl={!!highlight && value === highlight} />;

  if (f.shape === "triangle") {
    const corners: [number, number][] = [[75, 30], [24, 118], [126, 118]];
    // Each corner number sits just outside its corner: above the top, below the base corners.
    const labels: [number, number][] = [[75, 14], [24, 136], [126, 136]];
    return (
      <g>
        <polygon points={corners.map((p) => p.join(",")).join(" ")} className="ink" strokeWidth={FIG.line} strokeLinejoin="round" />
        {labels.map(([x, y], i) => at(x, y, v[i], `c${i}`))}
        {at(75, 88, f.center, "m")}
      </g>
    );
  }
  if (f.shape === "square") {
    const labels: [number, number][] = [[16, 16], [134, 16], [134, 134], [16, 134]];
    return (
      <g>
        <rect x={32} y={32} width={86} height={86} className="ink" strokeWidth={FIG.line} />
        {labels.map(([x, y], i) => at(x, y, v[i], `c${i}`))}
        {at(75, 75, f.center, "m")}
      </g>
    );
  }
  if (f.shape === "circle") {
    const n = Math.max(2, Math.min(8, v.length));
    const R = 66, c = 75;
    const inner = f.center ? 19 : 0;
    const angle = (k: number) => -Math.PI / 2 + (k * 2 * Math.PI) / n;
    const rText = inner ? (inner + R) / 2 + 2 : R * 0.58;
    return (
      <g>
        <circle cx={c} cy={c} r={R} className="ink" strokeWidth={FIG.line} />
        {Array.from({ length: n }, (_, k) => (
          <line
            key={`l${k}`}
            x1={c + inner * Math.cos(angle(k))}
            y1={c + inner * Math.sin(angle(k))}
            x2={c + R * Math.cos(angle(k))}
            y2={c + R * Math.sin(angle(k))}
            className="ink"
            strokeWidth={FIG.thin}
          />
        ))}
        {inner > 0 && <circle cx={c} cy={c} r={inner} className="ink" strokeWidth={FIG.thin} />}
        {v.slice(0, n).map((value, k) => at(c + rText * Math.cos(angle(k + 0.5)), c + rText * Math.sin(angle(k + 0.5)), value, `s${k}`))}
        {at(c, c, f.center, "m")}
      </g>
    );
  }
  return (
    <g>
      {(f.rows ?? []).map((row, r) =>
        row.map((cell, col) => (
          <g key={`g${r}-${col}`}>
            <rect x={2 + col * 44} y={2 + r * 44} width={44} height={44} className="ink" strokeWidth={FIG.thin} />
            {at(24 + col * 44, 24 + r * 44, cell, `t${r}-${col}`)}
          </g>
        )),
      )}
    </g>
  );
}

export function Puzzle({ d }: { d: PuzzleDiagram }) {
  const figures = (d.figures ?? []).slice(0, 4);
  const sizes = figures.map(figureSize);
  const gap = 36;
  const W = Math.max(1, sizes.reduce((a, [w]) => a + w, 0) + gap * Math.max(0, figures.length - 1));
  const H = Math.max(PZ, ...sizes.map(([, h]) => h));
  const xs = sizes.map((_, i) => sizes.slice(0, i).reduce((a, [w]) => a + w + gap, 0));
  return (
    <Svg w={W} h={H} label={d.alt || puzzleAlt(d)}>
      {figures.map((f, i) => (
        <g key={`f${i}`} transform={`translate(${xs[i]} ${(H - sizes[i][1]) / 2})`}>
          <PuzzleShape f={f} highlight={d.highlight} />
        </g>
      ))}
    </Svg>
  );
}

// ── Mirror / water images of text: each character in its own cell, moved and flipped.

export function Mirror({ d }: { d: MirrorDiagram }) {
  const chars = Array.from(d.text ?? "");
  const n = chars.length, cw = 24, ch = 40, pad = 10;
  const t = d.transform ?? "none";
  const keep = new Set(d.keep ?? []);
  const textW = n * cw;
  const right = d.line === "right", below = d.line === "below";
  const W = pad * 2 + textW + (right ? 34 : 0);
  const H = pad * 2 + ch + (below ? 30 : 0);
  const flipOf = (i: number) => {
    if (keep.has(i)) return "";
    if (t === "mirror") return " scale(-1 1)";
    if (t === "water") return " scale(1 -1)";
    if (t === "rotate") return " rotate(180)";
    return "";
  };
  return (
    <Svg w={W} h={H} label={d.alt || mirrorAlt(d)}>
      {chars.map((c, i) => {
        const slot = t === "mirror" || t === "rotate" ? n - 1 - i : i;
        return (
          <text
            key={`ch${i}`}
            transform={`translate(${pad + slot * cw + cw / 2} ${pad + ch / 2})${flipOf(i)}`}
            textAnchor="middle"
            dominantBaseline="central"
            className="bold mono fg"
            style={{ fontSize: FIG.glyph, stroke: "none" }}
          >
            {c}
          </text>
        );
      })}
      {right && (
        <g>
          <line x1={pad + textW + 16} x2={pad + textW + 16} y1={4} y2={H - 4} className="brand" strokeWidth={FIG.line} strokeDasharray={FIG.dash} />
          <text x={pad + textW + 26} y={14} className="small bold">M</text>
          <text x={pad + textW + 26} y={H - 6} className="small bold">N</text>
        </g>
      )}
      {below && (
        <g>
          <line x1={4} x2={W - 4} y1={pad + ch + 12} y2={pad + ch + 12} className="brand" strokeWidth={FIG.line} strokeDasharray={FIG.dash} />
          <text x={4} y={H - 3} className="small bold">M</text>
          <text x={W - 4} y={H - 3} textAnchor="end" className="small bold">N</text>
        </g>
      )}
    </Svg>
  );
}

// ── Numbers in the regions of 2 or 3 overlapping shapes, with a key to what each shape stands for.

const ICON: Record<RegionsDiagram["sets"][number]["shape"], (x: number, y: number) => ReactNode> = {
  circle: (x, y) => <circle cx={x} cy={y} r={7} className="ink" strokeWidth={FIG.line} />,
  square: (x, y) => <rect x={x - 6.5} y={y - 6.5} width={13} height={13} className="ink" strokeWidth={FIG.line} />,
  triangle: (x, y) => <polygon points={`${x},${y - 7.5} ${x - 8},${y + 6} ${x + 8},${y + 6}`} className="ink" strokeWidth={FIG.line} strokeLinejoin="round" />,
};

export function Regions({ d }: { d: RegionsDiagram }) {
  const L = useMemo(() => layoutRegions(d), [d]);
  const hl = new Set(d.highlight ?? []);
  // Different shapes: a key below says which is which. Repeated shapes: each one is named
  // beside it instead (top-left, top-right, bottom), since a key couldn't tell them apart.
  const direct = new Set(L.shapes.map((s) => s.shape)).size < L.shapes.length;
  const items = L.shapes.map((s) => ({ ...s, w: 30 + s.label.length * 7.2 }));
  const legendW = items.reduce((a, s) => a + s.w, 0);
  const side = direct ? Math.max(...L.shapes.map((s) => s.label.length * 7.2)) + 10 : 0;
  const W = direct ? L.width + side * 2 : Math.max(L.width, legendW + 8);
  const dx = (W - L.width) / 2;
  const dy = direct ? 18 : 0;
  const H = direct ? L.height + dy + 22 : L.height + 30;
  const legendY = L.height + 14;
  const legendX = items.map((_, i) => (W - legendW) / 2 + items.slice(0, i).reduce((a, s) => a + s.w, 0));
  const nameAt = L.shapes.map((s, i) => {
    const pick = (score: (p: [number, number]) => number) => s.outline.reduce((best, p) => (score(p) > score(best) ? p : best));
    if (i === 0) {
      const [x, y] = pick(([x, y]) => -x - y);
      return { x: x - 6, y: y - 6, anchor: "end" as const };
    }
    if (i === 1) {
      const [x, y] = pick(([x, y]) => x - y);
      return { x: x + 6, y: y - 6, anchor: "start" as const };
    }
    const [x, y] = pick(([, y]) => y);
    return { x, y: y + 16, anchor: "middle" as const };
  });
  return (
    <Svg w={W} h={H} label={d.alt || regionsAlt(d)}>
      {/* A number outside every group: the whole figure sits in a box, with that number in its corner. */}
      {d.outside !== undefined && <rect x={3} y={3} width={W - 6} height={(direct ? H : L.height) - 6} rx={6} className="muted" strokeWidth={FIG.frame} />}
      {d.outside !== undefined && d.outside !== "" && (
        <Value x={W - 22} y={(direct ? H : L.height) - 20} value={d.outside} hl={hl.has("outside")} size={14} />
      )}
      {direct &&
        L.shapes.map((s, i) => (
          <text key={`n${i}`} x={nameAt[i].x + dx} y={nameAt[i].y + dy} textAnchor={nameAt[i].anchor} className="small bold fg">
            {s.label}
          </text>
        ))}
      <g transform={`translate(${dx} ${dy})`}>
        {L.shapes.map((s, i) =>
          s.shape === "circle" ? (
            <circle
              key={`s${i}`}
              cx={s.outline.reduce((a, p) => a + p[0], 0) / s.outline.length}
              cy={s.outline.reduce((a, p) => a + p[1], 0) / s.outline.length}
              r={L.circleR}
              className="ink"
              strokeWidth={FIG.line}
            />
          ) : (
            <polygon key={`s${i}`} points={s.outline.map((p) => p.join(",")).join(" ")} className="ink" strokeWidth={FIG.line} strokeLinejoin="round" />
          ),
        )}
        {Object.entries(d.values ?? {}).map(([key, value]) => {
          const at = L.spots[key];
          if (!at || value === "") return null;
          return <Value key={`v${key}`} x={at[0]} y={at[1]} value={value} hl={hl.has(key)} size={14} />;
        })}
      </g>
      {!direct && items.map((s, i) => (
        <g key={`k${i}`}>
          {ICON[s.shape](legendX[i] + 9, legendY)}
          <text x={legendX[i] + 22} y={legendY + 4} className="small fg">
            {s.label}
          </text>
        </g>
      ))}
    </Svg>
  );
}

// ── Standard circle arrangements for "which diagram best represents" (options and explanations).

export function Relation({ d }: { d: RelationDiagram }) {
  const known = !!RELATION_PATTERNS[d.pattern];
  const circles = known ? patternCircles(d.pattern) : [];
  const labels = d.labels ?? [];
  const labelled = labels.some(Boolean);
  // Label spots depend only on the arrangement.
  const spots = useMemo(() => (labelled && known ? relationLabelSpots(patternCircles(d.pattern)) : []), [labelled, known, d.pattern]);
  // Labelled figures (explanations) are drawn larger so the names fit inside the circles;
  // sizes below are in figure units, so they are divided by the scale.
  const scale = labelled ? 1.7 : 1;
  return (
    <svg
      viewBox={`0 0 ${REL_W} ${REL_H}`}
      width={REL_W * scale}
      height={REL_H * scale}
      className="cf-dg"
      role="img"
      aria-label={d.alt || relationSays(d)}
    >
      {circles.map((c, i) => (
        <circle
          key={`c${i}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          className={d.highlight === i ? "brand" : "ink"}
          strokeWidth={(d.highlight === i ? FIG.bold : FIG.line) / scale}
          fill="none"
        />
      ))}
      {spots.map(([x, y], i) =>
        labels[i] ? (
          <text
            key={`t${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="bold"
            style={{ fontSize: (labels[i].length > 7 ? 10 : 11.5) / scale, strokeWidth: 3 / scale }}
          >
            {labels[i]}
          </text>
        ) : null,
      )}
    </svg>
  );
}
