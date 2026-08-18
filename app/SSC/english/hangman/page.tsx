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
    <div className="flex flex-col min-h-[100dvh] max-h-[100dvh] overflow-hidden bg-background">
      {/* Top Header */}
      <div className="w-full h-12 sm:h-14 flex items-center justify-between px-3 sm:px-6 border-b border-border/40 shrink-0 sticky top-0 bg-background/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link href="/SSC/english">
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-card/60 shrink-0 border border-border/40"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </Button>
          </Link>
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-extrabold text-foreground truncate uppercase tracking-wider">
              Hangman Sprint
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-violet-500 truncate">
              High-Frequency Vocabulary
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-card/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-violet-500/30 flex items-center gap-1.5 shadow-2xs">
            <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              Score
            </span>
            <span className="text-xs sm:text-sm font-black font-mono text-violet-600 dark:text-violet-400">
              450
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Container */}
      <main className="flex-1 w-full max-w-sm sm:max-w-md md:max-w-[480px] mx-auto flex flex-col justify-between pt-1.5 sm:pt-3 pb-2 sm:pb-4 px-3 sm:px-0 overflow-hidden">
        
        {/* Top Progress & Lives */}
        <div className="w-full flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center justify-between px-1">
            <div className="flex gap-1.5">
              {Array.from({ length: totalLives }).map((_, i) => (
                <div key={i}>
                  {i < totalLives - wrongGuesses ? (
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500 drop-shadow-xs animate-pulse" />
                  ) : (
                    <HeartCrack className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-card/60 px-2.5 py-0.5 rounded-full border border-border/40">
              Word 4 of 10
            </span>
          </div>
          <ProgressBar
            value={40}
            className="h-1.5 sm:h-2 bg-muted/60 rounded-full overflow-hidden border border-border/30"
            barClassName="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
          />
        </div>

        {/* Central Puzzle Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2.5 sm:gap-4 py-1 my-auto">
          {/* Hangman Graphic/Visualizer Placeholder */}
          <div className="relative flex flex-col items-center gap-0.5">
            <span className="text-3xl sm:text-4xl text-foreground font-black drop-shadow-xs">
              {wrongGuesses > 0 ? "😰" : "🤔"}
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-rose-500/20">
              {wrongGuesses} / {totalLives} Strikes
            </span>
          </div>

          {/* Hidden Word Display */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {mockWord.split("").map((letter, i) => {
              const isRevealed = guessedLetters.has(letter);
              return (
                <div
                  key={i}
                  className={`w-8 h-10 sm:w-10 sm:h-12 md:w-11 md:h-13 flex items-center justify-center rounded-xl sm:rounded-2xl border text-base sm:text-lg md:text-xl font-black font-mono uppercase transition-all duration-300 shadow-2xs ${
                    isRevealed
                      ? "bg-violet-500/15 border-violet-500/40 text-violet-600 dark:text-violet-300 shadow-violet-500/10 scale-105"
                      : "bg-card/40 backdrop-blur-sm border-border/60 text-transparent"
                  }`}
                >
                  {isRevealed ? letter : ""}
                </div>
              );
            })}
          </div>

          {/* Definition Hint */}
          <div className="bg-card/60 backdrop-blur-xl border border-violet-500/25 rounded-2xl p-3 sm:p-4 w-full text-center shadow-md shadow-black/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-indigo-500"></div>
            <div className="flex items-start justify-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm md:text-base font-semibold text-foreground/90 leading-relaxed italic">
                "{mockHint}"
              </p>
            </div>
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div className="w-full flex flex-col gap-1 sm:gap-1.5 shrink-0">
          {keyboardRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-center gap-1 sm:gap-1.5 w-full"
            >
              {row.map((key) => {
                const isGuessed = guessedLetters.has(key);
                const isCorrect = isGuessed && mockWord.includes(key);
                const isWrong = isGuessed && !mockWord.includes(key);

                let keyClasses =
                  "bg-card/60 backdrop-blur-md border-border/50 text-foreground hover:bg-card hover:border-border active:scale-[0.95] shadow-2xs";
                
                if (isCorrect) {
                  keyClasses = "bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-300 opacity-60 cursor-default";
                } else if (isWrong) {
                  keyClasses = "bg-rose-500/10 border-rose-500/20 text-rose-500/40 opacity-40 cursor-default";
                }

                return (
                  <button
                    key={key}
                    onClick={() => !isGuessed && handleKeyPress(key)}
                    disabled={isGuessed}
                    className={`flex-1 max-w-[34px] sm:max-w-[42px] h-9 sm:h-11 md:h-12 rounded-lg sm:rounded-xl border flex items-center justify-center text-xs sm:text-sm font-black font-mono transition-all select-none touch-manipulation cursor-pointer ${keyClasses}`}
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
