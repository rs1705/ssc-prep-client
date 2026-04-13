"use client";
import React, { useState, useEffect } from "react";
import Flashcard from "./Flashcard";
import { Button } from "@/components/ui/button";
import { Check, MoveLeft, MoveRight, Star, X } from "lucide-react";
import { FlashCardInterface } from "@/lib/types";
import { useSaveFlashcardInteractionMutation } from "@/redux/FlashcardApiSlice";
import { useAuth } from "@/context/auth";
interface FlashcardDeckProps {
  deck: FlashCardInterface[];
  deckId: string;
}

const FlashcardDeck = ({ deck, deckId }: FlashcardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [saveInteraction] = useSaveFlashcardInteractionMutation();
  const { user } = useAuth();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevCard();
      if (e.key === "ArrowRight") nextCard();
      if (e.key === " ") setIsFlipped((f) => !f);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, currentIndex]);

  useEffect(() => {
    setIsFlipped(false);
  }, [deckId]);

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

  const handleInteraction = (status: string) => {
    const card = deck[currentIndex];
    saveInteraction({
      userId: user?.uid,
      cardId: card._id,
      status,
    });
    nextCard();
  };

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
            {/* CARD */}
            <Flashcard
              card={deck[currentIndex]}
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
            />

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

            <div className="flex justify-between primary-buttons gap-0.5">
              <Button
                className="bg-green-600 hover:cursor-pointer hover:bg-green-500 flex items-center gap-1 group font-semibold w-30"
                onClick={() => handleInteraction("known")}
              >
                <Check className="transition-transform duration-150 group-hover:-translate-y-1" />
                Known
              </Button>
              <Button
                className="bg-red-600 hover:cursor-pointer hover:bg-red-600 flex items-center gap-1 group font-semibold w-30"
                onClick={() => handleInteraction("unknown")}
              >
                <X className="transition-transform duration-150 group-hover:-translate-y-1" />
                Unknown
              </Button>
              <Button
                className="bg-amber-500 hover:cursor-pointer hover:bg-amber-600 flex items-center gap-1 group font-semibold w-30"
                onClick={() => handleInteraction("important")}
              >
                <Star className="transition-transform duration-150 group-hover:-translate-y-1" />
                Important
              </Button>
            </div>
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
