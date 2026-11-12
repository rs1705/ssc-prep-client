import { describe, expect, it } from "vitest";
import type { FlashCardInterface } from "@/lib/types";
import { misspellings, toHangmanWord, toSpellingWord, toWordOfDay } from "./wordBank";

const card = (text: string, meaning: string, type = "vocab") =>
  ({ _id: text, type, front: { text }, back: { content_eng: meaning, content_hindi: ["हिंदी"] } }) as unknown as FlashCardInterface;

describe("wordBank", () => {
  it("turns a flashcard into a hangman word", () => {
    expect(toHangmanWord(card("Abolish", "To formally end a system."))).toEqual({
      word: "ABOLISH",
      meaning: "To formally end a system",
      hindi: "हिंदी",
      category: "Vocabulary",
    });
  });

  it("skips phrases and clues that give the word away", () => {
    expect(toHangmanWord(card("Bad egg", "A dishonest person"))).toBeNull();
    expect(toHangmanWord(card("Abate", "To abate something"))).toBeNull();
  });

  it("only uses five-letter words for Wordle", () => {
    expect(toWordOfDay(card("Brisk", "Quick and active"))?.word).toBe("BRISK");
    expect(toWordOfDay(card("Abolish", "To end"))).toBeNull();
  });

  it("makes three distinct misspellings, none equal to the word", () => {
    const s = toSpellingWord(card("Accommodate", "To fit in"))!;
    expect(s.wrong).toHaveLength(3);
    expect(new Set(s.wrong).size).toBe(3);
    expect(s.wrong.map((w) => w.toLowerCase())).not.toContain("accommodate");
    expect(misspellings("occurrence")).toContain("Ocurrence");
  });
});
