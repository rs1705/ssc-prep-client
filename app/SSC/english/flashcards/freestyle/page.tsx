"use client";
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import React from "react";
import VocabCards from "@/data/vocab.json";
import IdiomCards from "@/data/idioms.json";
import OwsCards from "@/data/ows.json";
import PhobiaCards from "@/data/phobia.json";
import PhileCards from "@/data/phile.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlashCardInterface } from "@/lib/types";
interface Decks {
  id: string;
  deckType: FlashCardInterface[];
  type: string;
}
const FreestylePage = () => {
  const decks: Decks[] = [
    {
      id: "1",
      deckType: VocabCards,
      type: "vocab",
    },
    {
      id: "2",
      deckType: IdiomCards,
      type: "idioms",
    },
    {
      id: "3",
      deckType: OwsCards,
      type: "ows",
    },
    {
      id: "4",
      deckType: PhobiaCards,
      type: "phobia",
    },
    {
      id: "5",
      deckType: PhileCards,
      type: "phile",
    },
  ];
  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center">Freestyle Mode</h1>
        <p className="text-center text-slate-500 text-sm">
          Choose from the below given categories and start learning
        </p>
        <div className="flex justify-center mt-2">
          <div className="flex w-full max-w-sm flex-row justify-center gap-2">
            <Tabs defaultValue={decks[0].type}>
              <TabsList className="w-full">
                {decks.map((deck) => (
                  <TabsTrigger
                    key={deck.type}
                    value={deck.type}
                    className="hover:cursor-pointer hover:bg-white"
                  >
                    {deck.type.toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>
              {decks.map((deck) => (
                <TabsContent key={deck.id} value={deck.type}>
                  <FlashcardDeck deck={deck.deckType} deckId={deck.type} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreestylePage;
