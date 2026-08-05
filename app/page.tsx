"use client";

import Link from "next/link";
import { ArrowRight, Brain, Zap, BookOpen, Target, Gamepad2, BarChart3, Rocket, XCircle, CheckCircle2, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden flex flex-col items-center relative scroll-smooth">
      
      {/* Dynamic Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-amber-500/30 blur-[100px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 -right-20 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-orange-500/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-rose-500/10 blur-[80px] rounded-full"
        />
      </div>

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-50">
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
            <div className="font-black text-xl tracking-tight text-foreground">PrepPilot</div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">All SSC Exams</div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-4"
        >
          <Link 
            href="/dashboard" 
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted/50 hover:bg-muted text-sm font-bold transition-all text-foreground"
          >
            Sign In
          </Link>
          <Link 
            href="/dashboard" 
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/25"
          >
            Enter App <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="w-full max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-28 md:pb-32 flex flex-col items-center text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 backdrop-blur-sm border border-border/50 text-[11px] font-bold tracking-widest uppercase text-foreground/80 mb-8"
        >
          <span className="text-lg leading-none mb-0.5">✨</span>
          Powered by Next-Gen AI Analytics
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05] mb-6 max-w-5xl text-foreground"
        >
          The Ultimate Arsenal for <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
            All SSC Exams.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="text-lg md:text-2xl text-foreground/80 max-w-3xl mb-12 font-medium leading-relaxed"
        >
          From CGL to MTS, train your brain with AI-driven analytics, a vast bank of PYQs (2020-2025), and zero distractions. No clutter. No ads. Just pure focus.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link 
            href="/dashboard" 
            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-foreground text-background text-lg font-bold hover:scale-105 transition-all w-full sm:w-auto shadow-xl shadow-foreground/10"
          >
            Start Practicing Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#competitor-dig" 
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-muted/50 hover:bg-muted text-foreground text-lg font-bold transition-all w-full sm:w-auto backdrop-blur-sm"
          >
            See The Difference
          </a>
        </motion.div>
      </main>

      {/* The Competitor Dig Section */}
      <section id="competitor-dig" className="w-full py-24 relative z-10 border-t border-border/40 bg-gradient-to-b from-card/30 to-background">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              Why We Are Different
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/80 md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Tired of the famous "T-Book" or "O-Board" apps looking like 1990s ad-boards? We were too.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* The Old Way */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-card/50 border border-border/50 rounded-3xl p-8 flex flex-col relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <XCircle className="w-24 h-24 text-rose-500" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground/70 flex items-center gap-2">
                <XCircle className="w-6 h-6 text-rose-500" /> Legacy Apps
              </h3>
              <ul className="flex flex-col gap-4 text-foreground/80">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span> Cluttered, messy UI that distracts you.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span> Bombarded with pop-up ads and up-sells.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span> Generic analytics that don't actually help.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span> Feels like a chore to use every day.
                </li>
              </ul>
            </motion.div>

            {/* The PrepPilot Way */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-gradient-to-br from-card to-background border-2 border-primary/40 rounded-3xl p-8 flex flex-col relative overflow-hidden group hover:border-primary transition-colors shadow-2xl shadow-primary/5"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle2 className="w-24 h-24 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" /> PrepPilot
              </h3>
              <ul className="flex flex-col gap-4 text-foreground font-medium">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span> Minimalist, distraction-free environment.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span> Zero ads. Zero visual clutter.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span> Deep AI-driven analytics that pinpoint weaknesses.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span> Gamified, lightning-fast interactions.
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Arsenal (Features Section) */}
      <section className="w-full bg-card/20 border-y border-border/40 py-24 relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              Your Complete Arsenal
            </motion.h2>
            <motion.p variants={itemVariants} className="text-foreground/80 md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Everything you need to crack the exam, built natively with speed and retention in mind.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="group relative flex flex-col p-8 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:border-emerald-500/30 hover:ring-1 hover:ring-emerald-500/30 transition-all duration-300 ease-out hover:-translate-y-0.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 overflow-hidden">
                <BookOpen className="w-7 h-7 transition-all duration-500 ease-out group-hover:scale-125 group-hover:-rotate-12" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Authentic PYQs (2020-2025)</h3>
              <p className="text-foreground/80 leading-relaxed text-sm">
                Practice from a vast bank of past year papers covering SSC CGL, CPO, MTS, CHSL, and GD to understand exact exam patterns.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="group relative flex flex-col p-8 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:border-cyan-500/30 hover:ring-1 hover:ring-cyan-500/30 transition-all duration-300 ease-out hover:-translate-y-0.5">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-6 overflow-hidden">
                <BarChart3 className="w-7 h-7 transition-all duration-500 ease-out group-hover:scale-125 group-hover:rotate-12" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">AI Detailed Analysis</h3>
              <p className="text-foreground/80 leading-relaxed text-sm">
                Get your detailed analysis with the help of AI. Track exact accuracy, pacing, and discover weak topics instantly.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="group relative flex flex-col p-8 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:border-blue-500/30 hover:ring-1 hover:ring-blue-500/30 transition-all duration-300 ease-out hover:-translate-y-0.5">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 overflow-hidden">
                <Target className="w-7 h-7 transition-all duration-500 ease-out group-hover:scale-110 group-hover:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Topic-Wise Practice</h3>
              <p className="text-foreground/80 leading-relaxed text-sm">
                Granular, highly-focused drills targeting specific weak points across Quantitative Aptitude, Reasoning, English, and GK.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={itemVariants} className="group relative flex flex-col p-8 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:border-amber-500/30 hover:ring-1 hover:ring-amber-500/30 transition-all duration-300 ease-out hover:-translate-y-0.5">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 overflow-hidden">
                <Zap className="w-7 h-7 transition-all duration-500 ease-out group-hover:scale-125 group-hover:rotate-12 group-hover:fill-amber-500/20" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Speed Math Arena</h3>
              <p className="text-foreground/80 leading-relaxed text-sm">
                Timed numerical drills, custom difficulty bounds, and instant pacing feedback to drastically reduce your calculation times.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div variants={itemVariants} className="group relative flex flex-col p-8 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:border-violet-500/30 hover:ring-1 hover:ring-violet-500/30 transition-all duration-300 ease-out hover:-translate-y-0.5">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-6 overflow-hidden">
                <Brain className="w-7 h-7 transition-all duration-500 ease-out group-hover:scale-125 group-hover:-rotate-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Smart Flashcards (FSRS)</h3>
              <p className="text-foreground/80 leading-relaxed text-sm">
                Powered by the advanced Free Spaced Repetition Scheduler algorithm to guarantee high retention of GS facts and English vocabulary.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div variants={itemVariants} className="group relative flex flex-col p-8 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:border-rose-500/30 hover:ring-1 hover:ring-rose-500/30 transition-all duration-300 ease-out hover:-translate-y-0.5">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 overflow-hidden">
                <Gamepad2 className="w-7 h-7 transition-all duration-500 ease-out group-hover:scale-125 group-hover:-translate-y-1" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Gamified Learning</h3>
              <p className="text-foreground/80 leading-relaxed text-sm">
                Engaging mini-games like Hangman and Crosswords to learn dry vocabulary and static GK without the burnout.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing / Subscription Section */}
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
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 hover:scale-[1.02] transition-all text-center shadow-lg shadow-primary/25"
              >
                Upgrade to Pro
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="w-full bg-card/30 pt-24 pb-12 text-center border-t border-border/10 relative z-10">
        <div className="max-w-3xl mx-auto px-6 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black mb-6 tracking-tight"
          >
            Ready to boost your score?
          </motion.h2>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Link 
              href="/dashboard" 
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
        <div className="text-muted-foreground text-sm font-medium">
          © {new Date().getFullYear()} PrepPilot. Built for SSC Aspirants.
        </div>
      </footer>

    </div>
  );
}
