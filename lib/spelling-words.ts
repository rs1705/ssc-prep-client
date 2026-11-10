export interface SpellingWord {
  correct: string;
  /** Exactly 3 realistic misspellings. */
  wrong: [string, string, string];
}

/** Demo bank of commonly misspelled words. Replace/extend with database words of the same shape. */
export const SPELLING_WORDS: SpellingWord[] = [
  { correct: "Accommodate", wrong: ["Acommodate", "Accomodate", "Acomodate"] },
  { correct: "Necessary", wrong: ["Neccessary", "Necesary", "Necessery"] },
  { correct: "Embarrass", wrong: ["Embarass", "Embarrase", "Embarras"] },
  { correct: "Occurrence", wrong: ["Occurence", "Occurrance", "Ocurrence"] },
  { correct: "Conscience", wrong: ["Concience", "Consience", "Conscence"] },
  { correct: "Separate", wrong: ["Seperate", "Separete", "Seprate"] },
  { correct: "Privilege", wrong: ["Priviledge", "Privelege", "Privilage"] },
  { correct: "Definitely", wrong: ["Definately", "Definitly", "Defanitely"] },
  { correct: "Maintenance", wrong: ["Maintainance", "Maintenence", "Maintanance"] },
  { correct: "Government", wrong: ["Goverment", "Govenment", "Governmant"] },
  { correct: "Environment", wrong: ["Enviroment", "Environmant", "Enviornment"] },
  { correct: "Receive", wrong: ["Recieve", "Receve", "Reciev"] },
  { correct: "Calendar", wrong: ["Calender", "Calandar", "Calander"] },
  { correct: "Committee", wrong: ["Commitee", "Comittee", "Committe"] },
  { correct: "Parliament", wrong: ["Parliment", "Parlament", "Parliamant"] },
  { correct: "Library", wrong: ["Libary", "Libarary", "Librery"] },
  { correct: "Bureaucracy", wrong: ["Beaurocracy", "Bureacracy", "Buraucracy"] },
  { correct: "Questionnaire", wrong: ["Questionaire", "Questionnare", "Questionnair"] },
  { correct: "Conscientious", wrong: ["Conscientous", "Consciencious", "Concientious"] },
  { correct: "Mischievous", wrong: ["Mischievious", "Mischevous", "Mischeivous"] },
  { correct: "Rhythm", wrong: ["Rythm", "Rhythem", "Rhythym"] },
  { correct: "Exaggerate", wrong: ["Exagerate", "Exaggarate", "Exagerrate"] },
  { correct: "Fluorescent", wrong: ["Florescent", "Fluoresent", "Flourescent"] },
  { correct: "Pronunciation", wrong: ["Pronounciation", "Pronunciaton", "Pronuncation"] },
  { correct: "Millennium", wrong: ["Millenium", "Milenium", "Millennum"] },
  { correct: "Interrupt", wrong: ["Interupt", "Inturrupt", "Interrapt"] },
  { correct: "Perseverance", wrong: ["Perseverence", "Perserverance", "Persaverance"] },
  { correct: "Supersede", wrong: ["Supercede", "Supersead", "Superseed"] },
  { correct: "Acquaintance", wrong: ["Aquaintance", "Acquaintence", "Acquantance"] },
  { correct: "Harass", wrong: ["Harrass", "Haras", "Harrasse"] },
  { correct: "Tomorrow", wrong: ["Tommorow", "Tomorow", "Tommorrow"] },
];
