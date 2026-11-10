"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BarChart3, Zap, Target, Flame, TrendingUp, AlertCircle, 
  CheckCircle2, Swords, ArrowRight, Clock, Award, Compass, RefreshCw
} from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";
import { ActivityHeatmap } from "@/components/custom/activity-heatmap";
import { subjectTheme, type SubjectKey } from "@/lib/subject-theme";

const SUMMARY_METRICS = [
  {
    title: "Overall Accuracy",
    value: "92.4%",
    delta: "+3.2% this week",
    icon: Target,
    theme: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    glow: "bg-emerald-500/10",
  },
  {
    title: "Avg Solving Speed",
    value: "3.8s / Q",
    delta: "Target: < 5.0s",
    icon: Zap,
    theme: "text-brand-700 dark:text-brand-400 bg-brand-500/10 border-brand-500/20",
    glow: "bg-brand-500/10",
  },
  {
    title: "Questions Mastered",
    value: "1,480",
    delta: "240 Qs in last 48h",
    icon: Award,
    theme: "text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
    glow: "bg-fuchsia-500/10",
  },
  {
    title: "Current Sprint Streak",
    value: "12 Days",
    delta: "Top 5% of Aspirants",
    icon: Flame,
    theme: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    glow: "bg-rose-500/10",
  },
];

const SUBJECT_ACCURACY = [
  {
    subject: "Quantitative Aptitude",
    key: "maths" as SubjectKey,
    score: 94,
    speed: "3.2s",
    attempted: 640,
    status: "Strong",
    badge: "Mastery Level",
  },
  {
    subject: "Reasoning & Logic",
    key: "reasoning" as SubjectKey,
    score: 91,
    speed: "4.1s",
    attempted: 420,
    status: "Solid",
    badge: "High Accuracy",
  },
  {
    subject: "English Comprehension",
    key: "english" as SubjectKey,
    score: 88,
    speed: "2.8s",
    attempted: 280,
    status: "Good",
    badge: "Flashcards Active",
  },
  {
    subject: "General Knowledge",
    key: "gk" as SubjectKey,
    score: 74,
    speed: "5.4s",
    attempted: 140,
    status: "Needs Work",
    badge: "Focus Area",
  },
];

const WEAK_AREAS = [
  {
    topic: "Percentages & Fractions",
    subject: "Mathematics",
    accuracy: "68%",
    recommendation: "Review 1/13 to 1/19 fractional conversions and decimal chains.",
    linkTo: "/SSC/maths/mental-maths/percentages",
  },
  {
    topic: "Static GK — Mughal Dynasties",
    subject: "General Knowledge",
    accuracy: "62%",
    recommendation: "Focus on battle chronological timelines and revenue ministers.",
    linkTo: "/SSC/gk",
  },
  {
    topic: "One Word Substitution (Medical Terms)",
    subject: "English Vocab",
    accuracy: "71%",
    recommendation: "Daily Flashcard session due for 14 specialized suffix cards.",
    linkTo: "/SSC/english/flashcards/fsrs",
  },
];

export default function AnalyticsPage() {
  const [activeRange, setActiveRange] = useState<"7d" | "30d" | "all">("7d");

  return (
    <ProtectedRoute>
      <TopicPageLayout
        title="Performance Analytics"
        description="Comprehensive telemetry on calculation speed, retention accuracy, and AI-identified score leakages for SSC CGL 2026."
      >
        <div className="flex flex-col gap-8 py-2">
          {/* Time Range Filter Bar */}
          <div 
            className="flex items-center justify-between flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700"
            style={{ animationDelay: "100ms", animationFillMode: "both" }}
          >
            <div className="flex w-full items-center gap-1.5 surface-card p-1.5 rounded-2xl sm:w-auto sm:gap-2">
              {(["7d", "30d", "all"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`flex-1 min-h-10 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer sm:flex-none ${
                    activeRange === r
                      ? "bg-foreground text-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/80"
                  }`}
                >
                  <span className="sm:hidden">{r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "All"}</span>
                  <span className="hidden sm:inline">{r === "7d" ? "Past 7 Days" : r === "30d" ? "Past 30 Days" : "All Time"}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest surface-card px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Active
            </div>
          </div>

          {/* Top 4 Summary Bento Cards */}
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            {SUMMARY_METRICS.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl surface-card shadow-xl shadow-black/5 hover:border-brand-500/30 transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
                      {m.title}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 ${m.theme}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-foreground relative z-10">
                    {m.value}
                  </div>
                  <div className="text-xs font-mono font-medium text-muted-foreground mt-1 relative z-10">
                    {m.delta}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subject Breakdown & AI Weakness Radar */}
          <div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700"
            style={{ animationDelay: "300ms", animationFillMode: "both" }}
          >
            {/* Left: Subject Mastery Telemetry */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              <div className="p-6 sm:p-8 rounded-3xl surface-card shadow-xl shadow-black/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-700 dark:text-brand-400 flex items-center justify-center border-2 border-brand-500/20">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-foreground">
                        Subject Mastery Index
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        Calibrated accuracy and latency across Tier 1 sections
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {SUBJECT_ACCURACY.map((s, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between text-xs font-medium">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-extrabold text-foreground tracking-tight text-sm">
                            {s.subject}
                          </span>
                          <span className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded-full border-2 border-current/25 whitespace-nowrap ${subjectTheme(s.key).text}`}>
                            {s.badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono shrink-0">
                          <span className="text-muted-foreground">{s.speed} / Q</span>
                          <span className="font-bold text-foreground">{s.score}%</span>
                        </div>
                      </div>

                      <div className="h-2.5 bg-muted/60 rounded-full overflow-hidden border-2 border-border">
                        <div
                          className={`h-full bg-gradient-to-r ${subjectTheme(s.key).bar} rounded-full shadow-xs transition-all duration-500`}
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Speed Progress Chart Banner */}
              <div className="p-6 rounded-3xl surface-card shadow-xl shadow-black/5 flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-700 dark:text-brand-400" />
                    <h4 className="text-sm font-extrabold text-foreground tracking-tight">
                      Speed Progression (Last 7 Days)
                    </h4>
                  </div>
                  <span className="whitespace-nowrap text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border-2 border-emerald-500/20">
                    -0.6s Reduction
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 pt-2">
                  {["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Today"].map((day, i) => {
                    const heights = [60, 65, 55, 75, 80, 85, 95];
                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="h-28 w-full surface-card rounded-2xl flex items-end p-1.5 overflow-hidden">
                          <div 
                            className="w-full bg-gradient-to-t from-brand-500 to-brand-alt-500 rounded-xl shadow-xs transition-all duration-500"
                            style={{ height: `${heights[i]}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-muted-foreground">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GitHub style heatmap */}
              <ActivityHeatmap />
            </div>

            {/* Right: AI Weak Area Radar & Prescriptions */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              <div className="p-6 rounded-3xl bg-card/60 backdrop-blur-2xl border-2 border-rose-500/25 shadow-xl shadow-rose-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-border/40">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center border-2 border-rose-500/20">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground tracking-tight">
                      AI Weakness Radar
                    </h4>
                    <p className="text-xs font-mono text-muted-foreground">3 Precision Leaks Detected</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {WEAK_AREAS.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl surface-card hover:border-rose-500/30 transition-all flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-black text-foreground">{item.topic}</div>
                          <div className="text-xs font-mono text-muted-foreground mt-0.5">{item.subject}</div>
                        </div>
                        <span className="text-xs font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border-2 border-rose-500/20">
                          {item.accuracy}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.recommendation}
                      </p>
                      <Button
                        asChild
                        variant="ghost"
                        className="mt-1 w-full h-10 rounded-xl text-xs font-mono font-bold uppercase tracking-wider gap-1.5 text-brand-700 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-500/10 border-2 border-brand-500/25"
                      >
                        <Link href={item.linkTo}>
                          <Swords className="w-3.5 h-3.5" />
                          Launch Fix Drill
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Goal Progress Card */}
              <div className="p-6 rounded-3xl surface-card shadow-xl shadow-black/5 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-700 dark:text-brand-400 flex items-center justify-center border-2 border-brand-500/20">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                      Weekly Sprint Goal
                    </h4>
                    <p className="text-xs font-mono text-brand-700 dark:text-brand-400">2,000 Questions</p>
                  </div>
                </div>
                <div className="h-2 bg-muted/60 rounded-full overflow-hidden border-2 border-border my-2">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-brand-alt-500 rounded-full w-[74%]" />
                </div>
                <div className="flex justify-between items-center text-xs font-mono font-medium text-muted-foreground mt-2">
                  <span>1,480 Completed</span>
                  <span className="font-bold text-foreground">74% of Target</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TopicPageLayout>
    </ProtectedRoute>
  );
}
