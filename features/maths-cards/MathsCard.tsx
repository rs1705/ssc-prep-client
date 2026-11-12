"use client";

import { RotateCcw } from "lucide-react";
import { RichText } from "@/features/pyq/RichText";
import type { MathsCardItem } from "./decks";

const FACE =
  "absolute inset-0 flex flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";
const WASH = "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sky-500/[0.08] to-transparent";
const MATH =
  "[&_.katex-display]:my-1 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-1";

/** A maths flashcard: question/formula name on the front, the answer (with LaTeX) on the back. */
export function MathsCard({ card, flipped, onFlip }: { card: MathsCardItem; flipped: boolean; onFlip: () => void }) {
  // Table cards (17², √289, 3/8) are one big value; formula cards are text.
  const short = !card._id.startsWith("f-");
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={flipped ? "Showing the answer. Press to show the question." : "Press to show the answer."}
      onClick={onFlip}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") e.preventDefault();
      }}
      className="h-full w-full cursor-pointer select-none rounded-3xl outline-none [perspective:1200px] focus-visible:ring-4 focus-visible:ring-brand-500/30"
    >
      <div
        className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}
      >
        <div className={FACE} aria-hidden={flipped}>
          <div className={WASH} />
          <div className="relative p-4">
            <span className="rounded-full border-2 border-sky-500/25 bg-[color-mix(in_oklab,var(--color-sky-500)_10%,var(--card))] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">
              {card.label}
            </span>
          </div>
          <div className={`relative flex flex-1 items-center justify-center px-6 text-center font-extrabold text-foreground ${short ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"} ${MATH}`}>
            <RichText text={card.prompt} inline />
          </div>
          <p className="relative pb-4 text-center text-xs font-semibold text-muted-foreground">Tap to see the answer</p>
        </div>

        <div className={`${FACE} [transform:rotateY(180deg)]`} aria-hidden={!flipped}>
          <div className={WASH} />
          <div className={`relative border-b-2 border-border px-4 py-3 text-base font-extrabold text-foreground ${MATH}`}>
            <RichText text={card.prompt} inline />
          </div>
          <div className={`relative flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-5 ${MATH}`}>
            <div className={short ? "flex flex-1 items-center justify-center text-4xl font-extrabold text-sky-700 dark:text-sky-300" : "text-[0.95rem] leading-relaxed text-foreground"}>
              <RichText text={card.answer} />
            </div>
            {card.note && <p className="text-sm text-muted-foreground">{card.note}</p>}
            {card.example && (
              <div className="border-l-4 border-sky-500/40 pl-3 text-sm text-foreground">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Example</span>
                <RichText text={card.example} />
              </div>
            )}
          </div>
          <p className="relative flex items-center justify-center gap-1 pb-3 text-xs font-semibold text-muted-foreground">
            <RotateCcw className="h-3 w-3" aria-hidden="true" /> Tap to see the question
          </p>
        </div>
      </div>
    </div>
  );
}
