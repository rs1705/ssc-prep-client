import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import React from "react";

const FlashcardPage = () => {
  return (
    <div className="flex flex-col justify-center mt-10">
      <h3 className="text-center text-3xl">🎴FlashCards🎴</h3>
      <br />
      <br />
      <div className="flex justify-center">
        <FlashcardDeck />
      </div>
    </div>
  );
};

export default FlashcardPage;
