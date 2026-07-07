import React from "react";
import { Logo } from "@/components/custom/logo";
import { Target, BookOpen, Trophy } from "lucide-react";

const About = () => {
  return (
    <section className="w-full">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">

        {/* Brand Intro */}
        <div className="mb-2 flex justify-center scale-125">
          <Logo />
        </div>
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-2 mt-4">
          <div className="h-[2px] w-12 sm:w-16 md:w-28 bg-black dark:bg-white rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
            Fuel Your <span className="text-orange-500 font-extrabold italic underline decoration-orange-500 decoration-wavy">Future</span>
          </h1>
          <div className="h-[2px] w-12 sm:w-16 md:w-28 bg-black dark:bg-white rounded-full"></div>
        </div>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-16 leading-relaxed">
          Welcome to <span className="font-bold text-slate-900 dark:text-white">PrepPilot</span>—the next-generation learning platform engineered for ambitious aspirants. We transform the grind of exam preparation into an engaging, high-speed journey toward your goals.
        </p>

        {/* The Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
          {/* Focus */}
          <div className="flex flex-col items-center p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Focus</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Target your weaknesses with precision. Our spaced-repetition algorithms ensure you only study what you actually need to learn.
            </p>
          </div>

          {/* Practice */}
          <div className="flex flex-col items-center p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Practice</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Immerse yourself in endless flashcards, quizzes, and mock tests designed to simulate the real exam environment.
            </p>
          </div>

          {/* Achieve */}
          <div className="flex flex-col items-center p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Achieve</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Track your mastery, climb the ranks in real-time battles, and cross the finish line with unbreakable confidence.
            </p>
          </div>
        </div>

        {/* Status Note */}
        <div className="inline-flex items-center gap-4 px-6 py-4 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm">
          <span className="text-2xl">🚀</span>
          <p className="font-medium text-sm text-left leading-relaxed">
            PrepPilot is currently in active development.<br />We are rapidly building new features to give you the ultimate edge.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
