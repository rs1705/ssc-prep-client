"use client";

import Link from "next/link";
import { 
  ArrowRight, Brain, Zap, BookOpen, Target, Gamepad2, BarChart3, Rocket, 
  XCircle, CheckCircle2, Check, Flame, Activity, Map, Dumbbell, Trophy, 
  ChevronDown, Heart, Scale, RefreshCw, Crosshair, Tag, ScrollText, 
  LayoutDashboard, BrainCircuit, Sparkles, Timer, RotateCw, CheckCircle,
  Award, TrendingUp, Compass, ChevronRight, HelpCircle, Layers, FileText,
  Lightbulb, ShieldCheck
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { 
  motion, useMotionValue, useTransform, animate, useInView, useSpring, 
  useMotionTemplate, Variants, useScroll, AnimatePresence 
} from "framer-motion";
import confetti from "canvas-confetti";
import { useAuth } from "@/context/auth";

/* ─── Snappy Spring & Ease Presets ─── */
const SNAPPY_SPRING = { type: "spring", stiffness: 400, damping: 28 } as const;
const SNAPPY_EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Typewriter Shimmer Headline ─── */
const WORDS = ["Dominating.", "Outranking.", "Excelling.", "Conquering."];

function TypewriterHeroText() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = WORDS[wordIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % WORDS.length);
      timeout = setTimeout(() => {}, 350);
    } else {
      const nextCharCount = isDeleting ? text.length - 1 : text.length + 1;
      const delta = isDeleting ? 50 : 95;
      timeout = setTimeout(() => {
        setText(currentWord.substring(0, nextCharCount));
      }, delta);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  return (
    <span className="inline-flex items-baseline min-h-[1.1em]">
      <span
        className="bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer inline-block"
        style={{ 
          backgroundImage: "linear-gradient(90deg, #f59e0b, #f97316, #f43f5e, #f97316, #f59e0b, #f97316, #f43f5e, #f97316, #f59e0b)" 
        }}
      >
        {text || "\u00A0"}
      </span>
      <span
        className="inline-block w-[3px] sm:w-[4px] md:w-[5px] h-[0.82em] bg-gradient-to-b from-amber-500 via-orange-500 to-rose-500 ml-1.5 translate-y-[2px] rounded-full shrink-0 shadow-sm shadow-amber-500/50 animate-[cursor-blink_0.9s_step-end_infinite]"
      />
    </span>
  );
}

/* ─── Snappy Animated Counter ─── */
function AnimatedCounter({ 
  target, 
  suffix = "", 
  prefix = "", 
  className = "", 
  delay = 0, 
  duration = 1.0 
}: { 
  target: number; 
  suffix?: string; 
  prefix?: string; 
  className?: string; 
  delay?: number; 
  duration?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, { duration, ease: SNAPPY_EASE, delay });
      return controls.stop;
    }
  }, [isInView, count, target, delay, duration]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}

/* ─── Exam Categories Selector ─── */
const EXAM_OPTIONS = [
  { id: "cgl", label: "SSC CGL", icon: Trophy },
  { id: "chsl", label: "SSC CHSL", icon: Target },
  { id: "cpo", label: "SSC CPO", icon: Compass },
  { id: "mts", label: "SSC MTS", icon: Dumbbell },
  { id: "gd", label: "SSC GD", icon: Award },
];

/* ─── Speed Sprint Demo Questions (7 Varied Categories) ─── */
const SPRINT_QUESTIONS = [
  {
    level: "Rapid Multiplication",
    tag: "Level 1",
    num1: "48",
    op: "×",
    num2: "7",
    answer: 336,
    options: [326, 336, 346, 356],
    tip: "Shortcut: (50 − 2) × 7 = 350 − 14 = 336",
  },
  {
    level: "Fast Squaring",
    tag: "Level 2",
    num1: "65",
    op: "²",
    num2: "",
    answer: 4225,
    options: [4125, 4225, 4275, 4325],
    tip: "Ends in 5: (6 × 7) = 42, append 25 = 4225",
  },
  {
    level: "Mental Percentage",
    tag: "Level 3",
    num1: "15%",
    op: "of",
    num2: "240",
    answer: 36,
    options: [32, 34, 36, 38],
    tip: "Shortcut: 10% is 24 + 5% is 12 = 36",
  },
  {
    level: "Rapid Subtraction",
    tag: "Level 4",
    num1: "1000",
    op: "−",
    num2: "374",
    answer: 626,
    options: [616, 626, 636, 726],
    tip: "All from 9, last from 10: 9-3=6, 9-7=2, 10-4=6 = 626",
  },
  {
    level: "Multiply by 11",
    tag: "Level 5",
    num1: "74",
    op: "×",
    num2: "11",
    answer: 814,
    options: [804, 814, 824, 714],
    tip: "Shortcut: 7 _ 4, sum 7+4=11 -> carry 1 into 7 = 814",
  },
  {
    level: "Cube Shortcuts",
    tag: "Level 6",
    num1: "13",
    op: "³",
    num2: "",
    answer: 2197,
    options: [2187, 2197, 2287, 2297],
    tip: "Frequent SSC cube: 13³ = 2,197",
  },
  {
    level: "Rapid Division",
    tag: "Level 7",
    num1: "504",
    op: "÷",
    num2: "7",
    answer: 72,
    options: [68, 72, 74, 78],
    tip: "Shortcut: 490 ÷ 7 = 70, 14 ÷ 7 = 2 -> 70 + 2 = 72",
  },
];

/* ─── High-Yield Flashcard Demos with Authentic SSC Content ─── */
const FLASHCARD_DEMOS = [
  {
    type: "vocab" as const,
    category: "SSC English Vocab",
    subtag: "High-Frequency Tier 1 Word",
    word: "Ephemeral",
    phonetic: "/ɪˈfɛm(ə)rəl/ • Adjective",
    definition: "Lasting for a very short time; transient or fleeting.",
    example: '"Fame in the digital age is often ephemeral."',
    examReference: "Appeared in CGL 2022, CHSL 2023",
    synonyms: ["Transient", "Fleeting", "Evanescent", "Momentary"],
    antonyms: ["Permanent", "Eternal", "Perpetual", "Enduring"]
  },
  {
    type: "idiom" as const,
    category: "Idioms & Phrases",
    subtag: "Previous Year Question",
    word: "Spill the beans",
    phonetic: "Idiom • Common Phrasal Meaning",
    definition: "To disclose confidential or secret information prematurely or indiscreetly.",
    example: '"Trusting him with the surprise plan was a mistake; he spilled the beans."',
    examReference: "SSC CGL 2023 Tier 1 (Shift 2)",
    related: ["Let the cat out of the bag", "Blow the gaff", "Divulge secret"],
    origin: "Ancient Greek voting system with colored beans"
  },
  {
    type: "polity" as const,
    category: "Indian Polity & Constitution",
    subtag: "Fundamental Rights (Part III)",
    word: "Article 32 — Constitutional Remedies",
    phonetic: "Supreme Court Writ Jurisdiction",
    definition: "Empowers citizens to move the Supreme Court directly for enforcement of Fundamental Rights via 5 Prerogative Writs.",
    example: "Habeas Corpus, Mandamus, Prohibition, Quo-Warranto & Certiorari.",
    examReference: "SSC CGL 2021, 2023 & CPO 2024",
    landmarkNote: "Dr. B.R. Ambedkar called Article 32 the 'Heart and Soul of the Constitution'.",
    scope: "Direct SC access without exhausting High Court remedies"
  },
  {
    type: "history" as const,
    category: "Medieval Indian History",
    subtag: "Key Battles & Treaties",
    word: "Battle of Chausa (1539 CE)",
    phonetic: "Sher Shah Suri vs Humayun",
    definition: "Decisive military engagement fought near Buxar, Bihar between Sher Khan (Sher Shah Suri) and Mughal Emperor Humayun.",
    example: "Humayun was defeated and escaped across the Ganges with the help of a water-carrier (Nizam).",
    examReference: "SSC MTS 2023 & CHSL 2024",
    impact: "Sher Khan assumed the royal title 'Farid al-Din Sher Shah'.",
    sequel: "Led to the Battle of Kannauj (1540 CE) and the establishment of the Sur Empire."
  }
];

/* ─── Comprehensive SSC Syllabus Matrix ─── */
const SYLLABUS_SECTIONS = [
  {
    id: "quant",
    title: "Quantitative Aptitude",
    icon: Zap,
    color: "text-amber-500",
    badge: "25 Qs / 50 Marks",
    desc: "Speed, accuracy, and shortcut mechanics across Arithmetic & Advanced Mathematics.",
    topics: [
      { name: "Number Systems & Divisibility", weight: "High", pyqs: "850+ Qs" },
      { name: "Percentages, Profit, Loss & Discount", weight: "High", pyqs: "1,240+ Qs" },
      { name: "Ratio, Proportion & Partnerships", weight: "Medium", pyqs: "620+ Qs" },
      { name: "Time, Work & Pipes/Cisterns", weight: "High", pyqs: "780+ Qs" },
      { name: "Speed, Time, Distance & Trains", weight: "High", pyqs: "810+ Qs" },
      { name: "Simple & Compound Interest", weight: "Medium", pyqs: "540+ Qs" },
      { name: "Algebra & Polynomial Identities", weight: "High", pyqs: "920+ Qs" },
      { name: "Geometry & Coordinate Geometry", weight: "High", pyqs: "1,150+ Qs" },
      { name: "Trigonometry & Heights/Distances", weight: "High", pyqs: "980+ Qs" },
      { name: "Mensuration (2D & 3D Solids)", weight: "High", pyqs: "890+ Qs" },
      { name: "Data Interpretation (DI)", weight: "Medium", pyqs: "650+ Qs" },
    ],
  },
  {
    id: "reasoning",
    title: "General Intelligence & Reasoning",
    icon: Target,
    color: "text-blue-500",
    badge: "25 Qs / 50 Marks",
    desc: "Analytical deduction, pattern recognition, and rapid elimination techniques.",
    topics: [
      { name: "Analogy & Semantic Classification", weight: "High", pyqs: "940+ Qs" },
      { name: "Coding-Decoding & Substitution", weight: "High", pyqs: "820+ Qs" },
      { name: "Number & Alphabet Series", weight: "High", pyqs: "1,050+ Qs" },
      { name: "Syllogisms & Venn Diagrams", weight: "High", pyqs: "760+ Qs" },
      { name: "Blood Relations & Family Tree", weight: "Medium", pyqs: "480+ Qs" },
      { name: "Direction Sense & Cardinal Positions", weight: "Medium", pyqs: "390+ Qs" },
      { name: "Linear & Circular Seating Order", weight: "Medium", pyqs: "410+ Qs" },
      { name: "Non-Verbal: Mirror & Paper Folding", weight: "High", pyqs: "890+ Qs" },
      { name: "Embedded Figures & Cube/Dice", weight: "Medium", pyqs: "530+ Qs" },
    ],
  },
  {
    id: "english",
    title: "English Comprehension",
    icon: BookOpen,
    color: "text-emerald-500",
    badge: "25 Qs / 50 Marks",
    desc: "Vocabulary mastery, grammar rules, active recall flashcards, and reading passages.",
    topics: [
      { name: "One Word Substitution (OWS)", weight: "High", pyqs: "1,120+ Qs" },
      { name: "Idioms & Phrasal Verbs", weight: "High", pyqs: "980+ Qs" },
      { name: "Repeated Synonyms & Antonyms", weight: "High", pyqs: "1,450+ Qs" },
      { name: "Spotting Errors & Sentence Correction", weight: "High", pyqs: "1,280+ Qs" },
      { name: "Active / Passive Voice Rules", weight: "High", pyqs: "720+ Qs" },
      { name: "Direct & Indirect Narration", weight: "High", pyqs: "690+ Qs" },
      { name: "Cloze Test & Passage Reading", weight: "High", pyqs: "860+ Qs" },
      { name: "Spelling Correction (Common Traps)", weight: "Medium", pyqs: "510+ Qs" },
    ],
  },
  {
    id: "gk",
    title: "General Awareness & Static GK",
    icon: BrainCircuit,
    color: "text-violet-500",
    badge: "25 Qs / 50 Marks",
    desc: "High-yield Indian Polity, History, Geography, Science, and recurring Static GK facts.",
    topics: [
      { name: "Indian Polity (Articles, Amendments, Acts)", weight: "High", pyqs: "890+ Qs" },
      { name: "Ancient, Medieval & Modern History", weight: "High", pyqs: "1,150+ Qs" },
      { name: "Geography: Rivers, Dams, Mountains, Biospheres", weight: "High", pyqs: "920+ Qs" },
      { name: "Indian Economy, Five Year Plans & Budget", weight: "Medium", pyqs: "610+ Qs" },
      { name: "General Science (Bio, Chem, Physics)", weight: "High", pyqs: "1,340+ Qs" },
      { name: "Art, Classical Dances, Festivals & Awards", weight: "High", pyqs: "880+ Qs" },
      { name: "Static GK: Books, Authors, Days & Capitals", weight: "Medium", pyqs: "730+ Qs" },
    ],
  },
];

/* ─── Aspirant FAQs ─── */
const SSC_FAQS = [
  {
    question: "Are these authentic TCS-pattern previous year questions?",
    answer: "Yes, 100%. Every single question in PrepPilot is extracted directly from official SSC CGL, CHSL, CPO, MTS, and GD shift answer keys (2020 through 2025). We rigorously OCR-scan, verify, taxonomy-tag, and format each question with step-by-step solutions."
  },
  {
    question: "How does the Mental Maths Arena help me score higher in Quant?",
    answer: "SSC Tier 1 requires solving 25 Quant questions in roughly 15–18 minutes. Writing manual scratch work for basic calculations (like 65², 15% of 240, or 74 × 11) bleeds 3–5 seconds per question. Our timed calculation arena builds instant calculation reflex so you finish the Quant section with minutes to spare."
  },
  {
    question: "How do Smart Flashcards work for English Vocab and Static GK?",
    answer: "Instead of rereading static PDF lists, Flashcards use spaced repetition (active recall). When you review high-frequency words, idioms, or polity articles, the algorithm schedules your next review (12 hours, 3 days, or 8 days) based on whether you found the item hard or easy. This cements facts into long-term memory."
  },
  {
    question: "How does PrepPilot differ from regular test series or PDF compilations?",
    answer: "PDF compilations are passive and static. Generic test series only tell you your overall score at the end. PrepPilot diagnoses your exact mark-bleed topics in real-time (e.g., 'You lose 2.5 marks on Geometry chords and spend 80s on simple ratio questions') and immediately gives you targeted 5-minute drill sets to fix them."
  },
  {
    question: "Can I practice on mobile phones and tablets?",
    answer: "Yes! PrepPilot is designed with a zero-lag responsive layout. All drills, speed calculation sprints, flashcards, and PYQ tests run seamlessly on all mobile screens with zero performance drops."
  }
];

/* ─── Scroll-Driven Timeline Line ─── */
function ScrollTimelineLine() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 60%"]
  });

  return (
    <div ref={ref} className="absolute top-12 md:top-20 bottom-12 md:bottom-20 left-[23.5px] md:left-1/2 md:-ml-[1.5px] w-[2px] md:w-[3px] z-0 bg-border/40 rounded-full overflow-hidden">
      <motion.div 
        className="w-full h-full origin-top bg-gradient-to-b from-amber-500 via-orange-500 to-amber-500"
        style={{ scaleY: scrollYProgress }}
      />
    </div>
  );
}

/* ─── Timeline Icon ─── */
function TimelineIcon({ children, baseClass, activeClass }: { children: React.ReactNode, baseClass: string, activeClass: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -40% 0px" });

  return (
    <div 
      ref={ref} 
      className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full border-4 border-background ring-2 flex items-center justify-center relative z-10 transition-all duration-400 group-hover:scale-110 group-hover:shadow-lg
        ${isInView ? activeClass : `bg-background ${baseClass}`}
      `}
    >
      {children}
    </div>
  );
}

/* ─── Lightweight Responsive Card (Zero Mobile Lag) ─── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-2xl transition-all duration-300 md:hover:-translate-y-1 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Interactive Hero Live Dashboard (3 Modes) ─── */
function InteractiveHeroDashboard() {
  const [activeTab, setActiveTab] = useState<"analytics" | "maths" | "flashcards">("analytics");
  
  // Maths Sprint State
  const [currentSprintIndex, setCurrentSprintIndex] = useState(0);
  const [selectedMathAnswer, setSelectedMathAnswer] = useState<number | null>(null);
  const [mathSolved, setMathSolved] = useState(false);
  const [sprintStreak, setSprintStreak] = useState(0);

  const currentQ = SPRINT_QUESTIONS[currentSprintIndex];

  const handleMathChoice = (val: number) => {
    setSelectedMathAnswer(val);
    if (val === currentQ.answer) {
      setMathSolved(true);
      setSprintStreak((s) => s + 1);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#3b82f6"]
      });
    }
  };

  const nextSprintQuestion = () => {
    setSelectedMathAnswer(null);
    setMathSolved(false);
    setCurrentSprintIndex((prev) => (prev + 1) % SPRINT_QUESTIONS.length);
  };

  const resetMathDemo = () => {
    setSelectedMathAnswer(null);
    setMathSolved(false);
  };

  // Flashcard State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [ratedInterval, setRatedInterval] = useState<string | null>(null);

  const currentCard = FLASHCARD_DEMOS[currentCardIndex];

  const handleRating = (interval: string) => {
    setRatedInterval(interval);
    setTimeout(() => {
      setCardFlipped(false);
      setRatedInterval(null);
      setCurrentCardIndex((prev) => (prev + 1) % FLASHCARD_DEMOS.length);
    }, 1400);
  };

  return (
    <div className="w-full relative">
      {/* Background Glow — Desktop only */}
      <div className="hidden md:block absolute -inset-10 bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-amber-500/15 blur-[90px] rounded-full pointer-events-none" />

      {/* Floating Ambient Badges */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-amber-500/30 shadow-xl shadow-amber-500/10 absolute -top-5 -left-6 z-30 font-mono text-xs font-bold text-foreground"
      >
        <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
        <span>14-Day Streak 🔥</span>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-emerald-500/30 shadow-xl shadow-emerald-500/10 absolute -bottom-4 -right-6 z-30 font-mono text-xs font-bold text-foreground"
      >
        <TrendingUp className="w-4 h-4 text-emerald-500" />
        <span>+18 Marks in Quant 📈</span>
      </motion.div>

      {/* Main Glassmorphic Window */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-amber-500/25 bg-card/95 md:bg-card/60 backdrop-blur-none md:backdrop-blur-2xl overflow-hidden shadow-2xl shadow-amber-500/10 flex flex-col">
        
        {/* Window Chrome Header & Interactive Tabs */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 border-b border-border/40 bg-background/40">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] font-mono font-semibold text-muted-foreground ml-2 hidden sm:inline">preppilot.live/demo</span>
          </div>

          {/* Interactive Mode Pills */}
          <div className="flex items-center gap-1 bg-background/80 p-1 rounded-xl border border-border/40 shadow-inner">
            {[
              { id: "analytics", label: "AI Analytics", icon: BarChart3 },
              { id: "maths", label: "Maths Sprint", icon: Zap },
              { id: "flashcards", label: "Flashcards", icon: Brain },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    isActive 
                      ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE SIMULATION
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 min-h-[300px] sm:min-h-[360px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* ─── 1. Analytics Tab ─── */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: SNAPPY_EASE }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {/* Column 1: Sectional Split */}
                <div className="rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5 text-amber-500" /> Sectional Accuracy
                    </span>
                    <span className="text-[9px] font-mono bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold">Today</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Quantitative Aptitude", val: 92, color: "bg-emerald-500" },
                      { label: "General Intelligence", val: 88, color: "bg-amber-500" },
                      { label: "English Comprehension", val: 76, color: "bg-violet-500" },
                      { label: "General Awareness", val: 64, color: "bg-rose-500" }
                    ].map((s, i) => (
                      <div key={s.label}>
                        <div className="flex justify-between text-[10px] font-mono font-bold mb-1">
                          <span className="text-foreground/70">{s.label}</span>
                          <span className="text-foreground">{s.val}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-border/40 overflow-hidden">
                          <motion.div 
                            className={`h-full rounded-full ${s.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${s.val}%` }}
                            transition={{ duration: 0.8, ease: SNAPPY_EASE, delay: i * 0.08 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Accuracy Trend */}
                <div className="rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-amber-500" /> 7-Shift Mastery Curve
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">+32% Net Trajectory</span>
                  </div>

                  <div className="w-full h-32 relative mt-1 select-none">
                    <svg className="w-full h-full" viewBox="0 0 280 110" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                          <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.03" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Graph Lines (Gridlines) */}
                      {[
                        { y: 14, label: "95%" },
                        { y: 38, label: "85%" },
                        { y: 62, label: "75%" },
                        { y: 86, label: "65%" },
                      ].map((grid) => (
                        <g key={grid.y}>
                          <text 
                            x="2" 
                            y={grid.y + 3} 
                            className="fill-muted-foreground/60 text-[7px] font-mono font-bold"
                          >
                            {grid.label}
                          </text>
                          <line 
                            x1="24" 
                            y1={grid.y} 
                            x2="276" 
                            y2={grid.y} 
                            stroke="currentColor" 
                            className="stroke-border/40" 
                            strokeDasharray="3 3" 
                            strokeWidth="0.8" 
                          />
                        </g>
                      ))}

                      {/* Vertical Shift Gridlines */}
                      {[32, 72, 112, 152, 192, 232, 270].map((x) => (
                        <line 
                          key={x} 
                          x1={x} 
                          y1="10" 
                          x2={x} 
                          y2="96" 
                          stroke="currentColor" 
                          className="stroke-border/20" 
                          strokeDasharray="2 3" 
                          strokeWidth="0.7" 
                        />
                      ))}

                      {/* Realistic Area Fill with Ups & Dips */}
                      <path 
                        fill="url(#trendAreaGrad)" 
                        d="M 32 93 L 72 59 L 112 78 L 152 40 L 192 55 L 232 28 L 270 16 L 270 96 L 32 96 Z" 
                      />

                      {/* Realistic Trend Line with Fluctuations */}
                      <motion.path 
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M 32 93 L 72 59 L 112 78 L 152 40 L 192 55 L 232 28 L 270 16"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, ease: SNAPPY_EASE }}
                      />

                      {/* Data Point Nodes with Tooltips */}
                      {[
                        { shift: "Shift 1", val: "62%", x: 32, y: 93 },
                        { shift: "Shift 2", val: "76%", x: 72, y: 59 },
                        { shift: "Shift 3", val: "68%", x: 112, y: 78, isDip: true },
                        { shift: "Shift 4", val: "84%", x: 152, y: 40 },
                        { shift: "Shift 5", val: "78%", x: 192, y: 55, isDip: true },
                        { shift: "Shift 6", val: "89%", x: 232, y: 28 },
                        { shift: "Shift 7", val: "94%", x: 270, y: 16, isPeak: true },
                      ].map((pt, i, arr) => {
                        const isLatest = i === arr.length - 1;
                        return (
                          <g key={i} className="group/dot cursor-pointer">
                            {isLatest && (
                              <circle cx={pt.x} cy={pt.y} r="7" fill="#f59e0b" opacity="0.3" className="animate-ping" />
                            )}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isLatest ? "4.5" : "3"}
                              className="fill-background"
                              stroke={pt.isDip ? "#f43f5e" : "#f59e0b"}
                              strokeWidth="2"
                            />
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="1.5"
                              fill={pt.isDip ? "#f43f5e" : "#f59e0b"}
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-muted-foreground mt-1 px-1">
                    <span>Shift 1 (62%)</span>
                    <span className="text-rose-400 font-semibold">Shift 3 (68% Dip)</span>
                    <span className="text-rose-400 font-semibold">Shift 5 (78%)</span>
                    <span className="text-amber-500 font-bold">Shift 7 (94% Peak)</span>
                  </div>
                </div>

                {/* Column 3: Overall Rank Metric */}
                <div className="rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground mb-3 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-amber-500" /> Overall Accuracy
                  </span>
                  <div className="relative w-24 h-24 rounded-full bg-muted/40 flex items-center justify-center mb-3">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" fill="none" className="stroke-border/50" strokeWidth="8" />
                      <motion.circle 
                        cx="50" cy="50" r="44" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 0.86 }}
                        transition={{ duration: 1.2, ease: SNAPPY_EASE }}
                      />
                    </svg>
                    <span className="text-2xl font-black font-mono text-foreground">86%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <div className="bg-card/60 rounded p-1.5 border border-border/30">
                      <div className="text-xs font-black font-mono text-foreground">164.5</div>
                      <div className="text-[7px] font-mono uppercase text-muted-foreground">Proj. Score</div>
                    </div>
                    <div className="bg-card/60 rounded p-1.5 border border-border/30">
                      <div className="text-xs font-black font-mono text-amber-500">42s</div>
                      <div className="text-[7px] font-mono uppercase text-muted-foreground">Avg / Q</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── 2. Mental Maths Sprint Tab ─── */}
            {activeTab === "maths" && (
              <motion.div
                key={`maths-${currentSprintIndex}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: SNAPPY_EASE }}
                className="max-w-xl mx-auto w-full flex flex-col items-center text-center p-2"
              >
                {/* Header with question indicators and streak */}
                <div className="flex flex-wrap items-center justify-between gap-2 w-full mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} /> Speed Sprint
                    </span>
                    <span className="text-xs font-mono text-muted-foreground hidden sm:inline">{currentQ.level}</span>
                  </div>

                  {/* Question Pills */}
                  <div className="flex items-center gap-1 bg-background/60 p-1 rounded-xl border border-border/30">
                    {SPRINT_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentSprintIndex(idx);
                          setSelectedMathAnswer(null);
                          setMathSolved(false);
                        }}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                          currentSprintIndex === idx
                            ? "bg-amber-500 text-zinc-950 font-black shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  {sprintStreak > 0 && (
                    <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                      🔥 {sprintStreak}
                    </span>
                  )}
                </div>

                {/* Question Expression */}
                <div className="text-3xl sm:text-4xl font-black font-mono text-foreground my-3 tracking-wider flex items-center justify-center gap-3 min-h-[48px]">
                  <span>{currentQ.num1}</span>
                  {currentQ.op && <span className="text-amber-500">{currentQ.op}</span>}
                  {currentQ.num2 && <span>{currentQ.num2}</span>}
                  <span className="text-muted-foreground">=</span>
                  <span className="text-amber-500 underline decoration-dashed underline-offset-8">
                    {selectedMathAnswer !== null ? selectedMathAnswer : "?"}
                  </span>
                </div>

                {/* Choices */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mt-2">
                  {currentQ.options.map((option) => {
                    const isSelected = selectedMathAnswer === option;
                    const isCorrect = option === currentQ.answer;
                    let btnStyle = "bg-background/80 hover:bg-card border-border/50 text-foreground";
                    
                    if (isSelected) {
                      btnStyle = isCorrect 
                        ? "bg-emerald-500 text-zinc-950 border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105" 
                        : "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30";
                    }

                    return (
                      <motion.button
                        key={option}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleMathChoice(option)}
                        className={`py-3 rounded-xl border text-base font-mono font-black transition-all ${btnStyle}`}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Feedback message & Next Drill */}
                {mathSolved && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono w-full bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400 font-bold"
                  >
                    <div className="flex items-center gap-2 text-left">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div>Correct! +15 Elo points gained.</div>
                        <div className="text-[10px] text-muted-foreground font-normal">{currentQ.tip}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={resetMathDemo} 
                        className="px-2 py-1 rounded bg-background/60 text-foreground hover:text-amber-400 flex items-center gap-1 text-[11px]"
                      >
                        <RotateCw className="w-3 h-3" /> Retry
                      </button>
                      <button 
                        onClick={nextSprintQuestion} 
                        className="px-3 py-1 rounded bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 flex items-center gap-1 text-[11px] shadow-sm"
                      >
                        Next Drill <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                )}
                {!mathSolved && (
                  <p className="text-[11px] text-muted-foreground mt-3 font-mono">
                    💡 Click the correct answer to experience the instant feedback loop. (Question {currentSprintIndex + 1} of {SPRINT_QUESTIONS.length})
                  </p>
                )}
              </motion.div>
            )}

            {/* ─── 3. Flashcard Tab ─── */}
            {activeTab === "flashcards" && (
              <motion.div
                key={`flashcards-${currentCardIndex}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: SNAPPY_EASE }}
                className="max-w-xl mx-auto w-full flex flex-col items-center p-1 sm:p-2"
              >
                {/* Header with Card Topic Selector */}
                <div className="flex flex-wrap items-center justify-between gap-2 w-full mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5" /> Spaced Recall
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                      {currentCard.category}
                    </span>
                  </div>

                  {/* 4 Card Selector Pills */}
                  <div className="flex items-center gap-1 bg-background/60 p-1 rounded-xl border border-border/30">
                    {FLASHCARD_DEMOS.map((card, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentCardIndex(idx);
                          setCardFlipped(false);
                          setRatedInterval(null);
                        }}
                        className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                          currentCardIndex === idx
                            ? "bg-violet-500 text-white font-black shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                        }`}
                      >
                        Deck {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3D Flip Card */}
                <div 
                  onClick={() => setCardFlipped(!cardFlipped)}
                  className="w-full min-h-[190px] sm:min-h-[200px] rounded-2xl bg-background/80 border-2 border-violet-500/30 p-5 sm:p-6 flex flex-col justify-between cursor-pointer hover:border-violet-500/60 transition-all shadow-xl shadow-violet-500/10 relative group select-none"
                >
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded font-bold">
                        {currentCard.subtag}
                      </span>
                      <span className="text-[9px] text-amber-500/90 hidden sm:inline">
                        • {currentCard.examReference}
                      </span>
                    </div>
                    <span className="group-hover:text-foreground transition-colors flex items-center gap-1 text-violet-400 font-bold">
                      <RotateCw className="w-3 h-3" /> {cardFlipped ? "Flip to Front" : "Tap to Reveal"}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center text-center my-3">
                    {!cardFlipped ? (
                      <div>
                        <div className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                          {currentCard.word}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 font-mono italic">
                          {currentCard.phonetic}
                        </div>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-1 text-left sm:text-center w-full">
                        <div className="text-xs sm:text-sm font-bold text-emerald-400 leading-relaxed mb-2">
                          {currentCard.definition}
                        </div>
                        <div className="text-[11px] text-foreground/80 italic mb-2.5">
                          {currentCard.example}
                        </div>

                        {/* Subject-Specific Metadata Box */}
                        {currentCard.type === "vocab" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] font-mono bg-card/60 p-2.5 rounded-xl border border-border/30">
                            <div>
                              <span className="text-emerald-400 font-bold">Synonyms: </span>
                              <span className="text-muted-foreground">{currentCard.synonyms.join(", ")}</span>
                            </div>
                            <div>
                              <span className="text-rose-400 font-bold">Antonyms: </span>
                              <span className="text-muted-foreground">{currentCard.antonyms.join(", ")}</span>
                            </div>
                          </div>
                        )}

                        {currentCard.type === "idiom" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] font-mono bg-card/60 p-2.5 rounded-xl border border-border/30">
                            <div>
                              <span className="text-amber-400 font-bold">Related: </span>
                              <span className="text-muted-foreground">{currentCard.related.join(", ")}</span>
                            </div>
                            <div>
                              <span className="text-cyan-400 font-bold">Origin: </span>
                              <span className="text-muted-foreground">{currentCard.origin}</span>
                            </div>
                          </div>
                        )}

                        {currentCard.type === "polity" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] font-mono bg-card/60 p-2.5 rounded-xl border border-border/30">
                            <div className="sm:col-span-2">
                              <span className="text-amber-400 font-bold">Key Note: </span>
                              <span className="text-muted-foreground">{currentCard.landmarkNote}</span>
                            </div>
                          </div>
                        )}

                        {currentCard.type === "history" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] font-mono bg-card/60 p-2.5 rounded-xl border border-border/30">
                            <div>
                              <span className="text-amber-400 font-bold">Impact: </span>
                              <span className="text-muted-foreground">{currentCard.impact}</span>
                            </div>
                            <div>
                              <span className="text-emerald-400 font-bold">Sequel: </span>
                              <span className="text-muted-foreground">{currentCard.sequel}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  <div className="text-[9px] font-mono text-center text-muted-foreground/60">
                    {cardFlipped ? "Rate your recall ease below to adjust review schedule" : "Tap anywhere on card to reveal definition & exam notes"}
                  </div>
                </div>

                {/* Spaced Repetition Flashcard Rating Buttons */}
                {cardFlipped && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-4 gap-2 w-full mt-3"
                  >
                    {[
                      { label: "Again", time: "<1 min", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
                      { label: "Hard", time: "12 hrs", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
                      { label: "Good", time: "3 days", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
                      { label: "Easy", time: "8 days", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
                    ].map((b) => (
                      <button
                        key={b.label}
                        onClick={() => handleRating(b.label)}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-102 cursor-pointer ${b.color}`}
                      >
                        <span className="text-[11px] font-bold font-mono">{b.label}</span>
                        <span className="text-[8px] opacity-75 font-mono">{b.time}</span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {ratedInterval && (
                  <div className="mt-2 text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Scheduled next review in {ratedInterval === "Easy" ? "8 days" : ratedInterval === "Good" ? "3 days" : ratedInterval === "Hard" ? "12 hours" : "1 minute"} • Advancing to next card...
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

/* ─── Infinite Testimonials Marquee ─── */
const testimonials = [
  { name: "Rahul S.", exam: "CGL Tier 1 (168/200)", text: "The accuracy analytics completely changed how I prep. I stopped doing random mocks and focused on my weak areas." },
  { name: "Priya M.", exam: "CHSL (AIR 42)", text: "Mental maths arena is insanely addictive. I shaved 15 seconds off my average calculation time in just two weeks." },
  { name: "Vikash K.", exam: "CGL Inspector", text: "Finally an app that isn't bloated with ads. The UI is cleaner than most paid platforms. Worth every penny." },
  { name: "Anjali T.", exam: "CPO SI", text: "The spaced repetition for GK actually works. I remember obscure facts that I usually forget after two days." },
  { name: "Amit D.", exam: "MTS & GD", text: "The honest comparison is real. I deleted all my telegram PDF groups after using PrepPilot." },
];

function InfiniteTestimonials() {
  return (
    <section className="w-full py-20 relative z-10 overflow-hidden bg-background">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 font-mono">
          <Heart className="w-3 h-3 text-amber-500" /> Wall of Love
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Trusted by Top SSC Rankers</h2>
      </div>

      {/* Marquee Container */}
      <div className="relative flex overflow-x-hidden group">
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-[marquee_35s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap will-change-transform">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="inline-block w-[300px] sm:w-[380px] whitespace-normal mx-3">
              <div className="bg-card/95 md:bg-card/40 backdrop-blur-none md:backdrop-blur-md border border-border/40 rounded-2xl p-6 h-full flex flex-col relative hover:border-amber-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                      {t.name} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">{t.exam}</div>
                  </div>
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Comprehensive SSC Syllabus Matrix Section ─── */
function SyllabusMatrixSection() {
  const [selectedSection, setSelectedSection] = useState("quant");
  const section = SYLLABUS_SECTIONS.find((s) => s.id === selectedSection) || SYLLABUS_SECTIONS[0];
  const Icon = section.icon;

  return (
    <section className="w-full py-16 sm:py-24 relative z-10 bg-background/50 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 font-mono">
            <Layers className="w-3.5 h-3.5 text-amber-500" /> Complete Exam Blueprint
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            Syllabus &amp; Weightage Breakdown
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Every chapter mapped to recent TCS question frequency, topic weightages, and Tier 1 &amp; Tier 2 marks.
          </p>
        </div>

        {/* 4 Section Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {SYLLABUS_SECTIONS.map((sec) => {
            const SIcon = sec.icon;
            const isSelected = sec.id === selectedSection;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSection(sec.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold font-mono transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20 font-black"
                    : "bg-card/60 border-border/40 text-foreground/80 hover:bg-card hover:text-foreground"
                }`}
              >
                <SIcon className="w-4 h-4" />
                <span>{sec.title.split(" ")[0]}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans ${isSelected ? "bg-zinc-950/20 text-zinc-950 font-bold" : "bg-muted text-muted-foreground"}`}>
                  {sec.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Section Header & Topics Grid */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-border/40">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-inner">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                  {section.title}
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {section.badge}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{section.desc}</p>
              </div>
            </div>

            <Link href="/practice" className="shrink-0">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-mono font-bold transition-all cursor-pointer">
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
                className="p-3.5 sm:p-4 rounded-2xl bg-card/50 border border-border/40 hover:border-amber-500/30 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-amber-500 transition-colors">
                    {t.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 font-mono">
                  <span className="text-[10px] text-muted-foreground font-medium">{t.pyqs}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      t.weight === "High"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
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

/* ─── Aspirant FAQ Section ─── */
function AspirantFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-16 sm:py-24 relative z-10 bg-background">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Aspirant Knowledge Base
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base max-w-xl mx-auto font-normal leading-relaxed">
            Everything you need to know about our questions, speed training methodology, and study system.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          {SSC_FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen 
                    ? "bg-card/70 border-amber-500/30 shadow-lg shadow-amber-500/5" 
                    : "bg-card/40 border-border/40 hover:border-border/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 rounded-xl bg-card border border-border/40 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-amber-500" : "text-muted-foreground"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 text-xs sm:text-sm text-foreground/80 leading-relaxed font-normal border-t border-border/20 mt-1"
                  >
                    <p className="pt-3">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  const [selectedExam, setSelectedExam] = useState("all");
  const { user, signInWithGoogle } = useAuth();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: SNAPPY_EASE } }
  };

  /* ─── Features Arsenal with Live Mini Micro-Simulations ─── */
  const features = [
    { 
      icon: BookOpen, 
      title: "Authentic PYQ Vault", 
      desc: "Every single shift from CGL, CHSL, CPO, MTS & GD — OCR-extracted, taxonomy-tagged, and ready for drill-mode practice.",
      badge: "10,000+ Questions",
      iconBg: "bg-emerald-500/15", 
      iconText: "text-emerald-500 dark:text-emerald-400", 
      auraBg: "from-emerald-500/25 via-emerald-500/10 to-transparent",
      borderHover: "hover:border-emerald-500/40",
      preview: "OCR-scanned authentic papers"
    },
    { 
      icon: BarChart3, 
      title: "AI-Powered Analytics", 
      desc: "Pinpoint your exact weak subtopics, track accuracy trends over time, and get a personalized study roadmap — no guesswork.",
      badge: "Subtopic Heatmap",
      iconBg: "bg-cyan-500/15", 
      iconText: "text-cyan-500 dark:text-cyan-400", 
      auraBg: "from-cyan-500/25 via-cyan-500/10 to-transparent",
      borderHover: "hover:border-cyan-500/40",
      preview: "Target accuracy: 92%+"
    },
    { 
      icon: Target, 
      title: "Surgical Topic Drills", 
      desc: "Zero in on specific subtopics like Trigonometry or Cloze Tests. Our engine serves questions weighted by your weakest areas.",
      badge: "Adaptive Engine",
      iconBg: "bg-blue-500/15", 
      iconText: "text-blue-500 dark:text-blue-400", 
      auraBg: "from-blue-500/25 via-blue-500/10 to-transparent",
      borderHover: "hover:border-blue-500/40",
      preview: "Focuses on mark-bleed areas"
    },
    { 
      icon: Zap, 
      title: "Mental Maths Arena", 
      desc: "Timed calculation sprints with adaptive difficulty. Shave seconds off your per-question time — the difference between selection and waitlist.",
      badge: "Speed Training",
      iconBg: "bg-amber-500/15", 
      iconText: "text-amber-500 dark:text-amber-400", 
      auraBg: "from-amber-500/25 via-amber-500/10 to-transparent",
      borderHover: "hover:border-amber-500/40",
      preview: "Reduces per-question pace"
    },
    { 
      icon: Brain, 
      title: "Smart Flashcards", 
      desc: "Spaced-repetition memory system applied to GK facts, idioms, and high-frequency vocabulary you keep forgetting.",
      badge: "Active Recall",
      iconBg: "bg-violet-500/15", 
      iconText: "text-violet-500 dark:text-violet-400", 
      auraBg: "from-violet-500/25 via-violet-500/10 to-transparent",
      borderHover: "hover:border-violet-500/40",
      preview: "Retention rate > 94%"
    },
    { 
      icon: Gamepad2, 
      title: "Gamified Retention", 
      desc: "Crosswords, word-hunts, and contextual games that make static GK and vocabulary stick — without the burnout of rote memorization.",
      badge: "Streak Badges",
      iconBg: "bg-rose-500/15", 
      iconText: "text-rose-500 dark:text-rose-400", 
      auraBg: "from-rose-500/25 via-rose-500/10 to-transparent",
      borderHover: "hover:border-rose-500/40",
      preview: "Zero rote memorization"
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden flex flex-col items-center relative scroll-smooth">
      
      {/* ─── Ambient Glow Blobs — Lightweight on mobile, animated on desktop ─── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="hidden md:block">
          <motion.div 
            animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[12%] -left-20 w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-amber-500/30 blur-[120px] rounded-full"
          />
          <motion.div 
            animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] -right-20 w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] bg-orange-500/25 blur-[140px] rounded-full"
          />
          <motion.div 
            animate={{ y: [0, 25, 0], x: [0, -15, 0], opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[60%] left-[20%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] bg-violet-500/15 blur-[100px] rounded-full"
          />
        </div>
        {/* Zero-overhead static ambient backdrop for mobile phones */}
        <div className="block md:hidden absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,158,11,0.12),transparent_70%)]" />
        <div className="absolute inset-0 dot-grid pointer-events-none" />
      </div>

      {/* ─── Floating Pill Navbar ─── */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 z-50 sticky top-0">
        <div className="w-full px-4 sm:px-6 py-3 rounded-full bg-background/95 sm:bg-background/80 backdrop-blur-none sm:backdrop-blur-xl border border-border/40 shadow-lg shadow-black/5 flex items-center justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, x: -15 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.4, ease: SNAPPY_EASE }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md shadow-amber-500/20 flex items-center justify-center text-white shrink-0 hover:rotate-6 transition-transform">
              <Rocket className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-base sm:text-lg tracking-tight text-foreground flex items-center gap-1.5">
                PrepPilot
                <span className="text-[9px] font-mono font-bold bg-amber-500/15 text-amber-500 px-1.5 py-0.5 rounded">PRO</span>
              </div>
            </div>
          </motion.div>
          
          <motion.nav 
            initial={{ opacity: 0, x: 15 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.4, ease: SNAPPY_EASE }}
            className="flex items-center gap-2 sm:gap-3"
          >
            {user ? (
              <Link 
                href="/dashboard" 
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/60 border border-border/40 hover:bg-card text-xs font-semibold transition-all text-foreground"
              >
                Dashboard
              </Link>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/60 border border-border/40 hover:bg-card text-xs font-semibold transition-all text-foreground cursor-pointer"
              >
                Sign In
              </button>
            )}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={SNAPPY_SPRING}>
              <Link 
                href="/practice" 
                className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/25 transition-all"
              >
                Enter App <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.nav>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 md:pt-16 md:pb-24 flex flex-col items-center text-center relative z-10">

        {/* Hero Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...SNAPPY_SPRING, delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/70 backdrop-blur-md border border-amber-500/30 text-[10px] sm:text-xs font-bold tracking-wider uppercase text-foreground/90 mb-6 font-mono shadow-md shadow-amber-500/10"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>The Next-Gen SSC Preparation Engine</span>
        </motion.div>

        {/* Headline with Dynamic Word Cycler */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: SNAPPY_EASE, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-5 max-w-5xl text-foreground"
        >
          Stop Guessing.{" "}
          <br />
          <span className="inline-block whitespace-nowrap">
            <span className="text-foreground">Start </span>
            <TypewriterHeroText />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: SNAPPY_EASE, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-foreground/70 max-w-2xl mb-8 font-normal leading-relaxed px-2 sm:px-0"
        >
          Combine 10,000+ verified PYQs, AI-powered weakness diagnosis, and spaced repetition — so every hour you study translates directly into marks.
        </motion.p>

        {/* CTAs with Snappy Physics */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: SNAPPY_EASE, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto px-2 sm:px-0 mb-10"
        >
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={SNAPPY_SPRING} className="w-full sm:w-auto">
            <Link 
              href="/practice" 
              className="group flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-base sm:text-lg font-bold shadow-2xl shadow-amber-500/30 w-full sm:w-auto"
            >
              <span>Start Practicing — Free</span>
              <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={SNAPPY_SPRING} className="w-full sm:w-auto">
            <a 
              href="#how-it-works" 
              className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-card/60 hover:bg-card/90 border border-border/40 hover:border-border/70 text-foreground text-base sm:text-lg font-semibold transition-all w-full sm:w-auto backdrop-blur-md"
            >
              See How It Works <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>
          </motion.div>
        </motion.div>

        {/* ─── Exam Category Pills (Clean Names Only) ─── */}
        <motion.div 
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: SNAPPY_EASE, delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5 max-w-3xl mb-12"
        >
          {EXAM_OPTIONS.map((exam) => {
            const Icon = exam.icon;
            return (
              <div
                key={exam.id}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-semibold bg-card/60 backdrop-blur-md text-foreground/90 border border-border/40 shadow-xs select-none hover:border-amber-500/30 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{exam.label}</span>
              </div>
            );
          })}
        </motion.div>

        {/* ─── Trust Stats ─── */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease: SNAPPY_EASE }}
          className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 py-4 mb-10"
        >
          {[
            { value: 10, suffix: "k+", label: "Authentic PYQs", icon: ScrollText, color: "text-amber-500" },
            { value: 5, suffix: "+", label: "SSC Exams Covered", icon: Trophy, color: "text-emerald-500" },
            { value: 4, suffix: "", label: "Complete Sections", icon: LayoutDashboard, color: "text-blue-500" },
            { value: 24, suffix: "/7", label: "AI-Driven Insights", icon: BrainCircuit, color: "text-violet-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={SNAPPY_SPRING}
              className="rounded-2xl p-4 sm:p-5 bg-card/60 backdrop-blur-md border border-border/40 shadow-sm flex flex-col items-center justify-center text-center"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} delay={0.5 + i * 0.1} />
              </div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Interactive Live Hero Dashboard ─── */}
        <div className="w-full max-w-5xl mt-6 relative mx-auto">
          <InteractiveHeroDashboard />
        </div>

      </main>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="w-full py-16 sm:py-24 relative z-10 bg-background">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 font-mono">
              <RefreshCw className="w-3 h-3 text-amber-500" /> The PrepPilot Loop
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
              Four Steps to Selection
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/70 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              A feedback-driven cycle that ensures every hour you study is an hour spent on what actually moves your score.
            </motion.p>
          </motion.div>

          <div className="relative">
            <ScrollTimelineLine />

            <div className="flex flex-col gap-10 md:gap-16 relative z-10">
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, ease: SNAPPY_EASE }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                <div className="hidden md:block md:w-1/2 md:text-right">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 1</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">Take a Diagnostic PYQ</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">Attempt a full Previous Year Paper under timed conditions. Our engine analyzes all 100 questions to map baseline accuracy, pace, and section strengths.</p>
                </div>
                <TimelineIcon baseClass="ring-blue-500/20 text-blue-500" activeClass="scale-110 bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                  <Activity className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
                <div className="md:w-1/2 md:hidden">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 1</div>
                  <h3 className="text-lg font-bold mb-1 tracking-tight">Take a Diagnostic PYQ</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">Attempt a full Previous Year Paper under timed conditions. Our engine analyzes all 100 questions to map baseline accuracy, pace, and section strengths.</p>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, ease: SNAPPY_EASE }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                <div className="hidden md:block md:w-1/2" />
                <TimelineIcon baseClass="ring-amber-500/20 text-amber-500" activeClass="scale-110 bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                  <Map className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
                <div className="md:w-1/2">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 2</div>
                  <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 tracking-tight">Get Your AI Weakness Roadmap</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">The engine identifies your mark-bleed topics — where you lose marks or waste time — and serves targeted drill recommendations.</p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, ease: SNAPPY_EASE }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                <div className="hidden md:block md:w-1/2 md:text-right">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 3</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">Execute Daily Micro-Drills</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">20 targeted PYQs, 5 minutes of Mental Maths sprints, and Smart Flashcards every day. Small inputs that compound rapidly.</p>
                </div>
                <TimelineIcon baseClass="ring-emerald-500/20 text-emerald-500" activeClass="scale-110 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                  <Dumbbell className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
                <div className="md:w-1/2 md:hidden">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 3</div>
                  <h3 className="text-lg font-bold mb-1 tracking-tight">Execute Daily Micro-Drills</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">20 targeted PYQs, 5 minutes of Mental Maths sprints, and Smart Flashcards every day. Small inputs that compound rapidly.</p>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </motion.div>

              {/* Step 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, ease: SNAPPY_EASE }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                <div className="hidden md:block md:w-1/2" />
                <TimelineIcon baseClass="ring-violet-500/20 text-violet-500" activeClass="scale-110 bg-violet-500 text-white shadow-lg shadow-violet-500/20">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
                <div className="md:w-1/2">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 4</div>
                  <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 tracking-tight">Track &amp; Dominate</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">Watch your accuracy climb and calculation times drop on the analytics dashboard. Re-test with a fresh PYQ every weekend to close the loop.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Arsenal ─── */}
      <section className="w-full py-16 sm:py-24 relative z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center mb-14"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 font-mono">
              <Crosshair className="w-3 h-3 text-amber-500" /> Built for Serious Aspirants
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
              Your Complete Arsenal
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/70 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              Six deeply engineered tools — each one designed to move a specific needle on exam day.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div 
                  key={f.title}
                  variants={itemVariants}
                  className="h-full"
                >
                  <div 
                    className={`group relative flex flex-col p-6 sm:p-7 rounded-3xl bg-card/95 md:bg-card/60 backdrop-blur-none md:backdrop-blur-2xl border border-border/40 ${f.borderHover} hover:shadow-2xl transition-all duration-300 shine-sweep h-full overflow-hidden hover:-translate-y-1`}
                  >
                    {/* Focused Corner Radial Aura — Desktop Only */}
                    <div 
                      className={`hidden md:block absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br ${f.auraBg} blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 ease-out`}
                      aria-hidden="true"
                    />

                    <div className="flex items-center justify-between mb-5 relative z-10">
                      <div className={`w-12 h-12 rounded-2xl ${f.iconBg} ${f.iconText} flex items-center justify-center border border-border/20 group-hover:scale-110 shadow-sm transition-transform duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-background/80 backdrop-blur-md text-muted-foreground px-2.5 py-1 rounded-full border border-border/40 shadow-2xs">
                        {f.badge}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-amber-500/90 transition-colors tracking-tight relative z-10">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm mb-5 flex-1 relative z-10">
                      {f.desc}
                    </p>

                    <div className="text-[11px] font-mono font-semibold text-foreground/85 pt-3.5 border-t border-border/30 flex items-center gap-2 relative z-10">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f.preview}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Comprehensive SSC Syllabus Matrix ─── */}
      <SyllabusMatrixSection />

      <InfiniteTestimonials />

      {/* ─── Pricing / Subscription Section ─── */}
      <section className="w-full py-20 sm:py-24 relative z-10 bg-background">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="text-center mb-14"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 font-mono">
              <Tag className="w-3 h-3 text-amber-500" /> Pricing
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/70 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              Start for free, upgrade when you are ready to dominate the leaderboard.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Tier */}
            <TiltCard>
              <div className="bg-card/50 border border-border/40 rounded-3xl p-7 sm:p-8 flex flex-col hover:border-border/70 transition-all h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-foreground mb-1">Free Tier</h3>
                  <p className="text-foreground/70 text-xs font-medium">For casual learners exploring the platform.</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-black font-mono text-foreground">₹0</span>
                    <span className="text-muted-foreground font-mono text-xs">/forever</span>
                  </div>
                </div>
                
                <ul className="flex flex-col gap-3 text-foreground/80 text-sm font-medium mb-8 flex-1">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-foreground">Limited PYQ Vault:</strong> Access to recent sample shifts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-foreground">Daily Sprints:</strong> 5-minute mixed calculation drills</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-foreground">Basic Flashcards:</strong> Standard vocabulary sets</span>
                  </li>
                </ul>
                
                <Link 
                  href="/practice" 
                  className="w-full py-3 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold transition-all text-center text-sm font-mono"
                >
                  Start Free
                </Link>
              </div>
            </TiltCard>

            {/* Pro Tier */}
            <TiltCard>
              <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border-2 border-amber-500/40 rounded-3xl p-7 sm:p-8 flex flex-col relative overflow-hidden text-white h-full shadow-xl shadow-amber-500/10 hover:border-amber-500/70 transition-all">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-bl-xl shadow-lg z-10 font-mono">
                  Most Popular
                </div>
                
                <div className="mb-6 relative z-10">
                  <h3 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
                    PrepPilot <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-950 px-2 py-0.5 rounded text-xs font-mono font-bold shadow-md">PRO</span>
                  </h3>
                  <p className="text-zinc-400 text-xs font-medium">For serious aspirants aiming for top ranks.</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-black font-mono text-white">₹99</span>
                    <span className="text-zinc-500 font-mono text-xs">/month</span>
                  </div>
                </div>
                
                <ul className="flex flex-col gap-3 text-zinc-300 text-sm font-medium mb-8 flex-1 relative z-10">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-white">Unlimited PYQ Vault:</strong> Every historical shift unlocked</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-white">AI Weakness Engine:</strong> Surgical topic recommendations</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-white">Advanced Drills:</strong> Sectional & custom topic sprints</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-white">Smart Flashcards:</strong> Active memory synchronization</span>
                  </li>
                </ul>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={SNAPPY_SPRING}>
                  <Link 
                    href="/practice" 
                    className="w-full block py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:opacity-95 transition-all text-center shadow-lg shadow-amber-500/25 relative z-10 text-sm font-mono"
                  >
                    Upgrade to Pro
                  </Link>
                </motion.div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ─── Aspirant FAQ Section ─── */}
      <AspirantFaqSection />

      {/* ─── Footer CTA ─── */}
      <footer className="w-full pt-16 pb-8 relative z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16 text-center relative">
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 tracking-tight">
            Your selection{" "}
            <span 
              className="bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer"
              style={{ backgroundImage: 'linear-gradient(90deg, #f59e0b, #f97316, #f43f5e, #f97316, #f59e0b, #f97316, #f43f5e, #f97316, #f59e0b)' }}
            >
              starts today.
            </span>
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base mb-8 max-w-lg mx-auto">
            Join thousands of aspirants who stopped hoping and started preparing with precision.
          </p>
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={SNAPPY_SPRING}>
            <Link 
              href="/practice" 
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-base font-bold shadow-xl shadow-amber-500/25"
            >
              <span>Start Practicing — Free</span>
              <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Footer Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 text-left">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0">
                <Rocket className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-base tracking-tight">PrepPilot</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              AI-driven exam preparation built specifically for SSC CGL, CHSL, CPO, MTS & GD aspirants.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">Product</h4>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-xs">Dashboard</Link>
            <Link href="/SSC/maths/mental-maths" className="text-muted-foreground hover:text-foreground transition-colors text-xs">Mental Maths Arena</Link>
            <Link href="/practice" className="text-muted-foreground hover:text-foreground transition-colors text-xs">PYQ Vault</Link>
            <Link href="/analytics" className="text-muted-foreground hover:text-foreground transition-colors text-xs">AI Analytics</Link>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">Resources</h4>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs">SSC CGL Syllabus</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs">Cutoff Predictor</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs">Study Strategy</Link>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">Support</h4>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs">Help Center</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs">Privacy Policy</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs">Terms of Service</Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left relative">
          <div className="absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          <div className="text-muted-foreground text-xs font-medium">
            © {new Date().getFullYear()} PrepPilot. Built for SSC Aspirants.
          </div>
          <div className="text-xs font-medium text-muted-foreground/70">
            Engineered for students who refuse to settle.
          </div>
        </div>
      </footer>

    </div>
  );
}
