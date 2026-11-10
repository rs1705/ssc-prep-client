import {
  ArrowLeftRight,
  CaseSensitive,
  Hash,
  KeyRound,
  ListOrdered,
  Scale,
  Shapes,
  Shuffle,
  type LucideIcon,
} from "lucide-react";
import type { SectionCardProps } from "@/components/custom/section-card/section-card";
import { SUBJECT_HUE } from "@/lib/subject-theme";
import {
  alphabetPosition,
  codingMixed,
  letterSeries,
  mixedReasoning,
  numberAnalogy,
  numberSeries,
  oddOneOut,
  oppositeLetter,
  type Generator,
} from "./generators";

export interface ReasoningDrill {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tips: string[];
  generate: Generator;
}

export const REASONING_DRILLS_HREF = "/SSC/reasoning/speed-drills";

/** In the order shown on the hub. Coding-decoding first: it is the most asked. */
export const REASONING_DRILLS: ReasoningDrill[] = [
  {
    slug: "coding-decoding",
    title: "Coding-Decoding",
    description: "Letter shifts, opposite-letter codes, reversed words and number codes.",
    icon: KeyRound,
    tips: ["Compare the first letter of the word and its code to find the rule"],
    generate: codingMixed,
  },
  {
    slug: "alphabet-positions",
    title: "Alphabet Positions",
    description: "Letter ↔ number and positions from the end, until they are instant.",
    icon: CaseSensitive,
    tips: ["EJOTY: E5 · J10 · O15 · T20 · Y25", "From the end = 27 − position"],
    generate: alphabetPosition,
  },
  {
    slug: "opposite-letters",
    title: "Opposite Letters",
    description: "A ↔ Z, B ↔ Y… the pairs behind half of all coding questions.",
    icon: ArrowLeftRight,
    tips: ["Opposite positions add up to 27", "Pairs to remember: AZ · BY · CX · DW · EV · FU · GT · HS · IR · JQ · KP · LO · MN"],
    generate: oppositeLetter,
  },
  {
    slug: "number-series",
    title: "Number Series",
    description: "Find the next term: steps, ratios, squares, cubes and growing gaps.",
    icon: Hash,
    tips: ["Check the differences first, then ratios, then squares/cubes"],
    generate: numberSeries,
  },
  {
    slug: "letter-series",
    title: "Letter Series",
    description: "Next letter or pair: fixed jumps, opposite pairs and growing gaps.",
    icon: ListOrdered,
    tips: ["Turn letters into numbers, solve it as a number series"],
    generate: letterSeries,
  },
  {
    slug: "number-analogy",
    title: "Number Analogy",
    description: "a : b :: c : ? with squares, cubes and their neighbours.",
    icon: Scale,
    tips: ["Test n², n³, n² ± 1, 2n + 1 and n(n + 1) on the first pair"],
    generate: numberAnalogy,
  },
  {
    slug: "odd-one-out",
    title: "Odd One Out",
    description: "Three numbers share a property: squares, primes, cubes or multiples.",
    icon: Shapes,
    tips: ["Squares up to 30² and cubes up to 10³ make this instant"],
    generate: oddOneOut,
  },
  {
    slug: "mixed",
    title: "Mixed Drill",
    description: "Everything above, shuffled, like the real section.",
    icon: Shuffle,
    tips: ["Read the question type first, then apply its trick"],
    generate: mixedReasoning,
  },
];

export function drillBySlug(slug: string): ReasoningDrill | undefined {
  return REASONING_DRILLS.find((d) => d.slug === slug);
}

/** Cards for the hub page. */
export const REASONING_DRILL_CARDS: SectionCardProps[] = REASONING_DRILLS.map((d) => ({
  title: d.title,
  description: d.description,
  icon: <d.icon className="w-5 h-5" strokeWidth={2} />,
  buttonText: "Start",
  meta: "60 seconds",
  linkTo: `${REASONING_DRILLS_HREF}/${d.slug}`,
  colorTheme: SUBJECT_HUE.reasoning,
}));
