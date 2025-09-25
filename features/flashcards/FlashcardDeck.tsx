"use client";
import React, { useMemo, useState, useEffect } from "react";
import Flashcard from "./Flashcard";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight, Star, Undo2 } from "lucide-react";
import { FlashCardInterface } from "@/lib/types";

interface FlashcardDeckProps {
  deck: FlashCardInterface[];
  deckId: string;
}

const FlashcardDeck = ({ deck, deckId }: FlashcardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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

  return (
    <>
      {deck.length > 0 ? (
        <div>
          <Flashcard
            card={deck[currentIndex]}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
          />
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

            <div className="flex justify-center gap-1">
              <Button
                onClick={prevCard}
                className="hover:cursor-pointer flex items-center gap-1 group"
              >
                <MoveLeft className="transition-transform duration-150 group-hover:-translate-x-1" />
                Previous
              </Button>

              <Button
                onClick={() => setIsFlipped((flipped) => !flipped)}
                className="hover:cursor-pointer flex items-center gap-1 group"
              >
                Flip
                <Undo2 className="transition-transform duration-150 group-hover:-translate-y-1" />
              </Button>

              <Button
                onClick={() => alert("Feature is in development currently.")}
                className="hover:cursor-pointer flex items-center gap-1 group"
              >
                <Star className="transition-transform duration-400 group-hover:rotate-y-[360deg]" />
                Bookmark
              </Button>

              <Button
                onClick={nextCard}
                className="hover:cursor-pointer flex items-center gap-1 group"
              >
                Next
                <MoveRight className="transition-transform duration-150 group-hover:translate-x-1" />
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
