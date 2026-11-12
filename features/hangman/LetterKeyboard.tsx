"use client";

import { cn } from "@/lib/utils";

/** QWERTY, matching the physical keyboard you can also type on. */
const QWERTY = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row) => row.split(""));

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
      {/* Phones: the keyboard reaches past the card padding and gaps stay tight so each key is as wide as possible. */}
      <div className="-mx-2 flex flex-col gap-1.5 sm:mx-0 sm:gap-2.5">
        {QWERTY.map((row, rowIndex) => (
          <div key={rowIndex} className="flex w-full justify-center gap-1 sm:gap-1.5">
            {row.map((letter) =>
              key(
                letter,
                "h-12 w-[calc((100%-2.25rem)/10)] shrink-0 rounded-lg text-lg sm:h-16 sm:w-[calc((100%-3.375rem)/10)] sm:rounded-xl sm:text-xl [@media(max-height:700px)]:h-10 sm:[@media(max-height:700px)]:h-12",
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
