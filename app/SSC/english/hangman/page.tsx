"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, HelpCircle, Heart, HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/custom/ProgressBar";

export default function HangmanDemoPage() {
  // Static Mock Data for the Demo
  const mockWord = "UBIQUITOUS";
  const mockHint = "Present, appearing, or found everywhere at the same time.";
  
  // Static state for visual demonstration
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(
    new Set(["U", "I", "O", "T", "X", "Z"])
  );
  
  const totalLives = 6;
  const wrongGuesses = 2; // 'X' and 'Z'

  // Generate Keyboard A-Z
  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const handleKeyPress = (letter: string) => {
    setGuessedLetters((prev) => {
      const next = new Set(prev);
      next.add(letter);
      return next;
    });
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Top Header */}
      <div className="w-full h-14 sm:h-16 flex items-center justify-between px-4 sm:px-8 border-b border-border/40 shrink-0 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/SSC/english">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-accent shrink-0"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </Button>
          </Link>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-bold text-foreground truncate uppercase tracking-wider">
              Hangman Sprint
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground truncate">
              High-Frequency Vocabulary
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-muted/40 px-3 py-1.5 rounded-xl border border-border/50 flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Score
            </span>
            <span className="text-sm font-black text-violet-600 dark:text-violet-400">
              450
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Container */}
      <main className="flex-1 w-full max-w-sm sm:max-w-md mx-auto flex flex-col justify-between pt-4 sm:pt-6 pb-6 sm:pb-8 px-4 sm:px-0">
        
        {/* Top Progress & Lives */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex gap-1.5">
              {Array.from({ length: totalLives }).map((_, i) => (
                <div key={i}>
                  {i < totalLives - wrongGuesses ? (
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500 drop-shadow-sm" />
                  ) : (
                    <HeartCrack className="w-5 h-5 text-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Word 4 of 10
            </span>
          </div>
          <ProgressBar
            value={40}
            className="h-1.5 bg-muted/65"
            barClassName="bg-violet-500"
          />
        </div>

        {/* Central Puzzle Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
          
          {/* Hangman Graphic/Visualizer Placeholder */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Soft glowing background for the "gallows" area */}
            <div className="absolute inset-0 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-2xl"></div>
            <div className="relative flex flex-col items-center gap-2">
               <span className="text-6xl text-foreground font-black opacity-80">
                 {wrongGuesses > 0 ? "😰" : "🤔"}
               </span>
               <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                 {wrongGuesses} / {totalLives} Strikes
               </span>
            </div>
          </div>

          {/* Hidden Word Display */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {mockWord.split("").map((letter, i) => {
              const isRevealed = guessedLetters.has(letter);
              return (
                <div
                  key={i}
                  className={`w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center rounded-xl border-b-4 text-2xl sm:text-3xl font-black uppercase transition-all duration-300 ${
                    isRevealed
                      ? "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400"
                      : "bg-muted/30 border-muted text-transparent"
                  }`}
                >
                  {isRevealed ? letter : "_"}
                </div>
              );
            })}
          </div>

          {/* Definition Hint */}
          <div className="bg-accent/40 border border-border/50 rounded-2xl p-4 w-full text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
            <div className="flex items-start justify-center gap-2">
              <HelpCircle className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-foreground/80 leading-relaxed italic">
                "{mockHint}"
              </p>
            </div>
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div className="w-full flex flex-col gap-2 mt-4">
          {keyboardRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-center gap-1.5 sm:gap-2 w-full"
            >
              {row.map((key) => {
                const isGuessed = guessedLetters.has(key);
                const isCorrect = isGuessed && mockWord.includes(key);
                const isWrong = isGuessed && !mockWord.includes(key);

                let keyClasses =
                  "bg-muted/50 border-border text-foreground hover:bg-muted active:scale-[0.95]";
                
                if (isCorrect) {
                  keyClasses = "bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 scale-[0.98] opacity-60 cursor-default";
                } else if (isWrong) {
                  keyClasses = "bg-rose-500/10 border-rose-500/20 text-rose-500/50 scale-[0.98] opacity-50 cursor-default";
                }

                return (
                  <button
                    key={key}
                    onClick={() => !isGuessed && handleKeyPress(key)}
                    disabled={isGuessed}
                    className={`flex-1 max-w-[40px] sm:max-w-[44px] h-12 sm:h-14 rounded-xl sm:rounded-2xl border flex items-center justify-center text-lg sm:text-xl font-bold transition-all shadow-sm select-none touch-manipulation ${keyClasses}`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
