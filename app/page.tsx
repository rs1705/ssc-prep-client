"use client";

import Link from "next/link";
import { ArrowRight, Brain, Zap, BookOpen, Target, Gamepad2, BarChart3, Rocket, XCircle, CheckCircle2, Check, Flame, Activity, Map, Dumbbell, Trophy, ChevronDown, Clock, Users, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useAuth } from "@/context/auth";

/* ─── Animated Counter (reusable) ─── */
function AnimatedCounter({ target, suffix = "", prefix = "", className = "" }: { target: number; suffix?: string; prefix?: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, count, target]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] } }
  };

  const features = [
    { icon: BookOpen, color: "emerald", title: "Authentic PYQ Vault", desc: "Every shift from CGL, CHSL, CPO, MTS & GD — OCR-extracted, taxonomy-tagged, and ready for drill-mode practice.", hoverRotate: "-rotate-12" },
    { icon: BarChart3, color: "cyan", title: "AI-Powered Analytics", desc: "Pinpoint your exact weak topics, track accuracy trends over time, and get a personalized study roadmap — no guesswork.", hoverRotate: "rotate-12" },
    { icon: Target, color: "blue", title: "Surgical Topic Drills", desc: "Zero in on specific subtopics like Trigonometry or Cloze Tests. Our engine serves questions weighted by your weakest areas.", hoverRotate: "rotate-6" },
    { icon: Zap, color: "amber", title: "Mental Maths Arena", desc: "Timed calculation sprints with adaptive difficulty. Shave seconds off your per-question time — the difference between selection and waitlist.", hoverRotate: "rotate-12" },
    { icon: Brain, color: "violet", title: "FSRS Smart Flashcards", desc: "The same spaced-repetition algorithm used by medical students — applied to GK facts, idioms, and vocabulary you keep forgetting.", hoverRotate: "-rotate-6" },
    { icon: Gamepad2, color: "rose", title: "Gamified Retention", desc: "Crosswords, word-hunts, and contextual games that make static GK and vocabulary stick — without the burnout of rote memorization.", hoverRotate: "-translate-y-1" },
  ];

  const timeline = [
    { icon: Activity, color: "primary", ring: "primary", title: "Take a Diagnostic PYQ", desc: "Attempt a full Previous Year Paper under timed conditions. Our engine analyzes all 100 questions to map your baseline accuracy, speed, and section-wise strengths." },
    { icon: Map, color: "amber-500", ring: "amber-500", title: "Get Your AI Roadmap", desc: "The engine identifies your \"bleed topics\" — where you haemorrhage marks or time — and generates a prioritized daily study plan." },
    { icon: Dumbbell, color: "emerald-500", ring: "emerald-500", title: "Execute Daily Drills", desc: "20 targeted PYQs, 5 minutes of Mental Maths, and FSRS flashcard reviews — every single day. Small, consistent inputs that compound." },
    { icon: Trophy, color: "violet-500", ring: "violet-500", title: "Track & Dominate", desc: "Watch your accuracy climb and calculation times drop on the analytics dashboard. Re-test with a fresh PYQ every weekend to close the loop." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden flex flex-col items-center relative scroll-smooth">
      
      {/* ─── Ambient Background ─── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-amber-500/30 blur-[100px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 -right-20 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-orange-500/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-rose-500/10 blur-[80px] rounded-full"
        />
      </div>

      {/* ─── Navbar ─── */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-50 sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border/0">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg flex items-center justify-center text-white shrink-0 hover:rotate-12 transition-transform duration-300">
            <Rocket className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-lg sm:text-xl tracking-tight text-foreground">PrepPilot</div>
            <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground">All SSC Exams</div>
          </div>
        </motion.div>
        
        <motion.nav 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3"
          aria-label="Primary navigation"
        >
          {user ? (
            <Link 
              href="/dashboard" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 hover:bg-muted text-sm font-semibold transition-all text-foreground"
            >
              Dashboard
            </Link>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 hover:bg-muted text-sm font-semibold transition-all text-foreground cursor-pointer"
            >
              Sign In
            </button>
          )}
          <Link 
            href="/practice" 
            className="group flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
          >
            Enter App <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.nav>
      </header>

      {/* ─── Hero Section ─── */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 md:pt-24 md:pb-28 flex flex-col items-center text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="inline-flex items-center gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-muted/80 backdrop-blur-sm border border-border/50 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-foreground/80 mb-6 sm:mb-8 font-mono"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Powered by AI Analytics & FSRS
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-5 sm:mb-6 max-w-5xl text-foreground"
        >
          Stop Guessing.{" "}
          <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
            Start Dominating.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="text-sm sm:text-base md:text-lg text-foreground/60 max-w-2xl mb-8 sm:mb-10 font-normal leading-relaxed px-2 sm:px-0"
        >
          The only SSC prep platform built around AI analytics and spaced repetition — not ads and chaos. CGL, CHSL, CPO, MTS, GD.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-2 sm:px-0"
        >
          <Link 
            href="/practice" 
            className="group flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-foreground text-background text-base sm:text-lg font-semibold hover:opacity-90 active:scale-[0.98] transition-all w-full sm:w-auto shadow-xl shadow-foreground/10"
          >
            Start Practicing — Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#how-it-works" 
            className="group flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-muted/50 hover:bg-muted text-foreground text-base sm:text-lg font-semibold transition-all w-full sm:w-auto backdrop-blur-sm"
          >
            See How It Works <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* ─── Trust Stats ─── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 sm:py-8"
          aria-label="Platform statistics"
        >
          {[
            { value: 10, suffix: "k+", label: "Authentic PYQs", icon: BookOpen },
            { value: 5, suffix: "+", label: "SSC Exams Covered", icon: Shield },
            { value: 100, suffix: "%", label: "Ad-Free Experience", icon: Clock },
            { value: 24, suffix: "/7", label: "AI-Driven Insights", icon: Users },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex flex-col items-center justify-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                <stat.icon className="w-4.5 h-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground font-mono tabular-nums" />
              <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em] sm:tracking-[0.15em] mt-1 sm:mt-1.5 font-mono">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Hero Dashboard Preview ─── */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="w-full max-w-5xl mt-8 sm:mt-12 relative mx-auto"
          aria-hidden="true"
        >
          {/* Background Glow */}
          <div className="absolute -inset-10 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          
          {/* Glassmorphism Window */}
          <div className="relative rounded-t-xl sm:rounded-t-2xl lg:rounded-t-[2rem] border border-border/80 bg-card/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/10 pt-3 px-3 sm:pt-4 sm:px-4 lg:pt-6 lg:px-6 h-[200px] sm:h-[240px] md:h-[340px] lg:h-[420px] flex flex-col pointer-events-none">
            
            {/* Window Chrome */}
            <div className="w-full flex items-center justify-between mb-5 pb-3 border-b border-border/40">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400/60" />
                <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
              </div>
              <div className="px-4 py-1.5 rounded-full bg-background/80 border border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-2 font-mono">
                <Flame className="w-3 h-3 text-amber-500" /> 14-Day Streak
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
              <div className="col-span-1 md:col-span-2 flex flex-col gap-4 lg:gap-5">
                <div className="bg-background/80 rounded-xl border border-border/50 p-5 flex-1 flex flex-col relative overflow-hidden">
                  <div className="text-xs sm:text-sm font-semibold text-foreground mb-0.5">Accuracy Trend</div>
                  <div className="text-[8px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-3 sm:mb-5 font-mono">Last 7 Sessions</div>
                  
                  {/* Mock Chart */}
                  <div className="flex-1 w-full flex items-end justify-between gap-1.5 sm:gap-2.5 px-1 h-20 sm:h-28 md:h-full">
                    {[40, 65, 45, 80, 55, 90, 85].map((h, i) => (
                      <div key={i} className="w-full h-full bg-primary/10 rounded-md relative">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 1.2 + i * 0.1, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                          className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-md" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-1 flex-col gap-4 lg:gap-5 hidden md:flex">
                <div className="bg-background/80 rounded-xl border border-border/50 p-5 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-500/10"
                  >
                    <motion.div 
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ delay: 1.5, duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
                      className="absolute inset-0" 
                      style={{ background: 'conic-gradient(#10b981 0% 84%, transparent 84% 100%)' }} 
                    />
                    <div className="absolute inset-[6px] bg-background rounded-full flex items-center justify-center">
                      <AnimatedCounter target={84} suffix="%" className="text-2xl lg:text-3xl font-extrabold text-foreground font-mono" />
                    </div>
                  </motion.div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mt-4 font-mono">Overall Accuracy</div>
                </div>
              </div>
            </div>

            {/* Gradient Overlay for Fade out */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
        </motion.div>
      </main>

      {/* ─── Competitor Comparison ─── */}
      <section id="competitor-dig" className="w-full py-16 sm:py-24 relative z-10 border-t border-border/30 bg-gradient-to-b from-card/20 to-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/40 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-5 font-mono">
              The Honest Comparison
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Why Aspirants Switch to Us
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              We built PrepPilot because we were tired of the same cluttered, ad-infested apps everyone complains about on Telegram groups.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">
            {/* The Old Way */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="bg-card/40 border border-border/40 rounded-2xl p-5 sm:p-7 flex flex-col relative overflow-hidden group hover:border-rose-500/20 transition-colors"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.06]">
                <XCircle className="w-28 h-28 text-rose-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-foreground/60 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-rose-500" />
                </div>
                Legacy Apps
              </h3>
              <ul className="flex flex-col gap-3 sm:gap-3.5 text-foreground/70 text-sm sm:text-[15px]">
                {[
                  "Cluttered dashboards drowning in banner ads and pop-ups.",
                  "Generic \"you got 60%\" reports with no actionable insight.",
                  "Outdated question banks with no OCR verification.",
                  "Feels like a chore — zero motivation to open daily.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-rose-500/80 font-bold mt-0.5 shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* The PrepPilot Way */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="bg-gradient-to-br from-card/80 to-background border-2 border-primary/30 rounded-2xl p-5 sm:p-7 flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors shadow-xl shadow-primary/5"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity">
                <CheckCircle2 className="w-28 h-28 text-emerald-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-foreground flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                PrepPilot
              </h3>
              <ul className="flex flex-col gap-3 sm:gap-3.5 text-foreground/90 font-medium text-sm sm:text-[15px]">
                {[
                  "Minimalist interface — every pixel earns its place.",
                  "AI pinpoints exact weak subtopics with trend analysis.",
                  "Every PYQ is OCR-extracted and manually verified.",
                  "Gamified streaks and micro-drills that build a daily habit.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="w-full py-16 sm:py-24 relative z-10 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/40 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-5 font-mono">
              The PrepPilot Loop
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Four Steps to Selection
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              A feedback-driven cycle that ensures every hour you study is an hour spent on what actually moves your score.
            </motion.p>
          </motion.div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-6 bottom-6 left-[23px] md:left-1/2 md:-ml-px w-px bg-border/40 z-0" />

            <div className="flex flex-col gap-10 md:gap-16 relative z-10">
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                {/* Desktop: text on left */}
                <div className="hidden md:block md:w-1/2 md:text-right">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-2 font-mono">Step 1</div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">Take a Diagnostic PYQ</h3>
                  <p className="text-foreground/60 leading-relaxed text-sm">Attempt a full Previous Year Paper under timed conditions. Our engine analyzes all 100 questions to map your baseline accuracy, speed, and section-wise strengths.</p>
                </div>
                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-card border-4 border-background ring-2 ring-primary/20 flex items-center justify-center text-primary relative z-10 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Activity className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                {/* Mobile: text on right | Desktop: empty spacer */}
                <div className="md:w-1/2 md:hidden">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 1</div>
                  <h3 className="text-lg font-semibold mb-1 tracking-tight">Take a Diagnostic PYQ</h3>
                  <p className="text-foreground/60 leading-relaxed text-sm">Attempt a full Previous Year Paper under timed conditions. Our engine analyzes all 100 questions to map your baseline accuracy, speed, and section-wise strengths.</p>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                {/* Desktop: empty spacer on left */}
                <div className="hidden md:block md:w-1/2" />
                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-card border-4 border-background ring-2 ring-amber-500/20 flex items-center justify-center text-amber-500 relative z-10 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <Map className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                {/* Text (both mobile and desktop) */}
                <div className="md:w-1/2">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 md:mb-2 font-mono">Step 2</div>
                  <h3 className="text-lg md:text-2xl font-semibold mb-1 md:mb-2 tracking-tight">Get Your AI Roadmap</h3>
                  <p className="text-foreground/60 leading-relaxed text-sm">The engine identifies your &quot;bleed topics&quot; — where you haemorrhage marks or time — and generates a prioritized daily study plan.</p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                {/* Desktop: text on left */}
                <div className="hidden md:block md:w-1/2 md:text-right">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-2 font-mono">Step 3</div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">Execute Daily Drills</h3>
                  <p className="text-foreground/60 leading-relaxed text-sm">20 targeted PYQs, 5 minutes of Mental Maths, and FSRS flashcard reviews — every single day. Small, consistent inputs that compound.</p>
                </div>
                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-card border-4 border-background ring-2 ring-emerald-500/20 flex items-center justify-center text-emerald-500 relative z-10 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <Dumbbell className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                {/* Mobile: text on right | Desktop: empty spacer */}
                <div className="md:w-1/2 md:hidden">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 font-mono">Step 3</div>
                  <h3 className="text-lg font-semibold mb-1 tracking-tight">Execute Daily Drills</h3>
                  <p className="text-foreground/60 leading-relaxed text-sm">20 targeted PYQs, 5 minutes of Mental Maths, and FSRS flashcard reviews — every single day. Small, consistent inputs that compound.</p>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </motion.div>

              {/* Step 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                {/* Desktop: empty spacer on left */}
                <div className="hidden md:block md:w-1/2" />
                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-card border-4 border-background ring-2 ring-violet-500/20 flex items-center justify-center text-violet-500 relative z-10 group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                {/* Text (both mobile and desktop) */}
                <div className="md:w-1/2">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 md:mb-2 font-mono">Step 4</div>
                  <h3 className="text-lg md:text-2xl font-semibold mb-1 md:mb-2 tracking-tight">Track &amp; Dominate</h3>
                  <p className="text-foreground/60 leading-relaxed text-sm">Watch your accuracy climb and calculation times drop on the analytics dashboard. Re-test with a fresh PYQ every weekend to close the loop.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Arsenal ─── */}
      <section className="w-full bg-card/10 border-y border-border/30 py-16 sm:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/40 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-5 font-mono">
              Built for Serious Aspirants
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Your Complete Arsenal
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              Six deeply engineered tools — each one designed to move a specific needle on exam day.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div 
                  key={f.title}
                  variants={itemVariants} 
                  className={`group relative flex flex-col p-5 sm:p-7 rounded-2xl bg-card/80 border border-border/60 hover:border-${f.color}-500/30 hover:shadow-lg hover:shadow-${f.color}-500/5 transition-all duration-300 ease-out hover:-translate-y-0.5`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-${f.color}-500/10 text-${f.color}-500 flex items-center justify-center mb-5 overflow-hidden`}>
                    <Icon className={`w-6 h-6 transition-all duration-500 ease-out group-hover:scale-125 group-hover:${f.hoverRotate}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground tracking-tight">{f.title}</h3>
                  <p className="text-foreground/60 leading-relaxed text-xs sm:text-sm">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Pricing / Subscription Section (hidden for now) */}
      {false && (
      <section className="w-full py-24 relative z-10 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/80 md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Start for free, upgrade when you are ready to dominate the leaderboard.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-card/50 border border-border/50 rounded-3xl p-8 flex flex-col hover:border-border transition-colors shadow-sm"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-black text-foreground mb-2">Starter</h3>
                <p className="text-foreground/70 text-sm font-medium">For casual learners exploring the platform.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-foreground">₹0</span>
                  <span className="text-muted-foreground font-medium">/forever</span>
                </div>
              </div>
              
              <ul className="flex flex-col gap-4 text-foreground/80 font-medium mb-10 flex-1">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" /> PYQ Starter Vault (3 Past Papers per Exam)
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" /> Daily Speed Sprints (10 min mixed-mode)
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" /> Freestyle Flashcards
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" /> Basic Scoring & Tracking
                </li>
              </ul>
              
              <Link 
                href="/dashboard" 
                className="w-full py-3 rounded-2xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-colors text-center"
              >
                Start Free
              </Link>
            </motion.div>

            {/* Pro Tier */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-primary/40 rounded-3xl p-8 flex flex-col relative overflow-hidden group hover:border-primary transition-colors shadow-xl shadow-primary/5"
            >
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl rounded-tr-2xl">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-black text-foreground mb-2 flex items-center gap-2">
                  PrepPilot <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-md text-sm">PRO</span>
                </h3>
                <p className="text-foreground/70 text-sm font-medium">For serious aspirants aiming for top ranks.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-foreground">₹99</span>
                  <span className="text-muted-foreground font-medium">/month</span>
                </div>
              </div>
              
              <ul className="flex flex-col gap-4 text-foreground font-medium mb-10 flex-1">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" /> <span className="font-bold">Full PYQ Vault:</span> All Historical Shifts
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" /> <span className="font-bold">AI Roadmap Analytics:</span> Weakness Insights
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" /> <span className="font-bold">Topic-Specific:</span> Math Drills unlocked
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" /> <span className="font-bold">Study Mode:</span> FSRS Flashcard Syncing
                </li>
              </ul>
              
              <Link 
                href="/dashboard" 
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 active:scale-[0.98] transition-all text-center shadow-lg shadow-primary/25"
              >
                Upgrade to Pro
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* ─── Footer ─── */}
      <footer className="w-full bg-card/20 pt-16 sm:pt-24 pb-6 sm:pb-8 border-t border-border/20 relative z-10">
        {/* Final CTA */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 tracking-tight"
          >
            Your selection starts today.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
            className="text-foreground/60 font-normal text-sm sm:text-base mb-6 sm:mb-8 max-w-lg mx-auto"
          >
            Join thousands of aspirants who stopped hoping and started preparing with precision.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Link 
              href="/practice" 
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-primary text-primary-foreground text-base sm:text-lg font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
            >
              Start Practicing — Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Quick Links Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16 text-left">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm flex items-center justify-center text-white shrink-0">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="font-bold text-base sm:text-lg tracking-tight">PrepPilot</span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm font-normal leading-relaxed max-w-xs">
              AI-driven exam preparation built specifically for SSC CGL, CHSL, CPO, MTS & GD aspirants.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="font-semibold text-foreground text-sm mb-1.5">Product</h4>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-normal">Dashboard</Link>
            <Link href="/SSC/maths/mental-maths" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-normal">Mental Maths Arena</Link>
            <Link href="/practice" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-normal">PYQ Vault</Link>
            <Link href="/analytics" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-normal">AI Analytics</Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="font-semibold text-foreground text-sm mb-1.5">Resources</h4>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-normal">SSC CGL Syllabus</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-normal">Previous Year Cutoffs</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-normal">Study Strategy</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-normal">Blog</Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="font-semibold text-foreground text-sm mb-1.5">Support</h4>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-normal">Help Center</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-normal">Contact Us</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-normal">Privacy Policy</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-normal">Terms of Service</Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="text-muted-foreground text-xs font-medium">
            © {new Date().getFullYear()} PrepPilot. Built for SSC Aspirants.
          </div>
          <div className="text-xs font-medium text-muted-foreground/60">
            Made with ❤️ for students who refuse to settle.
          </div>
        </div>
      </footer>

    </div>
  );
}
