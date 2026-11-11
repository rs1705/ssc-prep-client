"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  Brain,
  Flame,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Swords,
  CheckCircle2,
  XCircle,
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
    theme: "text-emerald-500 bg-[color-mix(in_oklab,var(--color-emerald-500)_10%,var(--card))] border-emerald-500/20",
    glow: "bg-[color-mix(in_oklab,var(--color-emerald-500)_10%,var(--card))]",
  },
  {
    title: "Long-Term Retention via Flashcards",
    tag: "Vocab & GK",
    desc: "Stop re-reading the same vocabulary lists endlessly. Our Smart Flashcard system schedules reviews right before your brain forgets, cutting study hours in half.",
    icon: Brain,
    theme: "text-fuchsia-600 dark:text-fuchsia-400 bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))] border-fuchsia-500/20",
    glow: "bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))]",
  },
  {
    title: "Exam Pressure Simulation",
    tag: "Timed drills",
    desc: "High scores are made under pressure. Our timed blitz drills and gamified challenges condition your mind to execute high-accuracy decisions without second-guessing.",
    icon: Flame,
    theme: "text-brand-700 dark:text-brand-400 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] border-brand-500/20",
    glow: "bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))]",
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
      title="About EptSsc"
      description="Engineered specifically for SSC CGL & government exam aspirants who value speed, scientific retention, and zero-distraction preparation."
    >
      <div className="flex flex-col gap-12 py-2">
        {/* Hero Section */}
        <div 
          className="relative rounded-3xl surface-card p-8 sm:p-12 shadow-xl shadow-black/5 overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700"
          style={{ animationDelay: "200ms", animationFillMode: "both" }}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[color-mix(in_oklab,var(--brand-alt-500)_10%,var(--card))] rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center sm:items-start max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] border-2 border-brand-500/20 mb-4 shadow-xs">
              <Sparkles className="w-3 h-3" />
              Manifesto & System Architecture
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
              Engineered for Speed. <br />
              <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-alt-500 bg-clip-text text-transparent italic">
                Built for Rank 1.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed font-medium">
              Most aspirants fail not because they lack knowledge, but because they run out of time. EptSsc (Elite Prep Training) replaces passive rote memorization with instinctive mental computation and cognitive retention protocols.
            </p>
          </div>

          <div className="flex sm:flex-col gap-3 relative z-10 shrink-0">
            <Link href="/practice">
              <Button className="h-12 px-6 rounded-full text-xs font-mono font-bold tracking-widest uppercase gap-2 bg-gradient-to-r from-brand-500 to-brand-alt-500 text-white shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 active:scale-95 transition-all border-0 cursor-pointer">
                <Swords className="w-4 h-4" />
                Start Training
              </Button>
            </Link>
            <Link href="/SSC/maths/mental-maths">
              <Button variant="outline" className="h-12 px-6 rounded-full text-xs font-mono font-bold tracking-widest uppercase gap-2 border-2 border-border hover:bg-card text-foreground cursor-pointer transition-all">
                Speed Math
              </Button>
            </Link>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        >
          {TELEMETRY_STATS.map((stat, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl surface-card flex flex-col justify-between shadow-sm hover:border-brand-500/30 transition-colors"
            >
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight my-1.5 text-brand-700 dark:text-brand-400">
                {stat.val}
              </div>
              <span className="text-xs text-muted-foreground font-medium truncate">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Three Core Pillars Bento */}
        <div 
          className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700"
          style={{ animationDelay: "400ms", animationFillMode: "both" }}
        >
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold text-brand-700 dark:text-brand-400 uppercase tracking-widest">
              Core Principles
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground mt-0.5">
              The Three Pillars of EptSsc
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="p-6 sm:p-7 rounded-3xl surface-card hover:border-brand-500/30 transition-all duration-300 flex flex-col justify-between shadow-lg shadow-black/5 relative overflow-hidden group hover:-translate-y-1"
                >
                  <div className={`absolute -right-6 -top-6 w-28 h-28 ${pillar.glow} rounded-full blur-2xl group-hover:scale-125 transition-transform`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border-2 shadow-inner ${pillar.theme}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-muted-foreground bg-[color-mix(in_oklab,var(--muted)_60%,var(--card))] px-2.5 py-1 rounded-full uppercase tracking-wider border-2 border-border">
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

        {/* Comparison Section: Traditional vs EptSsc */}
        <div 
          className="rounded-3xl surface-card p-6 sm:p-10 shadow-xl shadow-black/5 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700"
          style={{ animationDelay: "500ms", animationFillMode: "both" }}
        >
          <div>
            <span className="text-xs font-mono font-bold text-brand-700 dark:text-brand-400 uppercase tracking-widest">
              Methodology Breakdown
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground mt-0.5">
              Why Traditional Preparation Fails
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[color-mix(in_oklab,var(--color-rose-500)_3%,var(--card))] border-2 border-rose-500/20 flex flex-col gap-3">
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

            <div className="p-5 rounded-2xl bg-[color-mix(in_oklab,var(--brand-500)_4%,var(--card))] border-2 border-brand-500/30 flex flex-col gap-3 shadow-inner">
              <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-bold text-xs font-mono uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                The EptSsc Advantage
              </div>
              <div className="space-y-3">
                {COMPARISONS.map((comp, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground font-semibold">
                    <span className="text-brand-700 dark:text-brand-400 font-bold mt-0.5">✓</span>
                    <span>{comp.pilot}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Status & Community Banner */}
        <div 
          className="bg-card rounded-2xl bg-gradient-to-r from-brand-500/10 via-brand-alt-500/5 to-transparent border-2 border-brand-500/20 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700"
          style={{ animationDelay: "600ms", animationFillMode: "both" }}
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[color-mix(in_oklab,var(--brand-500)_15%,var(--card))] border-2 border-brand-500/30 flex items-center justify-center text-brand-700 dark:text-brand-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-foreground">
                Built continuously for SSC CGL
              </h4>
              <p className="text-xs text-muted-foreground font-medium">
                New formulas, drills and PYQ sets are added regularly.
              </p>
            </div>
          </div>
          <Link href="/feedback">
            <Button variant="ghost" className="px-4 py-2 h-auto text-xs font-mono font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] shrink-0 cursor-pointer border-2 border-brand-500/20 rounded-full">
              Suggest a Feature <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </TopicPageLayout>
  );
}
