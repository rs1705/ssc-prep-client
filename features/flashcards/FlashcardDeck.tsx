"use client";
import { useState } from "react";
import Flashcard from "./Flashcard";
import Cards from "./cards.json";
const FlashcardDeck = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + Cards.length) % Cards.length);
  };
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % Cards.length);
  };

  return (
    <div>
      <Flashcard card={Cards[currentIndex]} />
      <br />
      <div className="flex justify-between">
        <button
          onClick={prevCard}
          className="px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-slate-700 hover:cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={nextCard}
          className="px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-slate-700 hover:cursor-pointer"
        >
          Next
        </button>
      </div>
      <br />
      <p className="text-sm text-gray-500 text-center">
        Card {currentIndex + 1} of {Cards.length}
      </p>
    </div>
  );
};

export default FlashcardDeck;
