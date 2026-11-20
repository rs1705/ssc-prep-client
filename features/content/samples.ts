import { unfold } from "./fold";
import type { Block, ContentOption, FoldDiagram, GeometryDiagram, PanelAnchor, PanelCell, PanelGlyph } from "./types";

/**
 * The 12 sample questions from the approved Diagram Lab (design/diagram-lab.html), as
 * fixtures for the format gallery and the tests. Every block and diagram kind appears.
 */
export interface SampleQuestion {
  id: string;
  subject: "quant" | "reasoning";
  topic: string;
  kinds: string[];
  question: Block[];
  options: ContentOption[];
  answer: string;
  explanation: Block[];
}

const FIGURE = `
    <path d="M28 24 V92 H60" stroke="#111" stroke-width="7" fill="none" stroke-linecap="square"/>
    <path d="M70 30 L96 30 L83 54 Z" fill="#111"/>
    <circle cx="86" cy="82" r="8" fill="none" stroke="#111" stroke-width="5"/>
    <path d="M44 40 H54" stroke="#111" stroke-width="5"/>`;

/** Stand-ins for pictures cropped from a paper (the mirror-image question). */
function paperFigure(transform: string, withMirror: boolean): string {
  const g = `<g transform="translate(60 60) ${transform} translate(-60 -60)">${FIGURE}</g>`;
  const mirror = withMirror
    ? `<line x1="114" y1="8" x2="114" y2="112" stroke="#888" stroke-dasharray="4 3" stroke-width="2"/><text x="108" y="14" font-size="10" font-family="sans-serif" fill="#555">M</text><text x="108" y="116" font-size="10" font-family="sans-serif" fill="#555">N</text>`
    : "";
  return (
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#fff"/>${g}${mirror}</svg>`)
  );
}

const opts = (...texts: string[]): ContentOption[] =>
  texts.map((text, i) => ({ label: String.fromCharCode(65 + i), text }));

// Figure series, paper folding and figure counting.
const panelOption = (label: string, cell: PanelCell): ContentOption => ({
  label,
  blocks: [{ type: "diagram", diagram: { kind: "panel", cells: [cell] } }],
});
/** A black circle and a triangle in two corners. */
const cornerCell = (circle: PanelAnchor, triangle: PanelAnchor): PanelCell => ({
  items: [
    { type: "shape", shape: "circle", at: circle, filled: true, size: 0.2 },
    { type: "shape", shape: "triangle", at: triangle, size: 0.22 },
  ],
});
/** An arrow with a bar at its tail, turned `dir`, and a small square on the edge. */
const arrowCell = (dir: number, square: PanelAnchor): PanelCell => ({
  items: [
    { type: "arrow", dir, tail: "bar", size: 0.46 },
    { type: "shape", shape: "square", at: square, size: 0.12, filled: true },
  ],
});
/** F turned, R flipped. */
const letterCell = (f: PanelGlyph["transform"], r: PanelGlyph["transform"]): PanelCell => ({
  items: [
    { type: "glyph", text: "F", at: [0.32, 0.5], transform: f },
    { type: "glyph", text: "R", at: [0.7, 0.5], transform: r },
  ],
});
const holes = (at: [number, number][]): PanelCell => ({
  items: at.map((p) => ({ type: "shape", shape: "circle", at: p, size: 0.09, cut: true })),
});
const PUNCH: FoldDiagram = {
  kind: "fold", alt: "Square folded top half down, then left half over; one hole punched in the middle",
  steps: [{ fold: "top" }, { fold: "left" }], cuts: [{ shape: "circle", at: "c", size: 0.18 }],
};
const CUT: FoldDiagram = {
  kind: "fold", alt: "Square folded left over right, then top down; a square cut at the inner corner and a notch on the outer edge",
  steps: [{ fold: "left" }, { fold: "top" }],
  cuts: [{ shape: "square", at: [0, 0], size: 0.3 }, { shape: "circle", at: [1, 0.5], size: 0.3 }],
};
/** A square with both diagonals and both middle lines. */
const COUNT_FIGURE: GeometryDiagram = {
  kind: "geometry", count: "triangles", alt: "A square with both diagonals and the two lines joining the midpoints of opposite sides",
  points: { A: [0, 4], B: [4, 4], C: [4, 0], D: [0, 0], P: [2, 4], Q: [4, 2], R: [2, 0], S: [0, 2] },
  segments: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"], ["B", "D"], ["P", "R"], ["S", "Q"]],
};

const CIRCLE_POINTS: Record<string, [number, number]> = { O: [0, 0], A: [-5, 0], B: [5, 0], C: [-1.4, 4.8] };
const SALES = { labels: ["2020", "2021", "2022", "2023", "2024"], values: [120, 135, 165, 170, 190], tick: 50, unit: "₹ cr" };
const SPENDING = [
  { label: "Food", value: 35 },
  { label: "Rent", value: 25 },
  { label: "Education", value: 15 },
  { label: "Savings", value: 15 },
  { label: "Transport", value: 10 },
];

export const SAMPLE_QUESTIONS: SampleQuestion[] = [
  {
    id: "geometry", subject: "quant", topic: "Geometry · Circles", kinds: ["text", "geometry"],
    question: [
      { type: "text", text: "In the figure, AB is a diameter of the circle with centre O. If AB = 10 cm and AC = 6 cm, find the length of BC." },
      { type: "diagram", caption: "Figure from the question", diagram: {
        kind: "geometry", alt: "Circle with centre O, diameter AB and point C on the circle",
        points: CIRCLE_POINTS,
        circles: [{ center: "O", through: "A" }],
        segments: [["A", "B"], ["A", "C"], ["C", "B"]],
        labels: { AB: "10 cm", AC: "6 cm", CB: "?" } } },
    ],
    options: opts("6 cm", "8 cm", "9 cm", "10 cm"),
    answer: "B",
    explanation: [
      { type: "text", text: "An angle in a semicircle is a right angle, so $\\angle ACB = 90^\\circ$." },
      { type: "diagram", caption: "Right angle at C; Pythagoras on triangle ACB", diagram: {
        kind: "geometry", alt: "Triangle ACB with a right angle marked at C",
        points: CIRCLE_POINTS,
        circles: [{ center: "O", through: "A" }],
        segments: [["A", "B"], ["A", "C"], ["C", "B"]],
        rightAngles: [{ at: "C", from: "A", to: "B" }],
        highlight: ["CB", "right"],
        labels: { AB: "10 cm", AC: "6 cm", CB: "8 cm" } } },
      { type: "math", latex: "BC = \\sqrt{AB^2 - AC^2} = \\sqrt{10^2 - 6^2} = \\sqrt{64} = 8\\text{ cm}" },
    ],
  },
  {
    id: "algebra", subject: "quant", topic: "Algebra · Identities", kinds: ["math"],
    question: [{ type: "text", text: "If $x + \\dfrac{1}{x} = 5$, what is the value of $x^3 + \\dfrac{1}{x^3}$?" }],
    options: opts("110", "115", "120", "125"),
    answer: "A",
    explanation: [
      { type: "text", text: "**Shortcut:** use the cube identity directly, no need to find $x$." },
      { type: "math", latex: "x^3 + \\frac{1}{x^3} = \\left(x + \\frac{1}{x}\\right)^3 - 3\\left(x + \\frac{1}{x}\\right) = 125 - 15 = 110" },
    ],
  },
  {
    id: "di-table-bar", subject: "quant", topic: "Data Interpretation · Table and bar chart", kinds: ["table", "bar chart"],
    question: [
      { type: "text", text: "The table and chart show a company's sales (in ₹ crore). In which year was the increase over the previous year the highest?" },
      { type: "table", headers: ["Year", "2020", "2021", "2022", "2023", "2024"], rows: [["Sales (₹ cr)", 120, 135, 165, 170, 190]] },
      { type: "diagram", diagram: { kind: "bar", alt: "Sales by year, 2020 to 2024", ...SALES } },
    ],
    options: opts("2021", "2022", "2023", "2024"),
    answer: "B",
    explanation: [
      { type: "table", headers: ["Year", "Change over previous year"], rows: [["2021", "+15"], ["2022", "+30"], ["2023", "+5"], ["2024", "+20"]], highlightRow: 1, caption: "Year-on-year increase (₹ cr)" },
      { type: "diagram", diagram: { kind: "bar", alt: "Sales with 2022 highlighted", ...SALES, highlight: 2 } },
    ],
  },
  {
    id: "di-pie", subject: "quant", topic: "Data Interpretation · Pie chart", kinds: ["pie chart"],
    question: [
      { type: "text", text: "A family's monthly income of ₹48,000 is spent as shown. How much is spent on education?" },
      { type: "diagram", diagram: { kind: "pie", alt: "Monthly spending split", slices: SPENDING } },
    ],
    options: opts("₹6,400", "₹7,200", "₹7,800", "₹8,400"),
    answer: "B",
    explanation: [
      { type: "math", latex: "15\\%\\ \\text{of}\\ 48{,}000 = \\frac{15}{100} \\times 48{,}000 = 7{,}200" },
      { type: "diagram", diagram: { kind: "pie", alt: "Education share highlighted", highlight: 2, slices: SPENDING } },
    ],
  },
  {
    id: "numberline", subject: "quant", topic: "Algebra · Inequalities", kinds: ["math", "number line"],
    question: [{ type: "text", text: "How many integer values of $x$ satisfy both $2x - 3 > 5$ and $x \\le 7$?" }],
    options: opts("2", "3", "4", "5"),
    answer: "B",
    explanation: [
      { type: "math", latex: "2x - 3 > 5 \\Rightarrow x > 4, \\qquad x \\le 7 \\;\\Rightarrow\\; 4 < x \\le 7" },
      { type: "diagram", caption: "Open circle at 4 (not included), closed at 7 (included)", diagram: {
        kind: "numberline", alt: "Number line from 0 to 9 with x between 4 and 7", min: 0, max: 9,
        ranges: [{ from: 4, to: 7, fromClosed: false, toClosed: true }], marks: [5, 6, 7], marksLabel: "5, 6, 7" } },
    ],
  },
  {
    id: "series", subject: "reasoning", topic: "Number series", kinds: ["series"],
    question: [
      { type: "text", text: "Select the number that will come in place of the question mark (?)." },
      { type: "series", items: [3, 8, 15, 24, 35, "?"] },
    ],
    options: opts("46", "48", "49", "50"),
    answer: "B",
    explanation: [
      { type: "text", text: "The differences rise by 2 each time." },
      { type: "series", items: [3, 8, 15, 24, 35, 48], diffs: ["+5", "+7", "+9", "+11", "+13"], found: 5 },
      { type: "text", text: "Also: each term is $n^2 - 1$ for $n = 2, 3, 4, \\ldots$, so the next is $7^2 - 1 = 48$." },
    ],
  },
  {
    id: "coding", subject: "reasoning", topic: "Coding-decoding", kinds: ["coding"],
    question: [{ type: "text", text: "In a certain code language, COLD is written as FROG. How will WARM be written in that language?" }],
    options: opts("ZCUP", "ZDUP", "YDUP", "ZDTP"),
    answer: "B",
    explanation: [
      { type: "text", text: "Each letter moves 3 places forward." },
      { type: "coding", from: "COLD", to: "FROG", shifts: ["+3", "+3", "+3", "+3"], fromTag: "Word", toTag: "Code" },
      { type: "coding", from: "WARM", to: "ZDUP", shifts: ["+3", "+3", "+3", "+3"], fromTag: "Apply", toTag: "Answer" },
    ],
  },
  {
    id: "venn", subject: "reasoning", topic: "Syllogism", kinds: ["venn"],
    question: [
      { type: "text", text: "Statements: All pens are books. Some books are bags." },
      { type: "text", text: "Conclusions: I. Some pens are bags. II. Some bags are books." },
    ],
    options: opts("Only I follows", "Only II follows", "Both follow", "Neither follows"),
    answer: "B",
    explanation: [
      { type: "text", text: "Draw the simplest case that fits the statements. Pens sit fully inside Books; Bags only touch Books." },
      { type: "diagram", caption: "Pens and Bags need not meet, so I does not follow", diagram: {
        kind: "venn", alt: "Pens inside Books; Bags overlapping Books but not Pens",
        sets: [{ id: "books", label: "Books" }, { id: "pens", label: "Pens", within: "books" }, { id: "bags", label: "Bags", overlaps: "books", highlight: true }],
        region: { between: ["books", "bags"], label: "some bags are books" } } },
      { type: "text", text: "II is the reverse of 'Some books are bags', which is always true. So only II follows." },
    ],
  },
  {
    id: "tree", subject: "reasoning", topic: "Blood relations", kinds: ["tree"],
    question: [{ type: "text", text: "Pointing to a girl in a photograph, Ravi says, “She is the daughter of the only son of my grandfather.” How is the girl related to Ravi?" }],
    options: opts("Cousin", "Niece", "Sister", "Aunt"),
    answer: "C",
    explanation: [
      { type: "text", text: "Grandfather's only son is Ravi's father. His daughter is Ravi's sister." },
      { type: "diagram", caption: "Square = male, circle = female", diagram: {
        kind: "tree", alt: "Grandfather, his only son, and the son's two children Ravi and the girl",
        nodes: [
          { id: "gf", label: "Grandfather", gender: "m", short: "GF" },
          { id: "f", label: "Father (only son)", gender: "m", short: "F" },
          { id: "ravi", label: "Ravi", gender: "m", short: "R", highlight: "speaker" },
          { id: "girl", label: "Girl", gender: "f", short: "G", highlight: "answer" }],
        edges: [["gf", "f"], ["f", "ravi"], ["f", "girl"]] } },
    ],
  },
  {
    id: "path", subject: "reasoning", topic: "Direction sense", kinds: ["path"],
    question: [{ type: "text", text: "Asha walks 5 km north, turns right and walks 3 km, turns right again and walks 9 km, then turns left and walks 3 km. How far is she from her starting point, and in which direction?" }],
    options: opts("$\\sqrt{52}$ km, south-east", "6 km, east", "$\\sqrt{52}$ km, north-east", "10 km, south"),
    answer: "A",
    explanation: [
      { type: "diagram", caption: "Each square is 1 km", diagram: {
        kind: "path", alt: "Path: 5 north, 3 east, 9 south, 3 east", showDisplacement: true, displacementLabel: "√52 ≈ 7.2 km",
        steps: [{ dir: "N", dist: 5 }, { dir: "E", dist: 3 }, { dir: "S", dist: 9 }, { dir: "E", dist: 3 }] } },
      { type: "math", latex: "\\text{East} = 3 + 3 = 6,\\quad \\text{South} = 9 - 5 = 4,\\quad d = \\sqrt{6^2 + 4^2} = \\sqrt{52}" },
    ],
  },
  {
    id: "seating", subject: "reasoning", topic: "Seating arrangement", kinds: ["seating"],
    question: [{ type: "text", text: "Six friends A, B, C, D, E and F sit around a circular table, all facing the centre. B is second to the right of A. C sits opposite A. D is to the immediate left of B. E is not an immediate neighbour of A. Who sits to the immediate right of A?" }],
    options: opts("D", "F", "B", "E"),
    answer: "A",
    explanation: [
      { type: "text", text: "Facing the centre, a person's right runs anticlockwise. Fix A at the bottom and place each clue." },
      { type: "diagram", diagram: {
        kind: "seating", alt: "Circle of six: A, D, B, C, E, F anticlockwise from the bottom", note: "All face the centre · right = anticlockwise",
        seats: ["A", "D", "B", "C", "E", "F"], highlight: { A: "ref", D: "answer" } } },
      { type: "text", text: "D is both immediately left of B and immediately right of A." },
    ],
  },
  {
    id: "cube", subject: "reasoning", topic: "Dice and cubes", kinds: ["cube"],
    question: [
      { type: "text", text: "Two different positions of the same cube are shown. Which letter is on the face opposite to Q?" },
      { type: "diagram", diagram: { kind: "cube", views: [{ top: "Q", left: "Z", right: "V" }, { top: "T", left: "L", right: "V" }] } },
    ],
    options: opts("Z", "L", "T", "V"),
    answer: "C",
    explanation: [
      { type: "text", text: "V shows in both positions, in the same place (right). When the common face stays in the same place, the faces in matching places are opposite each other." },
      { type: "diagram", diagram: {
        kind: "cube", views: [{ top: "Q", left: "Z", right: "V" }, { top: "T", left: "L", right: "V" }],
        highlight: "V", opposites: [["Q", "T"], ["Z", "L"]] } },
      { type: "text", text: "- Top: Q in the first, T in the second, so **Q is opposite T**.\n- Left: Z and L, so Z is opposite L." },
    ],
  },
  {
    id: "puzzle", subject: "reasoning", topic: "Missing number", kinds: ["puzzle"],
    question: [
      { type: "text", text: "Select the number that can replace the question mark (?) in the following figure." },
      { type: "diagram", diagram: { kind: "puzzle", figures: [
        { shape: "triangle", values: ["2", "3", "4"], center: "24" },
        { shape: "triangle", values: ["3", "4", "5"], center: "60" },
        { shape: "triangle", values: ["4", "5", "6"], center: "?" },
      ] } },
    ],
    options: opts("90", "100", "120", "150"),
    answer: "C",
    explanation: [
      { type: "text", text: "The middle number is the product of the three corners: $2 \\times 3 \\times 4 = 24$ and $3 \\times 4 \\times 5 = 60$." },
      { type: "diagram", diagram: { kind: "puzzle", highlight: "120", figures: [
        { shape: "triangle", values: ["2", "3", "4"], center: "24" },
        { shape: "triangle", values: ["3", "4", "5"], center: "60" },
        { shape: "triangle", values: ["4", "5", "6"], center: "120" },
      ] } },
      { type: "text", text: "So the missing number is $4 \\times 5 \\times 6 = $ **120**." },
    ],
  },
  {
    id: "mirror-text", subject: "reasoning", topic: "Mirror images", kinds: ["mirror"],
    question: [
      { type: "text", text: "Select the correct mirror image of the given combination when the mirror is placed at MN as shown." },
      { type: "diagram", diagram: { kind: "mirror", text: "AB3K7", line: "right" } },
    ],
    options: [
      { label: "A", blocks: [{ type: "diagram", diagram: { kind: "mirror", text: "AB3K7", transform: "mirror" } }] },
      { label: "B", blocks: [{ type: "diagram", diagram: { kind: "mirror", text: "AB3K7", transform: "water" } }] },
      { label: "C", blocks: [{ type: "diagram", diagram: { kind: "mirror", text: "AB3K7", transform: "rotate" } }] },
      { label: "D", blocks: [{ type: "diagram", diagram: { kind: "mirror", text: "AB3K7", transform: "mirror", keep: [2] } }] },
    ],
    answer: "A",
    explanation: [
      { type: "text", text: "A mirror on the right swaps left and right: the order is reversed and every character is flipped sideways. Top and bottom stay as they are." },
      { type: "diagram", diagram: { kind: "mirror", text: "AB3K7", transform: "mirror", line: "right" } },
      { type: "text", text: "- B is the water image (flipped top to bottom).\n- C is turned upside down.\n- D leaves the 3 unflipped." },
    ],
  },
  {
    id: "regions", subject: "reasoning", topic: "Venn diagrams", kinds: ["regions"],
    question: [
      { type: "text", text: "In the given figure, the triangle stands for doctors, the circle for women and the square for mothers. How many women doctors are not mothers?" },
      { type: "diagram", diagram: { kind: "regions",
        sets: [{ label: "Doctors", shape: "triangle" }, { label: "Women", shape: "circle" }, { label: "Mothers", shape: "square" }],
        values: { A: "12", B: "8", C: "5", AB: "6", AC: "3", BC: "9", ABC: "4" } } },
    ],
    options: opts("4", "6", "9", "10"),
    answer: "B",
    explanation: [
      { type: "text", text: "Women doctors are inside both the triangle and the circle. Leaving out mothers means staying outside the square, so only one region counts." },
      { type: "diagram", diagram: { kind: "regions",
        sets: [{ label: "Doctors", shape: "triangle" }, { label: "Women", shape: "circle" }, { label: "Mothers", shape: "square" }],
        values: { A: "12", B: "8", C: "5", AB: "6", AC: "3", BC: "9", ABC: "4" }, highlight: ["AB"] } },
      { type: "text", text: "The region in the triangle and the circle but not the square holds **6**." },
    ],
  },
  {
    id: "relation", subject: "reasoning", topic: "Venn diagrams", kinds: ["relation"],
    question: [{ type: "text", text: "Which of the following diagrams best represents the relationship between Women, Mothers and Doctors?" }],
    options: [
      { label: "A", blocks: [{ type: "diagram", diagram: { kind: "relation", pattern: "3-nested" } }] },
      { label: "B", blocks: [{ type: "diagram", diagram: { kind: "relation", pattern: "3-inside-overlap-both" } }] },
      { label: "C", blocks: [{ type: "diagram", diagram: { kind: "relation", pattern: "3-overlap" } }] },
      { label: "D", blocks: [{ type: "diagram", diagram: { kind: "relation", pattern: "3-inside-apart" } }] },
    ],
    answer: "B",
    explanation: [
      { type: "text", text: "Every mother is a woman, so Mothers sits inside Women. Some women are doctors and some doctors are mothers, so Doctors overlaps both." },
      { type: "diagram", diagram: { kind: "relation", pattern: "3-inside-overlap-both", labels: ["Women", "Mothers", "Doctors"], highlight: 2 } },
    ],
  },
  {
    id: "mirror", subject: "reasoning", topic: "Mirror images", kinds: ["image"],
    question: [
      { type: "text", text: "Select the correct mirror image of the given figure when the mirror is placed at MN, as shown." },
      { type: "image", src: paperFigure("", true), alt: "Question figure with a mirror line MN on its right" },
    ],
    options: [
      { label: "A", image: paperFigure("scale(1 -1)", false), alt: "Option A figure" },
      { label: "B", image: paperFigure("rotate(180)", false), alt: "Option B figure" },
      { label: "C", image: paperFigure("scale(-1 1)", false), alt: "Option C figure" },
      { label: "D", image: paperFigure("", false), alt: "Option D figure" },
    ],
    answer: "C",
    explanation: [
      { type: "text", text: "A vertical mirror swaps left and right only; top and bottom stay put. Option A is the water image (flipped top to bottom), B is a half turn, and D is unchanged." },
      { type: "text", text: "Questions like this keep the real pictures from the paper: no spec can describe them reliably." },
    ],
  },
  {
    id: "series-shapes", subject: "reasoning", topic: "Figure series · Shapes moving", kinds: ["panel"],
    question: [
      { type: "text", text: "Select the figure that will come next in the following series." },
      { type: "diagram", diagram: { kind: "panel", cells: [
        cornerCell("tl", "br"), cornerCell("tr", "bl"), cornerCell("br", "tl"), cornerCell("bl", "tr"), { items: [], missing: true },
      ] } },
    ],
    options: [
      panelOption("A", cornerCell("tl", "tr")),
      panelOption("B", cornerCell("tl", "br")),
      panelOption("C", cornerCell("tr", "br")),
      panelOption("D", cornerCell("bl", "br")),
    ],
    answer: "B",
    explanation: [
      { type: "text", text: "- The black circle moves one corner clockwise each time: top-left, top-right, bottom-right, bottom-left, then back to **top-left**.\n- The triangle moves one corner clockwise too, from the opposite corner, so it is back at **bottom-right**." },
      { type: "diagram", diagram: { kind: "panel", cells: [
        cornerCell("tl", "br"), cornerCell("tr", "bl"), cornerCell("br", "tl"), cornerCell("bl", "tr"), { ...cornerCell("tl", "br"), highlight: true },
      ] } },
    ],
  },
  {
    id: "series-arrows", subject: "reasoning", topic: "Figure series · Arrows turning", kinds: ["panel"],
    question: [
      { type: "text", text: "Select the figure that can replace the question mark (?) in the following series." },
      { type: "diagram", diagram: { kind: "panel", cells: [arrowCell(0, "tl"), arrowCell(45, "t"), arrowCell(90, "tr"), { items: [], missing: true }] } },
    ],
    options: [
      panelOption("A", arrowCell(180, "r")),
      panelOption("B", arrowCell(135, "br")),
      panelOption("C", arrowCell(135, "r")),
      panelOption("D", arrowCell(315, "r")),
    ],
    answer: "C",
    explanation: [
      { type: "text", text: "- The arrow with the bar at its tail turns **45° clockwise** each time: up, up-right, right, so next it points down-right.\n- The small square moves one step clockwise round the edge: top-left, top, top-right, then **right**." },
      { type: "diagram", diagram: { kind: "panel", cells: [arrowCell(0, "tl"), arrowCell(45, "t"), arrowCell(90, "tr"), { ...arrowCell(135, "r"), highlight: true }] } },
    ],
  },
  {
    id: "series-letters", subject: "reasoning", topic: "Figure series · Letters turning and flipping", kinds: ["panel"],
    question: [
      { type: "text", text: "Select the figure that will come next in the following series." },
      { type: "diagram", diagram: { kind: "panel", cells: [letterCell("none", "none"), letterCell("rotate90", "mirror"), letterCell("rotate180", "none"), { items: [], missing: true }] } },
    ],
    options: [
      panelOption("A", letterCell("rotate270", "none")),
      panelOption("B", letterCell("rotate270", "mirror")),
      panelOption("C", letterCell("water", "mirror")),
      panelOption("D", letterCell("rotate90", "mirror")),
    ],
    answer: "B",
    explanation: [
      { type: "text", text: "- **F** turns 90° clockwise each time, so the fourth figure shows it turned 270°.\n- **R** flips left-right every other figure: as printed, flipped, as printed, so next it is **flipped**." },
      { type: "diagram", diagram: { kind: "panel", cells: [letterCell("none", "none"), letterCell("rotate90", "mirror"), letterCell("rotate180", "none"), { ...letterCell("rotate270", "mirror"), highlight: true }] } },
    ],
  },
  {
    id: "fold-punch", subject: "reasoning", topic: "Paper folding · Punching", kinds: ["fold", "panel"],
    question: [
      { type: "text", text: "A square sheet of paper is folded as shown and a hole is punched in it. How will the paper look when opened?" },
      { type: "diagram", diagram: PUNCH },
    ],
    options: [
      panelOption("A", holes([[0.25, 0.25], [0.75, 0.75]])),
      panelOption("B", holes([[0.5, 0.25], [0.5, 0.75], [0.25, 0.5], [0.75, 0.5]])),
      panelOption("C", unfold(PUNCH)),
      panelOption("D", holes([[0.75, 0.25], [0.75, 0.75]])),
    ],
    answer: "C",
    explanation: [
      { type: "text", text: "- Open the second fold (left over right): the hole is copied into the left half.\n- Open the first fold (top down): both holes are copied into the top half.\n- So there is one hole in each quarter of the sheet." },
      { type: "diagram", diagram: { ...PUNCH, showUnfolded: true } },
    ],
  },
  {
    id: "fold-cut", subject: "reasoning", topic: "Paper folding · Cutting", kinds: ["fold", "panel"],
    question: [
      { type: "text", text: "A square sheet of paper is folded and cut as shown. Which figure shows the paper when it is opened?" },
      { type: "diagram", diagram: CUT },
    ],
    options: [
      panelOption("A", unfold(CUT)),
      panelOption("B", { items: unfold(CUT).items.filter((i) => i.type === "shape" && Array.isArray(i.at) && i.at[0] !== 0) }),
      panelOption("C", { items: unfold(CUT).items.filter((i) => i.type === "shape" && i.shape === "circle") }),
      panelOption("D", unfold({ ...CUT, steps: [{ fold: "left" }] })),
    ],
    answer: "A",
    explanation: [
      { type: "text", text: "- The square cut at the folded corner is at the centre of the sheet, so it opens into **one** square hole.\n- The notch on the outer edge is copied by both folds: two notches on the right edge and two on the left." },
      { type: "diagram", diagram: { ...CUT, showUnfolded: true } },
    ],
  },
  {
    id: "count-triangles", subject: "reasoning", topic: "Figure counting · Triangles", kinds: ["geometry"],
    question: [
      { type: "text", text: "How many triangles are there in the given figure?" },
      { type: "diagram", diagram: COUNT_FIGURE },
    ],
    options: opts("8", "12", "16", "20"),
    answer: "C",
    explanation: [
      { type: "text", text: "- Single pieces: the two diagonals and two middle lines cut the square into **8** small triangles.\n- Made of two pieces: **4**, one on each side of the square with its tip at the centre.\n- Made of four pieces: **4** halves of the square cut by a diagonal.\n- Total: 8 + 4 + 4 = **16**." },
      { type: "diagram", diagram: COUNT_FIGURE },
    ],
  },
];
