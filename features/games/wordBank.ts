"use client";

import { useMemo } from "react";
import { useGetFilteredCardsQuery } from "@/redux/FlashcardApiSlice";
import type { FlashCardInterface } from "@/lib/types";
import { HANGMAN_WORDS, type HangmanWord } from "@/lib/hangman-words";
import { SPELLING_WORDS, type SpellingWord } from "@/lib/spelling-words";
import { WORD_OF_DAY_BANK, type WordOfDay } from "@/lib/wordle-words";

/**
 * Word games draw on the flashcard database (vocab + one-word substitutions,
 * several hundred words) instead of only their small built-in lists. The
 * built-in lists stay as a fallback and are merged in, so the games still work
 * offline or while the server wakes up.
 */

const clean = (s: string | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const firstClause = (s: string) => {
  const t = clean(s).replace(/\.$/, "");
  return t.length > 110 ? `${t.slice(0, 107).trimEnd()}…` : t;
};

function single(card: FlashCardInterface): string | null {
  const w = clean(card.front?.text);
  return /^[A-Za-z]+$/.test(w) ? w : null;
}

export function toHangmanWord(card: FlashCardInterface): HangmanWord | null {
  const w = single(card);
  if (!w || w.length < 4 || w.length > 13) return null;
  const meaning = firstClause(card.back?.content_eng ?? "");
  // The clue must not give the word away.
  if (!meaning || meaning.toLowerCase().includes(w.toLowerCase().slice(0, 5))) return null;
  return {
    word: w.toUpperCase(),
    meaning,
    hindi: clean(card.back?.content_hindi?.[0]),
    category: card.type === "ows" ? "One Word Substitution" : "Vocabulary",
  };
}

export function toWordOfDay(card: FlashCardInterface): WordOfDay | null {
  const h = toHangmanWord(card);
  return h && h.word.length === 5 ? { word: h.word, meaning: h.meaning, hindi: h.hindi } : null;
}

/* ---------- Spelling: realistic misspellings, generated ---------- */

const SWAPS: [RegExp, string][] = [
  [/ance$/, "ence"], [/ence$/, "ance"], [/ant$/, "ent"], [/ent$/, "ant"],
  [/ible$/, "able"], [/able$/, "ible"], [/ie/, "ei"], [/ei/, "ie"],
  [/ar$/, "er"], [/er$/, "ar"], [/ous$/, "us"], [/tion$/, "sion"], [/sion$/, "tion"],
  [/ph/, "f"], [/c(?=[ei])/, "s"], [/s(?=[ei])/, "c"], [/y/, "i"],
];

/** Plausible ways to misspell a word, most realistic first. */
export function misspellings(word: string): string[] {
  const w = word.toLowerCase();
  const out = new Set<string>();
  // Doubled letter written once, or a single consonant doubled.
  for (let i = 1; i < w.length; i++) if (w[i] === w[i - 1]) out.add(w.slice(0, i) + w.slice(i + 1));
  for (const [re, to] of SWAPS) if (re.test(w)) out.add(w.replace(re, to));
  // Vowel confusion in an unstressed-looking middle syllable.
  const vowel: Record<string, string> = { a: "e", e: "a", i: "e", o: "a", u: "o" };
  for (let i = 2; i < w.length - 2; i++) {
    if (vowel[w[i]] && !/[aeiou]/.test(w[i - 1]) && !/[aeiou]/.test(w[i + 1])) {
      out.add(w.slice(0, i) + vowel[w[i]] + w.slice(i + 1));
    }
  }
  // A single consonant doubled, only between vowels (the "occured/ocurred" kind of slip).
  for (let i = 2; i < w.length - 1; i++) {
    if (/[cdflmnprst]/.test(w[i]) && /[aeiou]/.test(w[i - 1]) && /[aeiou]/.test(w[i + 1])) {
      out.add(w.slice(0, i + 1) + w[i] + w.slice(i + 1));
    }
  }
  out.delete(w);
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return [...out].filter((s) => s.length >= 4).map(cap);
}

export function toSpellingWord(card: FlashCardInterface): SpellingWord | null {
  const w = single(card);
  if (!w || w.length < 7) return null;
  const wrong = misspellings(w).slice(0, 3);
  if (wrong.length < 3) return null;
  return { correct: w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(), wrong: wrong as [string, string, string] };
}

/* ---------- Hook ---------- */

function mergeBy<T>(key: (t: T) => string, ...lists: T[][]): T[] {
  const seen = new Map<string, T>();
  for (const list of lists) for (const t of list) if (!seen.has(key(t).toLowerCase())) seen.set(key(t).toLowerCase(), t);
  return [...seen.values()];
}

function mapAll<T>(cards: FlashCardInterface[] | undefined, fn: (c: FlashCardInterface) => T | null): T[] {
  return (cards ?? []).map(fn).filter((t): t is T => t !== null);
}

/** The English word banks: built-in words plus the database's. */
export function useWordBanks() {
  const vocab = useGetFilteredCardsQuery({ type: "vocab" });
  const ows = useGetFilteredCardsQuery({ type: "ows" });
  return useMemo(() => {
    const cards = [...(vocab.data ?? []), ...(ows.data ?? [])];
    return {
      hangman: mergeBy((w) => w.word, HANGMAN_WORDS, mapAll(cards, toHangmanWord)),
      spelling: mergeBy((w) => w.correct, SPELLING_WORDS, mapAll(cards, toSpellingWord)),
      wordle: mergeBy((w) => w.word, WORD_OF_DAY_BANK, mapAll(cards, toWordOfDay)),
      loading: vocab.isLoading || ows.isLoading,
    };
  }, [vocab.data, ows.data, vocab.isLoading, ows.isLoading]);
}
