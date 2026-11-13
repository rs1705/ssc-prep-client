"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The calm answer option used wherever a question is answered outside games and the
 * live exam screen: topic practice, mistakes review, mock-test review, landing quiz.
 * Thin border, an A-D letter chip in Geist Mono, and soft green / red fills only after answering.
 * Matches the Diagram Lab sample (design/diagram-lab.html).
 * (Games keep the chunky DUO options; the live exam keeps CBT radio rows.)
 */
export type ChoiceState = "idle" | "picked" | "right" | "wrong" | "faded";

/** The state for one option, from the usual three facts about it. */
export function choiceState({
  revealed,
  isAnswer,
  isChosen,
}: {
  revealed: boolean;
  isAnswer: boolean;
  isChosen: boolean;
}): ChoiceState {
  if (revealed && isAnswer) return "right";
  if (revealed && isChosen) return "wrong";
  if (isChosen) return "picked";
  return revealed ? "faded" : "idle";
}

const BOX: Record<ChoiceState, string> = {
  idle: "border-border bg-card text-foreground hover:border-brand-400/70 hover:bg-[color-mix(in_oklab,var(--brand-500)_4%,var(--card))]",
  picked: "border-brand-500 bg-[color-mix(in_oklab,var(--brand-500)_8%,var(--card))] text-foreground",
  right: "border-emerald-500 bg-[color-mix(in_oklab,var(--color-emerald-500)_9%,var(--card))] text-foreground",
  wrong: "border-rose-500 bg-[color-mix(in_oklab,var(--color-rose-500)_9%,var(--card))] text-foreground",
  faded: "border-border bg-card text-muted-foreground",
};

const CHIP: Record<ChoiceState, string> = {
  idle: "bg-[color-mix(in_oklab,var(--brand-500)_12%,var(--card))] text-brand-600 dark:text-brand-400",
  picked: "bg-brand-500 text-white",
  right: "bg-emerald-600 text-white",
  wrong: "bg-rose-600 text-white",
  faded: "bg-muted text-muted-foreground",
};

interface ChoiceOptionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Letter or number shown in the chip. */
  label: string;
  state: ChoiceState;
  children: ReactNode;
}

export function ChoiceOption({ label, state, children, className, ...rest }: ChoiceOptionProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "flex min-h-12 w-full min-w-0 items-center gap-2.5 rounded-[10px] border px-3 py-2.5 text-left text-sm font-medium leading-snug transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-default",
        BOX[state],
        className,
      )}
    >
      <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold", CHIP[state])}>
        {label}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
      {state === "right" && <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Correct answer" />}
      {state === "wrong" && <X className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" aria-label="Your answer, wrong" />}
    </button>
  );
}
