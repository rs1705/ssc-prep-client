import type { Block, ContentOption } from "./types";

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
];
