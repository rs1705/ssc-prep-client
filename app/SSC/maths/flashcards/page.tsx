"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Layers, Shuffle, X } from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { ProgressBar } from "@/components/custom/ProgressBar";
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import { MathsCard } from "@/features/maths-cards/MathsCard";
import { MATHS_DECKS, mathsDeckById, type MathsCardItem } from "@/features/maths-cards/decks";
import { readStored, writeStored } from "@/lib/storage";

const DECK_KEY = "ssc:maths-cards:deck";

export default function MathsFlashcardsPage() {
  const [deckId, setDeckId] = useState("squares");
  const [shuffled, setShuffled] = useState(false);
  const [position, setPosition] = useState({ current: 1, total: 0 });

  useEffect(() => {
    const saved = readStored<string>(DECK_KEY, "squares");
    if (MATHS_DECKS.some((d) => d.id === saved)) setDeckId(saved);
  }, []);

  const deck = mathsDeckById(deckId);
  const cards = useMemo(() => deck.build(), [deck]);
  const onPosition = useCallback((current: number, total: number) => setPosition({ current, total }), []);
  const renderCard = useCallback(
    (card: MathsCardItem, flipped: boolean, onFlip: () => void) => (
      <MathsCard card={card} flipped={flipped} onFlip={onFlip} />
    ),
    [],
  );

  const choose = (id: string) => {
    setDeckId(id);
    writeStored(DECK_KEY, id);
  };

  return (
    <TopicPageLayout contentMaxWidthClass="w-full max-w-sm sm:max-w-md md:max-w-[480px]" hideBreadcrumbs centerContent={false}>
      <div className="flex w-full flex-col gap-3">
        <div className="surface-card flex flex-col gap-3 rounded-2xl p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Layers className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true" />
              <span className="text-sm font-extrabold uppercase tracking-tight text-foreground sm:text-base">Flashcards</span>
              <span className="text-xs text-muted-foreground/60">•</span>
              <span className="truncate text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">Quant</span>
            </div>
            <Link
              href="/SSC/maths"
              aria-label="Close flashcards"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <label className="relative flex-1">
              <span className="sr-only">Deck</span>
              <select
                value={deckId}
                onChange={(e) => choose(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border-2 border-border bg-background pl-3 pr-9 text-sm font-bold text-foreground outline-none focus-visible:border-sky-500/60"
              >
                {(["Tables", "Formulas"] as const).map((group) => (
                  <optgroup key={group} label={group}>
                    {MATHS_DECKS.filter((d) => d.group === group).map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label} ({d.build().length})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            </label>
            <button
              type="button"
              aria-pressed={shuffled}
              aria-label="Shuffle cards"
              title={shuffled ? "Back to order" : "Shuffle the cards"}
              onClick={() => setShuffled((v) => !v)}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-colors ${
                shuffled ? "border-brand-600 bg-brand-600 text-on-brand" : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shuffle className="h-4 w-4" />
            </button>
          </div>

          {position.total > 0 && (
            <div className="flex flex-col gap-1.5 px-1">
              <div className="flex items-end justify-between">
                <span className="text-xs font-bold tracking-wider text-muted-foreground">{shuffled ? "SHUFFLED" : "PROGRESS"}</span>
                <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground">
                  {position.current} / {position.total}
                </span>
              </div>
              <ProgressBar value={(position.current / position.total) * 100} barClassName="bg-gradient-to-r from-sky-400 to-sky-600" />
            </div>
          )}
        </div>

        <FlashcardDeck<MathsCardItem>
          deck={cards}
          mode="freestyle"
          resetKey={deckId}
          shuffled={shuffled}
          onPosition={onPosition}
          renderCard={renderCard}
          backHref="/SSC/maths"
        />
      </div>
    </TopicPageLayout>
  );
}
