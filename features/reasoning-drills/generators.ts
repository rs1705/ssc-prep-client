import type { SprintQuestion } from "@/features/drills/sprint";

/**
 * Procedural question generators for the Reasoning speed drills. Each one
 * returns a question with exactly 4 distinct options, one of them correct,
 * and a one-line method. Patterns follow SSC CGL Tier 1 reasoning.
 */

export type Generator = () => SprintQuestion;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** A=1 ... Z=26 */
export const pos = (letter: string) => letter.charCodeAt(0) - 64;
/** 1 -> A, 27 -> A, 0 -> Z (wraps). */
export const letterAt = (n: number) => ALPHABET[(((n - 1) % 26) + 26) % 26];
/** A<->Z, B<->Y ... (positions add up to 27). */
export const opposite = (letter: string) => letterAt(27 - pos(letter));

export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
export const pick = <T,>(items: readonly T[]): T => items[randInt(0, items.length - 1)];

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** The answer plus 3 distinct wrong options (from candidates, then `fallback`). */
export function withOptions(answer: string, candidates: string[], fallback: () => string): string[] {
  const wrong: string[] = [];
  for (const c of candidates) {
    if (wrong.length === 3) break;
    if (c !== answer && !wrong.includes(c)) wrong.push(c);
  }
  let guard = 0;
  while (wrong.length < 3 && guard++ < 200) {
    const c = fallback();
    if (c !== answer && !wrong.includes(c)) wrong.push(c);
  }
  return shuffled([answer, ...wrong]);
}

const near = (n: number, spread = 3) => {
  let d = 0;
  while (d === 0) d = randInt(-spread, spread);
  return n + d;
};

const WORDS = [
  "CAT", "DOG", "SUN", "PEN", "CUP", "BAG", "MAP", "INK", "BOOK", "GOLD", "TREE", "MILK", "RAIN", "STAR",
  "BIRD", "FISH", "DOOR", "LAMP", "ROSE", "KING", "SHIP", "WIND", "NEST", "FIRE", "TIME", "RICE", "SALT",
  "HAND", "GATE", "COLD", "MIND", "SEAT", "BANK", "CARD", "LIGHT", "WATER", "PLANT", "CHAIR", "TRAIN",
];

function twoWords(): [string, string] {
  const a = pick(WORDS);
  let b = pick(WORDS);
  while (b === a) b = pick(WORDS);
  return [a, b];
}

const shiftWord = (word: string, k: number) => [...word].map((c) => letterAt(pos(c) + k)).join("");
const oppositeWord = (word: string) => [...word].map(opposite).join("");
const positionSum = (word: string) => [...word].reduce((sum, c) => sum + pos(c), 0);
const positionCode = (word: string) => [...word].map(pos).join("");
const signed = (k: number) => (k > 0 ? `+${k}` : String(k));

/* ───────────── Alphabet ───────────── */

export const alphabetPosition: Generator = () => {
  const variant = randInt(0, 2);
  const p = randInt(1, 26);
  const L = letterAt(p);
  if (variant === 0) {
    const answer = String(p);
    return {
      prompt: `Position of ${L} in the alphabet?`,
      options: withOptions(answer, [p + 1, p - 1, 27 - p, p + 2].filter((n) => n >= 1 && n <= 26).map(String), () =>
        String(randInt(1, 26)),
      ),
      answer,
      explain: `${L} = ${p}. Anchor on EJOTY: E5 J10 O15 T20 Y25.`,
    };
  }
  if (variant === 1) {
    return {
      prompt: `Which letter is at position ${p}?`,
      options: withOptions(L, [letterAt(p + 1), letterAt(p - 1), letterAt(27 - p)], () => letterAt(randInt(1, 26))),
      answer: L,
      explain: `Position ${p} = ${L}. Count from the nearest EJOTY anchor.`,
    };
  }
  const answer = String(27 - p);
  return {
    prompt: `Position of ${L} from the end (Z = 1)?`,
    options: withOptions(answer, [String(p), String(26 - p), String(28 - p)].filter((s) => +s >= 1 && +s <= 26), () =>
      String(randInt(1, 26)),
    ),
    answer,
    explain: `From the end = 27 − ${p} = ${27 - p}.`,
  };
};

export const oppositeLetter: Generator = () => {
  const L = letterAt(randInt(1, 26));
  const answer = opposite(L);
  return {
    prompt: `Opposite letter of ${L}?`,
    display: "A ↔ Z, B ↔ Y …",
    options: withOptions(
      answer,
      [letterAt(27 - pos(L) + 1), letterAt(27 - pos(L) - 1), letterAt(pos(L) + 1)],
      () => letterAt(randInt(1, 26)),
    ),
    answer,
    explain: `Opposites add up to 27: ${L}(${pos(L)}) + ${answer}(${27 - pos(L)}).`,
  };
};

/* ───────────── Coding-decoding ───────────── */

export const codingShift: Generator = () => {
  const [example, word] = twoWords();
  let k = 0;
  while (k === 0) k = randInt(-3, 3);
  const answer = shiftWord(word, k);
  return {
    prompt: `If ${example} is coded as ${shiftWord(example, k)}, how is ${word} coded?`,
    options: withOptions(answer, [shiftWord(word, -k), shiftWord(word, k + 1), shiftWord(word, k - 1), [...answer].reverse().join("")], () =>
      shiftWord(word, randInt(-4, 4)),
    ),
    answer,
    explain: `Each letter moves ${signed(k)} place${Math.abs(k) > 1 ? "s" : ""}: ${word[0]} → ${answer[0]}.`,
  };
};

export const codingOpposite: Generator = () => {
  const [example, word] = twoWords();
  const answer = oppositeWord(word);
  return {
    prompt: `If ${example} is coded as ${oppositeWord(example)}, how is ${word} coded?`,
    options: withOptions(
      answer,
      [[...answer].reverse().join(""), shiftWord(answer, 1), shiftWord(word, 1), shiftWord(answer, -1)],
      () => shiftWord(answer, randInt(-3, 3)),
    ),
    answer,
    explain: `Each letter is replaced by its opposite (A↔Z): ${word[0]} → ${answer[0]}.`,
  };
};

export const codingReverse: Generator = () => {
  const [example, word] = twoWords();
  const rev = (w: string) => [...w].reverse().join("");
  const answer = shiftWord(rev(word), 1);
  return {
    prompt: `If ${example} is coded as ${shiftWord(rev(example), 1)}, how is ${word} coded?`,
    options: withOptions(answer, [rev(word), shiftWord(word, 1), shiftWord(rev(word), -1), rev(answer)], () =>
      shiftWord(rev(word), randInt(-3, 3)),
    ),
    answer,
    explain: `Write the word backwards, then move each letter +1: ${rev(word)} → ${answer}.`,
  };
};

export const codingNumber: Generator = () => {
  const [example, word] = twoWords();
  if (Math.random() < 0.5) {
    const answer = String(positionSum(word));
    return {
      prompt: `If ${example} = ${positionSum(example)}, then ${word} = ?`,
      options: withOptions(
        answer,
        [positionSum(word) + 1, positionSum(word) - 1, positionSum(oppositeWord(word)), positionSum(word) + 2].map(String),
        () => String(near(positionSum(word), 6)),
      ),
      answer,
      explain: `Add the letter positions: ${[...word].map((c) => `${c}${pos(c)}`).join(" + ")} = ${answer}.`,
    };
  }
  const answer = positionCode(word);
  return {
    prompt: `If ${example} = ${positionCode(example)}, then ${word} = ?`,
    options: withOptions(
      answer,
      [positionCode(oppositeWord(word)), positionCode(shiftWord(word, 1)), positionCode([...word].reverse().join(""))],
      () => positionCode(shiftWord(word, randInt(-2, 2))),
    ),
    answer,
    explain: `Write each letter's position: ${[...word].map((c) => `${c}=${pos(c)}`).join(", ")}.`,
  };
};

export const codingMixed: Generator = () => pick([codingShift, codingOpposite, codingReverse, codingNumber])();

/* ───────────── Series ───────────── */

export const numberSeries: Generator = () => {
  const kind = randInt(0, 5);
  let terms: number[] = [];
  let rule = "";
  if (kind === 0) {
    const a = randInt(2, 30);
    const d = randInt(3, 13);
    terms = Array.from({ length: 6 }, (_, i) => a + i * d);
    rule = `Add ${d} each time.`;
  } else if (kind === 1) {
    const a = randInt(1, 5);
    const r = randInt(2, 3);
    terms = Array.from({ length: 6 }, (_, i) => a * r ** i);
    rule = `Multiply by ${r} each time.`;
  } else if (kind === 2) {
    const n = randInt(2, 12);
    terms = Array.from({ length: 6 }, (_, i) => (n + i) ** 2);
    rule = `Squares: ${n}², ${n + 1}², … ${n + 5}².`;
  } else if (kind === 3) {
    const n = randInt(1, 6);
    terms = Array.from({ length: 6 }, (_, i) => (n + i) ** 3);
    rule = `Cubes: ${n}³, ${n + 1}³, … ${n + 5}³.`;
  } else if (kind === 4) {
    const a = randInt(1, 20);
    const d = randInt(1, 5);
    const s = randInt(1, 3);
    terms = [a];
    for (let i = 0; i < 5; i++) terms.push(terms[i] + d + i * s);
    rule = `Differences grow by ${s}: +${d}, +${d + s}, +${d + 2 * s}, …`;
  } else {
    const a = randInt(1, 6);
    terms = [a];
    for (let i = 0; i < 5; i++) terms.push(terms[i] * 2 + 1);
    rule = "Each term × 2 + 1.";
  }
  const answer = terms[5];
  const last = terms[4];
  const step = answer - last;
  return {
    prompt: "Which number comes next?",
    display: `${terms.slice(0, 5).join(", ")}, ?`,
    options: withOptions(String(answer), [answer + 1, answer - 1, last + step + 2, answer + Math.max(2, Math.round(step / 2))].map(String), () =>
      String(near(answer, Math.max(3, Math.round(Math.abs(step) / 2)))),
    ),
    answer: String(answer),
    explain: rule,
  };
};

export const letterSeries: Generator = () => {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const k = randInt(2, 5);
    const start = randInt(1, 26 - 4 * k);
    const terms = Array.from({ length: 5 }, (_, i) => letterAt(start + i * k));
    const answer = terms[4];
    return {
      prompt: "Which letter comes next?",
      display: `${terms.slice(0, 4).join(", ")}, ?`,
      options: withOptions(answer, [letterAt(pos(answer) + 1), letterAt(pos(answer) - 1), letterAt(pos(answer) + k)], () =>
        letterAt(randInt(1, 26)),
      ),
      answer,
      explain: `Move +${k} each time: ${terms.join(" → ")}.`,
    };
  }
  if (kind === 1) {
    const step = randInt(1, 2);
    const start = randInt(1, 13 - 3 * step);
    const terms = Array.from({ length: 4 }, (_, i) => {
      const l = letterAt(start + i * step);
      return l + opposite(l);
    });
    const answer = terms[3];
    const a = answer[0];
    return {
      prompt: "Which pair comes next?",
      display: `${terms.slice(0, 3).join(", ")}, ?`,
      options: withOptions(
        answer,
        [a + letterAt(pos(opposite(a)) + 1), letterAt(pos(a) + 1) + opposite(a), a + letterAt(pos(a) + 1), opposite(a) + a],
        () => letterAt(randInt(1, 26)) + letterAt(randInt(1, 26)),
      ),
      answer,
      explain: `First letter moves +${step}; the second is its opposite (A↔Z).`,
    };
  }
  const start = randInt(1, 10);
  const terms = [start];
  for (let i = 1; i < 5; i++) terms.push(terms[i - 1] + i);
  const letters = terms.map(letterAt);
  const answer = letters[4];
  return {
    prompt: "Which letter comes next?",
    display: `${letters.slice(0, 4).join(", ")}, ?`,
    options: withOptions(answer, [letterAt(terms[4] + 1), letterAt(terms[4] - 1), letterAt(terms[3] + 3)], () =>
      letterAt(randInt(1, 26)),
    ),
    answer,
    explain: "Gaps grow by one: +1, +2, +3, +4.",
  };
};

/* ───────────── Analogy and classification ───────────── */

const RULES: { name: string; f: (n: number) => number }[] = [
  { name: "n → n²", f: (n) => n * n },
  { name: "n → n³", f: (n) => n ** 3 },
  { name: "n → n² + 1", f: (n) => n * n + 1 },
  { name: "n → n² − 1", f: (n) => n * n - 1 },
  { name: "n → 2n + 1", f: (n) => 2 * n + 1 },
  { name: "n → n(n + 1)", f: (n) => n * (n + 1) },
];

export const numberAnalogy: Generator = () => {
  const rule = pick(RULES);
  const a = randInt(2, rule.name === "n → n³" ? 6 : 11);
  let b = randInt(2, rule.name === "n → n³" ? 7 : 12);
  while (b === a) b = randInt(2, rule.name === "n → n³" ? 7 : 12);
  const answer = String(rule.f(b));
  return {
    prompt: "Find the missing number.",
    display: `${a} : ${rule.f(a)} :: ${b} : ?`,
    options: withOptions(answer, RULES.filter((r) => r !== rule).map((r) => String(r.f(b))), () => String(near(rule.f(b), 5))),
    answer,
    explain: `Rule ${rule.name}: ${a} → ${rule.f(a)}, so ${b} → ${answer}.`,
  };
};

const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};

export const oddOneOut: Generator = () => {
  const kind = randInt(0, 3);
  let members: number[] = [];
  let odd = 0;
  let reason = "";
  if (kind === 0) {
    const roots = shuffled(Array.from({ length: 20 }, (_, i) => i + 4)).slice(0, 3);
    members = roots.map((r) => r * r);
    const r = randInt(5, 20);
    odd = r * r + pick([1, -1, 2]);
    reason = "the others are perfect squares";
  } else if (kind === 1) {
    const primes = Array.from({ length: 97 }, (_, i) => i + 3).filter(isPrime);
    members = shuffled(primes).slice(0, 3);
    do odd = pick([21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93]);
    while (members.includes(odd));
    reason = "the others are prime";
  } else if (kind === 2) {
    const k = pick([7, 9, 11, 13]);
    members = shuffled(Array.from({ length: 12 }, (_, i) => k * (i + 3))).slice(0, 3);
    odd = k * randInt(3, 14) + randInt(1, k - 1);
    reason = `the others are multiples of ${k}`;
  } else {
    const roots = shuffled([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
    members = roots.map((r) => r ** 3);
    odd = pick(roots.map((r) => r * r * (r + 1)));
    reason = "the others are perfect cubes";
  }
  const answer = String(odd);
  const options = shuffled([...members.map(String), answer]);
  if (new Set(options).size !== 4) return oddOneOut();
  return { prompt: "Find the odd one out.", options, answer, explain: `${answer}: ${reason}.` };
};

export const mixedReasoning: Generator = () =>
  pick([alphabetPosition, oppositeLetter, codingMixed, numberSeries, letterSeries, numberAnalogy, oddOneOut])();

export function buildQueue(generate: Generator, count = 150): SprintQuestion[] {
  return Array.from({ length: count }, generate);
}
