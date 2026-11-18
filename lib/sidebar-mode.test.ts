import { describe, expect, it } from "vitest";
import { isFocusRoute, sidebarCollapsed } from "./sidebar-mode";

describe("isFocusRoute", () => {
  it("knows games, drills, decks and review from ordinary pages", () => {
    for (const p of [
      "/SSC/english/hangman",
      "/SSC/english/games/odd-link",
      "/SSC/english/flashcards/freestyle",
      "/SSC/english/flashcards/fsrs",
      "/SSC/maths/mental-maths/addition",
      "/SSC/reasoning/speed-drills/coding",
      "/SSC/maths/match",
      "/review",
    ]) {
      expect(isFocusRoute(p)).toBe(true);
    }
    for (const p of ["/dashboard", "/SSC/english/games", "/SSC/maths/mental-maths", "/SSC/maths/topic-pyqs", "/mock-tests"]) {
      expect(isFocusRoute(p)).toBe(false);
    }
  });
});

describe("sidebarCollapsed", () => {
  it("is narrow on focus pages and below 1280px, wide on big screens", () => {
    expect(sidebarCollapsed({ path: "/SSC/english/hangman", width: 1600, choice: {} })).toBe(true);
    expect(sidebarCollapsed({ path: "/dashboard", width: 1100, choice: {} })).toBe(true);
    expect(sidebarCollapsed({ path: "/dashboard", width: 1280, choice: {} })).toBe(false);
  });

  it("follows the learner's own choice for that kind of page", () => {
    expect(sidebarCollapsed({ path: "/dashboard", width: 1600, choice: { browse: true } })).toBe(true);
    expect(sidebarCollapsed({ path: "/SSC/english/hangman", width: 900, choice: { focus: false } })).toBe(false);
    // A choice made on focus pages doesn't change ordinary pages.
    expect(sidebarCollapsed({ path: "/dashboard", width: 1600, choice: { focus: true } })).toBe(false);
  });
});
