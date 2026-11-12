"use client";

import { ArrowRight, Zap, BookOpen, Target, BrainCircuit, Layers } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { subjectTheme, type SubjectKey } from "@/lib/subject-theme";

const SYLLABUS_SECTIONS = [
  {
    id: "quant",
    title: "Quantitative Aptitude",
    icon: Zap,
    badge: "25 Qs / 50 Marks",
    desc: "Speed, accuracy, and shortcut mechanics across Arithmetic & Advanced Mathematics.",
    topics: [
      { name: "Number Systems & Divisibility", weight: "High" },
      { name: "Percentages, Profit, Loss & Discount", weight: "High" },
      { name: "Ratio, Proportion & Partnerships", weight: "Medium" },
      { name: "Time, Work & Pipes/Cisterns", weight: "High" },
      { name: "Speed, Time, Distance & Trains", weight: "High" },
      { name: "Simple & Compound Interest", weight: "Medium" },
      { name: "Algebra & Polynomial Identities", weight: "High" },
      { name: "Geometry & Coordinate Geometry", weight: "High" },
      { name: "Trigonometry & Heights/Distances", weight: "High" },
      { name: "Mensuration (2D & 3D Solids)", weight: "High" },
      { name: "Data Interpretation (DI)", weight: "Medium" },
    ],
  },
  {
    id: "reasoning",
    title: "General Intelligence & Reasoning",
    icon: Target,
    badge: "25 Qs / 50 Marks",
    desc: "Analytical deduction, pattern recognition, and rapid elimination techniques.",
    topics: [
      { name: "Analogy & Semantic Classification", weight: "High" },
      { name: "Coding-Decoding & Substitution", weight: "High" },
      { name: "Number & Alphabet Series", weight: "High" },
      { name: "Syllogisms & Venn Diagrams", weight: "High" },
      { name: "Blood Relations & Family Tree", weight: "Medium" },
      { name: "Direction Sense & Cardinal Positions", weight: "Medium" },
      { name: "Linear & Circular Seating Order", weight: "Medium" },
      { name: "Non-Verbal: Mirror & Paper Folding", weight: "High" },
      { name: "Embedded Figures & Cube/Dice", weight: "Medium" },
    ],
  },
  {
    id: "english",
    title: "English Comprehension",
    icon: BookOpen,
    badge: "25 Qs / 50 Marks",
    desc: "Vocabulary mastery, grammar rules, active recall flashcards, and reading passages.",
    topics: [
      { name: "One Word Substitution (OWS)", weight: "High" },
      { name: "Idioms & Phrasal Verbs", weight: "High" },
      { name: "Repeated Synonyms & Antonyms", weight: "High" },
      { name: "Spotting Errors & Sentence Correction", weight: "High" },
      { name: "Active / Passive Voice Rules", weight: "High" },
      { name: "Direct & Indirect Narration", weight: "High" },
      { name: "Cloze Test & Passage Reading", weight: "High" },
      { name: "Spelling Correction (Common Traps)", weight: "Medium" },
    ],
  },
  {
    id: "gk",
    title: "General Awareness & Static GK",
    icon: BrainCircuit,
    badge: "25 Qs / 50 Marks",
    desc: "High-yield Indian Polity, History, Geography, Science, and recurring Static GK facts.",
    topics: [
      { name: "Indian Polity (Articles, Amendments, Acts)", weight: "High" },
      { name: "Ancient, Medieval & Modern History", weight: "High" },
      { name: "Geography: Rivers, Dams, Mountains, Biospheres", weight: "High" },
      { name: "Indian Economy, Five Year Plans & Budget", weight: "Medium" },
      { name: "General Science (Bio, Chem, Physics)", weight: "High" },
      { name: "Art, Classical Dances, Festivals & Awards", weight: "High" },
      { name: "Static GK: Books, Authors, Days & Capitals", weight: "Medium" },
    ],
  },
];

/* ─── Aspirant FAQs ─── */

const SUBJECT_OF: Record<string, SubjectKey> = { quant: "maths", reasoning: "reasoning", english: "english", gk: "gk" };

export default function SyllabusMatrixSection() {
  const [selectedSection, setSelectedSection] = useState("quant");
  const section = SYLLABUS_SECTIONS.find((s) => s.id === selectedSection) || SYLLABUS_SECTIONS[0];
  const Icon = section.icon;
  const theme = subjectTheme(SUBJECT_OF[section.id] ?? "maths");

  return (
    <section className="w-full py-12 sm:py-20 relative z-10 bg-background border-t-2 border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full surface-card text-xs sm:text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 font-mono">
            <Layers className="w-3.5 h-3.5 text-brand-500" /> Complete Exam Blueprint
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            Syllabus &amp; Weightage Breakdown
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            The main chapters of each Tier 1 section and how often they come up.
          </p>
        </div>

        {/* 4 Section Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {SYLLABUS_SECTIONS.map((sec) => {
            const SIcon = sec.icon;
            const isSelected = sec.id === selectedSection;
            const tabTheme = subjectTheme(SUBJECT_OF[sec.id] ?? "maths");
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSection(sec.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold font-mono transition-all border-2 cursor-pointer ${
                  isSelected
                    ? `${tabTheme.solid} font-black`
                    : "bg-card border-border/40 text-foreground/80 hover:bg-card hover:text-foreground"
                }`}
              >
                <SIcon className="w-4 h-4" />
                <span>{sec.title.split(" ")[0]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-sans ${isSelected ? "bg-white/20 text-white font-bold" : "bg-muted text-muted-foreground"}`}>
                  {sec.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Section Header & Topics Grid */}
        <div className="surface-card rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b-2 border-border/40">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-border shadow-inner ${theme.iconWrap}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                  {section.title}
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border-2 ${theme.chip}`}>
                    {section.badge}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{section.desc}</p>
              </div>
            </div>

            <Link href={`/SSC/${SUBJECT_OF[section.id] ?? "maths"}/topic-pyqs`} className="shrink-0">
              <button className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-xs font-mono font-bold transition-all cursor-pointer ${theme.chip}`}>
                <span>Practice {section.title.split(" ")[0]} PYQs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {section.topics.map((t, idx) => (
              <div
                key={idx}
                className={`p-3.5 sm:p-4 rounded-2xl surface-card transition-all flex items-center justify-between gap-3 group ${theme.hoverBorder}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${theme.dot}`} />
                  <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                    {t.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 font-mono">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border-2 ${
                      t.weight === "High"
                        ? theme.chip
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {t.weight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

