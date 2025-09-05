"use client";
import React, { useState } from "react";
import Flashcard from "./Flashcard";
import Cards from "./cards.json";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight, Star } from "lucide-react";
const FlashcardDeck = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const prevCard = () => {
    if (isFlipped) {
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + Cards.length) % Cards.length);
      }, 100);
      setIsFlipped(false);
    } else {
      setCurrentIndex((prev) => (prev - 1 + Cards.length) % Cards.length);
    }
  };
  const nextCard = () => {
    if (isFlipped) {
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1 + Cards.length) % Cards.length);
      }, 100);
      setIsFlipped(false);
    } else {
      setCurrentIndex((prev) => (prev + 1 + Cards.length) % Cards.length);
    }
  };

  return (
    <div>
      <p className="text-sm font-bold text-slate-900 text-center">
        Card {currentIndex + 1} of {Cards.length}
      </p>
      <Flashcard
        card={Cards[currentIndex]}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
      />
      <br />

      <div className="flex justify-center gap-1">
        <Button className="hover:cursor-pointer">
          <MoveLeft />
          Hard
        </Button>
        <Button className="hover:cursor-pointer ">Medium</Button>
        <Button className="hover:cursor-pointer ">Easy</Button>
        <Button className="hover:cursor-pointer">
          Next
          <MoveRight />
        </Button>
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
          Reveal✨
        </Button>
        <Button
          onClick={() => alert("Feature is in development currently.")}
          className="hover:cursor-pointer "
        >
          Save🔖
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
