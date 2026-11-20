import { RELATION_PATTERN_NAMES, RELATION_PATTERNS } from "./relations";
import { CUT_SHAPES, cutsOnSheet, FOLD_SIDES, foldedSheet, insidePolygon } from "./fold";
import { anchorPoint, DEFAULT_GLYPH_SIZE, isPanelAt, SHAPE_NAMES } from "./panel";
import type { Block, Diagram, PanelItem } from "./types";

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
      for (const a of d.arcs ?? []) {
        if (![a?.center, a?.from, a?.to].every(has)) out.push(`Arc about ${a?.center} uses an unknown point.`);
        else if (samePoint(d.points[a.center], d.points[a.from]) || samePoint(d.points[a.center], d.points[a.to])) {
          out.push(`Arc about ${a.center} has zero radius.`);
        }
      }
      if (d.count !== undefined && !["triangles", "squares", "rectangles"].includes(d.count)) {
        out.push("Count must be triangles, squares or rectangles.");
      }
      if (d.count && (d.segments ?? []).length < 3) out.push("A counting figure needs its lines (at least 3 segments).");
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
    case "puzzle": {
      if (!Array.isArray(d.figures) || d.figures.length === 0) return ["Number puzzle needs at least one figure."];
      if (d.figures.length > 4) out.push("Number puzzle is drawn for up to 4 figures.");
      const filled = (x: unknown) => typeof x === "string" && x.trim() !== "";
      d.figures.forEach((f, i) => {
        const name = `Figure ${i + 1}`;
        const values = f?.values ?? [];
        if (f?.shape === "triangle" && values.length !== 3) out.push(`${name}: a triangle needs 3 corner values.`);
        else if (f?.shape === "square" && values.length !== 4) out.push(`${name}: a square needs 4 corner values.`);
        else if (f?.shape === "circle" && (values.length < 2 || values.length > 8)) out.push(`${name}: a circle needs 2 to 8 sector values.`);
        else if (f?.shape === "grid") {
          const rows = f.rows ?? [];
          if (rows.length === 0 || rows.length > 6 || rows.some((r) => !Array.isArray(r) || r.length !== rows[0].length || r.length > 6)) {
            out.push(`${name}: a grid needs up to 6 rows of the same length (up to 6 cells).`);
          }
        } else if (!["triangle", "square", "circle", "grid"].includes(f?.shape as string)) {
          out.push(`${name}: shape must be triangle, square, circle or grid.`);
        }
        const all = [...values, ...(f?.rows ?? []).flat(), ...(f?.center !== undefined ? [f.center] : [])];
        if (!all.every(filled)) out.push(`${name} has an empty value.`);
        if (all.some((x) => typeof x === "string" && x.length > 5)) out.push(`${name}: keep each value short (up to 5 characters).`);
      });
      return out;
    }
    case "mirror": {
      if (typeof d.text !== "string" || d.text.trim() === "") return ["Mirror image needs the text."];
      if (Array.from(d.text).length > 14) out.push("Mirror image text is drawn for up to 14 characters.");
      if (d.transform && !["none", "mirror", "water", "rotate"].includes(d.transform)) out.push("Mirror transform must be none, mirror, water or rotate.");
      if (d.line && !["right", "below"].includes(d.line)) out.push('Mirror line must be "right" or "below".');
      const n = Array.from(d.text).length;
      if ((d.keep ?? []).some((i) => !Number.isInteger(i) || i < 0 || i >= n)) out.push("Mirror keep lists a position outside the text.");
      return out;
    }
    case "regions": {
      if (!Array.isArray(d.sets) || d.sets.length < 2 || d.sets.length > 3) return ["Regions figure needs 2 or 3 groups."];
      for (const s of d.sets) {
        if (!s || typeof s.label !== "string" || s.label.trim() === "") out.push("Each group needs a label.");
        if (!["circle", "triangle", "square"].includes(s?.shape as string)) out.push("Each group's shape must be circle, triangle or square.");
      }
      const valid = d.sets.length === 3 ? ["A", "B", "C", "AB", "AC", "BC", "ABC"] : ["A", "B", "AB"];
      const keys = Object.keys(isObject(d.values) ? d.values : {});
      if (keys.length === 0) out.push("Regions figure has no numbers.");
      for (const k of keys) if (!valid.includes(k)) out.push(`Region "${k}" doesn't exist for ${d.sets.length} groups.`);
      for (const k of d.highlight ?? []) if (!valid.includes(k) && k !== "outside") out.push(`Highlighted region "${k}" doesn't exist.`);
      return out;
    }
    case "relation": {
      if (!RELATION_PATTERN_NAMES.includes(d.pattern)) return [`Unknown circle arrangement "${String(d.pattern)}".`];
      const n = RELATION_PATTERNS[d.pattern].circles.length;
      if ((d.labels ?? []).length > n) out.push(`"${d.pattern}" has ${n} circles but ${d.labels!.length} labels.`);
      if (d.highlight !== undefined && (!Number.isInteger(d.highlight) || d.highlight < 0 || d.highlight >= n)) out.push("Highlighted circle is outside the arrangement.");
      return out;
    }
    case "cube": {
      if (!Array.isArray(d.views) || d.views.length === 0) return ["Cube needs at least one view."];
      if (d.views.length > 4) out.push("Cube is drawn for up to 4 views.");
      const shown = new Set<string>();
      d.views.forEach((v, i) => {
        const faces = [v?.top, v?.left, v?.right];
        if (!faces.every((f) => typeof f === "string" && f.trim() !== "")) {
          out.push(`Cube view ${i + 1} needs top, left and right faces.`);
          return;
        }
        if (faces.some((f) => f.length > 4)) out.push(`Cube view ${i + 1}: keep each face to a short symbol (up to 4 characters).`);
        if (new Set(faces).size !== 3) out.push(`Cube view ${i + 1} shows the same face twice.`);
        if (d.pips && faces.some((f) => !/^[1-6]$/.test(f))) out.push(`Cube view ${i + 1}: dot faces must be numbers 1 to 6.`);
        faces.forEach((f) => shown.add(f));
      });
      if (d.highlight && !shown.has(d.highlight)) out.push(`Cube highlight "${d.highlight}" isn't on any view.`);
      const paired = new Set<string>();
      for (const pair of d.opposites ?? []) {
        const [a, b] = pair ?? [];
        if (!a || !b || a === b) {
          out.push("Each opposite pair needs two different faces.");
          continue;
        }
        if (paired.has(a) || paired.has(b)) out.push(`Face ${paired.has(a) ? a : b} is in two opposite pairs.`);
        paired.add(a);
        paired.add(b);
        if (d.views.some((v) => v && [v.top, v.left, v.right].includes(a) && [v.top, v.left, v.right].includes(b))) {
          out.push(`${a} and ${b} show together on one view, so they can't be opposite.`);
        }
      }
      return out;
    }
    case "panel": {
      if (!Array.isArray(d.cells) || d.cells.length === 0) return ["Figure row needs at least one cell."];
      if (d.cells.length > 5) out.push("Figure row is drawn for up to 5 cells.");
      if (d.frame && !["square", "circle", "none"].includes(d.frame)) out.push("Cell frame must be square, circle or none.");
      d.cells.forEach((c, i) => {
        const name = d.cells.length > 1 ? `Cell ${i + 1}` : "Figure";
        if (!isObject(c)) return void out.push(`${name} isn't a cell.`);
        if (c.missing && (c.items ?? []).length) out.push(`${name} is the missing "?" figure but has items.`);
        if (!c.missing && !(c.items ?? []).length) out.push(`${name} is empty.`);
        if ((c.items ?? []).length > 16) out.push(`${name} has more than 16 items.`);
        if (marksOverlap(c.items ?? [])) out.push(`${name} has two letters drawn on top of each other.`);
        (c.items ?? []).forEach((it, j) => out.push(...panelItemProblems(it).map((p) => `${name}, item ${j + 1}: ${p}`)));
      });
      if (d.cells.slice(0, -1).some((c) => c?.missing)) out.push('Only the last cell can be the missing "?" figure.');
      return out;
    }
    case "trace": {
      if (!isNumber(d.w) || !isNumber(d.h) || d.w <= 0 || d.h <= 0) return ["Traced figure needs its size (w, h)."];
      const nums = (v: unknown) => Array.isArray(v) && v.every(isNumber);
      if ((d.lines ?? []).some((l) => !nums(l) || l.length !== 4)) out.push("Traced lines are [x1, y1, x2, y2].");
      if ((d.circles ?? []).some((c) => !nums(c) || c.length !== 3)) out.push("Traced circles are [cx, cy, r].");
      if ((d.glyphs ?? []).some((g) => !isString(g.text) || !g.text.trim())) out.push("A traced letter has no text.");
      const parts = (d.lines?.length ?? 0) + (d.circles?.length ?? 0) + (d.paths?.length ?? 0) + (d.polygons?.length ?? 0) + (d.fills?.length ?? 0) + (d.glyphs?.length ?? 0);
      if (!parts) out.push("Traced figure is empty.");
      return out;
    }
    case "fold": {
      if (!Array.isArray(d.steps)) return ["Paper folding needs its folds (steps)."];
      if (d.steps.length > 4) out.push("Paper folding is drawn for up to 4 folds.");
      for (const [i, s] of d.steps.entries()) {
        if (!FOLD_SIDES.includes(s?.fold)) out.push(`Fold ${i + 1} must be one of ${FOLD_SIDES.join(", ")}.`);
      }
      if (!Array.isArray(d.cuts) || d.cuts.length === 0) return [...out, "Paper folding needs at least one hole or cut."];
      if (d.cuts.length > 8) out.push("Paper folding is drawn for up to 8 cuts.");
      if (out.length) return out;
      const sheet = foldedSheet(d.steps);
      const placedAt = (i: number) => cutsOnSheet({ ...d, cuts: [d.cuts[i]] })[0];
      d.cuts.forEach((c, i) => {
        if (!CUT_SHAPES.includes(c?.shape)) out.push(`Cut ${i + 1}: shape must be one of ${CUT_SHAPES.join(", ")}.`);
        if (!isPanelAt(c?.at)) out.push(`Cut ${i + 1}: place it at a grid spot (tl … br) or [x, y] from 0 to 1.`);
        else if (!placedAt(i) || !insidePolygon(sheet, placedAt(i).at, 0.02)) out.push(`Cut ${i + 1} is off the folded sheet.`);
        if (c?.size !== undefined && (!isNumber(c.size) || c.size <= 0 || c.size > 1)) out.push(`Cut ${i + 1}: size must be between 0 and 1.`);
      });
      return out;
    }
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

const ARROW_HEADS = ["single", "double", "hollow"];
const ARROW_TAILS = ["none", "bar", "double"];
const GLYPH_TRANSFORMS = ["none", "mirror", "water", "rotate90", "rotate180", "rotate270"];
const LINE_ENDS = ["none", "bar", "arrow", "dot"];

/**
 * Two letters or digits in a cell closer than about their own width, so they'd be drawn
 * over each other. A mark with no place is drawn in the centre. Shapes may overlap on
 * purpose (a circle in a square, a dot on a line), so only glyphs are compared.
 */
function marksOverlap(items: PanelItem[]): boolean {
  const glyphs = items
    .filter((it): it is Extract<PanelItem, { type: "glyph" }> => isObject(it) && it.type === "glyph")
    .map((it) => ({ p: anchorPoint(it.at), size: it.size ?? DEFAULT_GLYPH_SIZE }))
    .filter((m): m is { p: [number, number]; size: number } => !!m.p);
  for (let i = 0; i < glyphs.length; i++)
    for (let j = i + 1; j < glyphs.length; j++) {
      const [a, b] = [glyphs[i], glyphs[j]];
      if (Math.hypot(a.p[0] - b.p[0], a.p[1] - b.p[1]) < 0.45 * (a.size + b.size)) return true;
    }
  return false;
}

function panelItemProblems(it: PanelItem): string[] {
  if (!isObject(it)) return ["not an item."];
  const out: string[] = [];
  const at = (v: unknown, what = "at") => {
    if (v !== undefined && !isPanelAt(v)) out.push(`${what} must be a grid spot (tl, t, tr, l, c, r, bl, b, br) or [x, y] from 0 to 1.`);
  };
  const share = (v: unknown, what: string) => {
    if (v !== undefined && (!isNumber(v) || v <= 0 || v > 1)) out.push(`${what} must be between 0 and 1.`);
  };
  switch (it.type) {
    case "shape":
      if (!SHAPE_NAMES.includes(it.shape)) out.push(`unknown shape "${String(it.shape)}".`);
      at(it.at);
      share(it.size, "size");
      if (it.aspect !== undefined && (!isNumber(it.aspect) || it.aspect <= 0 || it.aspect > 4)) out.push("aspect must be between 0 and 4.");
      if (it.rotate !== undefined && !isNumber(it.rotate)) out.push("rotate must be a number of degrees.");
      return out;
    case "arrow":
      if (it.from !== undefined || it.to !== undefined) {
        if (!isPanelAt(it.from) || !isPanelAt(it.to)) out.push("arrow from and to must both be grid spots or [x, y] from 0 to 1.");
        else if (JSON.stringify(it.from) === JSON.stringify(it.to)) out.push("arrow from and to are the same point.");
      } else {
        at(it.at);
        share(it.size, "size");
        if (!isNumber(it.dir) || it.dir % 45 !== 0) out.push("arrow dir must be degrees from up in steps of 45.");
      }
      if (it.head !== undefined && !ARROW_HEADS.includes(it.head)) out.push(`arrow head must be ${ARROW_HEADS.join(", ")}.`);
      if (it.tail !== undefined && !ARROW_TAILS.includes(it.tail)) out.push(`arrow tail must be ${ARROW_TAILS.join(", ")}.`);
      return out;
    case "glyph":
      if (!isString(it.text) || !it.text.trim()) out.push("glyph has no text.");
      else if (Array.from(it.text).length > 3) out.push("glyph is up to 3 characters.");
      at(it.at);
      share(it.size, "size");
      if (it.transform !== undefined && !GLYPH_TRANSFORMS.includes(it.transform)) out.push(`glyph transform must be ${GLYPH_TRANSFORMS.join(", ")}.`);
      return out;
    case "line":
      if (it.from === undefined || it.to === undefined) out.push("line needs from and to.");
      at(it.from, "from");
      at(it.to, "to");
      if (it.ends !== undefined && (!Array.isArray(it.ends) || it.ends.length !== 2 || !it.ends.every((e) => LINE_ENDS.includes(e)))) {
        out.push(`line ends must be two of ${LINE_ENDS.join(", ")}.`);
      }
      return out;
    case "arc":
      at(it.at);
      share(it.r, "r");
      if (!isNumber(it.start) || !isNumber(it.end)) out.push("arc needs start and end angles.");
      return out;
    default:
      return [`unknown item type "${String((it as { type?: unknown }).type)}".`];
  }
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
