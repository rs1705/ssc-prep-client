"use client";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import {
  Flame,
  ArrowUpRight,
  Calculator,
  Sigma,
  Languages,
  Newspaper,
  Zap,
  Target,
  Bookmark,
  ScrollText,
  ChevronRight,
  History,
  Gamepad2,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const mockStats = {
    streak: 12,
    xp: "2,480",
    todayGoal: 30,
    solved: 12,
    percent: "40%",
  };

  const subjects = [
    {
      icon: Calculator,
      name: "Quant",
      qs: "1,240 QS",
      to: "/SSC/maths",
      progress: 68,
      theme: "emerald",
    },
    {
      icon: Sigma,
      name: "Reasoning",
      qs: "890 QS",
      to: "/SSC/reasoning",
      progress: 54,
      theme: "amber",
    },
    {
      icon: Languages,
      name: "English",
      qs: "720 QS",
      to: "/SSC/english",
      progress: 42,
      theme: "violet",
    },
    {
      icon: Newspaper,
      name: "GK / GS",
      qs: "1,580 QS",
      to: "/SSC/gk",
      progress: 35,
      theme: "rose",
    },
  ];

  const quickActions = [
    { icon: Zap, label: "Speed Math", to: "/SSC/maths/mental-maths" },
    {
      icon: Target,
      label: "Daily Flashcards",
      to: "/SSC/english/flashcards/fsrs",
    },
    { icon: Gamepad2, label: "Hangman Sprint", to: "/SSC/english/hangman" },
  ];

  const recentSessions = [
    {
      name: "Ratio & Proportion",
      date: "22/25 · 12:40",
      score: "88%",
      xp: "+45 XP",
      icon: Calculator,
    },
    {
      name: "Reading Comp.",
      date: "18/20 · 09:12",
      score: "90%",
      xp: "+30 XP",
      icon: Languages,
    },
    {
      name: "Static GK — History",
      date: "14/20 · 14:20",
      score: "70%",
      xp: "+18 XP",
      icon: Newspaper,
    },
  ];

  const themeClasses: Record<string, { 
    bg: string; 
    text: string; 
    hoverBorder: string; 
    hoverBg: string;
    barGrad: string;
  }> = {
    emerald: { 
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15", 
      text: "text-emerald-600 dark:text-emerald-400",
      hoverBorder: "hover:border-emerald-500/50",
      hoverBg: "hover:bg-emerald-500/[0.03]",
      barGrad: "from-emerald-400 to-emerald-600",
    },
    amber: { 
      bg: "bg-amber-500/10 dark:bg-amber-500/15", 
      text: "text-amber-600 dark:text-amber-400",
      hoverBorder: "hover:border-amber-500/50",
      hoverBg: "hover:bg-amber-500/[0.03]",
      barGrad: "from-amber-400 to-orange-500",
    },
    violet: { 
      bg: "bg-violet-500/10 dark:bg-violet-500/15", 
      text: "text-violet-600 dark:text-violet-400",
      hoverBorder: "hover:border-violet-500/50",
      hoverBg: "hover:bg-violet-500/[0.03]",
      barGrad: "from-violet-400 to-purple-600",
    },
    rose: { 
      bg: "bg-rose-500/10 dark:bg-rose-500/15", 
      text: "text-rose-600 dark:text-rose-400",
      hoverBorder: "hover:border-rose-500/50",
      hoverBg: "hover:bg-rose-500/[0.03]",
      barGrad: "from-rose-400 to-rose-600",
    },
  };

  return (
    <ProtectedRoute>
      <div className="w-full h-full p-4 lg:p-8 space-y-8 pb-32 overflow-x-hidden max-w-[1600px] mx-auto">
        {/* Hero Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationFillMode: "both" }}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border-2 border-amber-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                CGL 2026 Focus Mode
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground">{user?.displayName?.split(" ")[0] || "Champ"}</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="px-4 py-2 rounded-2xl bg-card/60 backdrop-blur-md border-2 border-border/50 text-xs font-mono font-bold text-muted-foreground flex items-center gap-2 shadow-xs">
              <Target className="w-4 h-4 text-amber-500" />
              <span>Target: Tier 1 Exam</span>
            </div>
          </div>
        </div>

        {/* Top Row: Target & Resume */}
        <div className="grid lg:grid-cols-2 gap-5 mb-10">
          {/* Streak / Target Card */}
          <div className="rounded-3xl bg-card/60 backdrop-blur-2xl border-2 border-amber-500/30 p-6 sm:p-7 shadow-lg shadow-amber-500/5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground bg-background/60 px-3 py-1 rounded-full border-2 border-border/40">
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" strokeWidth={2.5} />
                Streak · {mockStats.streak} days
              </div>
              <div className="text-right">
                <div className="text-[9px] font-mono font-bold tracking-widest uppercase text-muted-foreground">
                  XP EARNED
                </div>
                <div className="text-lg font-black font-mono text-amber-500">
                  {mockStats.xp}
                </div>
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-black tracking-tight mb-4 text-foreground relative z-10">
              Today's Target · <span className="font-mono text-amber-500">{mockStats.todayGoal}</span> Qs
            </div>

            {/* Progress bar inside its own container */}
            <div className="w-full h-3 bg-muted/70 rounded-full overflow-hidden mb-3 border-2 border-border/50 p-0.5 relative z-10">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full shadow-xs transition-all duration-500"
                style={{ width: mockStats.percent }}
              />
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div className="inline-flex items-center gap-2 bg-foreground text-background text-[10px] font-mono font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-sm">
                <span>
                  {mockStats.solved} / {mockStats.todayGoal} SOLVED
                </span>
                <span className="text-amber-400">({mockStats.percent})</span>
              </div>
              <span className="text-xs font-mono font-semibold text-muted-foreground">18 Qs to daily goal</span>
            </div>

            {/* Week tracker pills */}
            <div className="mt-5 grid grid-cols-7 gap-1.5 relative z-10">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-2.5 w-full rounded-full transition-all ${
                      i < 5 
                        ? "bg-amber-500 shadow-xs shadow-amber-500/30" 
                        : i === 5 
                        ? "bg-amber-500/40" 
                        : "bg-muted/70"
                    }`}
                  />
                  <span className="text-[8px] font-mono font-bold text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Resume Card with 2px Outer Border */}
          <Link
            href="/SSC/maths/mental-maths"
            className="group rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-6 sm:p-7 flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/30 cursor-pointer border-2 border-amber-600/70 dark:border-amber-400/40 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 zoom-in-95"
            style={{ animationDelay: "150ms", animationFillMode: "both" }}
          >
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-widest uppercase bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-white mb-2">
                  <Zap className="w-3 h-3" /> Quick Resume
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                  Speed Math — Percentages
                </div>
                <div className="text-white/80 text-xs sm:text-sm font-medium mt-1">
                  Mathematics · Core Sprint Module
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 group-hover:scale-105 transition-all duration-300 shadow-sm shrink-0">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="relative z-10 mt-6">
              <div className="h-2 rounded-full bg-black/20 overflow-hidden mb-2">
                <div className="h-full bg-white rounded-full w-[32%] shadow-sm" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-white/90">
                <span>Q 8 / 25 SOLVED</span>
                <span>~ 8 MIN REMAINING</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Bottom Section */}
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-10 mb-10 items-stretch">
          
          {/* Left Column (Main Content) */}
          <div className="flex-1 flex flex-col gap-10 min-w-0">
            
            {/* Subjects Row with 2px borders, Mastery progress bars, and subtle hover color fill */}
            <div className="animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                  <span>Subject Command Centers</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <Link
                  href="/SSC"
                  className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  All 4 Tracks <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
                {subjects.map((s) => {
                  const colors = themeClasses[s.theme];
                  return (
                    <Link
                      key={s.name}
                      href={s.to}
                      className={`group rounded-3xl bg-card/70 backdrop-blur-xl border-2 border-border/60 p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden ${colors.hoverBorder} ${colors.hoverBg}`}
                    >
                      <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-inner ring-1 ring-border/40`}>
                          <s.icon className={`w-5 h-5 ${colors.text}`} strokeWidth={2.2} />
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                      
                      <div className="relative z-10">
                        <div className="font-extrabold text-lg tracking-tight text-foreground group-hover:text-amber-500 transition-colors">
                          {s.name}
                        </div>
                        <div className="text-xs font-mono font-semibold text-muted-foreground mt-0.5">
                          {s.qs}
                        </div>

                        {/* Mastery Progress Bar */}
                        <div className="mt-4 pt-3 border-t-2 border-border/40">
                          <div className="flex justify-between text-[10px] font-mono font-bold text-muted-foreground mb-1.5">
                            <span>Mastery</span>
                            <span className={colors.text}>{s.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-muted/60 overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${colors.barGrad}`}
                              style={{ width: `${s.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions (Wide Screen Only) */}
            <div className="hidden xl:block animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
              <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground mb-4">
                Fast Drills & Tools
              </div>
              <div className="grid grid-cols-3 gap-4">
                {quickActions.map((q) => (
                  <Link
                    key={q.label}
                    href={q.to}
                    className="rounded-2xl bg-card/60 backdrop-blur-md border-2 border-border/60 p-4.5 flex items-center gap-4 hover:border-amber-500/40 hover:bg-amber-500/[0.03] hover:shadow-md transition-all shadow-xs cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-inner ring-1 ring-border/40">
                      <q.icon className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <div className="font-bold text-sm text-foreground group-hover:text-amber-500 transition-colors">{q.label}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Second Row for Medium Screens */}
            <div className="xl:hidden flex flex-col gap-8">
              {/* Quick Actions */}
              <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
                <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground mb-3">
                  Fast Drills & Tools
                </div>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4 h-full">
                  {quickActions.map((q) => (
                    <Link
                      key={q.label}
                      href={q.to}
                      className="flex-1 rounded-2xl bg-card/60 backdrop-blur-md border-2 border-border/60 p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 hover:border-amber-500/40 hover:bg-amber-500/[0.03] transition-all shadow-xs cursor-pointer justify-center text-center sm:text-left group"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-inner ring-1 ring-border/40">
                        <q.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
                      </div>
                      <div className="font-bold text-foreground text-[10px] sm:text-xs leading-tight">{q.label}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Sessions */}
              <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "500ms", animationFillMode: "both" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground">
                    Recent Drill Feed
                  </div>
                  <Link
                    href="/history"
                    className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-500 hover:text-amber-400 flex items-center gap-1"
                  >
                    History <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="bg-card/60 backdrop-blur-xl border-2 border-border/60 rounded-3xl p-3 flex flex-col shadow-sm h-full justify-between gap-1">
                  {recentSessions.map((session, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 sm:p-3.5 hover:bg-muted/40 rounded-2xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 group-hover:bg-background transition-all duration-300 ease-out group-hover:scale-110 shadow-inner ring-1 ring-border/40">
                          <session.icon className="w-4 h-4 text-foreground/80" />
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-amber-500 transition-colors">
                            {session.name}
                          </div>
                          <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                            {session.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-0.5">
                        <div className="font-mono font-black text-emerald-500 text-xs sm:text-sm flex items-center gap-1">
                          {session.score} <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                        </div>
                        <div className="text-[9px] font-mono font-bold tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded">
                          {session.xp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Sessions (Wide Screen Only) */}
          <div className="hidden xl:flex w-[280px] shrink-0 flex-col animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-amber-500" />
                Recent Drill Feed
              </div>
              <Link
                href="/history"
                className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
              >
                History <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-card/60 backdrop-blur-2xl border-2 border-border/60 rounded-3xl p-3 flex flex-col shadow-xl shadow-black/5 h-full justify-between gap-1.5">
              {recentSessions.map((session, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 hover:bg-muted/40 rounded-2xl transition-all cursor-pointer group border-2 border-transparent hover:border-border/40"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 group-hover:bg-card transition-all duration-300 ease-out group-hover:scale-110 shadow-inner ring-1 ring-border/40">
                      <session.icon className="w-4 h-4 text-foreground/80" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground group-hover:text-amber-500 transition-colors">
                        {session.name}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        {session.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-0.5">
                    <div className="font-mono font-black text-emerald-500 text-sm flex items-center gap-1">
                      {session.score} <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                    </div>
                    <div className="text-[9px] font-mono font-bold tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border-2 border-amber-500/20">
                      {session.xp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground/60 py-6 flex items-center justify-center gap-2">
          <ScrollText className="w-3.5 h-3.5 text-amber-500" /> PrepPilot Precision Training Engine · 2026 Tier 1
        </div>
      </div>
    </ProtectedRoute>
  );
}
