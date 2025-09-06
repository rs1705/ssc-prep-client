import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import React from "react";

const FreestylePage = () => {
  return (
    <div>
      <div>
        <h2>Freestyle Mode Flashcards</h2>
      </div>
      <div className="flex justify-center">
        <FlashcardDeck />
      </div>
    </div>
  );
};

export default FreestylePage;
