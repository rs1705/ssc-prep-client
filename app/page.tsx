"use client";

import Link from "next/link";
import { 
  ArrowRight, Brain, Zap, BookOpen, Target, Gamepad2, BarChart3, Rocket, 
  XCircle, CheckCircle2, Check, Flame, Activity, Map, Dumbbell, Trophy, 
  ChevronDown, Heart, Scale, RefreshCw, Crosshair, Tag, ScrollText, 
  LayoutDashboard, BrainCircuit, Sparkles, Timer, RotateCw, CheckCircle,
  Award, TrendingUp, Compass
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
      // Finished typing full word -> pause for 1800ms
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1800);
    } else if (isDeleting && text === "") {
      // Finished deleting word -> move to next word and pause briefly
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % WORDS.length);
      timeout = setTimeout(() => {}, 300);
    } else {
      // Typing or deleting
      const nextCharCount = isDeleting ? text.length - 1 : text.length + 1;
      const delta = isDeleting ? 45 : 85;
      
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
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[3px] sm:w-[4px] md:w-[5px] h-[0.82em] bg-gradient-to-b from-amber-500 via-orange-500 to-rose-500 ml-1.5 translate-y-[2px] rounded-full shrink-0 shadow-sm shadow-amber-500/50"
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
  { id: "cgl", label: "SSC CGL", icon: Trophy, badge: "Tier 1 & Tier 2" },
  { id: "chsl", label: "SSC CHSL", icon: Target, badge: "10+2 Level" },
  { id: "cpo", label: "SSC CPO", icon: Compass, badge: "SI in Delhi Police" },
  { id: "mts", label: "SSC MTS", icon: Dumbbell, badge: "Multi-Tasking Staff" },
  { id: "gd", label: "SSC GD", icon: Award, badge: "General Duty Constable" },
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

/* ─── 3D TiltCard with Snappy Physics ─── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 350, mass: 0.4 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), springConfig);
  
  const spotX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const spotY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);
  const spotlightBackground = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, rgba(245,158,11,0.08) 0%, transparent 75%)`;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set((clientX - left) / width - 0.5);
    mouseY.set((clientY - top) / height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative rounded-2xl ${className}`}
    >
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
        style={{ background: spotlightBackground }}
      />
      <div style={{ transform: "translateZ(20px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Interactive Hero Live Dashboard (3 Modes) ─── */
function InteractiveHeroDashboard() {
  const [activeTab, setActiveTab] = useState<"analytics" | "maths" | "fsrs">("analytics");
  
  // Maths Sprint State
  const [selectedMathAnswer, setSelectedMathAnswer] = useState<number | null>(null);
  const [mathSolved, setMathSolved] = useState(false);
  const correctAnswer = 336; // 48 * 7

  const handleMathChoice = (val: number) => {
    setSelectedMathAnswer(val);
    if (val === correctAnswer) {
      setMathSolved(true);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#3b82f6"]
      });
    }
  };

  const resetMathDemo = () => {
    setSelectedMathAnswer(null);
    setMathSolved(false);
  };

  // FSRS Flashcard State
  const [cardFlipped, setCardFlipped] = useState(false);
  const [ratedInterval, setRatedInterval] = useState<string | null>(null);

  const handleRating = (interval: string) => {
    setRatedInterval(interval);
    setTimeout(() => {
      setCardFlipped(false);
      setRatedInterval(null);
    }, 1200);
  };

  return (
    <div className="w-full relative">
      {/* Background Glow */}
      <div className="absolute -inset-10 bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-amber-500/15 blur-[90px] rounded-full pointer-events-none" />

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
      <div className="relative rounded-2xl sm:rounded-3xl border border-amber-500/25 bg-card/60 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-amber-500/10 flex flex-col noise-overlay">
        
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
              { id: "fsrs", label: "FSRS Flashcard", icon: Brain },
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
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-amber-500" /> 7-Day Trend
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">+14% Growth</span>
                  </div>

                  <div className="w-full h-32 relative mt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#chartGrad)" d="M 0 55 L 16.6 50 L 33.3 40 L 50 35 L 66.6 24 L 83.3 18 L 100 12 L 100 100 L 0 100 Z" />
                      <motion.path 
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="3" 
                        vectorEffect="non-scaling-stroke" 
                        d="M 0 55 L 16.6 50 L 33.3 40 L 50 35 L 66.6 24 L 83.3 18 L 100 12"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.0, ease: SNAPPY_EASE }}
                      />
                    </svg>
                    {[55, 50, 40, 35, 24, 18, 12].map((y, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.08, ...SNAPPY_SPRING }}
                        className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-background absolute cursor-pointer hover:scale-150 transition-transform"
                        style={{ left: `${(i / 6) * 96 + 2}%`, top: `calc(${y}% - 5px)` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-muted-foreground mt-1">
                    <span>Shift 1</span>
                    <span>Shift 4</span>
                    <span>Shift 7 (Latest)</span>
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
                key="maths"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: SNAPPY_EASE }}
                className="max-w-xl mx-auto w-full flex flex-col items-center text-center p-2"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} /> Speed Sprint Mode
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">Level 4: Rapid Multiplication</span>
                </div>

                <div className="text-3xl sm:text-4xl font-black font-mono text-foreground my-4 tracking-wider flex items-center gap-3">
                  <span>48</span>
                  <span className="text-amber-500">×</span>
                  <span>7</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-amber-500 underline decoration-dashed underline-offset-8">
                    {selectedMathAnswer !== null ? selectedMathAnswer : "?"}
                  </span>
                </div>

                {/* Choices */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mt-2">
                  {[326, 336, 346, 356].map((option) => {
                    const isSelected = selectedMathAnswer === option;
                    const isCorrect = option === correctAnswer;
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

                {/* Feedback message */}
                {mathSolved && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Calculated in 1.4s! +15 Elo points gained.</span>
                    <button onClick={resetMathDemo} className="ml-2 underline text-foreground hover:text-amber-400 flex items-center gap-1">
                      <RotateCw className="w-3 h-3" /> Retry
                    </button>
                  </motion.div>
                )}
                {!mathSolved && (
                  <p className="text-[11px] text-muted-foreground mt-3 font-mono">
                    💡 Click the correct answer to experience the instant feedback loop.
                  </p>
                )}
              </motion.div>
            )}

            {/* ─── 3. FSRS Flashcard Tab ─── */}
            {activeTab === "fsrs" && (
              <motion.div
                key="fsrs"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: SNAPPY_EASE }}
                className="max-w-md mx-auto w-full flex flex-col items-center p-2"
              >
                <div className="text-[11px] font-mono text-muted-foreground mb-3 flex items-center gap-2">
                  <Brain className="w-3.5 h-3.5 text-violet-400" />
                  <span>Spaced Repetition Algorithm (FSRS-4.5)</span>
                </div>

                {/* 3D Flip Card */}
                <div 
                  onClick={() => setCardFlipped(!cardFlipped)}
                  className="w-full h-44 rounded-2xl bg-background/80 border-2 border-violet-500/30 p-5 flex flex-col justify-between cursor-pointer hover:border-violet-500/60 transition-all shadow-xl shadow-violet-500/10 relative group"
                >
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span className="bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded font-bold">SSC English Vocab</span>
                    <span className="group-hover:text-foreground transition-colors flex items-center gap-1">
                      <RotateCw className="w-3 h-3" /> {cardFlipped ? "Showing Meaning" : "Click to flip"}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    {!cardFlipped ? (
                      <div>
                        <div className="text-2xl font-black tracking-tight text-foreground">Ephemeral</div>
                        <div className="text-xs text-muted-foreground mt-1 font-mono italic">/ɪˈfɛm(ə)rəl/ • Adjective</div>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-2">
                        <div className="text-sm font-bold text-emerald-400 leading-snug">Lasting for a very short time; transient.</div>
                        <div className="text-xs text-muted-foreground mt-1.5 italic">&quot;Fame in the digital age is often ephemeral.&quot;</div>
                      </motion.div>
                    )}
                  </div>

                  <div className="text-[9px] font-mono text-center text-muted-foreground/60">
                    {cardFlipped ? "Rate your recall below to adjust next review date" : "Tap anywhere on card to reveal definition"}
                  </div>
                </div>

                {/* FSRS Rating Buttons */}
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
                        className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 ${b.color}`}
                      >
                        <span className="text-[11px] font-bold font-mono">{b.label}</span>
                        <span className="text-[8px] opacity-75 font-mono">{b.time}</span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {ratedInterval && (
                  <div className="mt-2 text-xs font-mono text-emerald-400 font-bold">
                    ✓ Scheduled next review in {ratedInterval === "Easy" ? "8 days" : ratedInterval === "Good" ? "3 days" : "12 hours"}
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
        
        <div className="flex animate-[marquee_35s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="inline-block w-[300px] sm:w-[380px] whitespace-normal mx-3">
              <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl p-6 h-full flex flex-col relative noise-overlay hover:border-amber-500/30 transition-colors">
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
      title: "FSRS Smart Flashcards", 
      desc: "The same spaced-repetition algorithm used by medical students — applied to GK facts, idioms, and vocabulary you keep forgetting.",
      badge: "Medical-Grade Spacing",
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
      
      {/* ─── Ambient Glow Blobs ─── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
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
        <div className="absolute inset-0 dot-grid pointer-events-none" />
      </div>

      {/* ─── Floating Pill Navbar ─── */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 z-50 sticky top-0">
        <div className="w-full px-4 sm:px-6 py-3 rounded-full bg-background/80 backdrop-blur-xl border border-border/40 shadow-lg shadow-black/5 flex items-center justify-between overflow-hidden relative">
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
              className="group flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-base sm:text-lg font-bold shadow-2xl shadow-amber-500/30 w-full sm:w-auto"
            >
              Start Practicing — Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

        {/* ─── Exam Category Pills (Showcase Badges) ─── */}
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
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-card/60 backdrop-blur-md text-foreground/90 border border-border/40 shadow-xs select-none hover:border-amber-500/30 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{exam.label}</span>
                <span className="text-[10px] text-muted-foreground/80 hidden sm:inline">· {exam.badge}</span>
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
              className="flex flex-col items-center justify-center bg-card/40 backdrop-blur-md border border-border/30 rounded-2xl p-4 sm:p-5 hover:border-amber-500/30 transition-colors shadow-sm"
            >
              <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
              <div className="flex items-baseline gap-0.5">
                <AnimatedCounter target={stat.value} delay={0.4 + i * 0.05} duration={0.9} className="text-2xl sm:text-3xl font-black font-mono text-foreground" />
                <span className="text-lg sm:text-xl font-bold font-mono text-foreground">{stat.suffix}</span>
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1 text-center font-mono">
                {stat.label}
              </div>
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
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
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
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, ease: SNAPPY_EASE }}
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
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, ease: SNAPPY_EASE }}
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
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, ease: SNAPPY_EASE }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                <div className="hidden md:block md:w-1/2 md:text-right">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 3</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">Execute Daily Micro-Drills</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">20 targeted PYQs, 5 minutes of Mental Maths sprints, and FSRS flashcards every day. Small inputs that compound rapidly.</p>
                </div>
                <TimelineIcon baseClass="ring-emerald-500/20 text-emerald-500" activeClass="scale-110 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                  <Dumbbell className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
                <div className="md:w-1/2 md:hidden">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 3</div>
                  <h3 className="text-lg font-bold mb-1 tracking-tight">Execute Daily Micro-Drills</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">20 targeted PYQs, 5 minutes of Mental Maths sprints, and FSRS flashcards every day. Small inputs that compound rapidly.</p>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </motion.div>

              {/* Step 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, ease: SNAPPY_EASE }}
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
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
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
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <TiltCard key={f.title}>
                  <motion.div 
                    variants={itemVariants} 
                    className={`group relative flex flex-col p-6 sm:p-7 rounded-3xl bg-card/60 backdrop-blur-2xl border border-border/40 ${f.borderHover} hover:shadow-2xl transition-all duration-300 shine-sweep h-full noise-overlay overflow-hidden`}
                  >
                    {/* Focused Corner Radial Aura */}
                    <div 
                      className={`absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br ${f.auraBg} blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 ease-out`}
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
                  </motion.div>
                </TiltCard>
              );
            })}
          </motion.div>
        </div>
      </section>

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
              <div className="bg-card/50 border border-border/40 rounded-3xl p-7 sm:p-8 flex flex-col hover:border-border/70 transition-all h-full noise-overlay">
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
              <div className="relative p-[2px] rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/20 group h-full">
                <div className="absolute inset-[-100%] animate-[border-spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(245,158,11,1)_360deg)] opacity-80 pointer-events-none" />
                
                <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-[22px] p-7 sm:p-8 flex flex-col relative overflow-hidden text-white h-full noise-overlay z-10 border border-amber-500/20">
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
                      <span><strong className="text-white">FSRS Algorithm:</strong> Medical-grade memory synchronization</span>
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
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ─── Footer CTA ─── */}
      <footer className="w-full pt-16 pb-8 relative z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
          
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
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-base font-bold shadow-xl shadow-amber-500/25"
            >
              Start Practicing — Free <ArrowRight className="w-5 h-5" />
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
