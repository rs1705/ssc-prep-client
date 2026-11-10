export interface WordOfDay {
  /** Exactly 5 letters, uppercase A-Z. */
  word: string;
  meaning: string;
  hindi: string;
}

/**
 * Demo bank of 5-letter SSC vocabulary. Keep the length coprime with 7 (the
 * daily rotation step) or the order will repeat early. Replace/extend with
 * database words of the same shape.
 */
export const WORD_OF_DAY_BANK: WordOfDay[] = [
  { word: "ABATE", meaning: "To become less intense or severe", hindi: "कम होना" },
  { word: "ADEPT", meaning: "Very skilled at something", hindi: "निपुण" },
  { word: "AGILE", meaning: "Able to move quickly and easily", hindi: "फुर्तीला" },
  { word: "ALOOF", meaning: "Distant and not friendly", hindi: "उदासीन" },
  { word: "AMASS", meaning: "To gather a large amount over time", hindi: "इकट्ठा करना" },
  { word: "AMPLE", meaning: "More than enough; plentiful", hindi: "प्रचुर" },
  { word: "AVERT", meaning: "To prevent something bad from happening", hindi: "टालना" },
  { word: "BLEAK", meaning: "Gloomy and without hope", hindi: "निराशाजनक" },
  { word: "BRISK", meaning: "Quick, active and energetic", hindi: "तेज़" },
  { word: "CHIDE", meaning: "To scold or rebuke someone mildly", hindi: "फटकारना" },
  { word: "DIRGE", meaning: "A slow, sad song for the dead", hindi: "शोकगीत" },
  { word: "DOGMA", meaning: "A belief held as absolutely true without question", hindi: "सिद्धांत / मतांधता" },
  { word: "EPOCH", meaning: "A long period of time marked by notable events", hindi: "युग" },
  { word: "EXULT", meaning: "To rejoice greatly", hindi: "उल्लसित होना" },
  { word: "FEIGN", meaning: "To pretend to be or feel something", hindi: "ढोंग करना" },
  { word: "FLOUT", meaning: "To openly disregard a rule or custom", hindi: "अवहेलना करना" },
  { word: "FRAIL", meaning: "Weak and easily damaged", hindi: "कमज़ोर" },
  { word: "GLEAN", meaning: "To gather information bit by bit", hindi: "बटोरना" },
  { word: "GUILE", meaning: "Clever and sly deceit", hindi: "चालाकी" },
  { word: "HASTY", meaning: "Done too quickly, without thought", hindi: "जल्दबाज़" },
  { word: "IRATE", meaning: "Feeling great anger", hindi: "क्रोधित" },
  { word: "JADED", meaning: "Tired or bored from too much of something", hindi: "थका हुआ" },
  { word: "LOFTY", meaning: "Of imposing height; noble or grand", hindi: "उच्च" },
  { word: "PERIL", meaning: "Serious and immediate danger", hindi: "संकट" },
  { word: "PLUCK", meaning: "Courage and spirit in a difficult situation", hindi: "साहस" },
  { word: "QUELL", meaning: "To put an end to; to suppress", hindi: "दबाना" },
  { word: "RIGID", meaning: "Stiff; not able to be bent or changed", hindi: "कठोर" },
  { word: "SCANT", meaning: "Barely enough; very little", hindi: "अपर्याप्त" },
  { word: "STARK", meaning: "Plain and harsh; bare", hindi: "नीरस / स्पष्ट" },
  { word: "TACIT", meaning: "Understood without being said", hindi: "अनकहा" },
  { word: "TERSE", meaning: "Using very few words; brief", hindi: "संक्षिप्त" },
  { word: "VAGUE", meaning: "Not clear or definite", hindi: "अस्पष्ट" },
  { word: "VIVID", meaning: "Strong, clear and bright", hindi: "जीवंत" },
  { word: "WRATH", meaning: "Extreme anger", hindi: "प्रकोप" },
];
