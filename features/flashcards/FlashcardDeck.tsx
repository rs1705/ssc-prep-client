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
import { useAuth } from "@/context/auth";
import { useDispatch, useSelector } from "react-redux";
interface FlashcardDeckProps {
  deck: FlashCardInterface[];
  deckId: string;
}

const FlashcardDeck = ({ deck, deckId }: FlashcardDeckProps) => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [saveInteraction] = useSaveFlashcardInteractionsMutation();
  const dispatch = useDispatch();
  const {
    deck: sessionDeck,
    currentCardId,
    cardMeta,
  } = useSelector((state: any) => state.session);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevCard();
      if (e.key === "ArrowRight") nextCard();
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
    let newCount = 0;
    const pool: string[] = [];
    sessionDeck.forEach((id: string) => {
      if (id === currentCardId) return;
      const meta = cardMeta[id];
      if (!meta) return;

      if (meta.status === "unknown") {
        pool.push(id, id, id, id);
      }
      if (meta.isImportant === true) {
        pool.push(id, id, id);
      }
      if (meta.status === "new" && newCount < 3) {
        pool.push(id, id);
        newCount++;
      }
      if (meta.status === "known") {
        if (Math.random() < 0.1) {
          pool.push(id);
        }
      }
    });

    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const prevCard = () => {
    if (isFlipped) {
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
      }, 100);
      setIsFlipped(false);
    } else {
      setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
    }
  };
  const nextCard = () => {
    if (isFlipped) {
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1 + deck.length) % deck.length);
      }, 100);
      setIsFlipped(false);
    } else {
      setCurrentIndex((prev) => (prev + 1 + deck.length) % deck.length);
    }
  };
  const onActionClick = (action: ActionType) => {
    const card = deck.find((card) => card._id === currentCardId);
    if (!card) return;
    dispatch(handleUserAction({ cardId: card._id, action }));
    saveInteraction({
      userId: user?.uid,
      cardId: card._id,
      action,
    });

    const currentIndex = sessionDeck.findIndex(
      (id: string) => id === currentCardId,
    );
    const nextId = getNextCardId();
    dispatch(setCurrentCard({ cardId: nextId }));
    setIsFlipped(false);
  };

  const currentCard = deck.find((card) => card._id === currentCardId);
  return (
    <>
      {deck.length > 0 ? (
        <div>
          <div className="relative flex justify-center items-center">
            <button
              onClick={prevCard}
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
              onClick={nextCard}
              className="absolute right-[-60px] top-1/2 -translate-y-1/2 
               w-10 h-10 rounded-full bg-white text-black 
           flex items-center justify-center 
           transition-all duration-200 
           opacity-50 hover:opacity-100 hover:scale-110 hover:cursor-pointer border-1 border-gray-950"
            >
              <MoveRight />
            </button>
          </div>
          <div>
            <div className="w-full my-2">
              <div className="relative h-3 w-full bg-slate-300 rounded-full overflow-hidden">
                {/* Progress fill */}
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-300 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / deck.length) * 100}%`,
                  }}
                />

                {/* Progress text */}
                <p
                  className={`absolute inset-0 flex items-center justify-center text-xs font-semibold transition-colors duration-300 ${
                    (currentIndex + 1) / deck.length > 0.15 ? "black" : "black"
                  }`}
                >
                  Card {currentIndex + 1} of {deck.length}
                </p>
              </div>
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
