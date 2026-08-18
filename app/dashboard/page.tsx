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

  // Dummy data mirroring the screenshot
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
      active: true,
      theme: "emerald",
    },
    {
      icon: Sigma,
      name: "Reasoning",
      qs: "890 QS",
      to: "/SSC/reasoning",
      theme: "amber",
    },
    {
      icon: Languages,
      name: "English",
      qs: "720 QS",
      to: "/SSC/english",
      theme: "violet",
    },
    {
      icon: Newspaper,
      name: "GK / GS",
      qs: "1,580 QS",
      to: "/SSC/gk",
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
    { icon: Bookmark, label: "Bookmarks", to: "/bookmarks" },
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

  const themeClasses: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    emerald: { 
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15", 
      text: "text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
      glow: "from-emerald-500/10 to-transparent",
    },
    amber: { 
      bg: "bg-amber-500/10 dark:bg-amber-500/15", 
      text: "text-amber-600 dark:text-amber-400",
      border: "hover:border-amber-500/40 hover:shadow-amber-500/10",
      glow: "from-amber-500/10 to-transparent",
    },
    violet: { 
      bg: "bg-violet-500/10 dark:bg-violet-500/15", 
      text: "text-violet-600 dark:text-violet-400",
      border: "hover:border-violet-500/40 hover:shadow-violet-500/10",
      glow: "from-violet-500/10 to-transparent",
    },
    rose: { 
      bg: "bg-rose-500/10 dark:bg-rose-500/15", 
      text: "text-rose-600 dark:text-rose-400",
      border: "hover:border-rose-500/40 hover:shadow-rose-500/10",
      glow: "from-rose-500/10 to-transparent",
    },
  };

  return (
    <ProtectedRoute>
      <div className="w-full h-full p-4 lg:p-8 space-y-8 pb-32 overflow-x-hidden max-w-[1600px] mx-auto">
        {/* Hero Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationFillMode: "both" }}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                CGL 2026 Focus Mode
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground">{user?.displayName?.split(" ")[0] || "Champ"}</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="px-4 py-2 rounded-2xl bg-card/60 backdrop-blur-md border border-border/40 text-xs font-mono font-bold text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" />
              <span>Target: Tier 1 Exam</span>
            </div>
          </div>
        </div>

        {/* Top Row: Target & Resume */}
        <div className="grid lg:grid-cols-2 gap-5 mb-10">
          {/* Streak / Target Card */}
          <div className="rounded-3xl bg-card/60 backdrop-blur-2xl border border-amber-500/20 p-6 sm:p-7 shadow-xl shadow-amber-500/5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
            {/* Ambient Corner Glow */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground bg-background/60 px-3 py-1 rounded-full border border-border/40">
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

            <div className="h-2 bg-muted/60 rounded-full overflow-hidden mb-3 border border-border/30 relative z-10">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full shadow-sm shadow-amber-500/50 transition-all duration-500"
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

          {/* Resume Card */}
          <Link
            href="/SSC/maths/mental-maths"
            className="group rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-6 sm:p-7 flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/30 cursor-pointer relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 zoom-in-95"
            style={{ animationDelay: "150ms", animationFillMode: "both" }}
          >
            {/* Ambient Shine Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

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
            
            {/* Subjects Row */}
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
                      className={`group rounded-3xl bg-card/60 backdrop-blur-xl border border-border/40 p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden ${colors.border}`}
                    >
                      {/* Ambient Glow */}
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors.glow} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-inner ring-1 ring-border/40`}>
                          <s.icon className={`w-5 h-5 ${colors.text}`} strokeWidth={2} />
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
                    className="rounded-2xl bg-card/60 backdrop-blur-md border border-border/40 p-4.5 flex items-center gap-4 hover:border-amber-500/30 hover:shadow-md transition-all shadow-xs cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
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
                      className="flex-1 rounded-2xl bg-card/60 backdrop-blur-md border border-border/40 p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 hover:border-amber-500/30 transition-all shadow-xs cursor-pointer justify-center text-center sm:text-left"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
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

                <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl p-3 flex flex-col shadow-sm h-full justify-between gap-1">
                  {recentSessions.map((session, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 sm:p-3.5 hover:bg-muted/40 rounded-2xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted/70 flex items-center justify-center shrink-0 group-hover:bg-background transition-colors border border-border/30">
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
          <div className="hidden xl:flex w-[360px] shrink-0 flex-col animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
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

            <div className="bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl p-3 flex flex-col shadow-xl shadow-black/5 h-full justify-between gap-1.5">
              {recentSessions.map((session, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 hover:bg-muted/40 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-border/40"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 group-hover:bg-card transition-colors border border-border/30 shadow-2xs">
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
                    <div className="text-[9px] font-mono font-bold tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
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
