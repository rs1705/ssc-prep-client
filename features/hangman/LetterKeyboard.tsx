"use client";

import { cn } from "@/lib/utils";

/** Larger screens: QWERTY, matching the physical keyboard you can also type on. */
const QWERTY = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row) => row.split(""));
/**
 * Phones: A-Z in rows of seven. Hangman is about picking letters, not typing,
 * and seven columns give each key about 40px of width on a 360px screen
 * instead of the ~26px a ten-key QWERTY row allows.
 */
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface LetterKeyboardProps {
  word: string;
  guessed: string[];
  disabled?: boolean;
  onGuess: (letter: string) => void;
}

function keyState(letter: string, word: string, guessed: string[]) {
  const used = guessed.includes(letter);
  return { used, correct: used && word.includes(letter), wrong: used && !word.includes(letter) };
}

const KEY_BASE =
  "select-none border-2 border-b-4 font-mono font-black transition-[transform,border-width,background-color,border-color] duration-75 active:translate-y-[2px] active:border-b-2 disabled:cursor-default";

function keyTone(correct: boolean, wrong: boolean) {
  return correct
    ? "border-emerald-500/40 border-b-emerald-500/60 bg-[color-mix(in_oklab,var(--color-emerald-500)_15%,var(--card))] text-emerald-700 dark:text-emerald-300"
    : wrong
      ? "border-border bg-muted text-muted-foreground/40 line-through"
      : "border-border border-b-border bg-card text-foreground hover:border-fuchsia-500/50 hover:bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))]";
}

export function LetterKeyboard({ word, guessed, disabled = false, onGuess }: LetterKeyboardProps) {
  const key = (letter: string, className: string) => {
    const { used, correct, wrong } = keyState(letter, word, guessed);
    return (
      <button
        key={letter}
        type="button"
        disabled={disabled || used}
        aria-label={`Letter ${letter}${correct ? ", correct" : wrong ? ", wrong" : ""}`}
        onClick={() => onGuess(letter)}
        className={cn(KEY_BASE, keyTone(correct, wrong), className)}
      >
        {letter}
      </button>
    );
  };

  return (
    <div role="group" aria-label="Letter keyboard" className="mx-auto w-full max-w-xl">
      {/* Phones: 7 columns, wide keys, generous gaps; reaches the card's edges for extra room. */}
      <div className="-mx-1.5 grid grid-cols-7 gap-1.5 sm:hidden [@media(max-height:760px)]:gap-y-1">
        {ALPHA.map((letter, i) =>
          key(letter, (i === 21 ? "col-start-2 " : "") + "h-11 rounded-xl text-lg [@media(max-height:760px)]:h-10 [@media(max-height:700px)]:h-9 [@media(max-height:620px)]:h-8 [@media(max-height:700px)]:text-base"),
        )}
      </div>

      {/* Tablets and up: QWERTY. */}
      <div className="hidden flex-col gap-2.5 sm:flex">
        {QWERTY.map((row, rowIndex) => (
          <div key={rowIndex} className="flex w-full justify-center gap-1.5">
            {row.map((letter) =>
              key(letter, "h-16 w-[calc((100%-3.375rem)/10)] shrink-0 rounded-xl text-xl [@media(max-height:700px)]:h-12"),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
