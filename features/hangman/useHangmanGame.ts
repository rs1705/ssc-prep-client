"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { HANGMAN_WORDS, type HangmanWord } from "@/lib/hangman-words";
import { readStored, writeStored } from "@/lib/storage";
import { loadSet, saveSet, shuffle, useReplayRequest } from "@/features/games/sessionSet";
import {
  REVEAL_MS,
  currentWord,
  hangmanReducer,
  initialState,
  shuffleQueue,
} from "./game";

const BEST_KEY = "ssc:hangman:best";

interface Options {
  /** Word source. Defaults to the built-in demo bank. */
  bank?: HangmanWord[];
}

export function useHangmanGame({ bank = HANGMAN_WORDS }: Options = {}) {
  const [state, dispatch] = useReducer(hangmanReducer, initialState);
  const [best, setBest] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const bestRef = useRef(0);

  const word = currentWord(state);

  // Load the saved personal best once, after mount.
  useEffect(() => {
    const saved = readStored<number>(BEST_KEY, 0);
    bestRef.current = saved;
    setBest(saved);
  }, []);

  // Save a new personal best when a run ends.
  useEffect(() => {
    if (state.phase !== "over") return;
    if (state.score > bestRef.current) {
      bestRef.current = state.score;
      setBest(state.score);
      setIsNewBest(true);
      writeStored(BEST_KEY, state.score);
    }
  }, [state.phase, state.score]);

  // One-second clock while a word is in play. It stands still while the tab is hidden.
  useEffect(() => {
    if (state.phase !== "playing") return;
    const id = window.setInterval(() => {
      if (!document.hidden) dispatch({ type: "TICK" });
    }, 1000);
    return () => window.clearInterval(id);
  }, [state.phase, state.index]);

  // Auto-advance past the reveal card (tap / Enter skips it).
  useEffect(() => {
    if (state.phase !== "reveal") return;
    const id = window.setTimeout(() => dispatch({ type: "NEXT" }), REVEAL_MS);
    return () => window.clearTimeout(id);
  }, [state.phase, state.index]);

  // Start with a given list of words and remember it for "Same set again".
  const begin = useCallback((queue: HangmanWord[], save = true) => {
    if (queue.length === 0) return;
    setIsNewBest(false);
    if (save) saveSet(window.location.pathname, queue);
    dispatch({ type: "START", queue });
  }, []);

  const start = useCallback(() => begin(shuffleQueue(bank)), [bank, begin]);

  const replaySet = useCallback(() => {
    const saved = loadSet<HangmanWord[]>(window.location.pathname);
    if (saved?.items?.length) begin(shuffle(saved.items), false);
  }, [begin]);

  const missedWords = state.results.filter((r) => r.outcome !== "solved").map((r) => r.word);
  const retryMistakes = useCallback(() => {
    const missed = state.results.filter((r) => r.outcome !== "solved").map((r) => r.word);
    begin(shuffle(missed), false);
  }, [begin, state.results]);

  const replay = useReplayRequest();
  useEffect(() => {
    if (!replay) return;
    const saved = loadSet<HangmanWord[]>(window.location.pathname);
    if (saved?.items?.length) begin(shuffle(saved.items));
    // Only when the page was opened with ?replay=1.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replay]);

  const guess = useCallback((letter: string) => {
    dispatch({ type: "GUESS", letter });
  }, []);

  const hint = useCallback(() => {
    if (!word) return;
    const hidden = word.word
      .split("")
      .filter((letter) => !state.guessed.includes(letter));
    if (hidden.length < 2) return; // never hand out the last letter
    const letter = hidden[Math.floor(Math.random() * hidden.length)];
    dispatch({ type: "HINT", letter });
  }, [word, state.guessed]);

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  // Physical keyboard: A-Z to guess, Enter to start / skip reveal / play again.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter") {
        if (state.phase === "lobby" || state.phase === "over") {
          e.preventDefault();
          start();
        } else if (state.phase === "reveal") {
          e.preventDefault();
          next();
        }
        return;
      }
      if (state.phase === "playing" && /^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        guess(e.key);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.phase, start, next, guess]);

  return { state, word, best, isNewBest, start, guess, hint, next, reset, replaySet, retryMistakes, retryCount: missedWords.length };
}
