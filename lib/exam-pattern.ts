import type { SubjectKey } from "@/lib/subject-theme";

/**
 * SSC CGL Tier 1 paper pattern (4 sections x 25 questions x 2 marks, one hour,
 * 0.50 negative marking). Shown as orientation, not as official notice text.
 */
export const TIER1_PATTERN = {
  exam: "SSC CGL Tier 1",
  totalQuestions: 100,
  totalMarks: 200,
  durationMinutes: 60,
  questionsPerSection: 25,
  marksPerSection: 50,
  marksPerQuestion: 2,
  negativeMark: 0.5,
} as const;

export interface SyllabusTopic {
  name: string;
  /** Present when there is something to practise for this topic today. */
  href?: string;
}

export interface SubjectMeta {
  /** Section name as printed on the paper. */
  paperSection: string;
  tagline: string;
  syllabus: SyllabusTopic[];
}

const drill = (topic: string) => `/SSC/maths/mental-maths/${topic}`;
const formulas = (topic: string) => `/SSC/maths/formula-practice#${topic}`;
const FLASHCARDS = "/SSC/english/flashcards/freestyle";

export const SUBJECT_META: Record<SubjectKey, SubjectMeta> = {
  maths: {
    paperSection: "Quantitative Aptitude",
    tagline: "Speed first: most marks here are lost to the clock, not to concepts.",
    syllabus: [
      { name: "Simplification", href: drill("simplification") },
      { name: "Percentage", href: drill("percentage") },
      { name: "Ratio & Proportion", href: drill("ratio") },
      { name: "Squares & Cubes", href: drill("squares") },
      { name: "Square & Cube Roots", href: drill("square_roots") },
      { name: "Number System", href: formulas("number-system") },
      { name: "Averages", href: formulas("averages") },
      { name: "Profit & Loss", href: formulas("profit-loss") },
      { name: "Simple & Compound Interest", href: formulas("interest") },
      { name: "Time & Work", href: formulas("time-work") },
      { name: "Time, Speed & Distance", href: formulas("speed") },
      { name: "Algebra", href: formulas("algebra-identities") },
      { name: "Geometry", href: formulas("triangles") },
      { name: "Mensuration", href: formulas("mensuration-2d") },
      { name: "Trigonometry", href: formulas("trig-identities") },
      { name: "Data Interpretation", href: formulas("data-interpretation") },
    ],
  },
  english: {
    paperSection: "English Comprehension",
    tagline: "Vocabulary repeats year after year. Learn it once, score it every time.",
    syllabus: [
      { name: "Synonyms & Antonyms", href: "/SSC/english/games/odd-link" },
      { name: "Vocabulary", href: FLASHCARDS },
      { name: "Idioms & Phrases", href: FLASHCARDS },
      { name: "One Word Substitution", href: FLASHCARDS },
      { name: "Spelling Check", href: "/SSC/english/games/spelling-sprint" },
      { name: "Spotting Errors" },
      { name: "Fill in the Blanks" },
      { name: "Sentence Improvement" },
      { name: "Active & Passive Voice" },
      { name: "Direct & Indirect Speech" },
      { name: "Para Jumbles" },
      { name: "Cloze Test" },
      { name: "Reading Comprehension" },
    ],
  },
  reasoning: {
    paperSection: "General Intelligence & Reasoning",
    tagline: "The most scoring section: patterns you can learn to spot on sight.",
    syllabus: [
      { name: "Analogy" },
      { name: "Classification" },
      { name: "Number & Letter Series" },
      { name: "Coding-Decoding" },
      { name: "Blood Relations" },
      { name: "Direction Sense" },
      { name: "Syllogism" },
      { name: "Venn Diagrams" },
      { name: "Missing Number" },
      { name: "Mirror & Water Images" },
      { name: "Paper Folding & Cutting" },
      { name: "Embedded Figures" },
      { name: "Dice & Cubes" },
    ],
  },
  gk: {
    paperSection: "General Awareness",
    tagline: "No calculation, just recall. The fastest 25 questions on the paper.",
    syllabus: [
      { name: "History" },
      { name: "Polity" },
      { name: "Geography" },
      { name: "Economy" },
      { name: "Physics" },
      { name: "Chemistry" },
      { name: "Biology" },
      { name: "Static GK" },
      { name: "Current Affairs" },
      { name: "Computer Awareness" },
    ],
  },
};
