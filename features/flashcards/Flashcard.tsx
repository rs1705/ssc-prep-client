"use client";

import { RotateCcw, Volume2 } from "lucide-react";
import type { FlashCardInterface } from "@/lib/types";
import { TYPE_LABEL } from "./ratings";
import { useSpeech } from "./useSpeech";

interface FlashcardProps {
  card: FlashCardInterface;
  flipped: boolean;
  onFlip: () => void;
}

const FACE =
  "absolute inset-0 flex flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";

/** Soft English-coloured wash at the top of each face (on top of the solid card). */
const WASH =
  "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-fuchsia-500/[0.08] to-transparent";

function capitalise(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function SpeakButton({ text }: { text: string }) {
  const { supported, speak } = useSpeech();
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      aria-label={`Pronounce ${text}`}
      title="Pronounce"
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-muted-foreground transition-colors hover:border-fuchsia-500/50 hover:text-fuchsia-700 dark:hover:text-fuchsia-300"
    >
      <Volume2 className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function TypeChip({ type }: { type: string }) {
  return (
    <span className="relative rounded-full border-2 border-fuchsia-500/25 bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-fuchsia-700 dark:text-fuchsia-300">
      {TYPE_LABEL[type] ?? type}
    </span>
  );
}

function WordList({ label, words }: { label: string; words?: string[] }) {
  const list = (words ?? []).filter(Boolean).slice(0, 3);
  if (list.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-full text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {list.map((word) => (
        <span
          key={word}
          className="rounded-lg border-2 border-border bg-[color-mix(in_oklab,var(--muted)_60%,var(--card))] px-2 py-0.5 text-sm font-semibold text-foreground"
        >
          {word.toLowerCase()}
        </span>
      ))}
    </div>
  );
}

export default function Flashcard({ card, flipped, onFlip }: FlashcardProps) {
  const word = capitalise(card.front.text.toLowerCase());
  const hindiWord = card.front.pronunciation?.hindi;
  const { content_eng, content_hindi, example_eng, example_hindi, synonyms, antonyms } = card.back;
  const hindiExample = example_hindi?.[0]?.split("।")[0]?.trim();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={flipped ? `Meaning of ${word}. Press to show the word.` : `${word}. Press to show the meaning.`}
      onClick={onFlip}
      onKeyDown={(e) => {
        // Space / Enter are handled by the deck's global shortcuts.
        if (e.key === " " || e.key === "Enter") e.preventDefault();
      }}
      className="h-full w-full cursor-pointer select-none rounded-3xl outline-none [perspective:1200px] focus-visible:ring-4 focus-visible:ring-brand-500/30"
    >
      <div
        className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}
      >
        {/* ── Front ── */}
        <div className={FACE} aria-hidden={flipped}>
          <div className={WASH} />
          <div className="relative flex items-center justify-between p-4">
            <TypeChip type={card.type} />
            <SpeakButton text={card.front.text} />
          </div>
          <div className="relative flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">{word}</p>
            {hindiWord && <p className="text-base font-medium text-muted-foreground">{hindiWord}</p>}
          </div>
          <p className="relative pb-4 text-center text-xs font-semibold text-muted-foreground">
            Tap to see the meaning
          </p>
        </div>

        {/* ── Back ── */}
        <div className={`${FACE} [transform:rotateY(180deg)]`} aria-hidden={!flipped}>
          <div className={WASH} />
          <div className="relative flex items-center justify-between gap-3 border-b-2 border-border px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold text-foreground">{word}</p>
              {hindiWord && <p className="truncate text-xs text-muted-foreground">{hindiWord}</p>}
            </div>
            <SpeakButton text={card.front.text} />
          </div>

          <div className="relative flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-5">
            <div>
              <p className="text-lg font-bold leading-snug text-foreground sm:text-xl">{content_eng}</p>
              {content_hindi && content_hindi.length > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">{content_hindi.join(", ")}</p>
              )}
            </div>

            {(synonyms?.length || antonyms?.length) ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <WordList label="Synonyms" words={synonyms} />
                <WordList label="Antonyms" words={antonyms} />
              </div>
            ) : null}

            {example_eng?.[0] && (
              <div className="border-l-4 border-fuchsia-500/40 pl-3">
                <p className="text-sm italic leading-relaxed text-foreground">&ldquo;{example_eng[0]}&rdquo;</p>
                {hindiExample && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{hindiExample}।</p>
                )}
              </div>
            )}
          </div>

          <p className="relative flex items-center justify-center gap-1 pb-3 text-xs font-semibold text-muted-foreground">
            <RotateCcw className="h-3 w-3" aria-hidden="true" /> Tap to see the word
          </p>
        </div>
      </div>
    </div>
  );
}
