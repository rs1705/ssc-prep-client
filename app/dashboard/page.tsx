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

  const themeClasses: Record<string, { bg: string; text: string }> = {
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500 dark:text-emerald-400" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-500 dark:text-amber-400" },
    violet: { bg: "bg-violet-500/10", text: "text-violet-500 dark:text-violet-400" },
    rose: { bg: "bg-rose-500/10", text: "text-rose-500 dark:text-rose-400" },
  };

  return (
    <ProtectedRoute>
      <div className="w-full h-full p-4 lg:p-8 space-y-8 pb-32 overflow-x-hidden max-w-[1600px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 md:mb-6 text-foreground animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationFillMode: "both" }}>
          {greeting}, {user?.displayName?.split(" ")[0] || "Champ"}
        </h1>

        {/* Top Row: Target & Resume */}
        <div className="grid lg:grid-cols-2 gap-5 mb-10">
          {/* Streak / Target Card */}
        <div className="rounded-3xl bg-card ring-1 ring-border p-7 shadow-sm animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              <Flame className="w-3.5 h-3.5 text-amber-500" strokeWidth={2.5} />
              Streak · {mockStats.streak} days
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                XP
              </div>
              <div className="text-lg font-bold text-amber-500">
                {mockStats.xp}
              </div>
            </div>
          </div>

          <div className="text-xl font-bold tracking-tight mb-4 text-foreground">
            Today's target · {mockStats.todayGoal} Qs
          </div>

          <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-primary"
              style={{ width: mockStats.percent }}
            />
          </div>

          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-full hover:opacity-95 transition-colors">
            <span>
              {mockStats.solved} / {mockStats.todayGoal} solved
            </span>
            <span>{mockStats.percent}</span>
          </div>

          {/* Week tracker pills */}
          <div className="mt-5 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-3 rounded-full ${i < 5 ? "bg-primary" : i === 5 ? "bg-primary/40" : "bg-muted"}`}
              />
            ))}
          </div>
        </div>

        {/* Resume Card (Primary Background) */}
        <Link
          href="/SSC/maths/mental-maths"
          className="group rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 text-white p-7 flex flex-col justify-between hover:-translate-y-0.5 transition-all shadow-[0_20px_60px_-20px_rgba(245,158,11,0.3)] hover:shadow-[0_28px_80px_-20px_rgba(245,158,11,0.5)] cursor-pointer animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700"
          style={{ animationDelay: "150ms", animationFillMode: "both" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-primary-foreground/70">
                Resume
              </div>
              <div className="text-3xl font-extrabold tracking-tight mt-1 text-primary-foreground">
                Speed Math — Percentages
              </div>
              <div className="opacity-80 text-sm mt-1 text-primary-foreground">
                Mathematics
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-primary-foreground/10 flex items-center justify-center group-hover:bg-primary-foreground/20 transition-colors">
              <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>

          <div>
            <div className="h-1.5 rounded-full bg-primary-foreground/15 overflow-hidden mb-2">
              <div className="h-full bg-primary-foreground w-[32%]" />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-primary-foreground">
              <span>Q 8 / 25</span>
              <span>~ 8 min left</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Bottom Section: Responsive Layout */}
      <div className="flex flex-col xl:flex-row gap-8 xl:gap-10 mb-10 items-stretch">
        
        {/* Left Column (Main Content) */}
        <div className="flex-1 flex flex-col gap-10 min-w-0">
          
          {/* Subjects Row */}
          <div className="animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-bold font-mono tracking-widest uppercase text-muted-foreground">
                Subjects
              </div>
              <Link
                href="/SSC"
                className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1"
              >
                All 4 <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              {subjects.map((s, idx) => {
                const colors = themeClasses[s.theme];
                return (
                  <Link
                    key={s.name}
                    href={s.to}
                    className="group rounded-2xl bg-card ring-1 ring-border p-5 hover:ring-primary/50 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3`}>
                        <s.icon className={`w-5 h-5 ${colors.text}`} strokeWidth={2} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-lg tracking-tight text-foreground">
                        {s.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.qs}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Actions (Wide Screen Only - Individual Horizontal Cards) */}
          <div className="hidden xl:block animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
            <div className="text-[10px] font-bold font-mono tracking-widest uppercase text-muted-foreground mb-4">
              Quick actions
            </div>
            <div className="grid grid-cols-3 gap-4">
              {quickActions.map((q, idx) => (
                <Link
                  key={q.label}
                  href={q.to}
                  className="rounded-2xl bg-card ring-1 ring-border p-5 flex items-center gap-4 hover:ring-primary/50 transition-all shadow-sm cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <q.icon className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
                  </div>
                  <div className="font-semibold text-foreground">{q.label}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Second Row for Medium Screens (lg and below): Quick Actions & Recent Sessions */}
          <div className="xl:hidden flex flex-col gap-8">
            
            {/* Quick Actions */}
            <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
              <div className="text-[10px] font-bold font-mono tracking-widest uppercase text-muted-foreground mb-4">
                Quick actions
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 h-full">
                {quickActions.map((q, idx) => (
                  <Link
                    key={q.label}
                    href={q.to}
                    className="flex-1 rounded-2xl bg-card ring-1 ring-border p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 hover:ring-primary/50 transition-all shadow-sm cursor-pointer justify-center text-center sm:text-left"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <q.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" strokeWidth={2} />
                    </div>
                    <div className="font-semibold text-foreground text-[10px] sm:text-sm leading-tight">{q.label}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "500ms", animationFillMode: "both" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-bold font-mono tracking-widest uppercase text-muted-foreground">
                  Recent Sessions
                </div>
                <Link
                  href="/history"
                  className="text-[10px] font-bold tracking-widest uppercase text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  History <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="bg-card ring-1 ring-border rounded-3xl p-3 flex flex-col shadow-sm h-full justify-between">
                {recentSessions.map((session, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 rounded-2xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-background transition-colors">
                        <session.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground">
                          {session.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {session.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-0.5">
                      <div className="font-bold text-primary text-sm flex items-center gap-1">
                        {session.score} <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div className="text-[10px] font-mono tracking-widest text-muted-foreground">
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
        <div className="hidden xl:flex w-[350px] shrink-0 flex-col animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold font-mono tracking-widest uppercase text-muted-foreground">
              Recent Sessions
            </div>
            <Link
              href="/history"
              className="text-[10px] font-bold tracking-widest uppercase text-primary hover:text-primary/80 flex items-center gap-1"
            >
              History <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-card ring-1 ring-border rounded-3xl p-3 flex flex-col shadow-sm h-full justify-between">
            {recentSessions.map((session, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-2xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-background transition-colors">
                    <session.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">
                      {session.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {session.date}
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-0.5">
                  <div className="font-bold text-primary text-sm flex items-center gap-1">
                    {session.score} <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-muted-foreground">
                    {session.xp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 py-8 flex items-center justify-center gap-2">
        <ScrollText className="w-3 h-3" /> Quiet focus · 5AM library mode
      </div>
      </div>
    </ProtectedRoute>
  );
}
