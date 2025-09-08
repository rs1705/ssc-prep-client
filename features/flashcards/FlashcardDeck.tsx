"use client";
import React, { useState } from "react";
import Flashcard from "./Flashcard";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import { FlashCardInterface } from "@/lib/types";
interface FlashcardDeckProps {
  deck: FlashCardInterface[];
}

const FlashcardDeck = ({ deck }: FlashcardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevCard();
      if (e.key === "ArrowRight") nextCard();
      if (e.key === " ") setIsFlipped((f) => !f);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, currentIndex]);

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
    <div>
      <Flashcard
        card={deck[currentIndex]}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
      />
      <div className="w-full mt-3">
        <div className="relative h-3 w-full bg-slate-200 rounded-full overflow-hidden">
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          />

          {/* Progress text */}
          <p
            className={`absolute inset-0 flex items-center justify-center text-xs font-semibold transition-colors duration-300 ${
              (currentIndex + 1) / deck.length > 0.15
                ? "text-slate-900"
                : "text-slate-800"
            }`}
          >
            Card {currentIndex + 1} of {deck.length}
          </p>
        </div>
      </div>

      <br />

      <div className="flex justify-center gap-1">
        <Button onClick={prevCard} className="hover:cursor-pointer">
          <MoveLeft />
          Previous
        </Button>
        <Button
          onClick={() => setIsFlipped((flipped) => !flipped)}
          className="hover:cursor-pointer "
        >
          Flip
        </Button>
        <Button
          onClick={() => alert("Feature is in development currently.")}
          className="hover:cursor-pointer "
        >
          Bookmark
        </Button>
        <Button onClick={nextCard} className="hover:cursor-pointer">
          Next
          <MoveRight />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardDeck;
