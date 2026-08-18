"use client";

import React from "react";
import Link from "next/link";
import { 
  Target, BookOpen, Trophy, Zap, Brain, Flame, 
  ArrowRight, ShieldCheck, Sparkles, Swords, Clock, CheckCircle2, XCircle
} from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { Button } from "@/components/ui/button";

const TELEMETRY_STATS = [
  { label: "Memory Retention", val: "94%+", desc: "Scientific spaced repetition" },
  { label: "Arithmetic Target", val: "< 10s / Q", desc: "Instinctive mental math" },
  { label: "Syllabus Coverage", val: "CGL 2026", desc: "Strictly authenticated PYQs" },
  { label: "Distraction Level", val: "0.00%", desc: "Obsidian focused dark UI" },
];

const PILLARS = [
  {
    title: "Instinctive Calculation Speed",
    tag: "Quant Engine",
    desc: "With strict sectional time limits, manual scratchpad calculations guarantee missed attempts. We train subconscious muscle memory for squares, fractions, and multiplication shortcuts.",
    icon: Zap,
    theme: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    glow: "bg-emerald-500/10",
  },
  {
    title: "Long-Term Retention via Flashcards",
    tag: "Vocab & GK",
    desc: "Stop re-reading the same vocabulary lists endlessly. Our Smart Flashcard system schedules reviews right before your brain forgets, cutting study hours in half.",
    icon: Brain,
    theme: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    glow: "bg-violet-500/10",
  },
  {
    title: "Exam Pressure Simulation",
    tag: "Sprint Drills",
    desc: "High scores are made under pressure. Our timed blitz drills and gamified challenges condition your mind to execute high-accuracy decisions without second-guessing.",
    icon: Flame,
    theme: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    glow: "bg-amber-500/10",
  },
];

const COMPARISONS = [
  {
    traditional: "Passive reading from massive 800-page textbooks",
    pilot: "Active recall with rapid interactive flashcards & micro-drills",
  },
  {
    traditional: "Slow pen-and-paper arithmetic during exam time",
    pilot: "Instinctive mental calculation with real-time speed drills",
  },
  {
    traditional: "Studying random topics without weakness detection",
    pilot: "Targeted diagnostics routing directly to leaky score areas",
  },
  {
    traditional: "Boring static PDFs leading to consistency burnout",
    pilot: "Gamified streak tracking, XP milestones, and daily D-Day telemetry",
  },
];

export default function AboutPage() {
  return (
    <TopicPageLayout
      title="About PrepPilot"
      description="Engineered specifically for SSC CGL & government exam aspirants who value speed, scientific retention, and zero-distraction preparation."
      contentMaxWidthClass="w-full max-w-[1280px]"
    >
      <div className="flex flex-col gap-12 py-2">
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-card/60 backdrop-blur-2xl border border-border/40 p-8 sm:p-12 shadow-xl shadow-black/5 overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center sm:items-start max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 mb-4 shadow-xs">
              <Sparkles className="w-3 h-3" />
              Manifesto & System Architecture
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
              Engineered for Speed. <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent italic">
                Built for Rank 1.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed font-medium">
              Most aspirants fail not because they lack knowledge, but because they run out of time. PrepPilot replaces passive rote memorization with instinctive mental computation and cognitive retention protocols.
            </p>
          </div>

          <div className="flex sm:flex-col gap-3 relative z-10 shrink-0">
            <Link href="/practice">
              <Button className="h-12 px-6 rounded-full text-xs font-mono font-bold tracking-widest uppercase gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95 transition-all border-0 cursor-pointer">
                <Swords className="w-4 h-4" />
                Start Training
              </Button>
            </Link>
            <Link href="/SSC/maths/mental-maths">
              <Button variant="outline" className="h-12 px-6 rounded-full text-xs font-mono font-bold tracking-widest uppercase gap-2 border border-border/60 hover:bg-card/80 text-foreground cursor-pointer transition-all">
                Speed Math
              </Button>
            </Link>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TELEMETRY_STATS.map((stat, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40 flex flex-col justify-between shadow-sm hover:border-amber-500/30 transition-colors"
            >
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-foreground my-1.5 text-amber-500">
                {stat.val}
              </div>
              <span className="text-[11px] text-muted-foreground font-medium truncate">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Three Core Pillars Bento */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">
              Core Principles
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground mt-0.5">
              The Three Pillars of PrepPilot
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="p-6 sm:p-7 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/40 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between shadow-lg shadow-black/5 relative overflow-hidden group hover:-translate-y-1"
                >
                  <div className={`absolute -right-6 -top-6 w-28 h-28 ${pillar.glow} rounded-full blur-2xl group-hover:scale-125 transition-transform`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-inner ${pillar.theme}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full uppercase tracking-wider border border-border/40">
                        {pillar.tag}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black tracking-tight text-foreground mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Section: Traditional vs PrepPilot */}
        <div className="rounded-3xl bg-card/60 backdrop-blur-2xl border border-border/40 p-6 sm:p-10 shadow-xl shadow-black/5 flex flex-col gap-6">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">
              Methodology Breakdown
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground mt-0.5">
              Why Traditional Preparation Fails
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-rose-500/[0.03] border border-rose-500/20 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-xs font-mono uppercase tracking-wider">
                <XCircle className="w-4 h-4" />
                The Outdated Traditional Way
              </div>
              <div className="space-y-3">
                {COMPARISONS.map((comp, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground font-medium">
                    <span className="text-rose-500/70 font-bold mt-0.5">✕</span>
                    <span>{comp.traditional}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/30 flex flex-col gap-3 shadow-inner">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs font-mono uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                The PrepPilot Advantage
              </div>
              <div className="space-y-3">
                {COMPARISONS.map((comp, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground font-semibold">
                    <span className="text-amber-500 font-bold mt-0.5">✓</span>
                    <span>{comp.pilot}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Status & Community Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-foreground">
                Continuous Sprint Development for SSC CGL 2026
              </h4>
              <p className="text-[11px] text-muted-foreground font-medium">
                New calculation formulas, memory drills, and PYQ sets are pushed to the live database weekly.
              </p>
            </div>
          </div>
          <Link href="/feedback">
            <Button variant="ghost" className="px-4 py-2 h-auto text-xs font-mono font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 shrink-0 cursor-pointer border border-amber-500/20 rounded-full">
              Suggest a Feature <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </TopicPageLayout>
  );
}
