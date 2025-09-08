"use client";
import React, { useMemo, useState, useEffect } from "react";
import Flashcard from "./Flashcard";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight, Star, Undo2 } from "lucide-react";
import { FlashCardInterface } from "@/lib/types";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { set } from "react-hook-form";
interface FlashcardDeckProps {
  deck: FlashCardInterface[];
  deckId: string;
}
const LETTERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const FlashcardDeck = ({ deck, deckId }: FlashcardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string>("");

  const filteredDeck = useMemo(() => {
    if (!selectedLetter) return deck;
    return deck.filter((d) => d.front.charAt(0) === selectedLetter);
  }, [deck, selectedLetter]);

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
    try {
      const savedProgress = localStorage.getItem("savedProgress");
      const allProgress = savedProgress ? JSON.parse(savedProgress) : {};

      // --- Load on mount (when state is still at defaults) ---
      if (allProgress[deckId] && selectedLetter === "" && currentIndex === 0) {
        const deckProgress = allProgress[deckId];
        setSelectedLetter(deckProgress.selectedLetter || "");
        setCurrentIndex(deckProgress.currentIndex || 0);
      } else {
        // --- Save whenever state changes ---
        const newProgress = {
          ...allProgress,
          [deckId]: {
            selectedLetter,
            currentIndex,
          },
        };
        localStorage.setItem("savedProgress", JSON.stringify(newProgress));
      }
    } catch (error) {
      console.log(error);
    }
  }, [deckId, selectedLetter, currentIndex]);

  const prevCard = () => {
    if (isFlipped) {
      setTimeout(() => {
        setCurrentIndex(
          (prev) => (prev - 1 + filteredDeck.length) % filteredDeck.length
        );
      }, 100);
      setIsFlipped(false);
    } else {
      setCurrentIndex(
        (prev) => (prev - 1 + filteredDeck.length) % filteredDeck.length
      );
    }
  };
  const nextCard = () => {
    if (isFlipped) {
      setTimeout(() => {
        setCurrentIndex(
          (prev) => (prev + 1 + filteredDeck.length) % filteredDeck.length
        );
      }, 100);
      setIsFlipped(false);
    } else {
      setCurrentIndex(
        (prev) => (prev + 1 + filteredDeck.length) % filteredDeck.length
      );
    }
  };

  return (
    <div>
      <div className="p-1 rounded-xl">
        <ToggleGroup
          type="single"
          size="default"
          className="flex-wrap"
          onValueChange={(val) => {
            if (val) setSelectedLetter(val);
          }}
        >
          {LETTERS.map((s) => (
            <ToggleGroupItem
              key={s}
              value={s}
              aria-label={`Toggle ${s}`}
              className="hover:cursor-pointer hover:bg-white"
            >
              {s}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <Flashcard
        card={filteredDeck[currentIndex]}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
      />
      <div>
        <div className="w-full my-2">
          <div className="relative h-3 w-full bg-slate-300 rounded-full overflow-hidden">
            {/* Progress fill */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / filteredDeck.length) * 100}%`,
              }}
            />

            {/* Progress text */}
            <p
              className={`absolute inset-0 flex items-center justify-center text-xs font-semibold transition-colors duration-300 ${
                (currentIndex + 1) / filteredDeck.length > 0.15
                  ? "black"
                  : "black"
              }`}
            >
              Card {currentIndex + 1} of {filteredDeck.length}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-1">
          <Button onClick={prevCard} className="hover:cursor-pointer ">
            <MoveLeft />
            Previous
          </Button>
          <Button
            onClick={() => setIsFlipped((flipped) => !flipped)}
            className="hover:cursor-pointer "
          >
            Flip <Undo2 />
          </Button>
          <Button
            onClick={() => alert("Feature is in development currently.")}
            className="hover:cursor-pointer "
          >
            <Star />
            Bookmark
          </Button>
          <Button onClick={nextCard} className="hover:cursor-pointer ">
            Next
            <MoveRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardDeck;
