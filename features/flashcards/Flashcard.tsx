"use client";
import React, { useState } from "react";

interface Card {
  front: string;
  back: string;
}
interface FlashcardProps {
  card: Card;
}
const Flashcard: React.FC<FlashcardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div
      className="w-64 h-40 [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full bg-slate-200 font-bold text-lg text-center text-slate-800 flex items-center justify-center rounded-xl shadow-xl [backface-visibility:hidden]">
          {card.front}
        </div>
        {/* Back */}
        <div className="absolute w-full h-full bg-red-400 text-white font-semibold text-lg text-center flex items-center justify-center rounded-xl shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {card.back}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
