"use client";

import { FIG, Svg } from "./figure";
import type { TraceDiagram } from "./types";

/** Picture pixels to screen pixels: traced figures keep their printed proportions. */
const SCALE = 0.8;
/** Letters sit in their measured box; a cap letter fills about 72% of the font size. */
const CAP = 0.72;

const pts = (list: [number, number][]) => list.map(([x, y]) => `${x},${y}`).join(" ");

/** A figure traced from the paper, drawn in the shared figure style. */
export function Trace({ d }: { d: TraceDiagram }) {
  const w = Math.max(1, d.w), h = Math.max(1, d.h);
  const stroke = { className: FIG.cls.line, strokeWidth: FIG.mark.line, vectorEffect: "non-scaling-stroke" as const, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <Svg w={Math.round(w * SCALE)} h={Math.round(h * SCALE)} label={d.alt || "Figure from the paper"} viewBox={`0 0 ${w} ${h}`}>
      {(d.lines ?? []).map(([x1, y1, x2, y2], i) => (
        <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} {...stroke} />
      ))}
      {(d.circles ?? []).map(([cx, cy, r], i) => (
        <circle key={`c${i}`} cx={cx} cy={cy} r={r} {...stroke} />
      ))}
      {(d.paths ?? []).map((p, i) => (
        <polyline key={`p${i}`} points={pts(p)} {...stroke} fill="none" />
      ))}
      {(d.polygons ?? []).map((p, i) => (
        <polygon key={`g${i}`} points={pts(p)} {...stroke} />
      ))}
      {(d.fills ?? []).map((p, i) => (
        <polygon key={`f${i}`} points={pts(p)} className={FIG.cls.fill} />
      ))}
      {(d.glyphs ?? []).map((g, i) => {
        const t = g.transform ?? "none";
        const turned = t === "rotate90" || t === "rotate270";
        // The box was measured on the printed (maybe turned) letter; size by its upright height.
        const size = (turned ? g.w : g.h) / CAP;
        const flip =
          t === "mirror" ? " scale(-1 1)" : t === "water" ? " scale(1 -1)" : t.startsWith("rotate") ? ` rotate(${t.slice(6)})` : "";
        return (
          <text
            key={`t${i}`}
            transform={`translate(${g.x} ${g.y})${flip}`}
            textAnchor="middle"
            dominantBaseline="central"
            className="fg cf-mark"
            style={{ fontSize: size, stroke: "none" }}
          >
            {g.text}
          </text>
        );
      })}
    </Svg>
  );
}
