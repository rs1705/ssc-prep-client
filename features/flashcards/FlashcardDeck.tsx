"use client";

import { recordPlanActivity } from "@/lib/today-plan";
import { cn } from "@/lib/utils";
import { DUO } from "@/features/games/buttons";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import posthog from "posthog-js";
import type { FlashCardInterface } from "@/lib/types";
import { shuffle } from "@/lib/shuffle";
import { useSaveFlashcardInteractionsMutation } from "@/redux/FlashcardApiSlice";
import Flashcard from "./Flashcard";
import { RATINGS, formatInterval } from "./ratings";
import { SessionSummary } from "./SessionSummary";

export type { ActionType } from "./ratings";

/** Anything the deck can show: it only needs an id (and review times in study mode). */
export interface DeckItem {
  _id: string;
  nextReview?: Record<"1" | "2" | "3" | "4", string>;
}

interface FlashcardDeckProps<T extends DeckItem> {
  deck: T[];
  /** Draws one card. Defaults to the vocabulary flashcard. */
  renderCard?: (card: T, flipped: boolean, onFlip: () => void) => React.ReactNode;
  /** Where the end-of-deck screen's back link goes. */
  backHref?: string;
  mode: "freestyle" | "study";
  /** Changing this starts the deck again (new tab, new filters...). */
  resetKey?: string;
  shuffled?: boolean;
  /** Reports the 1-based card position so the page can show progress. */
  onPosition?: (position: number, total: number) => void;
}

type Mark = "known" | "learning";

const slide: Variants = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1, zIndex: 1 },
  // The old card leaves fast (and underneath), so its text never shows through the new one.
  exit: (dir: number) => ({ x: dir * -30, opacity: 0, zIndex: 0, transition: { duration: 0.12, ease: "easeOut" as const } }),
};

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const el = target;
  return (
    ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName) ||
    el.isContentEditable ||
    Boolean(el.closest("[role=dialog],[role=listbox],[role=menu]"))
  );
}

export default function FlashcardDeck<T extends DeckItem = FlashCardInterface>({
  deck,
  mode,
  resetKey,
  shuffled = false,
  onPosition,
  renderCard,
  backHref,
}: FlashcardDeckProps<T>) {
  const [order, setOrder] = useState<T[]>(() => (shuffled ? shuffle(deck) : deck));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState(1);
  const [finished, setFinished] = useState(false);
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [nextDue, setNextDue] = useState<string | null>(null);
  const [saveReview] = useSaveFlashcardInteractionsMutation();
  const shownAt = useRef(0);
  const dragging = useRef(false);

  const start = (cards: T[]) => {
    setOrder(cards);
    setIndex(0);
    setFlipped(false);
    setFinished(false);
    setMarks({});
    setRatings({});
    setNextDue(null);
    setDirection(1);
  };

  // Start over whenever the source deck, the reset key or shuffle changes.
  const [source, setSource] = useState({ deck, resetKey, shuffled });
  if (source.deck !== deck || source.resetKey !== resetKey || source.shuffled !== shuffled) {
    setSource({ deck, resetKey, shuffled });
    start(shuffled ? shuffle(deck) : deck);
  }

  const card = order[index];

  useEffect(() => {
    onPosition?.(Math.min(index + 1, order.length), order.length);
  }, [index, order.length, onPosition]);

  useEffect(() => {
    shownAt.current = Date.now();
  }, [card?._id]);

  useEffect(() => {
    if (deck.length > 0) {
      posthog.capture("flashcard_session_started", { mode, deckSize: deck.length });
    }
  }, [deck, mode]);

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex(next);
    setFlipped(false);
  }, []);

  const next = useCallback(() => {
    if (index + 1 >= order.length) setFinished(true);
    else goTo(index + 1, 1);
  }, [index, order.length, goTo]);

  const prev = useCallback(() => {
    if (index > 0) goTo(index - 1, -1);
  }, [index, goTo]);

  const flip = useCallback(() => setFlipped((f) => !f), []);

  const mark = useCallback(
    (value: Mark) => {
      if (!card) return;
      setMarks((m) => ({ ...m, [card._id]: value }));
      recordPlanActivity("cards");
      next();
    },
    [card, next],
  );

  const rate = useCallback(
    (rating: 1 | 2 | 3 | 4) => {
      if (!card) return;
      setRatings((r) => ({ ...r, [card._id]: rating }));
      recordPlanActivity("cards");
      const timeTaken = Math.round((Date.now() - shownAt.current) / 1000);
      saveReview({ cardId: card._id, rating, timeTaken })
        .unwrap()
        .then((res) =>
          setNextDue((due) => (!due || new Date(res.dueDate) < new Date(due) ? res.dueDate : due)),
        )
        .catch(() => {
          // The review stays counted locally; the next session will resend due cards.
        });
      posthog.capture("flashcard_rated", { rating, mode, cardId: card._id });
      next();
    },
    [card, mode, next, saveReview],
  );

  // Keyboard: Space/Enter flip, arrows move (freestyle), number keys answer.
  useEffect(() => {
    if (finished || !card) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flip();
      } else if (mode === "freestyle" && e.key === "ArrowRight") {
        next();
      } else if (mode === "freestyle" && e.key === "ArrowLeft") {
        prev();
      } else if (flipped && mode === "freestyle" && (e.key === "1" || e.key === "2")) {
        mark(e.key === "1" ? "learning" : "known");
      } else if (flipped && mode === "study") {
        const r = RATINGS.find((x) => x.key === e.key);
        if (r) rate(r.rating);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finished, card, mode, flipped, flip, next, prev, mark, rate]);

  if (order.length === 0) {
    return (
      <div className="surface-card flex w-full flex-col items-center gap-2 rounded-3xl px-6 py-14 text-center">
        <p className="text-lg font-bold text-foreground">No cards here</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          {mode === "study"
            ? "You're all caught up for today. Come back tomorrow for new cards."
            : "No flashcards match these filters. Try another letter or clear the filters."}
        </p>
      </div>
    );
  }

  if (finished) {
    if (mode === "study") {
      const counts = RATINGS.map((r) => ({
        label: r.label,
        value: Object.values(ratings).filter((v) => v === r.rating).length,
        className: r.className.match(/text-\S+/)?.[0] ?? "text-foreground",
      }));
      const due = formatInterval(nextDue ?? undefined);
      return (
        <SessionSummary
          backHref={backHref}
          title="Today's review is done"
          subtitle={`${Object.keys(ratings).length} cards reviewed.${due ? ` The first one comes back in ${due}.` : ""}`}
          stats={counts}
        />
      );
    }
    const known = Object.values(marks).filter((m) => m === "known").length;
    const learning = order.filter((c) => marks[c._id] === "learning");
    return (
      <SessionSummary
          backHref={backHref}
        title="End of the deck"
        subtitle={`${order.length} cards. ${order.length - known - learning.length} skipped without marking.`}
        stats={[
          { label: "Got it", value: known, className: "text-emerald-600 dark:text-emerald-400" },
          { label: "Still learning", value: learning.length, className: "text-foreground" },
        ]}
        primary={
          learning.length > 0
            ? { label: `Review the ${learning.length} I'm still learning`, onClick: () => start(learning) }
            : undefined
        }
        onRestart={() => start(order)}
        onShuffle={() => start(shuffle(order))}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="relative h-[clamp(300px,calc(100dvh-22rem),440px)] w-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={`${card._id}-${index}`}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
            drag={mode === "freestyle" ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragStart={() => {
              dragging.current = true;
            }}
            onDragEnd={(_, { offset, velocity }) => {
              window.setTimeout(() => {
                dragging.current = false;
              }, 50);
              if (offset.x < -60 || velocity.x < -500) next();
              else if (offset.x > 60 || velocity.x > 500) prev();
            }}
            className="absolute inset-0"
          >
            {renderCard ? (
              renderCard(card, flipped, () => {
                if (!dragging.current) flip();
              })
            ) : (
              <Flashcard
                card={card as unknown as FlashCardInterface}
                flipped={flipped}
                onFlip={() => {
                  if (!dragging.current) flip();
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Controls ── */}
      {mode === "freestyle" ? (
        <div className="flex min-h-14 items-stretch gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous card"
            className={cn(DUO.secondary, "w-14 shrink-0 px-0")}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          {flipped ? (
            <>
              <button
                type="button"
                onClick={() => mark("learning")}
                className={cn(DUO.secondary, "flex-1 whitespace-nowrap px-2 text-[13px] tracking-normal sm:px-3")}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Still learning
              </button>
              <button
                type="button"
                onClick={() => mark("known")}
                className={cn(DUO.success, "flex-1 whitespace-nowrap px-2 text-[13px] tracking-normal sm:px-3")}
              >
                <Check className="h-4 w-4" aria-hidden="true" /> Got it
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={flip}
              className={cn(DUO.primary, "flex-1 px-3")}
            >
              {renderCard ? "Show answer" : "Show meaning"}
            </button>
          )}
          <button
            type="button"
            onClick={next}
            aria-label={index + 1 >= order.length ? "Finish deck" : "Next card"}
            className={cn(DUO.secondary, "w-14 shrink-0 px-0")}
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      ) : flipped ? (
        <div className="grid min-h-14 grid-cols-4 gap-2">
          {RATINGS.map((r) => {
            const when = formatInterval(card.nextReview?.[String(r.rating) as "1" | "2" | "3" | "4"]);
            return (
              <button
                key={r.action}
                type="button"
                onClick={() => rate(r.rating)}
                className={cn(DUO.option, "flex flex-col items-center justify-center px-1 py-1.5 text-sm font-extrabold uppercase tracking-wide", r.className)}
              >
                {r.label}
                {when && <span className="text-[11px] font-semibold opacity-75">{when}</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <button
          type="button"
          onClick={flip}
          className={cn(DUO.primary, "min-h-14 w-full")}
        >
          Show answer
        </button>
      )}

      <p className="hidden text-center text-xs text-muted-foreground md:block">
        {mode === "freestyle"
          ? "Space to flip · ← → to move · 1 still learning · 2 got it"
          : "Space to flip · 1–4 to rate · the time under each button is when you'll see the card again"}
      </p>
    </div>
  );
}
