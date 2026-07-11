import React from "react";
import { Logo } from "@/components/custom/logo";
import { Target, BookOpen, Trophy } from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";

const About = () => {
  return (
    <TopicPageLayout
      contentMaxWidthClass="w-full max-w-5xl"
    >
      <div className="w-full flex flex-col items-center text-center py-4">
        {/* Brand Intro */}
        <div className="mb-4 flex justify-center scale-125">
          <Logo />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 mt-6">
          Fuel Your <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent italic font-black">Future</span>
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-14 leading-relaxed">
          Welcome to <span className="font-bold text-slate-900 dark:text-white">PrepPilot</span>—the next-generation learning platform engineered for ambitious aspirants. We transform the grind of exam preparation into an engaging, high-speed journey toward your goals.
        </p>

        {/* The Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-14">
          {/* Focus */}
          <div className="flex flex-col items-center p-8 bg-card rounded-3xl border border-border/80 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-indigo-600/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">Focus</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Target your weaknesses with precision. Our spaced-repetition algorithms ensure you only study what you actually need to learn.
            </p>
          </div>

          {/* Practice */}
          <div className="flex flex-col items-center p-8 bg-card rounded-3xl border border-border/80 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-indigo-600/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">Practice</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Immerse yourself in endless flashcards, quizzes, and mock tests designed to simulate the real exam environment.
            </p>
          </div>

          {/* Achieve */}
          <div className="flex flex-col items-center p-8 bg-card rounded-3xl border border-border/80 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-indigo-600/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">Achieve</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Track your mastery, climb the ranks in real-time battles, and cross the finish line with unbreakable confidence.
            </p>
          </div>
        </div>

        {/* Status Note */}
        <div className="inline-flex items-center gap-4 px-6 py-4 bg-amber-500/[0.04] dark:bg-amber-500/[0.02] text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-500/20 shadow-xs">
          <span className="text-2xl select-none animate-pulse">🚀</span>
          <p className="font-semibold text-xs sm:text-sm text-left leading-relaxed">
            PrepPilot is currently in active development.<br />
            <span className="text-muted-foreground font-normal">We are rapidly building new features to give you the ultimate edge.</span>
          </p>
        </div>
      </div>
    </TopicPageLayout>
  );
};

export default About;
