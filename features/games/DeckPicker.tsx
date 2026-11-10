"use client";

import { GAME_TONE, type GameTone } from "./tone";

interface DeckPickerProps<T extends string> {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  tone?: GameTone;
}

/** Row of pills for choosing what a game draws from (word set, card type...). */
export function DeckPicker<T extends string>({ label, options, value, onChange, tone = "english" }: DeckPickerProps<T>) {
  return (
    <fieldset className="flex w-full max-w-sm flex-col gap-2">
      <legend className="section-label mb-2 w-full text-center">{label}</legend>
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={`min-h-9 rounded-full border-2 px-3.5 text-sm font-bold transition-colors ${
                active ? GAME_TONE[tone].selected : `border-border bg-card text-muted-foreground hover:text-foreground`
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
