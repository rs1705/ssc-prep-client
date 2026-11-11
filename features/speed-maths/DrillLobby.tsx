"use client";

import { Clock, Keyboard, ListChecks, Play, Zap } from "lucide-react";
import { DUO } from "@/features/games/buttons";
import { GAME_TONE } from "@/features/games/tone";
import { cn } from "@/lib/utils";

export type Difficulty = "easy" | "medium" | "hard" | "all";
export type DrillMode = "timed" | "freestyle";
export type InputLayout = "mcq" | "keys";

interface DrillLobbyProps {
  isMixed: boolean;
  difficulty: Difficulty;
  difficultyNote: string;
  mode: DrillMode;
  timeLimit: number | null;
  questionLimit: number | null;
  inputLayout: InputLayout;
  onDifficulty: (d: Difficulty) => void;
  onMode: (m: DrillMode) => void;
  onTimeLimit: (s: number) => void;
  onQuestionLimit: (n: number) => void;
  onInputLayout: (l: InputLayout) => void;
  onStart: () => void;
}

const tone = GAME_TONE.maths;

/** A selectable Duolingo-style choice tile. */
function Choice({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(DUO.option, selected ? tone.selected : DUO.idle, "min-h-11 px-2 text-sm font-bold", className)}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="section-label">{title}</h3>
      {children}
    </section>
  );
}

export function DrillLobby({
  isMixed,
  difficulty,
  difficultyNote,
  mode,
  timeLimit,
  questionLimit,
  inputLayout,
  onDifficulty,
  onMode,
  onTimeLimit,
  onQuestionLimit,
  onInputLayout,
  onStart,
}: DrillLobbyProps) {
  const limits = mode === "timed" ? (isMixed ? [60, 120, 300] : [30, 60, 90]) : [10, 20, 30];
  const current = mode === "timed" ? timeLimit : questionLimit;

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-5">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pb-1 [scrollbar-width:none]">
        {!isMixed && (
          <Section title="Difficulty">
            <div className="grid grid-cols-4 gap-2">
              {(["easy", "medium", "hard", "all"] as const).map((d) => (
                <Choice key={d} selected={d === difficulty} onClick={() => onDifficulty(d)} className="capitalize">
                  {d}
                </Choice>
              ))}
            </div>
            {difficultyNote && <p className="text-xs leading-relaxed text-muted-foreground">{difficultyNote}</p>}
          </Section>
        )}

        <Section title="Mode">
          {!isMixed && (
            <div className="grid grid-cols-2 gap-2">
              <Choice selected={mode === "timed"} onClick={() => onMode("timed")} className="flex items-center justify-center gap-3 py-3">
                <Clock className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="text-left leading-tight">
                  <span className="block">Timed</span>
                  <span className="block text-xs font-medium text-muted-foreground">Race the clock</span>
                </span>
              </Choice>
              <Choice selected={mode === "freestyle"} onClick={() => onMode("freestyle")} className="flex items-center justify-center gap-3 py-3">
                <Zap className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="text-left leading-tight">
                  <span className="block">Freestyle</span>
                  <span className="block text-xs font-medium text-muted-foreground">A fixed set, no clock</span>
                </span>
              </Choice>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2" role="group" aria-label={mode === "timed" ? "Time limit" : "Questions"}>
            {limits.map((value) => (
              <Choice
                key={value}
                selected={value === current}
                onClick={() => (mode === "timed" ? onTimeLimit(value) : onQuestionLimit(value))}
                className="tabular-nums"
              >
                {mode === "timed" ? (value >= 120 ? `${value / 60} min` : `${value}s`) : `${value} questions`}
              </Choice>
            ))}
          </div>
        </Section>

        <Section title="Answer with">
          <div className="grid grid-cols-2 gap-2">
            <Choice selected={inputLayout === "mcq"} onClick={() => onInputLayout("mcq")} className="flex items-center justify-center gap-3 py-3">
              <ListChecks className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="text-left leading-tight">
                <span className="block">Options</span>
                <span className="block text-xs font-medium text-muted-foreground">Pick 1 of 4</span>
              </span>
            </Choice>
            <Choice selected={inputLayout === "keys"} onClick={() => onInputLayout("keys")} className="flex items-center justify-center gap-3 py-3">
              <Keyboard className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="text-left leading-tight">
                <span className="block">Number pad</span>
                <span className="block text-xs font-medium text-muted-foreground">Type the answer</span>
              </span>
            </Choice>
          </div>
        </Section>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-2 border-t-2 border-border pt-4">
        <button type="button" onClick={onStart} autoFocus className={cn(DUO.primary, "w-full")}>
          <Play className="h-4 w-4 fill-current" aria-hidden="true" />
          Start drill
        </button>
        <p className="hidden text-xs text-muted-foreground md:block">or press Enter</p>
      </div>
    </div>
  );
}
