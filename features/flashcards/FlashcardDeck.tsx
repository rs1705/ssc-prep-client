"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Flashcard from "./Flashcard";
import { Button } from "@/components/ui/button";
import { Check, MoveLeft, MoveRight, Star, X } from "lucide-react";
import { FlashCardInterface } from "@/lib/types";
import { useSaveFlashcardInteractionsMutation, useGetStudyDeckQuery } from "@/redux/FlashcardApiSlice";

import {
  handleUserAction,
  ActionType,
  initializeSession,
  setCurrentCard,
} from "@/redux/sessionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/context/auth";
import { RootState } from "@/redux/store";
interface FlashcardDeckProps {
  deck: FlashCardInterface[];
  deckId?: string;
}

const FlashcardDeck = ({ deck, deckId }: FlashcardDeckProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardHistory, setCardHistory] = useState<string[]>([]);
  const [direction, setDirection] = useState(1);
  const { user } = useAuth();
  const [saveInteraction] = useSaveFlashcardInteractionsMutation();
  const dispatch = useDispatch();

  const {
    deck: sessionDeck,
    currentCardId,
    cardMeta,
  } = useSelector((state: RootState) => state.session);

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
  }, [deckId]);

  useEffect(() => {
    if (deck && deck.length > 0) {
      dispatch(
        initializeSession({
          deck: deck.map((card) => card._id),
        }),
      );
    }
  }, [deck, dispatch]);

  const getNextCardId = (history: string[] = cardHistory) => {
    console.log(history);
    const candidates = sessionDeck.filter((id: string) => id !== currentCardId);
    if (candidates.length === 0) return currentCardId;

    // Filter out the last 3 seen cards to avoid immediate repetition
    const recentHistory = history.slice(-3);
    const nonRecentCandidates = candidates.filter(id => !recentHistory.includes(id));

    // Fallback if the deck is too small and all candidates were recently seen
    const eligibleCandidates = nonRecentCandidates.length > 0 ? nonRecentCandidates : candidates;

    const unknown: string[] = [];
    const important: string[] = [];
    const newCards: string[] = [];
    const known: string[] = [];

    eligibleCandidates.forEach((id: string) => {
      const meta = cardMeta[id];

      if (!meta || meta.status === "new") {
        newCards.push(id);
      } else if (meta.status === "unknown") {
        unknown.push(id);
      } else if (meta.status === "known") {
        known.push(id);
      }

      if (meta && meta.isImportant) {
        important.push(id);
      }
    });

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    if (unknown.length > 0) return pick(unknown);
    if (newCards.length > 0) return pick(newCards);
    if (important.length > 0) return pick(important);
    if (known.length > 0) return pick(known);

    return currentCardId;
  };

  const onActionClick = (action: ActionType) => {
    const card = deck.find((card) => card._id === currentCardId);
    if (!card) return;

    if (!currentCardId) return;
    setDirection(1);
    const newHistory = [...cardHistory, currentCardId];
    setCardHistory(newHistory);

    dispatch(handleUserAction({ cardId: card._id, action }));
    saveInteraction({
      userId: user?.uid,
      cardId: card._id,
      action,
    });
    const nextId = getNextCardId(newHistory);

    setTimeout(() => {
      dispatch(setCurrentCard({ cardId: nextId }));
    }, 100);
    setIsFlipped(false);
  };

  const onNextClick = () => {
    if (!currentCardId) return;
    setDirection(1);
    const newHistory = [...cardHistory, currentCardId];
    setCardHistory(newHistory);
    const nextId = getNextCardId(newHistory);
    dispatch(setCurrentCard({ cardId: nextId }));
    setIsFlipped(false);
  };

  const onPrevClick = () => {
    if (cardHistory.length === 0) return;
    setDirection(-1);
    const prevId = cardHistory[cardHistory.length - 1];
    setCardHistory((prev) => prev.slice(0, -1));
    dispatch(setCurrentCard({ cardId: prevId }));
    setIsFlipped(false);
  };

  const currentCard = deck.find((card) => card._id === currentCardId);
  return (
    <>
      {deck.length > 0 ? (
        <div>
          <div className="relative flex justify-center items-center">
            <button
              onClick={onPrevClick}
              className="absolute z-20 -left-2 sm:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center transition-all duration-200 opacity-90 hover:opacity-100 hover:scale-110 hover:cursor-pointer border border-slate-200"
            >
              <MoveLeft className="w-5 h-5" />
            </button>
            {currentCard ? (
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentCardId}
                  custom={direction}
                  initial={{
                    x: direction > 0 ? 100 : -100,
                    opacity: 0,
                    rotate: direction > 0 ? 15 : -15,
                    scale: 0.85
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    rotate: 0,
                    scale: 1
                  }}
                  exit={{
                    x: direction > 0 ? -100 : 100,
                    opacity: 0,
                    rotate: direction > 0 ? -15 : 15,
                    scale: 0.85
                  }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                >
                  <Flashcard
                    card={currentCard}
                    isFlipped={isFlipped}
                    setIsFlipped={setIsFlipped}
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div>Loading...</div>
            )}
            {/* RIGHT BUTTON */}
            <button
              className="absolute z-20 -right-2 sm:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center transition-all duration-200 opacity-90 hover:opacity-100 hover:scale-110 hover:cursor-pointer border border-slate-200"
              onClick={onNextClick}
            >
              <MoveRight className="w-5 h-5" />
            </button>
          </div>
          <div>
            <div className="w-full my-2">
              {/* <div className="relative h-3 w-full bg-slate-300 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / deck.length) * 100}%`,
                  }}
                />

                <p
                  className={`absolute inset-0 flex items-center justify-center text-xs font-semibold transition-colors duration-300 ${
                    (currentIndex + 1) / deck.length > 0.15 ? "black" : "black"
                  }`}
                >
                  Card {currentIndex + 1} of {deck.length}
                </p>
              </div> */}
            </div>

            {isFlipped && (
              <div className="flex justify-between primary-buttons gap-0.5">
                <Button
                  className="fade-up [animation-delay:0.05s] active:scale-95 transition-transform duration-100 hover:brightness-110 w-1/3 hover:font-semibold hover:cursor-pointer hover:text-red-400 group"
                  onClick={() => onActionClick("unknown")}
                >
                  <X className="transition-transform duration-150 group-hover:-translate-y-1" />
                  AGAIN
                </Button>
                <Button
                  className="ffade-up [animation-delay:0.30s] active:scale-95 transition-transform duration-100 hover:brightness-110 w-1/3  hover:font-semibold hover:cursor-pointer hover:text-lime-500 group"
                  onClick={() => onActionClick("known")}
                >
                  <Check className="transition-transform duration-150 group-hover:-translate-y-1" />
                  GOOD
                </Button>
                <Button
                  className="fade-up [animation-delay:0.55s] active:scale-95 transition-transform duration-100 hover:brightness-110 w-1/3  hover:font-semibold hover:cursor-pointer hover:text-amber-400 group"
                  onClick={() => onActionClick("important")}
                >
                  <Star className="hover:transition-transform duration-150 group-hover:-translate-y-1" />
                  IMPORTANT
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-[360px] text-center text-red-400 font-semibold transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-left-5">
          <p>🥹Oops! No data found for the applied filter.🥹</p>
        </div>
      )}
    </>
  );
};

export default FlashcardDeck;
