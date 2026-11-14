import type { Block, Diagram } from "./types";

/**
 * Plain-English problems with a block, or [] when it can be drawn. The renderer shows
 * these instead of drawing a broken figure, and the review page lists them.
 */
export function blockProblems(block: unknown): string[] {
  if (!isObject(block)) return ["Not a block."];
  const b = block as Partial<Block> & Record<string, unknown>;
  switch (b.type) {
    case "text":
      return isString(b.text) ? [] : ["Text block has no text."];
    case "math":
      return isString(b.latex) && b.latex.trim() ? [] : ["Math block has no LaTeX."];
    case "table": {
      const out: string[] = [];
      if (!Array.isArray(b.headers) || b.headers.length === 0) out.push("Table has no headers.");
      if (!Array.isArray(b.rows)) out.push("Table has no rows.");
      else {
        const width = Array.isArray(b.headers) ? b.headers.length : 0;
        (b.rows as unknown[]).forEach((row, i) => {
          if (!Array.isArray(row)) out.push(`Table row ${i + 1} isn't a list.`);
          else if (width && row.length !== width) out.push(`Table row ${i + 1} has ${row.length} cells, headers have ${width}.`);
        });
        if (isNumber(b.highlightRow) && (b.highlightRow < 0 || b.highlightRow >= (b.rows as unknown[]).length)) {
          out.push("Table highlightRow is outside the rows.");
        }
      }
      return out;
    }
    case "series": {
      const out: string[] = [];
      if (!Array.isArray(b.items) || b.items.length < 2) return ["Series needs at least two items."];
      if (b.diffs !== undefined) {
        if (!Array.isArray(b.diffs)) out.push("Series diffs must be a list.");
        else if (b.diffs.length !== b.items.length - 1) {
          out.push(`Series has ${b.items.length} items, so it needs ${b.items.length - 1} diffs (got ${b.diffs.length}).`);
        }
      }
      if (isNumber(b.found) && (b.found < 0 || b.found >= b.items.length)) out.push("Series found is outside the items.");
      return out;
    }
    case "coding": {
      const out: string[] = [];
      if (!isString(b.from) || !b.from) out.push("Coding block has no word.");
      if (!isString(b.to) || !b.to) out.push("Coding block has no code.");
      if (!Array.isArray(b.shifts)) out.push("Coding block has no shifts.");
      if (isString(b.from) && Array.isArray(b.shifts) && b.shifts.length !== [...b.from].length) {
        out.push(`Coding: ${[...b.from].length} letters but ${b.shifts.length} shifts.`);
      }
      return out;
    }
    case "image":
      return isString(b.src) && b.src ? (isString(b.alt) && b.alt.trim() ? [] : ["Image has no alt text."]) : ["Image has no src."];
    case "diagram":
      return isObject(b.diagram) ? diagramProblems(b.diagram as Diagram) : ["Diagram block has no diagram."];
    default:
      return [`Unknown block type "${String(b.type)}".`];
  }
}

export function diagramProblems(d: Diagram): string[] {
  const out: string[] = [];
  switch (d.kind) {
    case "geometry": {
      const names = isObject(d.points) ? Object.keys(d.points) : [];
      if (names.length < 2) return ["Geometry needs at least two points."];
      for (const [n, p] of Object.entries(d.points)) {
        if (!Array.isArray(p) || p.length !== 2 || !p.every(isNumber)) out.push(`Point ${n} needs [x, y] numbers.`);
      }
      const has = (n: string) => names.includes(n);
      for (const c of d.circles ?? []) {
        if (!has(c.center) || !has(c.through)) out.push(`Circle uses an unknown point (${c.center}, ${c.through}).`);
        else if (samePoint(d.points[c.center], d.points[c.through])) out.push(`Circle at ${c.center} has zero radius.`);
      }
      for (const seg of d.segments ?? []) {
        if (!Array.isArray(seg) || seg.length !== 2 || !has(seg[0]) || !has(seg[1])) {
          out.push(`Segment ${JSON.stringify(seg)} uses an unknown point.`);
        }
      }
      for (const r of d.rightAngles ?? []) {
        if (![r.at, r.from, r.to].every(has)) out.push(`Right angle at ${r.at} uses an unknown point.`);
      }
      for (const key of Object.keys(d.labels ?? {})) {
        const pair = splitSegmentName(key, names);
        if (!pair) out.push(`Label "${key}" doesn't name a segment between two points.`);
      }
      const xs = Object.values(d.points).map((p) => p[0]);
      const ys = Object.values(d.points).map((p) => p[1]);
      if (out.length === 0 && Math.max(...xs) === Math.min(...xs) && Math.max(...ys) === Math.min(...ys)) {
        out.push("All points are in the same place.");
      }
      return out;
    }
    case "bar":
      if (!Array.isArray(d.values) || d.values.length === 0) return ["Bar chart has no values."];
      if (!d.values.every(isNumber)) out.push("Bar chart values must be numbers.");
      if (!Array.isArray(d.labels) || d.labels.length !== d.values.length) {
        out.push(`Bar chart has ${d.values.length} values but ${Array.isArray(d.labels) ? d.labels.length : 0} labels.`);
      }
      if (d.values.some((v) => isNumber(v) && v < 0)) out.push("Bar chart values can't be negative.");
      if (d.tick !== undefined && (!isNumber(d.tick) || d.tick <= 0)) out.push("Bar chart tick must be a positive number.");
      if (isNumber(d.highlight) && (d.highlight < 0 || d.highlight >= d.values.length)) out.push("Bar highlight is outside the bars.");
      return out;
    case "pie": {
      if (!Array.isArray(d.slices) || d.slices.length === 0) return ["Pie chart has no slices."];
      if (!d.slices.every((s) => isNumber(s.value) && s.value >= 0)) return ["Pie slice values must be non-negative numbers."];
      const total = d.slices.reduce((a, s) => a + s.value, 0);
      if (Math.abs(total - 100) > 0.6) out.push(`Pie slices add up to ${round(total)}%, not 100%.`);
      if (d.slices.length > 5) out.push("Pie charts have 5 colours; use at most 5 slices (group the rest as Others).");
      if (isNumber(d.highlight) && (d.highlight < 0 || d.highlight >= d.slices.length)) out.push("Pie highlight is outside the slices.");
      return out;
    }
    case "venn": {
      if (!Array.isArray(d.sets) || d.sets.length === 0) return ["Venn diagram has no sets."];
      const seen = new Set<string>();
      d.sets.forEach((s, i) => {
        if (i > 0 && !s.within && !s.overlaps && d.sets.slice(1, i).filter((x) => !x.within && !x.overlaps).length >= 2) {
          out.push(`Set ${s.label}: at most two sets can stand apart from the others.`);
        }
        for (const ref of [s.within, s.overlaps]) {
          if (ref && !seen.has(ref)) out.push(`Set ${s.label} refers to "${ref}", which isn't an earlier set.`);
        }
        seen.add(s.id);
      });
      if (d.sets.length > 4) out.push("Venn diagrams are drawn for up to 4 sets.");
      if (d.region && !d.region.between.every((id) => seen.has(id))) out.push("Venn region names an unknown set.");
      return out;
    }
    case "tree": {
      if (!Array.isArray(d.nodes) || d.nodes.length === 0) return ["Family tree has no people."];
      const ids = new Set(d.nodes.map((n) => n.id));
      for (const [p, c] of d.edges ?? []) {
        if (!ids.has(p) || !ids.has(c)) out.push(`Family tree link ${p} → ${c} names an unknown person.`);
      }
      if (d.nodes.length > 1 && (d.edges ?? []).length === 0) out.push("Family tree has people but no parent → child links.");
      if (out.length === 0 && hasCycle(d.nodes.map((n) => n.id), d.edges ?? [])) out.push("Family tree has a loop.");
      return out;
    }
    case "path":
      if (!Array.isArray(d.steps) || d.steps.length === 0) return ["Direction path has no steps."];
      for (const [i, s] of d.steps.entries()) {
        if (!["N", "S", "E", "W"].includes(s.dir)) out.push(`Step ${i + 1} direction must be N, S, E or W.`);
        if (!isNumber(s.dist) || s.dist <= 0) out.push(`Step ${i + 1} needs a positive distance.`);
      }
      return out;
    case "seating": {
      if (!Array.isArray(d.seats) || d.seats.length < 3) return ["Seating needs at least 3 seats."];
      if (d.seats.length > 12) out.push("Seating is drawn for up to 12 seats.");
      if (new Set(d.seats).size !== d.seats.length) out.push("Seating lists someone twice.");
      for (const name of Object.keys(d.highlight ?? {})) {
        if (!d.seats.includes(name)) out.push(`Seating highlight "${name}" isn't seated.`);
      }
      return out;
    }
    case "numberline":
      if (!isNumber(d.min) || !isNumber(d.max) || d.min >= d.max) return ["Number line needs min below max."];
      if (d.max - d.min > 30) out.push("Number line spans more than 30 units; ticks would crowd.");
      for (const r of d.ranges ?? []) {
        if (r.from > r.to || r.from < d.min || r.to > d.max) out.push(`Range ${r.from}–${r.to} is outside ${d.min}–${d.max}.`);
      }
      for (const m of d.marks ?? []) if (m < d.min || m > d.max) out.push(`Mark ${m} is outside the line.`);
      return out;
    default:
      return [`Unknown diagram kind "${String((d as { kind?: unknown }).kind)}".`];
  }
}

/** Problems for every block in a list, labelled by position. */
export function contentProblems(blocks: Block[]): string[] {
  return blocks.flatMap((b, i) => blockProblems(b).map((p) => (blocks.length > 1 ? `Block ${i + 1}: ${p}` : p)));
}

/**
 * "AB" → ["A", "B"]; also handles multi-letter names like "O1P" when they are points.
 * Returns null when the key isn't two known points.
 */
export function splitSegmentName(key: string, names: string[]): [string, string] | null {
  for (let i = 1; i < key.length; i++) {
    const a = key.slice(0, i), b = key.slice(i);
    if (names.includes(a) && names.includes(b) && a !== b) return [a, b];
  }
  return null;
}

function hasCycle(ids: string[], edges: [string, string][]): boolean {
  const kids = new Map<string, string[]>();
  for (const [p, c] of edges) kids.set(p, [...(kids.get(p) ?? []), c]);
  const state = new Map<string, 1 | 2>();
  const visit = (id: string): boolean => {
    if (state.get(id) === 1) return true;
    if (state.get(id) === 2) return false;
    state.set(id, 1);
    for (const c of kids.get(id) ?? []) if (visit(c)) return true;
    state.set(id, 2);
    return false;
  };
  return ids.some(visit);
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isString = (v: unknown): v is string => typeof v === "string";
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const samePoint = (a: [number, number], b: [number, number]) => a[0] === b[0] && a[1] === b[1];
const round = (n: number) => Math.round(n * 10) / 10;
