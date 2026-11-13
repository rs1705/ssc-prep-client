"use client";

import { ArrowRight, Brain, Zap, BookOpen, Gamepad2, Rocket, CheckCircle2, Check, Activity, Map, Dumbbell, Trophy, RefreshCw, Crosshair, Tag, Timer } from "lucide-react";
import { useRef } from "react";
import { motion, useInView, type Variants, useScroll } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import dynamic from "next/dynamic";
import { SNAPPY_SPRING, SNAPPY_EASE } from "@/features/landing/motion";
import { TryQuestion } from "@/features/landing/TryQuestion";
import { HeroCopy } from "@/features/landing/HeroCopy";
import { SubjectCards } from "@/features/landing/SubjectCards";
import { DUO } from "@/features/games/buttons";
import { cn } from "@/lib/utils";

// Below the fold: separate chunks, still rendered on the server for search engines.
const SyllabusMatrixSection = dynamic(() => import("@/features/landing/SyllabusMatrix"));
const AspirantFaqSection = dynamic(() => import("@/features/landing/Faq"));


/* ─── Typewriter Shimmer Headline ─── */
/* ─── Speed Sprint Demo Questions (7 Varied Categories) ─── */

function ScrollTimelineLine() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 60%"]
  });

  return (
    <div ref={ref} className="absolute top-12 md:top-20 bottom-12 md:bottom-20 left-[23.5px] md:left-1/2 md:-ml-[1.5px] w-[2px] md:w-[3px] z-0 bg-[color-mix(in_oklab,var(--border)_40%,var(--card))] rounded-full overflow-hidden">
      <motion.div 
        className="w-full h-full origin-top bg-gradient-to-b from-brand-500 via-brand-alt-500 to-brand-500"
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

export default function LandingPage() {
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
      icon: Zap,
      title: "Speed Math Drills",
      desc: "Timed calculation sprints, from tables and squares to percentages and ratios, at three difficulty levels.",
      badge: "12 drills",
      href: "/SSC/maths/mental-maths",
      iconBg: "bg-[color-mix(in_oklab,var(--color-sky-500)_15%,var(--card))]",
      iconText: "text-sky-600 dark:text-sky-400",
      auraBg: "from-sky-500/25 via-sky-500/10 to-transparent",
      borderHover: "hover:border-sky-500/40",
      preview: "Timed or freestyle"
    },
    {
      icon: BookOpen,
      title: "Topic-wise PYQs",
      desc: "Real SSC CGL questions grouped by topic. Answer, see if you were right, and read the explanation straight away.",
      badge: "Real papers",
      href: "/SSC/maths/topic-pyqs",
      iconBg: "bg-[color-mix(in_oklab,var(--brand-500)_15%,var(--card))]",
      iconText: "text-brand-600 dark:text-brand-400",
      auraBg: "from-brand-500/25 via-brand-500/10 to-transparent",
      borderHover: "hover:border-brand-500/40",
      preview: "Explanation for every question"
    },
    {
      icon: Timer,
      title: "Sectional Tests",
      desc: "Sit one section of a past paper against the clock with exam marking, then review every answer.",
      badge: "+2 / −0.5",
      href: "/SSC/english/sectional-pyqs",
      iconBg: "bg-[color-mix(in_oklab,var(--brand-500)_15%,var(--card))]",
      iconText: "text-brand-600 dark:text-brand-400",
      auraBg: "from-brand-500/25 via-brand-500/10 to-transparent",
      borderHover: "hover:border-brand-500/40",
      preview: "Submits itself when time is up"
    },
    {
      icon: Brain,
      title: "Smart Flashcards",
      desc: "High-frequency words, idioms and one-word substitutions with Hindi meanings, scheduled by spaced repetition.",
      badge: "637 cards",
      href: "/SSC/english/flashcards",
      iconBg: "bg-[color-mix(in_oklab,var(--color-fuchsia-500)_15%,var(--card))]",
      iconText: "text-fuchsia-700 dark:text-fuchsia-400",
      auraBg: "from-fuchsia-500/25 via-fuchsia-500/10 to-transparent",
      borderHover: "hover:border-fuchsia-500/40",
      preview: "Browse free, sign in to track"
    },
    {
      icon: Gamepad2,
      title: "Word Games",
      desc: "Match the Following, Fill in the Blanks, Hangman, Odd Link, Word of the Day and Spelling Check. Two-minute games that make vocabulary stick.",
      badge: "4 games",
      href: "/SSC/english/games",
      iconBg: "bg-[color-mix(in_oklab,var(--color-fuchsia-500)_15%,var(--card))]",
      iconText: "text-fuchsia-700 dark:text-fuchsia-400",
      auraBg: "from-fuchsia-500/25 via-fuchsia-500/10 to-transparent",
      borderHover: "hover:border-fuchsia-500/40",
      preview: "No sign-in needed"
    },
    {
      icon: Map,
      title: "Syllabus Map",
      desc: "Each section laid out as on the paper: questions, marks, negative marking and the topics you can practice today.",
      badge: "4 subjects",
      href: "/practice",
      iconBg: "bg-[color-mix(in_oklab,var(--brand-500)_15%,var(--card))]",
      iconText: "text-brand-600 dark:text-brand-400",
      auraBg: "from-brand-500/25 via-brand-500/10 to-transparent",
      borderHover: "hover:border-brand-500/40",
      preview: "Exam pattern at a glance"
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-clip flex flex-col items-center relative scroll-smooth">
      
      {/* ─── Ambient Glow Blobs — Lightweight on mobile, animated on desktop ─── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="hidden md:block">
          <div className="absolute -left-20 top-[8%] h-[45vw] max-h-[600px] w-[45vw] max-w-[600px] rounded-full bg-[color-mix(in_oklab,var(--brand-500)_22%,var(--card))] opacity-60 blur-[120px]" />
          <div className="absolute -right-20 top-[30%] h-[45vw] max-h-[650px] w-[45vw] max-w-[650px] rounded-full bg-[color-mix(in_oklab,var(--brand-alt-500)_20%,var(--card))] opacity-50 blur-[140px]" />
        </div>
        {/* Zero-overhead static ambient backdrop for mobile phones */}
        <div className="block md:hidden absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(192,38,211,0.12),transparent_70%)]" />
        <div className="absolute inset-0 dot-grid pointer-events-none" />
      </div>

      {/* ─── Floating Pill Navbar ─── */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 z-50 sticky top-0">
        <div className="w-full px-4 sm:px-6 py-3 rounded-full bg-background sm:bg-background backdrop-blur-none sm:backdrop-blur-xl border-2 border-border shadow-lg shadow-black/5 flex items-center justify-between overflow-hidden relative">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-alt-500 shadow-md shadow-brand-500/20 flex items-center justify-center text-white shrink-0 group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Rocket className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-base sm:text-lg tracking-tight text-foreground flex items-center gap-1.5">
                <span>Ept<span className="text-brand-600 dark:text-brand-400">SSC</span></span>
              </div>
            </div>
          </Link>
          
          <motion.nav 
            initial={{ opacity: 0, x: 15 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.4, ease: SNAPPY_EASE }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="hidden lg:flex items-center gap-1 mr-2 text-sm font-semibold text-muted-foreground">
              <a href="#features" className="px-3 py-2 rounded-full hover:text-foreground hover:bg-[color-mix(in_oklab,var(--muted)_70%,var(--card))] transition-colors">Features</a>
              <a href="#how-it-works" className="px-3 py-2 rounded-full hover:text-foreground hover:bg-[color-mix(in_oklab,var(--muted)_70%,var(--card))] transition-colors">How it works</a>
              <a href="#faq" className="px-3 py-2 rounded-full hover:text-foreground hover:bg-[color-mix(in_oklab,var(--muted)_70%,var(--card))] transition-colors">FAQ</a>
            </div>
            {user ? (
              <Link 
                href="/dashboard" 
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full surface-card hover:bg-card text-xs font-semibold transition-all text-foreground"
              >
                Dashboard
              </Link>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full surface-card hover:bg-card text-xs font-semibold transition-all text-foreground cursor-pointer"
              >
                Sign In
              </button>
            )}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={SNAPPY_SPRING}>
              <Link 
                href="/practice" 
                className="group flex h-10 items-center gap-1.5 px-5 rounded-full bg-gradient-to-r from-brand-500 to-brand-alt-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/25 transition-all"
              >
                Enter App <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.nav>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-6 md:pb-20 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
          <HeroCopy />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: SNAPPY_EASE, delay: 0.1 }}
          >
            <TryQuestion />
          </motion.div>
        </div>

        <div className="mt-12 md:mt-16">
          <p className="section-label mb-3">Pick a section</p>
          <SubjectCards />
        </div>
      </main>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="w-full py-12 sm:py-20 relative z-10 bg-background">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full surface-card text-xs sm:text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 font-mono">
              <RefreshCw className="w-3 h-3 text-brand-500" /> The EptSSC Loop
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
              A Simple Loop That Works
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/70 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              Test yourself on real questions, learn from every answer, drill the gaps, repeat.
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
                  <div className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 1</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">Sit a Real Section</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">Pick a section from a past SSC CGL Tier 1 paper and attempt it against the clock, with the real +2 / −0.5 marking.</p>
                </div>
                <TimelineIcon baseClass="ring-sky-500/20 text-sky-600" activeClass="scale-110 bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                  <Activity className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
                <div className="md:w-1/2 md:hidden">
                  <div className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 1</div>
                  <h3 className="text-lg font-bold mb-1 tracking-tight">Sit a Real Section</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">Pick a section from a past SSC CGL Tier 1 paper and attempt it against the clock, with the real +2 / −0.5 marking.</p>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, ease: SNAPPY_EASE }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                <div className="hidden md:block md:w-1/2" />
                <TimelineIcon baseClass="ring-brand-500/20 text-brand-500" activeClass="scale-110 bg-brand-500 text-white shadow-lg shadow-brand-500/20">
                  <Map className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
                <div className="md:w-1/2">
                  <div className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 2</div>
                  <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 tracking-tight">Review Every Answer</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">See what you got right, wrong or skipped, with a step-by-step explanation for every single question.</p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, ease: SNAPPY_EASE }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                <div className="hidden md:block md:w-1/2 md:text-right">
                  <div className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 3</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">Drill Daily in Minutes</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">Speed Math sprints, topic-wise PYQ sets, flashcards and word games. Short sessions that fit into any day.</p>
                </div>
                <TimelineIcon baseClass="ring-brand-500/20 text-brand-500" activeClass="scale-110 bg-brand-500 text-white shadow-lg shadow-brand-500/20">
                  <Dumbbell className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
                <div className="md:w-1/2 md:hidden">
                  <div className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 3</div>
                  <h3 className="text-lg font-bold mb-1 tracking-tight">Drill Daily in Minutes</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">Speed Math sprints, topic-wise PYQ sets, flashcards and word games. Short sessions that fit into any day.</p>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </motion.div>

              {/* Step 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, ease: SNAPPY_EASE }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                <div className="hidden md:block md:w-1/2" />
                <TimelineIcon baseClass="ring-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400" activeClass="scale-110 bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
                <div className="md:w-1/2">
                  <div className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 4</div>
                  <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 tracking-tight">Retest and Compare</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">Retake the section or try another paper, and see your marks and accuracy move.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Arsenal ─── */}
      <section id="features" className="w-full py-12 sm:py-20 relative z-10 scroll-mt-24">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center mb-14"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full surface-card text-xs sm:text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 font-mono">
              <Crosshair className="w-3 h-3 text-brand-500" /> Built for Serious Aspirants
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
              Everything You Can Practice Today
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/70 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              Six tools, all live. Tap any card to try it, no account needed.
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
                    className={`group relative flex flex-col p-6 sm:p-7 rounded-3xl bg-card md:bg-card backdrop-blur-none md:backdrop-blur-2xl border-2 border-border ${f.borderHover} hover:shadow-2xl transition-all duration-300 shine-sweep h-full overflow-hidden hover:-translate-y-1`}
                  >
                    {/* Focused Corner Radial Aura — Desktop Only */}
                    <div 
                      className={`hidden md:block absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br ${f.auraBg} blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 ease-out`}
                      aria-hidden="true"
                    />

                    <div className="flex items-center justify-between mb-5 relative z-10">
                      <div className={`w-12 h-12 rounded-2xl ${f.iconBg} ${f.iconText} flex items-center justify-center border-2 border-border/20 group-hover:scale-110 shadow-sm transition-transform duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold bg-background backdrop-blur-md text-muted-foreground px-2.5 py-1 rounded-full border-2 border-border shadow-2xs">
                        {f.badge}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-brand-500/90 transition-colors tracking-tight relative z-10">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm mb-5 flex-1 relative z-10">
                      {f.desc}
                    </p>

                    <div className="text-xs font-mono font-semibold text-foreground/85 pt-3.5 border-t-2 border-border/30 flex items-center gap-2 relative z-10">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f.preview}</span>
                      <ArrowRight className="ml-auto w-4 h-4 text-brand-600 dark:text-brand-400 transition-transform group-hover:translate-x-1" />
                    </div>
                    <Link href={f.href} aria-label={`Open ${f.title}`} className="absolute inset-0 z-20 rounded-3xl" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Comprehensive SSC Syllabus Matrix ─── */}
      <SyllabusMatrixSection />


      {/* ─── Pricing / Subscription Section ─── */}
      <section className="w-full py-12 sm:py-20 relative z-10 bg-background">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="text-center mb-14"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full surface-card text-xs sm:text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 font-mono">
              <Tag className="w-3 h-3 text-brand-500" /> Pricing
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/70 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              Everything live today is free. A Pro plan is planned for later.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Tier */}
            <TiltCard>
              <div className="bg-card border-2 border-border rounded-3xl p-7 sm:p-8 flex flex-col hover:border-border/70 transition-all h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-foreground mb-1">Free Tier</h3>
                  <p className="text-foreground/70 text-xs font-medium">Everything that is live today.</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-black font-mono text-foreground">₹0</span>
                    <span className="text-muted-foreground font-mono text-xs">/forever</span>
                  </div>
                </div>
                
                <ul className="flex flex-col gap-3 text-foreground/80 text-sm font-medium mb-8 flex-1">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-foreground">Real PYQs:</strong> Topic sets and timed sectional tests</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-foreground">Speed Math:</strong> All 12 drills, every difficulty</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-foreground">Flashcards &amp; games:</strong> 637 cards and 4 word games</span>
                  </li>
                </ul>
                
                <Link 
                  href="/practice" 
                  className="w-full py-3 rounded-2xl bg-muted hover:bg-[color-mix(in_oklab,var(--muted)_80%,var(--card))] text-foreground font-bold transition-all text-center text-sm font-mono"
                >
                  Start Free
                </Link>
              </div>
            </TiltCard>

            {/* Pro Tier */}
            <TiltCard>
              <div className="bg-gradient-to-br from-[#0b1020] to-[#16224f] border-2 border-brand-500/40 rounded-3xl p-7 sm:p-8 flex flex-col relative overflow-hidden text-white h-full shadow-xl shadow-brand-500/10 hover:border-brand-500/70 transition-all">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-brand-500 to-brand-alt-500 text-on-brand text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-bl-xl shadow-lg z-10 font-mono">
                  Coming soon
                </div>
                
                <div className="mb-6 relative z-10">
                  <h3 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
                    EptSSC <span className="bg-gradient-to-r from-brand-400 to-brand-alt-500 text-on-brand px-2 py-0.5 rounded text-xs font-mono font-bold shadow-md">PRO</span>
                  </h3>
                  <p className="text-zinc-400 text-xs font-medium">Planned: more papers, deeper analytics and custom tests.</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-black font-mono text-white">₹99</span>
                    <span className="text-zinc-500 font-mono text-xs">/month</span>
                  </div>
                </div>
                
                <ul className="flex flex-col gap-3 text-zinc-300 text-sm font-medium mb-8 flex-1 relative z-10">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-white">Unlimited PYQ Vault:</strong> Every historical shift unlocked</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-white">AI Weakness Engine:</strong> Surgical topic recommendations</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-white">Advanced Drills:</strong> Sectional & custom topic sprints</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> 
                    <span><strong className="text-white">Smart Flashcards:</strong> Active memory synchronization</span>
                  </li>
                </ul>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={SNAPPY_SPRING}>
                  <Link 
                    href="/practice" 
                    className="w-full block py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-alt-500 text-white font-bold hover:opacity-95 transition-all text-center shadow-lg shadow-brand-500/25 relative z-10 text-sm font-mono"
                  >
                    Coming soon
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
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16 text-center relative isolate">
          <div className="hidden md:block absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] blur-[130px] rounded-full pointer-events-none" aria-hidden="true" />
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 tracking-tight">
            Your selection{" "}
            <span 
              className="bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer"
              style={{ backgroundImage: 'linear-gradient(90deg, var(--brand-500), var(--brand-alt-500), var(--brand-hot), var(--brand-alt-500), var(--brand-500), var(--brand-alt-500), var(--brand-hot), var(--brand-alt-500), var(--brand-500))' }}
            >
              starts today.
            </span>
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base mb-8 max-w-lg mx-auto">
            Open a drill, a deck or a real past paper. It takes less than a minute to start.
          </p>
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={SNAPPY_SPRING}>
            <Link 
              href="/practice" 
              className={cn(DUO.primary, "px-8 text-base")}
            >
              <span>Start practicing, free</span>
              <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Footer Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 text-left">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-3 group cursor-pointer w-fit">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-alt-500 flex items-center justify-center text-white shrink-0 group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Rocket className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-base tracking-tight text-foreground group-hover:text-brand-500 transition-colors">EptSSC</span>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              Exam preparation built around the SSC CGL Tier 1 paper: real questions, speed drills, flashcards and games.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">Practice</h4>
            <Link href="/practice" className="inline-block py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">Practice Hub</Link>
            <Link href="/SSC/maths/mental-maths" className="inline-block py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">Speed Math</Link>
            <Link href="/SSC/english/flashcards" className="inline-block py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">Flashcards</Link>
            <Link href="/SSC/english/games" className="inline-block py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">Word Games</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">Subjects</h4>
            <Link href="/SSC/maths" className="inline-block py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">Quant</Link>
            <Link href="/SSC/english" className="inline-block py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">English</Link>
            <Link href="/SSC/reasoning" className="inline-block py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">Reasoning</Link>
            <Link href="/SSC/gk" className="inline-block py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">General Knowledge</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">Company</h4>
            <Link href="/about" className="inline-block py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">About</Link>
            <Link href="/feedback" className="inline-block py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">Feedback &amp; roadmap</Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left relative">
          <div className="absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          <div className="text-muted-foreground text-xs font-medium">
            © {new Date().getFullYear()} EptSSC. Built for SSC Aspirants.
          </div>
          <div className="text-xs font-medium text-muted-foreground/70">
            Engineered for students who refuse to settle.
          </div>
        </div>
      </footer>

    </div>
  );
}

