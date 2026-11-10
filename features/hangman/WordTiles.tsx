"use client";

import { motion, useReducedMotion } from "framer-motion";

interface WordTilesProps {
  word: string;
  guessed: string[];
  /** Show every letter; letters the player never found are marked as missed. */
  revealAll?: boolean;
}

export function WordTiles({ word, guessed, revealAll = false }: WordTilesProps) {
  const reduceMotion = useReducedMotion();
  const long = word.length >= 11;

  return (
    <div
      className="flex w-full justify-center gap-1 sm:gap-1.5"
      role="img"
      aria-label={
        revealAll
          ? `The word is ${word}`
          : `Word with ${word.length} letters, ${
              word.split("").filter((l) => guessed.includes(l)).length
            } found`
      }
    >
      {word.split("").map((letter, i) => {
        const found = guessed.includes(letter);
        const missed = revealAll && !found;
        const shown = found || revealAll;

        return (
          <div
            key={i}
            className={`flex h-11 min-w-0 max-w-12 flex-1 items-center justify-center border-2 font-mono font-black uppercase sm:h-14 [@media(max-height:600px)]:h-10 ${
              word.length >= 9 ? "rounded-lg" : "rounded-xl sm:rounded-2xl"
            } ${
              long ? "text-base sm:text-xl" : "text-lg sm:text-2xl"
            } ${
              missed
                ? "border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-300"
                : found
                  ? "border-violet-500/50 bg-violet-500/15 text-violet-700 dark:text-violet-200"
                  : "border-border bg-card text-transparent"
            }`}
          >
            {shown && (
              <motion.span
                key={`${i}-${shown}`}
                initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
              >
                {letter}
              </motion.span>
            )}
          </div>
        );
      })}
    </div>
  );
}
