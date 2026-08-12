"use client";

import Link from "next/link";
import { ArrowRight, Brain, Zap, BookOpen, Target, Gamepad2, BarChart3, Rocket, XCircle, CheckCircle2, Check, Flame, Activity, Map, Dumbbell, Trophy, ChevronDown, Clock, Users, Shield, Heart, Scale, RefreshCw, Crosshair, Tag, ScrollText, LayoutDashboard, BrainCircuit } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView, useSpring, useMotionTemplate, Variants, useScroll } from "framer-motion";
import { useAuth } from "@/context/auth";

/* ─── Dominating Typing Effect ─── */
function DominatingText() {
  // Type "Dominating" only — cursor sits between "g" and ".", period is rendered after
  const word = "Dominating";
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(word.slice(0, i));
        if (i >= word.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, 60);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(startDelay);
  }, []);

  // Last 3 chars pulse gently once typing completes
  const stable = done ? displayed.slice(0, displayed.length - 3) : displayed;
  const pulse  = done ? displayed.slice(displayed.length - 3) : "";

  return (
    <span
      className="bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer"
      style={{ backgroundImage: "linear-gradient(90deg, #f59e0b, #f97316, #f43f5e, #f97316, #f59e0b, #f97316, #f43f5e, #f97316, #f59e0b)" }}
    >
      {"Start "}{stable}
      {pulse && <span className="dominating-pulse">{pulse}</span>}
      <span className="dominating-cursor" aria-hidden="true">_</span>
    </span>
  );
}

/* ─── Animated Counter (reusable) ─── */
function AnimatedCounter({ target, suffix = "", prefix = "", className = "", delay = 0, duration = 2 }: { target: number; suffix?: string; prefix?: string; className?: string; delay?: number; duration?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, { duration, ease: [0.22, 1, 0.36, 1] as const, delay });
      return controls.stop;
    }
  }, [isInView, count, target, delay, duration]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}

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
        className="w-full h-full origin-top bg-foreground"
        style={{ scaleY: scrollYProgress }}
      />
    </div>
  );
}

/* ─── Timeline Icon (Fills on scroll) ─── */
function TimelineIcon({ children, baseClass, activeClass }: { children: React.ReactNode, baseClass: string, activeClass: string }) {
  const ref = useRef(null);
  // Triggers when the icon crosses the 60% mark of the viewport (matching the timeline line)
  const isInView = useInView(ref, { margin: "0px 0px -40% 0px" });

  return (
    <div 
      ref={ref} 
      className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full border-4 border-background ring-2 flex items-center justify-center relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg
        ${isInView ? activeClass : `bg-background ${baseClass}`}
      `}
    >
      {children}
    </div>
  );
}

/* ─── TiltCard (3D physics on hover) ─── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring configurations for smooth physical feel
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig);
  
  // Spotlight effect
  const spotX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const spotY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);
  const spotlightBackground = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.06) 0%, transparent 80%)`;

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
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative rounded-2xl ${className}`}
    >
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
        style={{ background: spotlightBackground }}
      />
      <div style={{ transform: "translateZ(30px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Infinite Testimonials Marquee ─── */
const testimonials = [
  { name: "Rahul S.", exam: "CGL Tier 1", text: "The accuracy analytics completely changed how I prep. I stopped doing random mocks and focused on my weak areas. Scored 165+." },
  { name: "Priya M.", exam: "CHSL", text: "Mental maths arena is insanely addictive. I shaved 15 seconds off my average calculation time in just two weeks." },
  { name: "Vikash K.", exam: "CGL", text: "Finally an app that isn't bloated with ads. The UI is cleaner than most paid platforms. Worth every penny." },
  { name: "Anjali T.", exam: "CPO", text: "The spaced repetition for GK actually works. I remember obscure facts that I usually forget after two days." },
  { name: "Amit D.", exam: "MTS", text: "The honest comparison is real. I deleted all my telegram PDF groups after using PrepPilot." },
];

function InfiniteTestimonials() {
  return (
    <section className="w-full py-20 relative z-10 overflow-hidden bg-background">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 font-mono">
          <Heart className="w-3 h-3 text-amber-500" /> Wall of Love
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Trusted by Top Rankers</h2>
      </div>

      {/* Marquee Container */}
      <div className="relative flex overflow-x-hidden group">
        {/* Fading Edges */}
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-[marquee_35s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap">
          {/* Duplicate content to make scrolling seamless */}
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="inline-block w-[300px] sm:w-[400px] whitespace-normal mx-4">
              <div className="bg-card/40 backdrop-blur-md border border-border/30 rounded-2xl p-6 h-full flex flex-col relative noise-overlay">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{t.exam} Aspirant</div>
                  </div>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, signInWithGoogle } = useAuth();

  const dashboardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: dashScroll } = useScroll({
    target: dashboardRef,
    offset: ["start end", "center center"]
  });
  
  // Cinematic tilt effect for the hero dashboard
  const dashRotate = useTransform(dashScroll, [0, 1], [30, 0]);
  const dashScale = useTransform(dashScroll, [0, 1], [0.85, 1]);
  const dashOpacity = useTransform(dashScroll, [0, 1], [0.2, 1]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const } }
  };

  /* ─── Features with static Tailwind classes (fixes broken dynamic class generation) ─── */
  const features = [
    { icon: BookOpen, title: "Authentic PYQ Vault", desc: "Every shift from CGL, CHSL, CPO, MTS & GD — OCR-extracted, taxonomy-tagged, and ready for drill-mode practice.", iconBg: "bg-emerald-500/15", glowColor: "bg-emerald-500", iconText: "text-emerald-400", borderHover: "hover:border-emerald-500/25", shadowHover: "hover:shadow-emerald-500/10", hoverRotate: "group-hover:-rotate-12" },
    { icon: BarChart3, title: "AI-Powered Analytics", desc: "Pinpoint your exact weak topics, track accuracy trends over time, and get a personalized study roadmap — no guesswork.", iconBg: "bg-cyan-500/15", glowColor: "bg-cyan-500", iconText: "text-cyan-400", borderHover: "hover:border-cyan-500/25", shadowHover: "hover:shadow-cyan-500/10", hoverRotate: "group-hover:rotate-12" },
    { icon: Target, title: "Surgical Topic Drills", desc: "Zero in on specific subtopics like Trigonometry or Cloze Tests. Our engine serves questions weighted by your weakest areas.", iconBg: "bg-blue-500/15", glowColor: "bg-blue-500", iconText: "text-blue-400", borderHover: "hover:border-blue-500/25", shadowHover: "hover:shadow-blue-500/10", hoverRotate: "group-hover:rotate-6" },
    { icon: Zap, title: "Mental Maths Arena", desc: "Timed calculation sprints with adaptive difficulty. Shave seconds off your per-question time — the difference between selection and waitlist.", iconBg: "bg-amber-500/15", glowColor: "bg-amber-500", iconText: "text-amber-400", borderHover: "hover:border-amber-500/25", shadowHover: "hover:shadow-amber-500/10", hoverRotate: "group-hover:rotate-12" },
    { icon: Brain, title: "FSRS Smart Flashcards", desc: "The same spaced-repetition algorithm used by medical students — applied to GK facts, idioms, and vocabulary you keep forgetting.", iconBg: "bg-violet-500/15", glowColor: "bg-violet-500", iconText: "text-violet-400", borderHover: "hover:border-violet-500/25", shadowHover: "hover:shadow-violet-500/10", hoverRotate: "group-hover:-rotate-6" },
    { icon: Gamepad2, title: "Gamified Retention", desc: "Crosswords, word-hunts, and contextual games that make static GK and vocabulary stick — without the burnout of rote memorization.", iconBg: "bg-rose-500/15", glowColor: "bg-rose-500", iconText: "text-rose-400", borderHover: "hover:border-rose-500/25", shadowHover: "hover:shadow-rose-500/10", hoverRotate: "group-hover:-translate-y-1" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden flex flex-col items-center relative scroll-smooth">
      
      {/* ─── Ambient Background — Enhanced with stronger blobs & 4th violet blob ─── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] -left-20 w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-amber-500/30 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] -right-20 w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] bg-orange-500/25 blur-[140px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.10, 0.18, 0.10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-rose-500/15 blur-[100px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 25, 0], x: [0, -15, 0], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-[60%] left-[20%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] bg-violet-500/15 blur-[100px] rounded-full"
        />
        {/* Premium dot-grid texture — adapts to light/dark automatically */}
        <div className="absolute inset-0 dot-grid pointer-events-none" />
      </div>

      {/* ─── Navbar — Glassmorphic ─── */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-50 sticky top-0 bg-background/70 backdrop-blur-xl border-b border-border/30 overflow-hidden">
        {/* Amber brand accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center text-white shrink-0 hover:rotate-12 transition-transform duration-300">
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
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/30 hover:bg-card/80 hover:border-border/50 text-sm font-semibold transition-all text-foreground"
            >
              Dashboard
            </Link>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/30 hover:bg-card/80 hover:border-border/50 text-sm font-semibold transition-all text-foreground cursor-pointer"
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

      {/* ─── Hero Section — Premium ─── */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 md:pt-24 md:pb-28 flex flex-col items-center text-center relative z-10">


        {/* Hero Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-card/60 backdrop-blur-md border border-amber-500/25 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-foreground/80 mb-6 sm:mb-8 font-mono shadow-lg shadow-amber-500/10"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Powered by AI Analytics
        </motion.div>

        {/* Headline with Shimmer Gradient */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-5 sm:mb-6 max-w-5xl text-foreground"
        >
          Stop Guessing,{" "}
          <br className="hidden md:block" />
          <DominatingText />
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="text-sm sm:text-base md:text-lg text-foreground/60 max-w-2xl mb-8 sm:mb-10 font-normal leading-relaxed px-2 sm:px-0"
        >
          The only SSC prep platform that combines 10,000+ verified PYQs, AI-powered weakness analysis, and spaced repetition — so every hour you study actually moves your score. Built for CGL, CHSL, CPO, MTS & GD.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-2 sm:px-0"
        >
          <Link 
            href="/practice" 
            className="group flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-base sm:text-lg font-semibold hover:opacity-90 active:scale-[0.98] transition-all w-full sm:w-auto shadow-2xl shadow-amber-500/30"
          >
            Start Practicing — Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#how-it-works" 
            className="group flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-card/60 hover:bg-card/80 border border-border/40 hover:border-border/60 text-foreground text-base sm:text-lg font-semibold transition-all w-full sm:w-auto backdrop-blur-md"
          >
            See How It Works <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </motion.div>


        {/* ─── Trust Stats — Enhanced with color-coded hovers & gradient underlines ─── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 sm:py-8"
          aria-label="Platform statistics"
        >
          {[
            { value: 10, suffix: "k+", label: "Authentic PYQs", icon: ScrollText, color: "amber" as const },
            { value: 5, suffix: "+", label: "SSC Exams Covered", icon: Trophy, color: "emerald" as const },
            { value: 4, suffix: "", label: "Complete Sections", icon: LayoutDashboard, color: "blue" as const },
            { value: 24, suffix: "/7", label: "AI-Driven Insights", icon: BrainCircuit, color: "violet" as const },
          ].map((stat, i) => {
            const colors = {
              amber: { text: "group-hover:text-amber-500", border: "hover:border-amber-500/30", shadow: "hover:shadow-amber-500/10", glow: "bg-amber-500/10" },
              emerald: { text: "group-hover:text-emerald-500", border: "hover:border-emerald-500/30", shadow: "hover:shadow-emerald-500/10", glow: "bg-emerald-500/10" },
              blue: { text: "group-hover:text-blue-500", border: "hover:border-blue-500/30", shadow: "hover:shadow-blue-500/10", glow: "bg-blue-500/10" },
              violet: { text: "group-hover:text-violet-500", border: "hover:border-violet-500/30", shadow: "hover:shadow-violet-500/10", glow: "bg-violet-500/10" },
            }[stat.color];

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.08 }}
                className={`flex flex-col items-center justify-center group relative bg-card/30 backdrop-blur-sm border border-border/20 rounded-2xl p-4 sm:p-5 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:bg-card/60 ${colors.border} ${colors.shadow} overflow-hidden`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl ${colors.glow} pointer-events-none`} />
                
                {/* Animated Icon */}
                <stat.icon className={`w-6 h-6 mb-3 text-muted-foreground transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1 relative z-10 ${colors.text}`} />
                
                <div className="flex items-baseline gap-0.5 relative z-10">
                  <AnimatedCounter target={stat.value} delay={1.0 + i * 0.08} duration={2.5} className={`text-2xl sm:text-3xl font-black text-foreground transition-colors duration-500 ${colors.text}`} />
                  <span className={`text-lg sm:text-xl font-bold text-foreground transition-colors duration-500 ${colors.text}`}>{stat.suffix}</span>
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1 text-center group-hover:text-foreground/90 transition-colors relative z-10">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ─── Dashboard Preview Section — with contextual heading ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-5xl mt-14 sm:mt-20 mx-auto text-center relative z-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-5 font-mono">
            <BarChart3 className="w-3 h-3 text-amber-500" /> Live Dashboard Preview
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">See Your Analytics in Action</h2>
          <p className="text-foreground/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-8">Real-time accuracy trends, overall score, and streak tracking — all in one clean view.</p>
        </motion.div>

        {/* ─── Cinematic Dashboard Spotlight ─── */}
        <div ref={dashboardRef} className="w-full max-w-5xl relative mx-auto mt-4 sm:mt-8 perspective-[1200px] z-20">
          <motion.div
            style={{ 
              rotateX: dashRotate, 
              scale: dashScale, 
              opacity: dashOpacity,
              transformStyle: "preserve-3d" 
            }}
            className="w-full relative mx-auto origin-bottom"
            aria-hidden="true"
          >
            {/* Background Glow */}
            <div className="absolute -inset-16 bg-gradient-to-b from-amber-500/22 via-orange-500/10 to-amber-500/15 blur-[90px] rounded-full pointer-events-none" />
            
            {/* Glassmorphism Window */}
            <div className="relative rounded-t-xl sm:rounded-t-2xl lg:rounded-t-[2rem] border border-amber-500/20 bg-card/40 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-amber-500/10 p-3 sm:p-4 lg:p-6 h-[240px] sm:h-[280px] md:h-[380px] lg:h-[460px] flex flex-col pointer-events-none noise-overlay">
              
              {/* Window Chrome */}
              <div className="w-full flex items-center justify-between mb-5 pb-3 border-b border-border/30">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-background/60 backdrop-blur-sm border border-border/30 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-2 font-mono">
                  <Flame className="w-3 h-3 text-amber-500" /> 14-Day Streak
                </div>
              </div>

              {/* Dashboard Content Mock */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                
                {/* Column 1: Sectional Split */}
                <div className="col-span-1 flex flex-col">
                  <div className="flex-1 rounded-xl bg-background/60 backdrop-blur-sm border border-border/30 p-5 flex flex-col relative overflow-hidden group">
                    <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />
                    <div className="w-full flex justify-between items-center mb-4 relative z-10">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] font-mono flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Sectional Split</span>
                      </div>
                      <div className="text-[9px] font-semibold text-muted-foreground/50 font-mono uppercase tracking-widest">Today</div>
                    </div>
                    <div className="flex-1 flex flex-col gap-4 justify-center relative z-10">
                      {[
                        { label: "Quant", val: 92, color: "bg-emerald-500" },
                        { label: "Reasoning", val: 88, color: "bg-amber-500" },
                        { label: "English", val: 76, color: "bg-violet-500" },
                        { label: "GK / GS", val: 64, color: "bg-rose-500" }
                      ].map((stat, i) => (
                        <div key={stat.label} className="w-full">
                          <div className="flex justify-between text-[10px] font-bold mb-2 font-mono">
                            <span className="text-foreground/70">{stat.label}</span>
                            <span className="text-foreground">
                              <AnimatedCounter target={stat.val} suffix="%" delay={0.2 + i * 0.15} duration={3} />
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-border/40 overflow-hidden">
                            <motion.div 
                              className={`h-full rounded-full ${stat.color}`} 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${stat.val}%` }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 + i * 0.15, duration: 3, ease: [0.22, 1, 0.36, 1] as const }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 2: Accuracy Trend */}
                <div className="col-span-1 flex flex-col">
                  <div className="flex-1 bg-background/60 backdrop-blur-sm rounded-xl border border-border/30 p-5 flex flex-col relative overflow-hidden group">
                    <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />
                    <div className="w-full flex justify-between items-center mb-4 relative z-10">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] font-mono flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Accuracy Trend</span>
                      </div>
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        <ArrowRight className="w-2.5 h-2.5 text-amber-500 rotate-[-45deg]" />
                        <span className="text-[8px] font-bold text-amber-500 font-mono">+12%</span>
                      </div>
                    </div>
                    
                    {/* Classic Line Chart */}
                    <div className="flex-1 w-full h-24 relative mt-2 z-10">
                      {/* Full Grid Background */}
                      <div className="absolute inset-0 pointer-events-none py-2 z-0">
                        <div className="w-full h-full border-l-[2px] border-b-[2px] border-muted-foreground/30 relative">
                          <div className="absolute inset-0 flex flex-col justify-between">
                            {[...Array(5)].map((_, i) => <div key={i} className="w-full h-px bg-border/40" />)}
                          </div>
                          <div className="absolute inset-0 flex justify-between h-full">
                            {[...Array(7)].map((_, i) => <div key={i} className="h-full w-px bg-border/40" />)}
                          </div>
                        </div>
                      </div>

                      {/* SVG Connector Line + Area Fill */}
                      <motion.div 
                        className="absolute inset-0 z-10 pointer-events-none"
                        initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 2.0, ease: "easeOut" }}
                      >
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path fill="url(#areaFill)" d="M 0 45 L 16.666 48 L 33.333 35 L 50 39 L 66.666 26 L 83.333 21 L 100 15 L 100 100 L 0 100 Z" />
                          <path fill="none" stroke="currentColor" className="text-amber-500" strokeWidth="2.5" vectorEffect="non-scaling-stroke" d="M 0 45 L 16.666 48 L 33.333 35 L 50 39 L 66.666 26 L 83.333 21 L 100 15" />
                        </svg>
                      </motion.div>
                      
                      {[55, 52, 65, 61, 74, 79, 85].map((h, i) => {
                        return (
                          <div key={i} className="absolute h-full flex flex-col justify-end items-center group cursor-crosshair z-20 w-8 -ml-4" style={{ left: `${(i / 6) * 100}%` }}>
                            <motion.div 
                              initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.15, duration: 0.5, type: "spring" }}
                              className="w-3.5 h-3.5 rounded-full bg-background border-[3px] border-amber-500 absolute z-20 shadow-sm group-hover:scale-150 transition-transform duration-300"
                              style={{ bottom: `calc(${h}% - 7px)` }}
                            >
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded-md pointer-events-none shadow-xl font-mono whitespace-nowrap">
                                {h}%
                              </div>
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Column 3: Overall Accuracy */}
                <div className="col-span-1 flex flex-col">
                  <div className="bg-background/60 backdrop-blur-sm rounded-xl border border-border/30 p-5 flex-1 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />
                    <div className="w-full flex justify-between items-center mb-4 relative z-10">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] font-mono flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        <span>Accuracy %</span>
                      </div>
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                    </div>

                    <div className="flex-1 w-full flex flex-col items-center justify-center relative z-10 py-2 min-h-0">
                      <motion.div 
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-muted flex items-center justify-center shadow-lg shadow-amber-500/10"
                      >
                        <svg className="absolute inset-0 w-full h-full -rotate-90 overflow-visible" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="47" fill="none" className="stroke-background" strokeWidth="6" />
                          <motion.circle 
                            cx="50" cy="50" r="47" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 0.84, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 2, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <AnimatedCounter target={84} suffix="%" delay={0.2} className="text-2xl font-extrabold text-foreground font-mono" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2 relative z-10 shrink-0">
                      <div className="bg-background/40 rounded border border-border/30 p-2 text-center">
                        <div className="text-sm font-extrabold text-foreground font-mono">142</div>
                        <div className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Solved</div>
                      </div>
                      <div className="bg-background/40 rounded border border-border/30 p-2 text-center">
                        <div className="text-sm font-extrabold text-amber-500 font-mono">1:24</div>
                        <div className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Avg Pace</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Fog overlay for the bottom to blend seamlessly */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/90 via-background/50 to-transparent z-30 pointer-events-none" />
          </motion.div>
        </div>

      </main>

      {/* ─── Competitor Comparison — Glassmorphic with colored auras ─── */}
      <section id="competitor-dig" className="w-full py-16 sm:py-24 relative z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-card/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-5 font-mono">
              <Scale className="w-3 h-3 text-amber-500" /> The Honest Comparison
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
              className="bg-card/30 backdrop-blur-lg border border-border/30 rounded-2xl p-5 sm:p-7 flex flex-col relative overflow-hidden group hover:border-rose-500/20 transition-all duration-300"
            >
              {/* Red aura glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/5 blur-[60px] rounded-full group-hover:bg-rose-500/10 transition-colors duration-500" />
              <div className="absolute top-0 right-0 p-4 opacity-[0.04]">
                <XCircle className="w-28 h-28 text-rose-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-foreground/60 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-rose-500" />
                </div>
                Legacy Apps
              </h3>
              <motion.ul 
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                className="flex flex-col gap-3 sm:gap-3.5 text-foreground/70 text-sm sm:text-[15px]"
              >
                {[
                  { title: "Cluttered interface:", desc: "Drowning in banner ads and noisy pop-ups." },
                  { title: "Generic reports:", desc: "\"You got 60%\" — with zero actionable insight." },
                  { title: "Unreliable content:", desc: "Outdated question banks with no OCR verification." },
                  { title: "Chore-like experience:", desc: "Boring design with zero motivation to open daily." },
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-rose-500/80 font-bold mt-0.5 shrink-0">✕</span>
                    <span>
                      <span className="font-semibold text-foreground/80">{item.title}</span> {item.desc}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* The PrepPilot Way */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="bg-card/40 backdrop-blur-lg border-2 border-primary/20 rounded-2xl p-5 sm:p-7 flex flex-col relative overflow-hidden group hover:border-primary/40 transition-all duration-300 shadow-xl shadow-primary/5"
            >
              {/* Green aura glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/5 blur-[60px] rounded-full group-hover:bg-emerald-500/10 transition-colors duration-500" />
              <div className="absolute top-0 right-0 p-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
                <CheckCircle2 className="w-28 h-28 text-emerald-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-foreground flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                PrepPilot
              </h3>
              <motion.ul 
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
                className="flex flex-col gap-3 sm:gap-3.5 text-foreground/90 font-medium text-sm sm:text-[15px]"
              >
                {[
                  { title: "Laser-focused design:", desc: "Minimalist interface where every pixel earns its place." },
                  { title: "AI-driven insights:", desc: "Pinpoints exact weak subtopics with trend analysis." },
                  { title: "Authentic material:", desc: "100% of PYQs are OCR-extracted and manually verified." },
                  { title: "Habit-building tools:", desc: "Gamified streaks and micro-drills that make studying addictive." },
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
                    <span>
                      <span className="font-bold text-foreground">{item.title}</span> <span className="text-foreground/80">{item.desc}</span>
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── How It Works — Premium Timeline with gradient line ─── */}
      <section id="how-it-works" className="w-full py-16 sm:py-24 relative z-10 bg-background">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-5 font-mono">
              <RefreshCw className="w-3 h-3 text-amber-500" /> The PrepPilot Loop
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Four Steps to Selection
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              A feedback-driven cycle that ensures every hour you study is an hour spent on what actually moves your score.
            </motion.p>
          </motion.div>

          <div className="relative">
            {/* Gradient Connecting Line */}
            <ScrollTimelineLine />

            <div className="flex flex-col gap-10 md:gap-16 relative z-10">
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-center group"
              >
                <div className="hidden md:block md:w-1/2 md:text-right">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-2 font-mono">Step 1</div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">Take a Diagnostic PYQ</h3>
                  <p className="text-foreground/60 leading-relaxed text-sm">Attempt a full Previous Year Paper under timed conditions. Our engine analyzes all 100 questions to map your baseline accuracy, speed, and section-wise strengths.</p>
                </div>
                <TimelineIcon 
                  baseClass="ring-blue-500/20 text-blue-500" 
                  activeClass="scale-110 bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                >
                  <Activity className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
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
                <div className="hidden md:block md:w-1/2" />
                <TimelineIcon 
                  baseClass="ring-amber-500/20 text-amber-500" 
                  activeClass="scale-110 bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                >
                  <Map className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
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
                <div className="hidden md:block md:w-1/2 md:text-right">
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-2 font-mono">Step 3</div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">Execute Daily Drills</h3>
                  <p className="text-foreground/60 leading-relaxed text-sm">20 targeted PYQs, 5 minutes of Mental Maths, and FSRS flashcard reviews — every single day. Small, consistent inputs that compound.</p>
                </div>
                <TimelineIcon 
                  baseClass="ring-emerald-500/20 text-emerald-500" 
                  activeClass="scale-110 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                >
                  <Dumbbell className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
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
                <div className="hidden md:block md:w-1/2" />
                <TimelineIcon 
                  baseClass="ring-violet-500/20 text-violet-500" 
                  activeClass="scale-110 bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                >
                  <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                </TimelineIcon>
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

      {/* ─── Features Arsenal — Glass Cards with shine-sweep hover ─── */}
      <section className="w-full py-16 sm:py-24 relative z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-card/5 via-card/10 to-card/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-5 font-mono">
              <Crosshair className="w-3 h-3 text-amber-500" /> Built for Serious Aspirants
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
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <TiltCard key={f.title}>
                  <motion.div 
                    variants={itemVariants} 
                    className={`group relative flex flex-col p-6 sm:p-8 rounded-[24px] bg-card/40 backdrop-blur-xl border border-border/30 ${f.borderHover} hover:shadow-2xl ${f.shadowHover} transition-all duration-500 ease-out hover:-translate-y-1 shine-sweep h-full noise-overlay`}
                  >
                  {/* Subtle hover gradient overlay */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-[24px] ${f.glowColor}`} />
                  
                  {/* Editorial index number */}
                  <span className="absolute top-6 right-6 text-[10px] font-black font-mono text-muted-foreground/20 group-hover:text-muted-foreground/45 transition-colors tracking-[0.2em] select-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  
                  {/* Icon */}
                  <div className="relative mb-6 w-fit">
                    <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${f.iconBg} ${f.iconText} flex items-center justify-center overflow-hidden border border-border/10 group-hover:border-transparent transition-colors`}>
                      <Icon className={`w-6 h-6 transition-all duration-500 ease-out group-hover:scale-110 ${f.hoverRotate}`} />
                    </div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-foreground tracking-tight group-hover:text-foreground transition-colors">{f.title}</h3>
                  <p className="text-foreground/60 leading-relaxed text-sm transition-colors group-hover:text-foreground/70">
                    {f.desc}
                  </p>
                  </motion.div>
                </TiltCard>
              );
            })}
          </motion.div>
        </div>
      </section>

      <InfiniteTestimonials />

      {/* Pricing / Subscription Section */}
      <section className="w-full py-24 relative z-10 bg-background">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-5 font-mono">
              <Tag className="w-3 h-3 text-amber-500" /> Pricing
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              Start for free, upgrade when you are ready to dominate the leaderboard.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <TiltCard>
              <motion.div 
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-card/50 border border-border/30 rounded-3xl p-8 flex flex-col hover:border-border/60 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 shadow-sm h-full noise-overlay"
              >
              <div className="mb-8">
                <h3 className="text-2xl font-black text-foreground mb-2">Free</h3>
                <p className="text-foreground/70 text-sm font-medium">For casual learners exploring the platform.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-foreground">₹0</span>
                  <span className="text-muted-foreground font-medium">/forever</span>
                </div>
              </div>
              
              <ul className="flex flex-col gap-4 text-foreground/80 font-medium mb-10 flex-1">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> 
                  <span><span className="font-bold text-foreground">Limited PYQ Vault:</span> Access to 3 recent shifts per exam</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> 
                  <span><span className="font-bold text-foreground">Daily Sprints:</span> 10-minute mixed calculation drills</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> 
                  <span><span className="font-bold text-foreground">Basic Flashcards:</span> Standard spaced-repetition</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> 
                  <span><span className="font-bold text-foreground">Standard Analytics:</span> Simple accuracy tracking</span>
                </li>
              </ul>
              
              <Link 
                href="/dashboard" 
                className="w-full py-3 rounded-2xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-colors text-center"
              >
                Start Free
              </Link>
              </motion.div>
            </TiltCard>

            {/* Pro Tier */}
            <TiltCard>
              <motion.div 
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                className="relative p-[2px] rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/20 group h-full"
              >
                {/* Animated Gradient Border */}
                <div className="absolute inset-[-100%] animate-[border-spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(245,158,11,1)_360deg)] opacity-70 pointer-events-none" />
                
                <div className="bg-gradient-to-br from-zinc-900 to-black rounded-[22px] p-8 flex flex-col relative overflow-hidden text-white h-full noise-overlay z-10 border border-amber-500/10">
                  {/* Ambient Glows */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none"></div>

              <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl rounded-tr-2xl shadow-lg z-10">
                Most Popular
              </div>
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                  PrepPilot <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-950 px-2 py-0.5 rounded-md text-sm shadow-md">PRO</span>
                </h3>
                <p className="text-zinc-400 text-sm font-medium">For serious aspirants aiming for top ranks.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹99</span>
                  <span className="text-zinc-500 font-medium">/month</span>
                </div>
              </div>
              
              <ul className="flex flex-col gap-4 text-zinc-300 font-medium mb-10 flex-1 relative z-10">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> 
                  <span><span className="font-bold text-white">Unlimited PYQ Vault:</span> Every historical shift unlocked</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> 
                  <span><span className="font-bold text-white">AI Weakness Engine:</span> Surgical topic recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> 
                  <span><span className="font-bold text-white">Advanced Drills:</span> Subject-wise & topic-wise practice</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> 
                  <span><span className="font-bold text-white">FSRS Algorithm:</span> Medical-grade flashcard syncing</span>
                </li>
              </ul>
              
              <Link 
                href="/dashboard" 
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:opacity-90 active:scale-[0.98] transition-all text-center shadow-lg shadow-amber-500/25 relative z-10"
              >
                Upgrade to Pro
              </Link>
                </div>
              </motion.div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ─── Footer — Premium CTA with shimmer ─── */}
      <footer className="w-full pt-16 sm:pt-24 pb-6 sm:pb-8 relative z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        {/* Final CTA */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent pointer-events-none" />
          {/* Amber ambient halo — gives the footer CTA a premium glow backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/5 blur-[130px] rounded-full pointer-events-none" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24 text-center relative">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 tracking-tight"
            >
              Your selection{" "}
              <span 
                className="bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer"
                style={{ backgroundImage: 'linear-gradient(90deg, #f59e0b, #f97316, #f43f5e, #f97316, #f59e0b, #f97316, #f43f5e, #f97316, #f59e0b)' }}
              >
                starts today.
              </span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left relative">
          <div className="absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
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
