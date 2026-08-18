"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Flashcard from "./Flashcard";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import { FlashCardInterface } from "@/lib/types";
import { useSaveFlashcardInteractionsMutation } from "@/redux/FlashcardApiSlice";
import posthog from "posthog-js";

import { initializeSession, setCurrentCard } from "@/redux/sessionSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Loader from "@/components/custom/loader";
import { ProgressBar } from "@/components/custom/ProgressBar";
interface FlashcardDeckProps {
  deck: FlashCardInterface[];
  deckId?: string;
  isLinear?: boolean;
  mode?: "freestyle" | "study";
  activeFilters?: string[];
}

export const COLOR_SCHEMES = [
  {
    bg: "from-rose-50 to-rose-100/90 dark:from-rose-950/40 dark:to-zinc-900",
    textMain: "text-rose-950 dark:text-rose-100",
    textSecondary: "text-rose-700/80 dark:text-rose-300/70",
    accent: "text-rose-600 dark:text-rose-400",
    accentBg: "bg-white/60 dark:bg-rose-950/50 border-rose-200/80 dark:border-rose-500/25",
    barBg: "bg-gradient-to-r from-rose-400 to-rose-500",
    border: "border-2 border-rose-200/80 dark:border-rose-500/30",
  },
  {
    bg: "from-sky-50 to-sky-100/90 dark:from-sky-950/40 dark:to-zinc-900",
    textMain: "text-sky-950 dark:text-sky-100",
    textSecondary: "text-sky-700/80 dark:text-sky-300/70",
    accent: "text-sky-600 dark:text-sky-400",
    accentBg: "bg-white/60 dark:bg-sky-950/50 border-sky-200/80 dark:border-sky-500/25",
    barBg: "bg-gradient-to-r from-sky-400 to-sky-500",
    border: "border-2 border-sky-200/80 dark:border-sky-500/30",
  },
  {
    bg: "from-violet-50 to-violet-100/90 dark:from-violet-950/40 dark:to-zinc-900",
    textMain: "text-violet-950 dark:text-violet-100",
    textSecondary: "text-violet-700/80 dark:text-violet-300/70",
    accent: "text-violet-600 dark:text-violet-400",
    accentBg: "bg-white/60 dark:bg-violet-950/50 border-violet-200/80 dark:border-violet-500/25",
    barBg: "bg-gradient-to-r from-violet-400 to-violet-500",
    border: "border-2 border-violet-200/80 dark:border-violet-500/30",
  },
  {
    bg: "from-amber-50 to-amber-100/90 dark:from-amber-950/40 dark:to-zinc-900",
    textMain: "text-amber-950 dark:text-amber-100",
    textSecondary: "text-amber-800/80 dark:text-amber-300/70",
    accent: "text-amber-600 dark:text-amber-400",
    accentBg: "bg-white/60 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-500/25",
    barBg: "bg-gradient-to-r from-amber-500 to-amber-600",
    border: "border-2 border-amber-200/80 dark:border-amber-500/30",
  },
  {
    bg: "from-emerald-50 to-emerald-100/90 dark:from-emerald-950/40 dark:to-zinc-900",
    textMain: "text-emerald-950 dark:text-emerald-100",
    textSecondary: "text-emerald-700/80 dark:text-emerald-300/70",
    accent: "text-emerald-600 dark:text-emerald-400",
    accentBg: "bg-white/60 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-500/25",
    barBg: "bg-gradient-to-r from-emerald-400 to-emerald-500",
    border: "border-2 border-emerald-200/80 dark:border-emerald-500/30",
  },
  {
    bg: "from-indigo-50 to-indigo-100/90 dark:from-indigo-950/40 dark:to-zinc-900",
    textMain: "text-indigo-950 dark:text-indigo-100",
    textSecondary: "text-indigo-700/80 dark:text-indigo-300/70",
    accent: "text-indigo-600 dark:text-indigo-400",
    accentBg: "bg-white/60 dark:bg-indigo-950/50 border-indigo-200/80 dark:border-indigo-500/25",
    barBg: "bg-gradient-to-r from-indigo-400 to-indigo-500",
    border: "border-2 border-indigo-200/80 dark:border-indigo-500/30",
  },
  {
    bg: "from-orange-50 to-orange-100/90 dark:from-orange-950/40 dark:to-zinc-900",
    textMain: "text-orange-950 dark:text-orange-100",
    textSecondary: "text-orange-800/80 dark:text-orange-300/70",
    accent: "text-orange-600 dark:text-orange-400",
    accentBg: "bg-white/60 dark:bg-orange-950/50 border-orange-200/80 dark:border-orange-500/25",
    barBg: "bg-gradient-to-r from-orange-400 to-orange-500",
    border: "border-2 border-orange-200/80 dark:border-orange-500/30",
  },
  {
    bg: "from-teal-50 to-teal-100/90 dark:from-teal-950/40 dark:to-zinc-900",
    textMain: "text-teal-950 dark:text-teal-100",
    textSecondary: "text-teal-800/80 dark:text-teal-300/70",
    accent: "text-teal-600 dark:text-teal-400",
    accentBg: "bg-white/60 dark:bg-teal-950/50 border-teal-200/80 dark:border-teal-500/25",
    barBg: "bg-gradient-to-r from-teal-400 to-teal-500",
    border: "border-2 border-teal-200/80 dark:border-teal-500/30",
  },
  {
    bg: "from-fuchsia-50 to-fuchsia-100/90 dark:from-fuchsia-950/40 dark:to-zinc-900",
    textMain: "text-fuchsia-950 dark:text-fuchsia-100",
    textSecondary: "text-fuchsia-800/80 dark:text-fuchsia-300/70",
    accent: "text-fuchsia-600 dark:text-fuchsia-400",
    accentBg: "bg-white/60 dark:bg-fuchsia-950/50 border-fuchsia-200/80 dark:border-fuchsia-500/25",
    barBg: "bg-gradient-to-r from-fuchsia-400 to-fuchsia-500",
    border: "border-2 border-fuchsia-200/80 dark:border-fuchsia-500/30",
  },
  {
    bg: "from-stone-50 to-stone-100/90 dark:from-zinc-900 dark:to-zinc-950",
    textMain: "text-stone-900 dark:text-zinc-100",
    textSecondary: "text-stone-600 dark:text-zinc-400",
    accent: "text-amber-600 dark:text-amber-400",
    accentBg: "bg-white/60 dark:bg-zinc-800/60 border-stone-200/80 dark:border-zinc-700/40",
    barBg: "bg-gradient-to-r from-stone-400 to-stone-500",
    border: "border-2 border-stone-200/80 dark:border-zinc-800",
  },
];

export const BUTTON_ACTIONS = {
  AGAIN: {
    label: "AGAIN",
    sub: "< 1m",
    rating: 1,
    color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40 border-b-[4px] border-b-rose-600/70 hover:bg-rose-500/25 hover:border-rose-500/60 active:border-b-[1px] active:translate-y-[3px]",
  },
  HARD: {
    label: "HARD",
    sub: "2d",
    rating: 2,
    color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 border-b-[4px] border-b-amber-600/70 hover:bg-amber-500/25 hover:border-amber-500/60 active:border-b-[1px] active:translate-y-[3px]",
  },
  GOOD: {
    label: "GOOD",
    sub: "4d",
    rating: 3,
    color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 border-b-[4px] border-b-emerald-600/70 hover:bg-emerald-500/25 hover:border-emerald-500/60 active:border-b-[1px] active:translate-y-[3px]",
  },
  EASY: {
    label: "EASY",
    sub: "7d",
    rating: 4,
    color: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/40 border-b-[4px] border-b-sky-600/70 hover:bg-sky-500/25 hover:border-sky-500/60 active:border-b-[1px] active:translate-y-[3px]",
  },
} as const;
export type ActionType = keyof typeof BUTTON_ACTIONS;

/*
  REFERENCE: ORIGINAL DARK COLOR SCHEME
  If you ever want to revert back to the original dark styling, use these values:
  
  Card scheme (DEFAULT_SCHEME in Flashcard.tsx):
  {
    bg: "from-slate-700 to-slate-800",
    textMain: "text-white",
    textSecondary: "text-slate-400",
    accent: "text-amber-400",
    accentBg: "bg-amber-400/10 border-amber-400/20"
  }

  Progress Bar (FlashcardDeck.tsx):
  - Container class: "relative h-4 w-full bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600/50 shadow-inner"
  - Progress fill class: "absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 transition-all duration-300"
  - Text class: "absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-wider transition-colors duration-300 text-white mix-blend-difference"
*/

const FlashcardDeck = ({ deck = [], deckId, mode, activeFilters = [] }: FlashcardDeckProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cardHistory, setCardHistory] = useState<string[]>([]);
  const [direction, setDirection] = useState(1);
  const [navCount, setNavCount] = useState(0);
  const [saveInteraction] = useSaveFlashcardInteractionsMutation();
  const dispatch = useDispatch();

  const { currentCardId } = useSelector((state: RootState) => state.session);

  const currentIndex = deck.findIndex((card) => card._id === currentCardId);
  const scheme =
    COLOR_SCHEMES[
      (currentIndex >= 0 ? currentIndex : 0) % COLOR_SCHEMES.length
    ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
      }
      if (e.key === "ArrowRight") {
      }
      if (e.key === " ") setIsFlipped((f) => !f);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    setIsFlipped(false);
    setNavCount((prev) => prev + 1);
  }, [deckId, currentCardId]);

  useEffect(() => {
    if (deck && deck.length > 0) {
      dispatch(
        initializeSession({
          deck: deck.map((card) => card._id),
        }),
      );
      posthog.capture("flashcard_session_started", {
        mode: mode || "freestyle",
        deckSize: deck.length,
      });
    }
  }, [deck, dispatch]);

  const onActionClick = (action: keyof typeof BUTTON_ACTIONS) => {
    console.log(action);
    const card = deck.find((card) => card._id === currentCardId);
    if (!card) return;

    if (!currentCardId) return;
    setDirection(1);
    const newHistory = [...cardHistory, currentCardId];
    setCardHistory(newHistory);

    if (mode === "study") {
      saveInteraction({
        cardId: card._id,
        rating: BUTTON_ACTIONS[action].rating,
      });
    }

    posthog.capture("flashcard_rated", {
      rating: BUTTON_ACTIONS[action].label,
      ratingValue: BUTTON_ACTIONS[action].rating,
      mode: mode || "freestyle",
      cardId: card._id,
    });
    const currentIndex = deck.findIndex((c) => c._id === currentCardId);
    const nextIndex = (currentIndex + 1) % deck.length;
    const nextId = deck[nextIndex]._id;

    setTimeout(() => {
      dispatch(setCurrentCard({ cardId: nextId }));
    }, 100);
    setIsFlipped(false);
  };

  const onNextClick = () => {
    if (!deck || deck.length === 0) return;
    const currentIndex = deck.findIndex((c) => c._id === currentCardId);
    const nextIndex = (currentIndex + 1) % deck.length;
    setDirection(1);
    dispatch(setCurrentCard({ cardId: deck[nextIndex]._id }));
    setIsFlipped(false);
  };

  const onPrevClick = () => {
    if (!deck || deck.length === 0) return;
    const currentIndex = deck.findIndex((c) => c._id === currentCardId);
    const prevIndex = (currentIndex - 1 + deck.length) % deck.length;
    setDirection(-1);
    dispatch(setCurrentCard({ cardId: deck[prevIndex]._id }));
    setIsFlipped(false);
  };

  const currentCard = deck.find((card) => card._id === currentCardId);

  return (
    <>
      {deck.length > 0 ? (
        <div className="flex flex-col items-center w-full">


          <div className="relative w-full h-[380px] min-[375px]:h-[410px] min-[414px]:h-[430px] sm:h-[450px] md:h-[475px] lg:h-[490px]">
            {/* LEFT BUTTON (Outside 3D perspective to avoid visual clipping) */}
            <button
              onClick={onPrevClick}
              disabled={deck.length <= 1}
              className={`absolute z-30 hidden md:flex -left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full text-foreground shadow-xl shadow-black/5 items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 hover:cursor-pointer border-2 border-border/40 ${deck.length <= 1 ? "md:hidden" : ""} bg-card/60 backdrop-blur-xl hover:border-amber-500/30`}
            >
              <MoveLeft className="w-5 h-5" />
            </button>

            {/* 3D PERSPECTIVE WRAPPER */}
            <div className="relative grid place-items-center w-full h-[380px] min-[375px]:h-[410px] min-[414px]:h-[430px] sm:h-[450px] md:h-[475px] lg:h-[490px] [perspective:1000px]">
              {currentCard ? (
                <AnimatePresence custom={direction}>
                  <motion.div
                    key={`${currentCard._id}-${navCount}`}
                    custom={direction}
                    className="row-start-1 col-start-1 w-full h-full cursor-grab active:cursor-grabbing select-none"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={(e, { offset, velocity }) => {
                      setTimeout(() => setIsDragging(false), 80);
                      const swipeThreshold = 40;
                      const velocityThreshold = 400;
                      if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
                        onNextClick();
                      } else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
                        onPrevClick();
                      }
                    }}
                    initial={{
                      x: direction > 0 ? 250 : -250,
                      opacity: 0,
                      rotateY: direction > 0 ? -50 : 50,
                      scale: 0.6,
                      zIndex: 0,
                    }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      rotateY: 0,
                      scale: 1,
                      zIndex: 1,
                    }}
                    exit={{
                      x: direction > 0 ? -250 : 250,
                      opacity: 0,
                      rotateY: direction > 0 ? 50 : -50,
                      scale: 0.6,
                      zIndex: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 28,
                      mass: 0.8,
                    }}
                  >
                    <Flashcard
                      card={currentCard}
                      onFlipChange={setIsFlipped}
                      colorScheme={scheme}
                      activeFilters={activeFilters}
                      isDragging={isDragging}
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <Loader size="sm" />
              )}
            </div>

            {/* RIGHT BUTTON (Outside 3D perspective to avoid visual clipping) */}
            <button
              className={`absolute z-30 hidden md:flex -right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full text-foreground shadow-xl shadow-black/5 items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 hover:cursor-pointer border-2 border-border/40 ${deck.length <= 1 ? "md:hidden" : ""} bg-card/60 backdrop-blur-xl hover:border-amber-500/30`}
              onClick={onNextClick}
              disabled={deck.length <= 1}
            >
              <MoveRight className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full">
            <div className="w-full h-12 sm:h-13 mt-4 sm:mt-5 flex items-center">
              {isFlipped && (
                <div className="flex primary-buttons gap-2 sm:gap-2.5 w-full animate-in fade-in duration-200 ease-out">
                  {(Object.keys(BUTTON_ACTIONS) as ActionType[]).map(
                    (actionKey) => {
                      const actionConfig = BUTTON_ACTIONS[actionKey];
                      return (
                        <button
                          key={actionKey}
                          type="button"
                          className={`flex-1 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 h-auto text-xs font-mono font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-0.5 border-2 select-none transition-all duration-75 cursor-pointer shadow-xs ${actionConfig.color}`}
                          onClick={() => onActionClick(actionKey)}
                        >
                          <span className="font-bold">{actionConfig.label}</span>
                          <span className="text-[9px] font-normal opacity-80 font-mono">
                            {actionConfig.sub}
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[500px] mx-auto transition-all duration-300 ease-in-out animate-in fade-in">
          <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 min-h-[300px] min-[375px]:min-h-[330px] sm:min-h-[440px] rounded-3xl bg-card border-2 border-border shadow-sm">
            <span className="text-5xl mb-4 animate-pulse select-none">🔍</span>
            <h3 className="text-lg font-bold text-foreground mb-1.5">
              No Cards Found
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Oops! No flashcards match your current filters. Try changing the
              category or removing some filters above.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashcardDeck;
