import React from "react";
import "@/features/flashcards/Flashcard";
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
const page = () => {
  return (
    <>
      <h1 className="text-5xl font-bold my-5">English</h1>
      <div className="flex justify-center">
        <FlashcardDeck />
      </div>
    </>
  );
};

export default page;
