"use client";
import React, { useState, useEffect } from "react";
import Flashcard from "./Flashcard";
import { Button } from "@/components/ui/button";
import { Check, MoveLeft, MoveRight, Star, X } from "lucide-react";
import { FlashCardInterface } from "@/lib/types";
import { useSaveFlashcardInteractionsMutation } from "@/redux/FlashcardApiSlice";

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
  deckId: string;
}

const FlashcardDeck = ({ deck, deckId }: FlashcardDeckProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardHistory, setCardHistory] = useState<string[]>([]);
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

  const getNextCardId = () => {
    const candidates = sessionDeck.filter((id: string) => id !== currentCardId);
    if (candidates.length === 0) return currentCardId;

    const unknown: string[] = [];
    const important: string[] = [];
    const newCards: string[] = [];
    const known: string[] = [];

    candidates.forEach((id: string) => {
      const meta = cardMeta[id];

      if (!meta || meta.status === "new") newCards.push(id);
      else if (meta.status === "unknown") unknown.push(id);
      else if (meta.isImportant) important.push(id);
      else if (meta.status === "known") known.push(id);
    });
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const r = Math.random();

    if (r < 0.35 && unknown.length > 0) return pick(unknown);
    if (r < 0.65 && important.length > 0) return pick(important);
    if (r < 0.85 && newCards.length > 0) return pick(newCards);
    if (known.length > 0) return pick(known);

    const all = [...unknown, ...important, ...newCards, ...known];

    return all.length ? pick(all) : currentCardId;
  };

  const onActionClick = (action: ActionType) => {
    const card = deck.find((card) => card._id === currentCardId);
    if (!card) return;

    if (!currentCardId) return;
    setCardHistory((prev) => [...prev, currentCardId]);

    dispatch(handleUserAction({ cardId: card._id, action }));
    saveInteraction({
      userId: user?.uid,
      cardId: card._id,
      action,
    });
    const nextId = getNextCardId();

    setTimeout(() => {
      dispatch(setCurrentCard({ cardId: nextId }));
    }, 100);
    setIsFlipped(false);
  };

  const onNextClick = () => {
    if (!currentCardId) return;
    setCardHistory((prev) => [...prev, currentCardId]);
    const nextId = getNextCardId();
    dispatch(setCurrentCard({ cardId: nextId }));
    setIsFlipped(false);
  };

  const onPrevClick = () => {
    if (cardHistory.length === 0) return;
    const prevId = cardHistory[cardHistory.length - 1];
    setCardHistory((prev) => prev.slice(0, -1));
    dispatch(setCurrentCard({ cardId: prevId }));
    setIsFlipped(false);
  };

  const currentCard = deck.find((card) => card._id === currentCardId);
  console.log(cardHistory);
  return (
    <>
      {deck.length > 0 ? (
        <div>
          <div className="relative flex justify-center items-center">
            <button
              onClick={onPrevClick}
              className="absolute left-[-60px] top-1/2 -translate-y-1/2 
           w-10 h-10 rounded-full bg-white text-black 
           flex items-center justify-center 
           transition-all duration-200 
           opacity-50 hover:opacity-100 hover:scale-110 hover:cursor-pointer border-1 border-gray-950"
            >
              <MoveLeft />
            </button>
            {currentCard ? (
              <Flashcard
                card={currentCard}
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}
              />
            ) : (
              <div>Loading...</div>
            )}
            {/* RIGHT BUTTON */}
            <button
              className="absolute right-[-60px] top-1/2 -translate-y-1/2 
               w-10 h-10 rounded-full bg-white text-black 
           flex items-center justify-center 
           transition-all duration-200 
           opacity-50 hover:opacity-100 hover:scale-110 hover:cursor-pointer border-1 border-gray-950"
              onClick={onNextClick}
            >
              <MoveRight />
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
