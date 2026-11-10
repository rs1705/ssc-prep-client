"use client";

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row) => row.split(""));

interface LetterKeyboardProps {
  word: string;
  guessed: string[];
  disabled?: boolean;
  onGuess: (letter: string) => void;
}

export function LetterKeyboard({
  word,
  guessed,
  disabled = false,
  onGuess,
}: LetterKeyboardProps) {
  return (
    <div
      role="group"
      aria-label="Letter keyboard"
      className="mx-auto flex w-full max-w-md flex-col gap-1.5 sm:gap-2"
    >
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex w-full justify-center gap-1 sm:gap-1.5">
          {row.map((letter) => {
            const used = guessed.includes(letter);
            const correct = used && word.includes(letter);
            const wrong = used && !word.includes(letter);

            return (
              <button
                key={letter}
                type="button"
                disabled={disabled || used}
                aria-label={`Letter ${letter}${
                  correct ? ", correct" : wrong ? ", wrong" : ""
                }`}
                onClick={() => onGuess(letter)}
                className={`h-11 [@media(max-height:600px)]:h-10 w-[calc((100%-2.25rem)/10)] shrink-0 select-none sm:w-[calc((100%-3.375rem)/10)] rounded-lg border-2 border-b-4 font-mono text-sm font-black transition-[transform,border-width,background-color,border-color] duration-75 active:translate-y-[2px] active:border-b-2 disabled:cursor-default sm:h-12 sm:rounded-xl sm:text-base ${
                  correct
                    ? "border-emerald-500/40 border-b-emerald-500/60 bg-[color-mix(in_oklab,var(--color-emerald-500)_15%,var(--card))] text-emerald-700 dark:text-emerald-300"
                    : wrong
                      ? "border-border bg-muted text-muted-foreground/40 line-through"
                      : "border-border border-b-border bg-card text-foreground hover:border-fuchsia-500/50 hover:bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))]"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
