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
    bg: "from-rose-50 to-rose-200",
    textMain: "text-slate-800",
    textSecondary: "text-slate-500",
    accent: "text-rose-700",
    accentBg: "bg-white/50 border-rose-200/80",
    barBg: "bg-gradient-to-r from-rose-400 to-rose-500",
    border: "border border-rose-300/80",
  },
  {
    bg: "from-sky-50 to-sky-200",
    textMain: "text-slate-800",
    textSecondary: "text-slate-500",
    accent: "text-sky-600",
    accentBg: "bg-white/50 border-sky-200/80",
    barBg: "bg-gradient-to-r from-sky-400 to-sky-500",
    border: "border border-sky-300/80",
  },
  {
    bg: "from-violet-50 to-violet-200",
    textMain: "text-slate-800",
    textSecondary: "text-slate-500",
    accent: "text-violet-700",
    accentBg: "bg-white/50 border-violet-200/80",
    barBg: "bg-gradient-to-r from-violet-400 to-violet-500",
    border: "border border-violet-300/80",
  },
  {
    bg: "from-stone-50 to-stone-200",
    textMain: "text-stone-800",
    textSecondary: "text-stone-500",
    accent: "text-stone-700",
    accentBg: "bg-white/50 border-stone-200/80",
    barBg: "bg-gradient-to-r from-stone-400 to-stone-500",
    border: "border border-stone-300/80",
  },
  {
    bg: "from-emerald-50 to-emerald-200",
    textMain: "text-slate-800",
    textSecondary: "text-slate-500",
    accent: "text-emerald-700",
    accentBg: "bg-white/50 border-emerald-200/80",
    barBg: "bg-gradient-to-r from-emerald-400 to-emerald-500",
    border: "border border-emerald-300/80",
  },
  {
    bg: "from-slate-50 to-slate-200",
    textMain: "text-slate-800",
    textSecondary: "text-slate-500",
    accent: "text-slate-600",
    accentBg: "bg-white/50 border-slate-200/80",
    barBg: "bg-gradient-to-r from-slate-400 to-slate-500",
    border: "border border-slate-300/80",
  },
  {
    bg: "from-amber-50 to-amber-200",
    textMain: "text-stone-800",
    textSecondary: "text-stone-500",
    accent: "text-amber-900",
    accentBg: "bg-white/50 border-amber-200/80",
    barBg: "bg-gradient-to-r from-amber-500 to-amber-600",
    border: "border border-amber-300/80",
  },
];

export const BUTTON_ACTIONS = {
  AGAIN: {
    label: "AGAIN",
    rating: 1,
    color: "hover:bg-red-50  border-red-300 bg-red-200",
  },
  HARD: {
    label: "HARD",
    rating: 2,
    color: "hover:bg-orange-50  border-orange-300 bg-orange-200",
  },
  GOOD: {
    label: "GOOD",
    rating: 3,
    color: "hover:bg-blue-50  border-blue-300 bg-blue-200",
  },
  EASY: {
    label: "EASY",
    rating: 4,
    color: "hover:bg-emerald-50 border-emerald-300 bg-emerald-200",
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
  - Container class: "relative h-4 w-full bg-slate-700 rounded-full overflow-hidden border border-slate-600/50 shadow-inner"
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


          <div className="relative w-full min-h-[420px] sm:min-h-[460px] md:min-h-[480px]">
            {/* LEFT BUTTON (Outside 3D perspective to avoid visual clipping) */}
            <button
              onClick={onPrevClick}
              disabled={deck.length <= 1}
              className={`absolute z-30 hidden md:flex -left-16 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full text-slate-800 shadow-md items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 hover:cursor-pointer border border-slate-200 ${deck.length <= 1 ? "md:hidden" : ""} bg-white opacity-90 hover:opacity-100`}
            >
              <MoveLeft className="w-6 h-6" />
            </button>

            {/* 3D PERSPECTIVE WRAPPER */}
            <div className="relative grid place-items-center w-full min-h-[420px] sm:min-h-[460px] md:min-h-[480px] [perspective:1000px]">
              {currentCard ? (
                <AnimatePresence custom={direction}>
                  <motion.div
                    key={`${currentCardId}-${navCount}`}
                    className="row-start-1 col-start-1 w-full cursor-grab active:cursor-grabbing select-none"
                    custom={direction}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={(event, info) => {
                      setTimeout(() => setIsDragging(false), 100);
                      const swipeThreshold = 40;
                      const velocityThreshold = 400;
                      if (
                        info.offset.x < -swipeThreshold ||
                        info.velocity.x < -velocityThreshold
                      ) {
                        onNextClick();
                      } else if (
                        info.offset.x > swipeThreshold ||
                        info.velocity.x > velocityThreshold
                      ) {
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
                      zIndex: 10,
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
                      stiffness: 350,
                      damping: 30,
                      mass: 1,
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
              className={`absolute z-30 hidden md:flex -right-16 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full text-slate-800 shadow-md items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 hover:cursor-pointer border border-slate-200 ${deck.length <= 1 ? "md:hidden" : ""} bg-white opacity-90 hover:opacity-100`}
              onClick={onNextClick}
              disabled={deck.length <= 1}
            >
              <MoveRight className="w-6 h-6" />
            </button>
          </div>
          <div className="w-full">
            <div className="w-full h-12 mt-2 flex items-center">
              {isFlipped && (
                <div className="flex primary-buttons gap-1 w-full animate-in fade-in duration-300 ease-out">
                  {(Object.keys(BUTTON_ACTIONS) as ActionType[]).map(
                    (actionKey) => {
                      const actionConfig = BUTTON_ACTIONS[actionKey];
                      return (
                        <Button
                          key={actionKey}
                          variant="outline"
                          className={`fade-up active:scale-95 transition-all duration-200 flex-1 hover:font-bold hover:cursor-pointer rounded-xl py-3 text-xs font-semibold ${actionConfig.color}`}
                          onClick={() => onActionClick(actionKey)}
                        >
                          {actionConfig.label}
                        </Button>
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
          <div className="flex flex-col items-center justify-center text-center p-8 min-h-[380px] min-[375px]:min-h-[440px] rounded-3xl bg-card border border-border shadow-sm">
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
