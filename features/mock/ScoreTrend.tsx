"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Attempt } from "./attempts";

/** Most recent attempts to plot. */
const MAX_POINTS = 20;
const HEIGHT = 180;
const PAD = { top: 12, right: 12, bottom: 24, left: 36 };

const pct = (a: Attempt) => (a.maxMarks > 0 ? (a.marks / a.maxMarks) * 100 : 0);
const shortDate = (at: number) => new Date(at).toLocaleDateString(undefined, { day: "numeric", month: "short" });

/**
 * Score over time for full mocks and past papers, as a share of the maximum
 * (papers differ: 2025 is out of 200, 2024 out of 178). One series, so no
 * legend: the title names it. Hover or focus shows each attempt's score.
 */
export function ScoreTrend({ attempts }: { attempts: Attempt[] }) {
  const points = useMemo(() => [...attempts].sort((a, b) => a.at - b.at).slice(-MAX_POINTS), [attempts]);
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const hasChart = points.length >= 2;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    // Measure the inner width now, on resize, and whenever the card itself changes size
    // (the page may still be laying out when this first runs).
    const measure = () => {
      const style = getComputedStyle(el);
      setWidth(el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
    };
    measure();
    const frame = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [hasChart]);

  if (!hasChart) return null;

  const latest = points[points.length - 1];
  const previous = points[points.length - 2];
  const change = Math.round((pct(latest) - pct(previous)) * 10) / 10;
  const best = points.reduce((b, a) => (pct(a) > pct(b) ? a : b), points[0]);

  // Scale: y is 0-100%; negative scores are clamped to the baseline.
  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const y = (v: number) => PAD.top + plotH - (Math.max(0, Math.min(100, v)) / 100) * plotH;
  const line = points.map((a, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(pct(a)).toFixed(1)}`).join(" ");
  const ticks = [0, 25, 50, 75, 100];

  // Nearest attempt to the pointer, so readers aim at a column, not a 2px line.
  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = Math.round((px / rect.width) * (points.length - 1));
    setActive(Math.max(0, Math.min(points.length - 1, i)));
  };

  const shown = active !== null ? points[active] : null;

  return (
    <section aria-labelledby="trend-heading" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="trend-heading" className="text-lg font-extrabold text-foreground">
            Score trend
          </h2>
          <p className="text-sm text-muted-foreground">Mocks and full papers, as % of maximum marks · last {points.length}</p>
        </div>
        <dl className="flex gap-5 text-right">
          <div>
            <dt className="text-xs text-muted-foreground">Latest</dt>
            <dd className="font-mono text-lg font-bold tabular-nums text-foreground">
              {latest.marks}
              <span className="text-xs font-semibold text-muted-foreground">/{latest.maxMarks}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">vs previous</dt>
            <dd
              className={cn(
                "flex items-center justify-end gap-1 font-mono text-lg font-bold tabular-nums",
                change > 0 ? "text-emerald-700 dark:text-emerald-300" : change < 0 ? "text-rose-700 dark:text-rose-300" : "text-foreground",
              )}
            >
              {change > 0 ? <TrendingUp className="h-4 w-4" aria-hidden="true" /> : change < 0 ? <TrendingDown className="h-4 w-4" aria-hidden="true" /> : null}
              {change > 0 ? "+" : ""}
              {change}%
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Best</dt>
            <dd className="font-mono text-lg font-bold tabular-nums text-foreground">{Math.round(pct(best))}%</dd>
          </div>
        </dl>
      </div>

      <div ref={wrap} className="surface-card relative overflow-hidden rounded-3xl px-2 pt-3">
        {width > 0 && (
          <svg width={width} height={HEIGHT} role="img" aria-label={`Score trend over your last ${points.length} attempts`} className="block">
            {/* Recessive grid and y-axis labels */}
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} className="stroke-border" strokeWidth={1} strokeDasharray={t === 0 ? undefined : "2 4"} />
                <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted-foreground font-mono text-[10px]">
                  {t}%
                </text>
              </g>
            ))}
            {/* First and last dates on the x-axis */}
            <text x={x(0)} y={HEIGHT - 6} textAnchor="start" className="fill-muted-foreground text-[10px]">
              {shortDate(points[0].at)}
            </text>
            <text x={x(points.length - 1)} y={HEIGHT - 6} textAnchor="end" className="fill-muted-foreground text-[10px]">
              {shortDate(latest.at)}
            </text>

            {shown && active !== null && (
              <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + plotH} className="stroke-muted-foreground/40" strokeWidth={1} />
            )}

            <path d={line} fill="none" className="stroke-brand-500" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {points.map((a, i) => (
              <circle
                key={a.id}
                cx={x(i)}
                cy={y(pct(a))}
                r={active === i ? 5.5 : 4}
                className={cn("fill-brand-500 stroke-card", a.id === best.id && "fill-emerald-500")}
                strokeWidth={2}
              />
            ))}

            {/* Hit layer: the whole plot, nearest attempt wins */}
            <rect
              x={PAD.left - 8}
              y={PAD.top}
              width={plotW + 16}
              height={plotH}
              fill="transparent"
              onPointerMove={onMove}
              onPointerLeave={() => setActive(null)}
              tabIndex={0}
              aria-label="Score points. Use left and right arrows to read each attempt."
              onFocus={() => setActive(points.length - 1)}
              onBlur={() => setActive(null)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setActive((i) => Math.max(0, (i ?? points.length - 1) - 1));
                if (e.key === "ArrowRight") setActive((i) => Math.min(points.length - 1, (i ?? 0) + 1));
              }}
              className="cursor-crosshair outline-none"
            />
          </svg>
        )}

        {shown && active !== null && (
          <div
            role="status"
            className="pointer-events-none absolute top-2 z-10 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg"
            style={{ left: Math.min(Math.max(x(active) - 70, 4), Math.max(4, width - 148)), width: 140 }}
          >
            <p className="font-mono text-sm font-bold tabular-nums text-foreground">
              {shown.marks}/{shown.maxMarks} · {Math.round(pct(shown))}%
            </p>
            <p className="truncate text-muted-foreground">{shown.title.replace("SSC CGL Tier 1 · ", "")}</p>
            <p className="text-muted-foreground">{shortDate(shown.at)}</p>
          </div>
        )}

        {/* The same numbers without hovering */}
        <table className="sr-only">
          <caption>Score per attempt, oldest first</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>Test</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {points.map((a) => (
              <tr key={a.id}>
                <td>{shortDate(a.at)}</td>
                <td>{a.title}</td>
                <td>
                  {a.marks} of {a.maxMarks} ({Math.round(pct(a))}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
