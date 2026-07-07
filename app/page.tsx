"use client";
import { useAuth } from "@/context/auth";
import { Flame, Target, BookOpen, BrainCircuit, ChevronRight, Trophy } from "lucide-react";
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
      icon: "👩🏼‍🎓",
      title: "English",
      description: "Enhance your grammar, vocabulary, and fluency to score higher in every test.",
      linkTo: "/SSC/english",
      buttonText: "Start Learning",
    },

    {
      icon: "🧮",
      title: "Maths",
      description: "Practice smart maths tricks, sharpen accuracy, and solve questions with confidence.",
      linkTo: "/SSC/maths",
      buttonText: "Practice maths",
    },
    {
      icon: "🌊",
      title: "General Knowledge",
      description: "Dive into the vast ocean of General knowledge to stay ahead and ace in exams.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
    {
      icon: "🧩",
      title: "Reasoning",
      description: "Challenge your mind with fun reasoning puzzles and boost problem-solving speed.",
      linkTo: "#",
      buttonText: "Coming Soon",
    }
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">

      {/* 1. WHERE AM I? (Greeting, Streak, Goal) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="md:col-span-2 bg-card rounded-[18px] p-8 border border-border shadow-sm flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
            Welcome back, <span className="text-orange-500">{user?.displayName?.toUpperCase() || "Champ"}</span>!
          </h1>
          <p className="text-muted-foreground text-lg">
            You're on a great path. Ready to tackle your daily targets?
          </p>
        </div>

        {/* Streak & Goal */}
        <div className="bg-card rounded-[18px] p-6 border border-border shadow-sm flex flex-col justify-center gap-6">
          {/* Streak (Orange Rocket Accent) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
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
              <span className="font-medium text-muted-foreground">Today's Goal</span>
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
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight mb-4">Your Next Step</h2>

          {/* Primary Action Card (Full Width) */}
          <div className="bg-primary text-primary-foreground rounded-[18px] p-8 shadow-sm relative overflow-hidden group">
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
                <Button className="w-full sm:w-auto bg-white text-primary hover:bg-slate-50 rounded-[12px] h-12 px-6 font-bold text-base shadow-sm hover:cursor-pointer">
                  Continue Learning
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* All Modules Grid */}
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight mb-4 mt-8">Explore subjects</h3>
          <SectionCardGrid sections={sections} layout="grid-4" />
        </div>
      </section>

      {/* 3. HOW AM I DOING? (Performance Stats) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Performance Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-[18px] p-6 shadow-sm flex items-center gap-5 hover:border-green-200 dark:hover:border-green-900/50 transition-colors">
            <div className="w-12 h-12 rounded-[14px] bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-500">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{mockStats.accuracy}%</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-[18px] p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
            <div className="w-12 h-12 rounded-[14px] bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-500">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Questions Solved</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{mockStats.questionsSolved.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-[18px] p-6 shadow-sm flex items-center gap-5 hover:border-purple-200 dark:hover:border-purple-900/50 transition-colors">
            <div className="w-12 h-12 rounded-[14px] bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-500">
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
