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
      <div className="flex "></div>

      <div>
        <h1 className="text-4xl font-bold text-center">Freestyle Mode</h1>
        <br />
        <p className="text-center text-slate-500">
          Start learning with free mode by choosing a category of your liking.
        </p>
        <div className="flex justify-center mt-2">
          <div className="flex w-full max-w-sm flex-col gap-2">
            <Tabs defaultValue={decks[0].type}>
              <TabsList>
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
                  <FlashcardDeck deck={deck.deckType} />
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
