"use client";
import { useAuth } from "@/context/auth";
import { Flame, Target, BrainCircuit, ChevronRight, Trophy, GraduationCap, Calculator, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { SectionCardProps } from "@/lib/types";

export default function Dashboard() {
  const { user } = useAuth();

  // Hardcoded realistic mock data
  const mockStats = {
    streak: 12,
    todayGoal: 65, // percentage
    accuracy: 82, // percentage
    questionsSolved: 1450,
  };

  const sections: SectionCardProps[] = [
    {
      icon: <GraduationCap className="w-8 h-8 text-violet-500 dark:text-violet-400" fill="currentColor" fillOpacity={0.1} />,
      title: "English",
      description: "Master grammar rules, build high-frequency vocabulary, and train your comprehension speed to maximize exam performance.",
      linkTo: "/SSC/english",
      buttonText: "Explore English",
      colorTheme: "violet",
    },

    {
      icon: <Calculator className="w-8 h-8 text-emerald-500 dark:text-emerald-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Maths",
      description: "Sharpen calculation speed, learn time-saving mental math shortcuts, and master problem-solving accuracy under pressure.",
      linkTo: "/SSC/maths",
      buttonText: "Explore Maths",
      colorTheme: "emerald",
    },
    {
      icon: <Globe className="w-8 h-8 text-rose-500 dark:text-rose-400" fill="currentColor" fillOpacity={0.1} />,
      title: "General Knowledge",
      description: "Stay ahead with curated current affairs, historical milestones, and static GK summaries designed for rapid retention.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "rose",
    },
    {
      icon: <BrainCircuit className="w-8 h-8 text-amber-500 dark:text-amber-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Reasoning",
      description: "Build strong logical deduction skills, master visual patterns, and train your brain to solve puzzle grids in seconds.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "amber",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-8 animate-fadeIn">

      {/* Speed Math Release Feature Announcement Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-500/20 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              Speed Math Upgraded! <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary uppercase tracking-wider">New</span>
            </h4>
            <div className="text-xs text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
              Master the ultimate mental agility challenge with our newly expanded math engine:
              <ul className="list-disc list-inside mt-1.5 space-y-0.5 ml-1">
                <li><strong className="text-foreground font-semibold">Addition, Subtraction, Multiplication & Division</strong> sprints</li>
                <li>Unpredictable <strong className="text-foreground font-semibold">ANY Difficulty Mode</strong> for combined-digit tests</li>
                <li>Tricky <strong className="text-foreground font-semibold">Smart Distractors</strong> that mimic human calculation errors</li>
              </ul>
            </div>
          </div>
        </div>
        <Link href="/SSC/maths/mental-maths" className="shrink-0">
          <Button variant="outline" size="sm" className="h-9 px-4 rounded-2xl text-xs font-bold bg-background/50 hover:bg-background border-border/80 transition-all active:scale-[0.97] hover:cursor-pointer flex items-center gap-1.5 group">
            Speed Run Now <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* 1. WHERE AM I? (Greeting, Streak, Goal) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Welcome Card */}
        <div className="md:col-span-2 bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 tracking-tight">
            Welcome back, <span className="text-orange-500">{user?.displayName?.toUpperCase() || "Champ"}</span>!
          </h1>
          <p className="text-muted-foreground text-lg">
            You&apos;re on a great path. Ready to tackle your daily targets?
          </p>
        </div>

        {/* Streak & Goal */}
        <div className="bg-card rounded-3xl p-5 sm:p-6 border border-border shadow-sm flex flex-col justify-center gap-4 sm:gap-6">
          {/* Streak (Orange Rocket Accent) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold text-foreground tracking-tight">{mockStats.streak} Days</p>
              </div>
            </div>
          </div>

          {/* Daily Goal */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-muted-foreground">Today&apos;s Goal</span>
              <span className="font-bold text-primary">{mockStats.todayGoal}%</span>
            </div>
            <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FFD54A] via-[#FF9F1C] to-[#F97316] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${mockStats.todayGoal}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT SHOULD I DO? (Primary Action & Modules) */}
      <section className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight mb-4">Your Next Step</h2>

          {/* Primary Action Card (Full Width) */}
          <div className="bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-transform duration-700 group-hover:scale-110"></div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-md">
                  <Target className="w-4 h-4" />
                  <span>Resume Practice</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">English Flashcards</h3>
                <p className="text-primary-foreground/90 max-w-xl">
                  You have cards due for review today. Keep the momentum going and master your vocabulary.
                </p>
              </div>
              <Link href="/SSC/english/flashcards/fsrs" className="shrink-0">
                <Button className="w-full sm:w-auto bg-white text-primary hover:bg-slate-50 rounded-2xl h-12 px-6 font-bold text-base shadow-sm hover:cursor-pointer active:scale-[0.97] transition-all duration-200 group/btn">
                  Continue Learning
                  <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* All Modules Grid */}
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight mb-3 mt-5 sm:mt-8">Explore subjects</h3>
          <SectionCardGrid sections={sections} layout="grid-4" />
        </div>
      </section>

      {/* 3. HOW AM I DOING? (Performance Stats) */}
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Performance Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm flex items-center gap-4 sm:gap-5 hover:border-green-200 dark:hover:border-green-900/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-500">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{mockStats.accuracy}%</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm flex items-center gap-4 sm:gap-5 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-500">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Questions Solved</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{mockStats.questionsSolved.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm flex items-center gap-4 sm:gap-5 hover:border-purple-200 dark:hover:border-purple-900/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-500">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Weekly Rank</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">Top 15%</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
