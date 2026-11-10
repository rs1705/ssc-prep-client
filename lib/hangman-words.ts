export type HangmanCategory = "Vocabulary" | "One Word Substitution";

export interface HangmanWord {
  /** Uppercase A-Z only, no spaces or hyphens. */
  word: string;
  /** Shown as the clue. Must not contain the word itself. */
  meaning: string;
  hindi: string;
  category: HangmanCategory;
}

/**
 * Demo bank of SSC-style words. Replace/extend by loading the same shape from
 * the database; the game only depends on this interface.
 */
export const HANGMAN_WORDS: HangmanWord[] = [
  { word: "ABATE", meaning: "To become less intense, widespread or severe", hindi: "कम होना", category: "Vocabulary" },
  { word: "ABSTAIN", meaning: "To choose not to do or take something, especially on purpose", hindi: "परहेज़ करना", category: "Vocabulary" },
  { word: "ADVERSITY", meaning: "A condition of hardship, misfortune or difficulty", hindi: "विपत्ति", category: "Vocabulary" },
  { word: "AMELIORATE", meaning: "To make a bad situation better or improve it", hindi: "सुधारना", category: "Vocabulary" },
  { word: "BENEVOLENT", meaning: "Kind, generous and well-meaning towards others", hindi: "परोपकारी", category: "Vocabulary" },
  { word: "CANDID", meaning: "Honest and straightforward, even when it is uncomfortable", hindi: "स्पष्टवादी", category: "Vocabulary" },
  { word: "CONCISE", meaning: "Giving a lot of information in few words", hindi: "संक्षिप्त", category: "Vocabulary" },
  { word: "DILIGENT", meaning: "Showing steady, careful effort in work or duty", hindi: "मेहनती", category: "Vocabulary" },
  { word: "EPHEMERAL", meaning: "Lasting for a very short time", hindi: "क्षणभंगुर", category: "Vocabulary" },
  { word: "FRUGAL", meaning: "Careful and sparing with money or resources", hindi: "मितव्ययी", category: "Vocabulary" },
  { word: "GREGARIOUS", meaning: "Fond of company; sociable and outgoing", hindi: "मिलनसार", category: "Vocabulary" },
  { word: "HOSTILE", meaning: "Unfriendly, aggressive or opposed to something", hindi: "शत्रुतापूर्ण", category: "Vocabulary" },
  { word: "INEVITABLE", meaning: "Certain to happen; impossible to avoid", hindi: "अपरिहार्य", category: "Vocabulary" },
  { word: "LUCID", meaning: "Clearly expressed and easy to understand", hindi: "स्पष्ट", category: "Vocabulary" },
  { word: "METICULOUS", meaning: "Showing great attention to detail; very careful", hindi: "अत्यंत सावधान", category: "Vocabulary" },
  { word: "OBSOLETE", meaning: "No longer produced or used; out of date", hindi: "अप्रचलित", category: "Vocabulary" },
  { word: "PRUDENT", meaning: "Acting with care and good judgment about the future", hindi: "विवेकशील", category: "Vocabulary" },
  { word: "RESILIENT", meaning: "Able to recover quickly from difficulties", hindi: "दृढ़ / लचीला", category: "Vocabulary" },
  { word: "SCRUTINIZE", meaning: "To examine something very closely and carefully", hindi: "बारीकी से जाँचना", category: "Vocabulary" },
  { word: "TENACIOUS", meaning: "Holding firmly on; not giving up easily", hindi: "दृढ़निश्चयी", category: "Vocabulary" },
  { word: "UBIQUITOUS", meaning: "Present, appearing or found everywhere at once", hindi: "सर्वव्यापी", category: "Vocabulary" },
  { word: "VERBOSE", meaning: "Using more words than are needed", hindi: "वाचाल", category: "Vocabulary" },
  { word: "ZEALOUS", meaning: "Full of energy and enthusiasm for a cause", hindi: "उत्साही", category: "Vocabulary" },
  { word: "ATHEIST", meaning: "A person who does not believe in the existence of God", hindi: "नास्तिक", category: "One Word Substitution" },
  { word: "MISANTHROPE", meaning: "A person who hates or distrusts mankind", hindi: "मानवद्वेषी", category: "One Word Substitution" },
  { word: "PHILATELIST", meaning: "A person who collects postage stamps", hindi: "डाक टिकट संग्राहक", category: "One Word Substitution" },
  { word: "AMBIDEXTROUS", meaning: "Able to use both the left and right hand equally well", hindi: "उभयहस्त", category: "One Word Substitution" },
  { word: "OMNIPOTENT", meaning: "Having unlimited power; all-powerful", hindi: "सर्वशक्तिमान", category: "One Word Substitution" },
  { word: "NOCTURNAL", meaning: "Active during the night rather than the day", hindi: "निशाचर", category: "One Word Substitution" },
  { word: "POLYGLOT", meaning: "A person who knows and uses many languages", hindi: "बहुभाषी", category: "One Word Substitution" },
];
