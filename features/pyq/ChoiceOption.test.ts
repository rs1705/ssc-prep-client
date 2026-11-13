import { describe, expect, it } from "vitest";
import { letterFor, optionLetter, relabelOptionRefs } from "./ChoiceOption";

const numbered = ["1", "2", "3", "4"].map((label) => ({ label }));
const lettered = ["A", "B", "C", "D"].map((label) => ({ label }));

describe("option letters", () => {
  it("letters by position", () => {
    expect([0, 1, 2, 3].map(optionLetter)).toEqual(["A", "B", "C", "D"]);
  });

  it("maps a stored label to its display letter", () => {
    expect(letterFor(numbered, "3")).toBe("C");
    expect(letterFor(lettered, "B")).toBe("B");
    expect(letterFor(numbered, "x")).toBe("x");
  });
});

describe("relabelOptionRefs", () => {
  it("rewrites option numbers for numbered papers", () => {
    expect(relabelOptionRefs("- Option 1: $15:48$. In option (3), the", numbered)).toBe(
      "- Option A: $15:48$. In option C, the",
    );
    expect(relabelOptionRefs("options 2 fails", numbered)).toBe("options B fails");
  });

  it("leaves other numbers and lettered papers alone", () => {
    expect(relabelOptionRefs("option 12 and option 7", numbered)).toBe("option 12 and option 7");
    expect(relabelOptionRefs("Check each option against 3 rules", numbered)).toBe(
      "Check each option against 3 rules",
    );
    expect(relabelOptionRefs("Option 1 is right", lettered)).toBe("Option 1 is right");
  });
});
