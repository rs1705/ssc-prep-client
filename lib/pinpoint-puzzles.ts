export interface PinpointPuzzle {
  /** The shared link, e.g. `Words meaning "brave"`. */
  answer: string;
  /** Exactly 3 plausible wrong answers. */
  distractors: [string, string, string];
  /** Hardest first. The Nth clue is shown after N-1 wrong guesses. */
  clues: [string, string, string, string];
}

/** Demo bank. Replace/extend with database puzzles of the same shape. */
export const PINPOINT_PUZZLES: PinpointPuzzle[] = [
  {
    answer: 'Words meaning "brave"',
    distractors: ['Words meaning "careful"', 'Words meaning "angry"', 'Words meaning "lazy"'],
    clues: ["Dauntless", "Intrepid", "Valiant", "Courageous"],
  },
  {
    answer: 'Words meaning "temporary"',
    distractors: ['Words meaning "secret"', 'Words meaning "ancient"', 'Words meaning "noisy"'],
    clues: ["Ephemeral", "Transient", "Fleeting", "Short-lived"],
  },
  {
    answer: 'Antonyms of "generous"',
    distractors: ['Synonyms of "generous"', 'Antonyms of "brave"', 'Antonyms of "proud"'],
    clues: ["Parsimonious", "Niggardly", "Miserly", "Stingy"],
  },
  {
    answer: 'Antonyms of "abundant"',
    distractors: ['Synonyms of "abundant"', 'Antonyms of "ancient"', 'Antonyms of "rapid"'],
    clues: ["Meagre", "Sparse", "Scanty", "Scarce"],
  },
  {
    answer: "One-word substitutions for people",
    distractors: ["Collective nouns", "Types of poems", "Names of tenses"],
    clues: ["Misanthrope", "Philatelist", "Polyglot", "Atheist"],
  },
  {
    answer: "Collective nouns for animals",
    distractors: ["Animal habitats", "Animal sounds", "Baby animals"],
    clues: ["Murder (of crows)", "Pride (of lions)", "Flock", "Herd"],
  },
  {
    answer: "Words with a silent letter",
    distractors: ["Words with double letters", 'Words ending in "-ly"', "Words borrowed from French"],
    clues: ["Psychology", "Knife", "Island", "Hour"],
  },
  {
    answer: "Prepositions",
    distractors: ["Conjunctions", "Adverbs of manner", "Articles"],
    clues: ["Beneath", "Beyond", "Among", "Beside"],
  },
  {
    answer: "Conjunctions",
    distractors: ["Prepositions", "Pronouns", "Interjections"],
    clues: ["Whereas", "Unless", "Although", "But"],
  },
  {
    answer: "Figures of speech",
    distractors: ["Types of tenses", "Parts of speech", "Types of clauses"],
    clues: ["Oxymoron", "Hyperbole", "Metaphor", "Simile"],
  },
  {
    answer: "Punctuation marks",
    distractors: ["Figures of speech", "Parts of speech", "Types of clauses"],
    clues: ["Semicolon", "Apostrophe", "Hyphen", "Comma"],
  },
  {
    answer: 'Words meaning "angry"',
    distractors: ['Words meaning "sad"', 'Words meaning "tired"', 'Words meaning "clever"'],
    clues: ["Incensed", "Livid", "Irate", "Furious"],
  },
  {
    answer: 'Words meaning "clever"',
    distractors: ['Words meaning "rude"', 'Words meaning "weak"', 'Words meaning "hungry"'],
    clues: ["Sagacious", "Astute", "Shrewd", "Smart"],
  },
  {
    answer: 'Words meaning "weak"',
    distractors: ['Words meaning "strong"', 'Words meaning "hidden"', 'Words meaning "quick"'],
    clues: ["Infirm", "Decrepit", "Frail", "Feeble"],
  },
  {
    answer: 'Words meaning "to hide"',
    distractors: ['Words meaning "to show"', 'Words meaning "to praise"', 'Words meaning "to break"'],
    clues: ["Veil", "Cloak", "Conceal", "Cover"],
  },
  {
    answer: 'Words meaning "to praise"',
    distractors: ['Words meaning "to blame"', 'Words meaning "to hide"', 'Words meaning "to follow"'],
    clues: ["Extol", "Laud", "Commend", "Applaud"],
  },
  {
    answer: 'Words meaning "to reduce"',
    distractors: ['Words meaning "to increase"', 'Words meaning "to begin"', 'Words meaning "to travel"'],
    clues: ["Abate", "Curtail", "Diminish", "Lessen"],
  },
  {
    answer: 'Words meaning "to end"',
    distractors: ['Words meaning "to start"', 'Words meaning "to repeat"', 'Words meaning "to wait"'],
    clues: ["Culminate", "Terminate", "Conclude", "Finish"],
  },
];
