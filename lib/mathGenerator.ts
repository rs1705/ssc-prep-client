import { buildAST, evaluate, tokenize } from "./mathParser";

const DIFFICULTY = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
  ALL: "ALL",
};

export const TOPIC_ID = {
  // Current Mental Maths & Speed Drills
  ADDITION: "addition",
  SUBTRACTION: "subtraction",
  MULTIPLICATION: "multiplication",
  DIVISION: "division",
  SQUARES: "squares",
  CUBES: "cubes",
  SQUARE_ROOTS: "square_roots",
  CUBE_ROOTS: "cube_roots",
  SIMPLIFICATION: "simplification",
  PERCENTAGE: "percentage",
  RATIO: "ratio",

  // Future SSC CGL Tier-1 & Tier-2 Quant Topics
  AVERAGES: "averages",
  HCF_LCM: "hcf_lcm",
  FRACTIONS: "fractions",
  PROFIT_LOSS: "profit_loss",
  SI_CI: "si_ci", // Simple & Compound Interest shortcuts
  SPEED_TIME_DISTANCE: "speed_time_distance", // 5/18 and 18/5 conversion tables
  TIME_WORK: "time_work", // Efficiency & Work splits
  ALGEBRA_IDENTITIES: "algebra_identities", // x + 1/x drills
  MENSURATION: "mensuration", // Multiples of 7 for circle area/perimeter
  TRIGONOMETRY: "trigonometry", // Standard angle values (sin 30, tan 60)
  NUMBER_SYSTEM: "number_system", // Divisibility & Remainder theorems
} as const;

export type TopicId = (typeof TOPIC_ID)[keyof typeof TOPIC_ID] | string;

export interface DifficultyRangeConfig {
  easyMin: number;
  easyMax: number;
  mediumMin: number;
  mediumMax: number;
  hardMin: number;
  hardMax: number;
  anyMin: number;
  anyMax: number;
}

export const DIFFICULTY_CONFIGS: Record<string, DifficultyRangeConfig> = {
  squares: {
    easyMin: 5,
    easyMax: 14,
    mediumMin: 15,
    mediumMax: 30,
    hardMin: 31,
    hardMax: 40,
    anyMin: 5,
    anyMax: 40,
  },
  cubes: {
    easyMin: 2,
    easyMax: 10,
    mediumMin: 11,
    mediumMax: 20,
    hardMin: 21,
    hardMax: 30,
    anyMin: 2,
    anyMax: 30,
  },
  addition: {
    easyMin: 10,
    easyMax: 99,
    mediumMin: 100,
    mediumMax: 999,
    hardMin: 1000,
    hardMax: 9999,
    anyMin: 1,
    anyMax: 9999,
  },
  subtraction: {
    easyMin: 10,
    easyMax: 99,
    mediumMin: 100,
    mediumMax: 999,
    hardMin: 1000,
    hardMax: 9999,
    anyMin: 5,
    anyMax: 9999,
  },
  multiplication: {
    easyMin: 11,
    easyMax: 25,
    mediumMin: 25,
    mediumMax: 99,
    hardMin: 100,
    hardMax: 999,
    anyMin: 11,
    anyMax: 999,
  },
  division: {
    easyMin: 5,
    easyMax: 50,
    mediumMin: 50,
    mediumMax: 200,
    hardMin: 200,
    hardMax: 500,
    anyMin: 5,
    anyMax: 500,
  },

  simplification: {
    easyMin: 5,
    easyMax: 30,
    mediumMin: 30,
    mediumMax: 200,
    hardMin: 200,
    hardMax: 500,
    anyMin: 1,
    anyMax: 500,
  },

  percentage: {
    easyMin: 10,
    easyMax: 99,
    mediumMin: 100,
    mediumMax: 999,
    hardMin: 1000,
    hardMax: 9999,
    anyMin: 1,
    anyMax: 9999,
  },

  ratio: {
    easyMin: 10,
    easyMax: 99,
    mediumMin: 100,
    mediumMax: 999,
    hardMin: 1000,
    hardMax: 9999,
    anyMin: 1,
    anyMax: 9999,
  },
};

export interface Term {
  text: string;
  value: number;
}

export interface SSCPercentageConfig {
  display: string;
  numerator: number;
  denominator: number;
}

export const SSC_PERCENTAGES: readonly SSCPercentageConfig[] = [
  { display: "20%", numerator: 1, denominator: 5 },
  { display: "25%", numerator: 1, denominator: 4 },
  { display: "33.33%", numerator: 1, denominator: 3 },
  { display: "40%", numerator: 2, denominator: 5 },
  { display: "50%", numerator: 1, denominator: 2 },
  { display: "60%", numerator: 3, denominator: 5 },
  { display: "66.66%", numerator: 2, denominator: 3 },
  { display: "75%", numerator: 3, denominator: 4 },
  { display: "80%", numerator: 4, denominator: 5 },
  // 1/6 Family
  { display: "16.66%", numerator: 1, denominator: 6 },
  { display: "83.33%", numerator: 5, denominator: 6 },
  // 1/7 Family (Classic SSC CGL Favorite!)
  { display: "14.28%", numerator: 1, denominator: 7 },
  { display: "28.56%", numerator: 2, denominator: 7 },
  { display: "42.84%", numerator: 3, denominator: 7 },
  { display: "57.12%", numerator: 4, denominator: 7 },
  { display: "71.42%", numerator: 5, denominator: 7 },
  { display: "85.71%", numerator: 6, denominator: 7 },
  // 1/8 Family
  { display: "12.5%", numerator: 1, denominator: 8 },
  { display: "37.5%", numerator: 3, denominator: 8 },
  { display: "62.5%", numerator: 5, denominator: 8 },
  { display: "87.5%", numerator: 7, denominator: 8 },
  // 1/9 Family (Multiples of 11.11%)
  { display: "11.11%", numerator: 1, denominator: 9 },
  { display: "22.22%", numerator: 2, denominator: 9 },
  { display: "44.44%", numerator: 4, denominator: 9 },
  { display: "55.55%", numerator: 5, denominator: 9 },
  { display: "77.77%", numerator: 7, denominator: 9 },
  { display: "88.88%", numerator: 8, denominator: 9 },
  // 1/11 Family (Multiples of 9.09%)
  { display: "9.09%", numerator: 1, denominator: 11 },
  { display: "18.18%", numerator: 2, denominator: 11 },
  { display: "27.27%", numerator: 3, denominator: 11 },
  { display: "36.36%", numerator: 4, denominator: 11 },
  { display: "45.45%", numerator: 5, denominator: 11 },
  { display: "54.54%", numerator: 6, denominator: 11 },
  { display: "63.63%", numerator: 7, denominator: 11 },
  { display: "72.72%", numerator: 8, denominator: 11 },
  { display: "81.81%", numerator: 9, denominator: 11 },
  { display: "90.90%", numerator: 10, denominator: 11 },
  // 1/12 to 1/16 Advanced Speed Fractions
  { display: "8.33%", numerator: 1, denominator: 12 },
  { display: "7.69%", numerator: 1, denominator: 13 },
  { display: "7.14%", numerator: 1, denominator: 14 },
  { display: "6.66%", numerator: 1, denominator: 15 },
  { display: "6.25%", numerator: 1, denominator: 16 },
];

const uniqueQuestionGenerator = (
  generatorFn: () => any,
  exclusions: string[],
  maxRetries = 30,
) => {
  let question;
  let retries = 0;

  do {
    question = generatorFn();
    retries++;
  } while (
    question.questionKey &&
    exclusions.includes(question.questionKey) &&
    maxRetries > retries
  );
  return question;
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export type QuestionType = "square" | "cube" | "sqrt" | "cbrt" | string;

const generateOptions = (
  correctAnswer: number,
  type: QuestionType = "general",
  baseNum?: number,
): number[] => {
  let generatedOptions: number[] = [];

  if ((type === TOPIC_ID.SQUARES || type === "square") && baseNum) {
    const offSets = [baseNum - 1, baseNum + 1, baseNum + 3];
    generatedOptions = [
      correctAnswer,
      offSets[0] * offSets[0],
      offSets[1] * offSets[1],
      offSets[2] * offSets[2],
    ];
  } else if ((type === TOPIC_ID.CUBES || type === "cube") && baseNum) {
    const offSets = [baseNum - 1, baseNum + 1, baseNum + 3];
    generatedOptions = [
      correctAnswer,
      offSets[0] * offSets[0] * offSets[0],
      offSets[1] * offSets[1] * offSets[1],
      offSets[2] * offSets[2] * offSets[2],
    ];
  } else if (
    type === TOPIC_ID.SQUARE_ROOTS ||
    type === TOPIC_ID.CUBE_ROOTS ||
    type === "sqrt" ||
    type === "cbrt"
  ) {
    generatedOptions = [
      correctAnswer,
      correctAnswer + 1,
      correctAnswer + 2,
      Math.max(1, correctAnswer - 1),
    ];
  } else {
    // Universal Smart Strategy for ALL arithmetic, percentages, ratios, simplification, etc.
    const ans = Math.round(correctAnswer);
    if (ans <= 15) {
      generatedOptions = [ans, ans + 1, ans + 2, Math.max(1, ans - 1)];
    } else {
      generatedOptions = [ans, ans - 10, ans + 10, ans + 20];
    }
  }

  // Ensure 4 unique options in case of collisions
  const uniqueOptions = Array.from(new Set(generatedOptions));
  while (uniqueOptions.length < 4) {
    uniqueOptions.push(uniqueOptions[uniqueOptions.length - 1] + 5);
  }

  return uniqueOptions.sort(() => Math.random() - 0.5);
};

const getRandomIntByDifficulty = (
  difficulty: string,
  config: DifficultyRangeConfig,
): number => {
  const diff = difficulty.toUpperCase();
  switch (diff) {
    case DIFFICULTY.EASY:
      return getRandomInt(config.easyMin, config.easyMax);
    case DIFFICULTY.MEDIUM:
      return getRandomInt(config.mediumMin, config.mediumMax);
    case DIFFICULTY.HARD:
      return getRandomInt(config.hardMin, config.hardMax);
  }
  return getRandomInt(config.anyMin, config.anyMax);
};

export const generateComplexTerm = (
  type: "square" | "cube" | "sqrt" | "cbrt",
  min: number,
  max: number,
): Term => {
  const val = getRandomInt(min, max);
  switch (type) {
    case "square":
      return { text: `${val}²`, value: val * val };
    case "cube":
      return { text: `${val}³`, value: val * val * val };
    case "sqrt":
      return { text: `√${val * val}`, value: val };
    case "cbrt":
      return { text: `³√${val * val * val}`, value: val };
  }
};

export const generateSSCPercentageTerm = (
  minMult: number,
  maxMult: number,
): Term => {
  const config = SSC_PERCENTAGES[getRandomInt(0, SSC_PERCENTAGES.length - 1)];
  const mult = getRandomInt(minMult, maxMult);
  const base = mult * config.denominator;
  const value = mult * config.numerator;

  return {
    text: `${config.display} of ${base}`,
    value,
  };
};

const generateSquareQuestion = (difficulty: string) => {
  const num = getRandomIntByDifficulty(difficulty, DIFFICULTY_CONFIGS.squares);
  const correctAnswer = num * num;
  const options = generateOptions(correctAnswer, "square", num);

  return {
    questionText: `${num}²`,
    correctAnswer,
    options,
    baseNum: num,
    questionKey: `sq_${num}`,
  };
};

const generateSquareRootQuestion = (difficulty: string) => {
  const correctAnswer = getRandomIntByDifficulty(
    difficulty,
    DIFFICULTY_CONFIGS.squares,
  );
  const question = correctAnswer * correctAnswer;
  const options = generateOptions(correctAnswer, "sqrt", correctAnswer);

  return {
    questionText: `√${question}`,
    correctAnswer,
    options,
    baseNum: correctAnswer,
    questionKey: `sqrt_${question}`,
  };
};

const generateCubeRootQuestion = (difficulty: string) => {
  const correctAnswer = getRandomIntByDifficulty(
    difficulty,
    DIFFICULTY_CONFIGS.cubes,
  );
  const question = correctAnswer * correctAnswer * correctAnswer;
  const options = generateOptions(correctAnswer, "cbrt", correctAnswer);

  return {
    questionText: `³√${question}`,
    correctAnswer,
    options,
    baseNum: correctAnswer,
    questionKey: `cbrt_${question}`,
  };
};

const generateCubeQuestion = (difficulty: string) => {
  const num = getRandomIntByDifficulty(difficulty, DIFFICULTY_CONFIGS.cubes);
  const correctAnswer = num * num * num;
  const options = generateOptions(correctAnswer, "cube", num);
  return {
    questionText: `${num}³`,
    correctAnswer,
    options,
    baseNum: num,
    questionKey: `cb_${num}`,
  };
};

const generateAdditionQuestion = (difficulty: string) => {
  const num1 = getRandomIntByDifficulty(
    difficulty,
    DIFFICULTY_CONFIGS.addition,
  );
  const num2 = getRandomIntByDifficulty(
    difficulty,
    DIFFICULTY_CONFIGS.addition,
  );

  const correctAnswer = num1 + num2;
  const options = generateOptions(correctAnswer, "addition");
  return {
    questionText: `${num1} + ${num2}`,
    correctAnswer,
    options,
    questionKey: `add_${num1}_${num2}`,
  };
};

const generateSubtractionQuestion = (difficulty: string) => {
  let num1 = getRandomIntByDifficulty(
    difficulty,
    DIFFICULTY_CONFIGS.subtraction,
  );
  let num2 = getRandomIntByDifficulty(
    difficulty,
    DIFFICULTY_CONFIGS.subtraction,
  );

  let temp;
  if (num1 < num2) {
    temp = num1;
    num1 = num2;
    num2 = temp;
  }
  const correctAnswer = num1 - num2;

  const options = generateOptions(correctAnswer, "subtraction");
  return {
    questionText: `${num1} - ${num2}`,
    correctAnswer,
    options,
    questionKey: `sub_${num1}_${num2}`,
  };
};

const generateMultiplicationQuestion = (difficulty: string) => {
  const num1 = getRandomIntByDifficulty(
    difficulty,
    DIFFICULTY_CONFIGS.multiplication,
  );
  const num2 = getRandomIntByDifficulty(
    difficulty,
    DIFFICULTY_CONFIGS.multiplication,
  );

  const correctAnswer = num1 * num2;

  const options = generateOptions(correctAnswer, "multiplication", num1);

  return {
    questionText: `${num1} × ${num2}`,
    correctAnswer,
    options,
    questionKey: `mul_${num1}_${num2}`,
  };
};

const generateDivisionQuestion = (difficulty: string) => {
  const divisor = getRandomIntByDifficulty(
    difficulty,
    DIFFICULTY_CONFIGS.division,
  );
  const answer = getRandomIntByDifficulty(
    difficulty,
    DIFFICULTY_CONFIGS.division,
  );

  const numerator = divisor * answer;
  const options = generateOptions(answer, "division", divisor);
  return {
    questionText: `${numerator} ÷ ${divisor}`,
    correctAnswer: answer,
    options,
    questionKey: `div_${numerator}_${divisor}`,
  };
};

const generateSimplificationQuestion = (difficulty: string) => {
  let targetDiff = difficulty.toUpperCase();
  if (
    targetDiff === DIFFICULTY.ALL ||
    ![DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD].includes(targetDiff)
  ) {
    const tiers = [DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD];
    targetDiff = tiers[getRandomInt(0, tiers.length - 1)];
  }

  let opsAllowed: string[] = ["+", "-", "*", "/"];
  let equation = "";
  let engineEquation = "";
  let displayEquation = "";

  if (targetDiff === DIFFICULTY.EASY) {
    let operands = 3;
    let terms: Term[] = [];
    let ops: string[] = [];
    for (let i = 0; i < operands; i++) {
      const num = getRandomIntByDifficulty(
        DIFFICULTY.EASY,
        DIFFICULTY_CONFIGS.simplification,
      );
      terms.push({ text: "number", value: num });
    }

    for (let i = 0; i < operands - 1; i++) {
      let op = opsAllowed[getRandomInt(0, opsAllowed.length - 1)];
      ops.push(op);
    }

    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === "/") {
        const multiplier = getRandomInt(3, 10);
        terms[i].value = terms[i + 1].value * multiplier;
        terms[i + 1].text = terms[i].value.toString();
      }
    }

    for (let i = 0; i < terms.length; i++) {
      equation += terms[i].value;
      if (i < ops.length) {
        equation += ` ${ops[i]} `;
      }
    }
    displayEquation = equation;
    engineEquation = equation;
  }

  if (targetDiff === DIFFICULTY.MEDIUM) {
    const archetype = getRandomInt(1, 5);
    if (archetype === 1) {
      //Blueprint for equation-> (P% of N) + (A² × B) - √C
      const percTerm = generateSSCPercentageTerm(5, 20);
      const squareTerm = generateComplexTerm("square", 16, 30);
      const rootTerm = generateComplexTerm("sqrt", 16, 30);
      const b = getRandomInt(20, 100);
      displayEquation = `(${percTerm.text}) + (${squareTerm.text} × ${b}) - ${rootTerm.text}`;
      engineEquation = `${percTerm.value} + ${squareTerm.value} * ${b} - ${rootTerm.value}`;
    }
    if (archetype === 2) {
      //Blueprint for equation-> //[ (³√A + B²) ÷ C ] × D
      const cubeRootTerm = generateComplexTerm("cbrt", 2, 8); // e.g. 6
      const squareTerm = generateComplexTerm("square", 3, 9); // e.g. 64
      const sum = cubeRootTerm.value + squareTerm.value; // e.g. 70
      // Find a clean divisor C of sum:
      const c = [2, 5, 7, 10].find((val) => sum % val === 0) || 2;
      const d = getRandomInt(2, 6);
      displayEquation = `[ (${cubeRootTerm.text} + ${squareTerm.text}) ÷ ${c} ] × ${d}`;
      engineEquation = `[ (${cubeRootTerm.value} + ${squareTerm.value}) / ${c} ] * ${d}`;
    }
    if (archetype === 3) {
      //Blueprint for equation-> (A² - B²) ÷ √C + D²
      const squareTerm1 = generateComplexTerm("square", 21, 29);
      const squareTerm2 = generateComplexTerm("square", 11, 20);
      const diff = squareTerm1.value - squareTerm2.value;

      const validFactors = [2, 3, 4, 5, 6, 8, 10].filter(
        (val) => diff % val === 0,
      );

      const rootVal =
        validFactors[getRandomInt(0, validFactors.length - 1)] || 2;

      const rootTerm = { text: `√${rootVal * rootVal}`, value: rootVal };
      const d = generateComplexTerm("square", 10, 20);
      displayEquation = `(${squareTerm1.text} - ${squareTerm2.text}) ÷ ${rootTerm.text} + ${d.text}`;
      engineEquation = `(${squareTerm1.value} - ${squareTerm2.value}) / ${rootTerm.value} + ${d.value}`;
    }
    if (archetype === 4) {
      //Blueprint for equation->(P1% of N1) - (P2% of N2) + ³√A
      let percTerm1 = generateSSCPercentageTerm(5, 20);
      let percTerm2 = generateSSCPercentageTerm(10, 30);

      if (percTerm1.value < percTerm2.value) {
        [percTerm1, percTerm2] = [percTerm2, percTerm1];
      }
      const rootTerm = generateComplexTerm("cbrt", 8, 21);
      displayEquation = `(${percTerm1.text}) - (${percTerm2.text}) + ${rootTerm.text}`;
      engineEquation = `${percTerm1.value} - ${percTerm2.value} + ${rootTerm.value}`;
    }
    if (archetype === 5) {
      //Blueprint for equation->[ A + { (B² × C) ÷ √D } ] - E
      const a = getRandomInt(50, 150);
      const termB = generateComplexTerm("square", 2, 8); // e.g. 4² (value: 16)
      const termRootD = generateComplexTerm("sqrt", 2, 8); // e.g. √16 (value: 4)
      const c = termRootD.value * getRandomInt(2, 5); // Guarantees clean division!
      const e = getRandomInt(10, 30);
      displayEquation = `[ ${a} + { (${termB.text} × ${c}) ÷ ${termRootD.text} } ] - ${e}`;
      engineEquation = `[ ${a} + { (${termB.value} * ${c}) / ${termRootD.value} } ] - ${e}`;
    }
  }

  if (targetDiff === DIFFICULTY.HARD) {
    const archetype = getRandomInt(1, 6);
    if (archetype === 1) {
      //Blueprint: [ A - { B ÷ (C - D) } ] × E

      const k = getRandomInt(2, 8);
      const d = getRandomInt(2, 10);
      const c = k + d; // Guaranteed: (C - D) === k
      const b = k * getRandomInt(2, 8); // Guaranteed: B ÷ (C - D) is clean integer!
      const a = getRandomInt(50, 100);
      const e = getRandomInt(2, 5);
      displayEquation = `[ ${a} - { ${b} ÷ (${c} - ${d}) } ] × ${e}`;
      engineEquation = `[ ${a} - { ${b} / (${c} - ${d}) } ] * ${e}`;
    }
    if (archetype === 2) {
      //Blueprint: [ (P% of N) + A² ] ÷ √B
      const termPerc = generateSSCPercentageTerm(5, 20);
      const termRoot = generateComplexTerm("sqrt", 2, 8); // e.g. √16 (value: 4)
      // Make sure (termPerc.value + termSq.value) divides cleanly by termRoot.value:
      const targetMultiple = termRoot.value * getRandomInt(20, 50);
      const sqValue = targetMultiple - termPerc.value;
      // If sqValue isn't a perfect square, we can just use a normal integer for A, or pick termPerc and termSq first and make termRoot a factor of their sum!
      const termSq = generateComplexTerm("square", 3, 9);
      const sum = termPerc.value + termSq.value;
      const validFactors = [2, 3, 4, 5, 6, 8, 10].filter(
        (val) => sum % val === 0,
      );
      const rootVal =
        validFactors[getRandomInt(0, validFactors.length - 1)] || 2;
      const rootTerm = { text: `√${rootVal * rootVal}`, value: rootVal };

      displayEquation = `[ (${termPerc.text}) + ${termSq.text} ] ÷ ${rootTerm.text}`;
      engineEquation = `[ (${termPerc.value}) + ${termSq.value} ] / ${rootTerm.value}`;
    }
    if (archetype === 3) {
      //Blueprint: (P1% of N1) + (P2% of N2) - √A
      const perc1 = generateSSCPercentageTerm(10, 30);
      const perc2 = generateSSCPercentageTerm(10, 30);
      const rootTerm = generateComplexTerm("sqrt", 5, 15);
      displayEquation = `(${perc1.text}) + (${perc2.text}) - ${rootTerm.text}`;
      engineEquation = `${perc1.value} + ${perc2.value} - ${rootTerm.value}`;
    }
    if (archetype === 4) {
      //Blueprint: [ (A² - B²) ÷ C ] + ³√D

      const sq1 = generateComplexTerm("square", 12, 20);
      const sq2 = generateComplexTerm("square", 2, 10);
      const diff = sq1.value - sq2.value;
      const validFactors = [2, 3, 4, 5, 6, 8, 10].filter(
        (val) => diff % val === 0,
      );
      const c = validFactors[getRandomInt(0, validFactors.length - 1)] || 2;
      const cbrtTerm = generateComplexTerm("cbrt", 2, 6);
      displayEquation = `[ (${sq1.text} - ${sq2.text}) ÷ ${c} ] + ${cbrtTerm.text}`;
      engineEquation = `[ (${sq1.value} - ${sq2.value}) / ${c} ] + ${cbrtTerm.value}`;
    }
    if (archetype === 5) {
      //Blueprint: P% of [ { A + (B × C) } - D² ]
      // Pick percentage first so we know what denominator we must divide cleanly by!
      const config =
        SSC_PERCENTAGES[getRandomInt(0, SSC_PERCENTAGES.length - 1)];
      const mult = getRandomInt(5, 20);
      const targetSum = mult * config.denominator; // The inside of [] MUST equal targetSum!

      const termD = generateComplexTerm("square", 2, 6);
      const bcProduct = getRandomInt(10, 30);
      const b = getRandomInt(2, 6);
      const c = Math.floor(bcProduct / b);
      const a = targetSum + termD.value - b * c; // Solves exact algebra so bracket === targetSum!

      displayEquation = `${config.display} of [ { ${a} + (${b} × ${c}) } - ${termD.text} ]`;
      engineEquation = `${mult * config.numerator}`; // Since we engineered bracket to equal targetSum, the whole answer is simply mult * numerator! But for AST parser:
      // For Shunting Yard: `${config.numerator} * ( ( ${a} + (${b} * ${c}) - ${termD.value} ) / ${config.denominator} )`
    }
    if (archetype === 6) {
      //Blueprint: √A + [ B × { C ÷ (D + E) } ]
      const k = getRandomInt(2, 8);
      const d = getRandomInt(2, 10);
      const e = k - d > 0 ? k - d : 2;
      const actualK = d + e;
      const c = actualK * getRandomInt(2, 6); // Guarantees C ÷ (D + E) is clean!
      const b = getRandomInt(2, 6);
      const rootTerm = generateComplexTerm("sqrt", 5, 15);
      displayEquation = `${rootTerm.text} + [ ${b} × { ${c} ÷ (${d} + ${e}) } ]`;
      engineEquation = `${rootTerm.value} + [ ${b} * { ${c} / (${d} + ${e}) } ]`;
    }
  }

  // Convert [], {} to standard () for Shunting Yard:
  const normalizedEngineEquation = engineEquation
    .replace(/\[|\{/g, "(")
    .replace(/\]|\}/g, ")");

  const ast = buildAST(tokenize(normalizedEngineEquation));
  const answer = Math.round(evaluate(ast));
  return {
    questionText: displayEquation, // UI sees rich symbols!
    correctAnswer: answer,
    options: generateOptions(answer, "simplification"),
    questionKey: `simp_${displayEquation}`,
  };
};

const generatePercentageQuestion = (difficulty: string) => {
  if (!difficulty) return;
  let targetDiff = difficulty.toUpperCase();

  if (
    targetDiff === DIFFICULTY.ALL ||
    ![DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD].includes(targetDiff)
  ) {
    const tiers = [DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD];
    targetDiff = tiers[getRandomInt(0, tiers.length - 1)];
  }

  let questionText = "";
  let correctAnswer = 0;

  if (targetDiff === DIFFICULTY.EASY) {
    const archetype = getRandomInt(1, 3);

    if (archetype === 1) {
      // 1. Standard Direct Calculation: P% of N
      let NUMBERS = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);

      let percentage = NUMBERS[getRandomInt(0, NUMBERS.length - 1)];
      const base = 20 * getRandomInt(1, 25);

      correctAnswer = (percentage * base) / 100;
      questionText = `${percentage}% of ${base}`;
    }

    if (archetype === 2) {
      // 2. SSC Fractional Table Shortcut: P% of N
      const term = generateSSCPercentageTerm(5, 50);
      questionText = term.text;
      correctAnswer = term.value;
    }

    if (archetype === 3) {
      // 3. Reverse Base Finding: "If P% of N = X, find N"
      const config =
        SSC_PERCENTAGES[getRandomInt(0, SSC_PERCENTAGES.length - 1)];
      const mult = getRandomInt(5, 30);
      const base = mult * config.denominator;
      const val = mult * config.numerator;

      questionText = `If ${config.display} of N = ${val}, find N?`;
      correctAnswer = base;
    }
  } else if (targetDiff === DIFFICULTY.MEDIUM) {
    const archetype = getRandomInt(1, 3);

    if (archetype === 1) {
      // 1. Proportional Equality: "If P1% of X = P2% of Y, find X"
      const p1 = getRandomInt(1, 10) * 5;
      const p2 = getRandomInt(1, 15) * 5;
      const m = getRandomInt(5, 20); // hidden multiplier

      const y = p1 * m;
      const x = p2 * m;

      questionText = `If ${p1}% of X = ${p2}% of ${y}, find X`;
      correctAnswer = x;
    }

    if (archetype === 2) {
      // 2. Successive Percentage (Naked): Base increased by A%, then decreased by B%
      const base = getRandomInt(1, 10) * 100;
      const a = getRandomInt(1, 5) * 10;
      const b = getRandomInt(1, 4) * 10;

      correctAnswer = base * (1 + a / 100) * (1 - b / 100);
      questionText = `${base} increased by ${a}%, then decreased by ${b}% = ?`;
    }

    if (archetype === 3) {
      // 3. Dual-Base Sum: P1% of X + P2% of Y = ?
      const term1 = generateSSCPercentageTerm(5, 20);
      const term2 = generateSSCPercentageTerm(5, 20);
      questionText = `${term1.text} + ${term2.text}`;
      correctAnswer = term1.value + term2.value;
    }
  } else if (targetDiff === DIFFICULTY.HARD) {
    const archetype = getRandomInt(1, 3);

    if (archetype === 1) {
      // 1. Percentage of Percentage: P1% of P2% of N = ?
      const p1 = getRandomInt(1, 10) * 5; // e.g. 20
      const p2 = getRandomInt(1, 15) * 5; // e.g. 25
      const n = getRandomInt(1, 10) * 400; // multiple of 400 guarantees integer
      correctAnswer = (p1 * p2 * n) / 10000;
      questionText = `${p1}% of ${p2}% of ${n}`;
    }

    if (archetype === 2) {
      // 2. Fractional Table Chaining: F1 of F2 of N = ?
      const config1 =
        SSC_PERCENTAGES[getRandomInt(0, SSC_PERCENTAGES.length - 1)];
      const config2 =
        SSC_PERCENTAGES[getRandomInt(0, SSC_PERCENTAGES.length - 1)];
      const m = getRandomInt(2, 10);
      const n = config1.denominator * config2.denominator * m;
      correctAnswer = config1.numerator * config2.numerator * m;
      questionText = `${config1.display} of ${config2.display} of ${n}`;
    }

    if (archetype === 3) {
      // 3. Reverse Dual-Base Equation: P1% of X + P2% of Y = Z. Find X.
      const config1 =
        SSC_PERCENTAGES[getRandomInt(0, SSC_PERCENTAGES.length - 1)];
      const mX = getRandomInt(2, 15);
      const x = config1.denominator * mX;
      const term1Value = config1.numerator * mX;

      const term2 = generateSSCPercentageTerm(2, 10);
      const z = term1Value + term2.value;

      questionText = `If ${config1.display} of X + ${term2.text} = ${z}, find X`;
      correctAnswer = x;
    }
  }

  return {
    questionText,
    correctAnswer,
    options: generateOptions(correctAnswer, "percentage"),
    questionKey: `perc_${questionText}`,
  };
};

const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

const generateRatioQuestion = (difficulty: string) => {
  let targetDiff = difficulty.toUpperCase();
  let questionText, correctAnswer, options;
  if (
    targetDiff === DIFFICULTY.ALL ||
    ![DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD].includes(targetDiff)
  ) {
    const tiers = [DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD];
    targetDiff = tiers[getRandomInt(0, tiers.length - 1)];
  }

  if (targetDiff === DIFFICULTY.EASY) {
    const archetype = getRandomInt(1, 3);
    if (archetype === 1) {
      let multiplier = getRandomInt(2, 20);
      let a = getRandomInt(2, 20);
      let b = getRandomInt(2, 20);

      const divisor=gcd(a,b);
      a/=divisor;
      b/=divisor;

      const askForA = Math.random() > 0.5;
      const givenValue = askForA ? b * multiplier : a * multiplier;
      const givenVar = askForA ? "B" : "A";
      const askVar = askForA ? "A" : "B";
      questionText = `If A:B=${a}:${b} and ${givenVar}=${givenValue}, what is the value of ${askVar}?`;
      correctAnswer = askForA ? a * multiplier : b * multiplier;
      options = generateOptions(correctAnswer, "ratio");
    }
    if (archetype === 2) {
      let aRatio = getRandomInt(2, 8);
      let bRatio1 = getRandomInt(3, 9);
      const div1 = gcd(aRatio, bRatio1);
      aRatio /= div1;
      bRatio1 /= div1;

      let bRatio2 = getRandomInt(2, 8);
      let cRatio = getRandomInt(3, 9);
      const div2 = gcd(bRatio2, cRatio);
      bRatio2 /= div2;
      cRatio /= div2;

      // Combine ratios to find true proportions
      const A = aRatio * bRatio2;
      const C = bRatio1 * cRatio;

      const multiplier = getRandomInt(2, 10);
      const askForA = Math.random() > 0.5;
      const givenValue = askForA ? C * multiplier : A * multiplier;
      const givenVar = askForA ? "C" : "A";
      const askVar = askForA ? "A" : "C";
      
      questionText = `If A:B=${aRatio}:${bRatio1} and B:C=${bRatio2}:${cRatio}, and ${givenVar}=${givenValue}, what is the value of ${askVar}?`;
      correctAnswer = askForA ? A * multiplier : C * multiplier;
      options = generateOptions(correctAnswer, "ratio");
    } else if (archetype === 3) {
      let a = getRandomInt(2, 9);
      let b = getRandomInt(2, 9);
      while (a === b) b = getRandomInt(2, 9);
      const div = gcd(a, b);
      a /= div; b /= div;

      const multiplier = getRandomInt(2, 20);
      const valA = a * multiplier;
      const valB = b * multiplier;

      const isSum = Math.random() > 0.5;
      const givenVal = isSum ? valA + valB : Math.abs(valA - valB);
      const condition = isSum ? "sum" : "difference";

      const askType = getRandomInt(1, 4);
      let askStr = "";
      if (askType === 1) { askStr = "value of the smaller number"; correctAnswer = Math.min(valA, valB); }
      else if (askType === 2) { askStr = "value of the larger number"; correctAnswer = Math.max(valA, valB); }
      else if (askType === 3) { askStr = "value of A"; correctAnswer = valA; }
      else { askStr = "value of B"; correctAnswer = valB; }

      questionText = `Two numbers A and B are in the ratio ${a}:${b}. If their ${condition} is ${givenVal}, what is the ${askStr}?`;
      options = generateOptions(correctAnswer, "ratio");
    }
  } else if (targetDiff === DIFFICULTY.MEDIUM) {
    const archetype = getRandomInt(1, 3);
    if (archetype === 1) {
      const aRatio = getRandomInt(1, 5);
      const bRatio = getRandomInt(2, 7);
      const cRatio = getRandomInt(1, 6);
      const sumRatio = aRatio + bRatio + cRatio;
      const multiplier = getRandomInt(10, 50);
      const total = sumRatio * multiplier;

      const targetVar = ["A", "B", "C"][getRandomInt(0, 2)];
      const targetRatio = targetVar === "A" ? aRatio : targetVar === "B" ? bRatio : cRatio;
      
      questionText = `An amount of ₹${total} is divided among A, B, and C in the ratio ${aRatio}:${bRatio}:${cRatio}. What is ${targetVar}'s share?`;
      correctAnswer = targetRatio * multiplier;
      options = generateOptions(correctAnswer, "ratio");
    } else if (archetype === 2) {
      const isFourth = Math.random() > 0.5;
      if (isFourth) {
        const a = getRandomInt(2, 10);
        const b = getRandomInt(3, 12);
        const multiplier = getRandomInt(2, 10);
        const c = a * multiplier;
        correctAnswer = b * multiplier;
        questionText = `Find the fourth proportional to ${a}, ${b}, and ${c}.`;
      } else {
        const multiplier = getRandomInt(2, 8);
        const a = getRandomInt(2, 6);
        const b = a * multiplier;
        correctAnswer = a * multiplier * multiplier;
        questionText = `Find the third proportional to ${a} and ${b}.`;
      }
      options = generateOptions(correctAnswer, "ratio");
    } else if (archetype === 3) {
      let x = getRandomInt(2, 5);
      let y = getRandomInt(3, 6);
      let z = getRandomInt(4, 8);
      const gcdXY = gcd(x, y);
      const gcdXYZ = gcd(gcdXY, z);
      x /= gcdXYZ; y /= gcdXYZ; z /= gcdXYZ;
      
      let ratioA = y * z;
      let ratioB = x * z;
      let ratioC = x * y;
      const gcdABC = gcd(gcd(ratioA, ratioB), ratioC);
      ratioA /= gcdABC; ratioB /= gcdABC; ratioC /= gcdABC;
      
      const sumRatio = ratioA + ratioB + ratioC;
      const multiplier = getRandomInt(2, 10);
      const total = sumRatio * multiplier;
      
      const targetVar = ["A", "B", "C"][getRandomInt(0, 2)];
      const targetRatio = targetVar === "A" ? ratioA : targetVar === "B" ? ratioB : ratioC;
      
      questionText = `If ${x}A = ${y}B = ${z}C and A+B+C = ${total}, what is the value of ${targetVar}?`;
      correctAnswer = targetRatio * multiplier;
      options = generateOptions(correctAnswer, "ratio");
    }
  } else if (targetDiff === DIFFICULTY.HARD) {
    const archetype = getRandomInt(1, 3);
    if (archetype === 1) {
      let aRatio = getRandomInt(3, 8);
      let bRatio = getRandomInt(2, 6);
      const div = gcd(aRatio, bRatio);
      aRatio /= div; bRatio /= div;
      
      let x = getRandomInt(1, 4);
      let y = getRandomInt(1, 4);
      let z = getRandomInt(3, 6);
      let w = getRandomInt(1, 3);
      if (z * aRatio <= w * bRatio) z = Math.floor((w * bRatio) / aRatio) + getRandomInt(1, 3);
      
      let p = (x * aRatio) + (y * bRatio);
      let q = (z * aRatio) - (w * bRatio);
      const pqDiv = gcd(p, q);
      p /= pqDiv; q /= pqDiv;
      
      const multiplier = getRandomInt(2, 10);
      const askForA = Math.random() > 0.5;
      const givenValue = askForA ? bRatio * multiplier : aRatio * multiplier;
      const givenVar = askForA ? "B" : "A";
      const askVar = askForA ? "A" : "B";
      
      questionText = `If (${x}A+${y}B)/(${z}A-${w}B) = ${p}/${q} and ${givenVar} = ${givenValue}, find ${askVar}.`;
      correctAnswer = askForA ? aRatio * multiplier : bRatio * multiplier;
      options = generateOptions(correctAnswer, "ratio");
    } else if (archetype === 2) {
      const aRatio = getRandomInt(2, 5);
      const bRatio = getRandomInt(aRatio + 1, aRatio + 4); 
      const k = getRandomInt(3, 12);
      const addX = getRandomInt(4, 15);
      
      const n1 = aRatio * k;
      const n2 = bRatio * k;
      const new1 = n1 + addX;
      const new2 = n2 + addX;
      
      const newGcd = gcd(new1, new2);
      const cRatio = new1 / newGcd;
      const dRatio = new2 / newGcd;

      questionText = `Two numbers are in the ratio ${aRatio}:${bRatio}. If ${addX} is added to both, the new ratio becomes ${cRatio}:${dRatio}. Find the smaller number.`;
      correctAnswer = n1;
      options = generateOptions(correctAnswer, "ratio");
    } else if (archetype === 3) {
      let aRatio = getRandomInt(2, 5);
      let bRatio1 = getRandomInt(2, 5);
      const div1 = gcd(aRatio, bRatio1);
      aRatio /= div1; bRatio1 /= div1;
      
      let bRatio2 = getRandomInt(2, 5);
      let cRatio1 = getRandomInt(2, 5);
      const div2 = gcd(bRatio2, cRatio1);
      bRatio2 /= div2; cRatio1 /= div2;
      
      let cRatio2 = getRandomInt(2, 5);
      let dRatio = getRandomInt(2, 5);
      const div3 = gcd(cRatio2, dRatio);
      cRatio2 /= div3; dRatio /= div3;
      
      const lcmB = (bRatio1 * bRatio2) / gcd(bRatio1, bRatio2);
      let A = aRatio * (lcmB / bRatio1);
      let B = lcmB;
      let C = cRatio1 * (lcmB / bRatio2);
      
      const lcmC = (C * cRatio2) / gcd(C, cRatio2);
      A = A * (lcmC / C);
      B = B * (lcmC / C);
      const finalC = lcmC;
      const D = dRatio * (lcmC / cRatio2);
      
      const multiplier = getRandomInt(2, 6);
      const vars = ["A", "B", "C", "D"];
      const askIndex = getRandomInt(0, 3);
      let givenIndex = getRandomInt(0, 3);
      while (givenIndex === askIndex) givenIndex = getRandomInt(0, 3);
      
      const values = [A * multiplier, B * multiplier, finalC * multiplier, D * multiplier];
      const givenVar = vars[givenIndex];
      const askVar = vars[askIndex];
      const givenValue = values[givenIndex];
      
      questionText = `If A:B=${aRatio}:${bRatio1}, B:C=${bRatio2}:${cRatio1}, C:D=${cRatio2}:${dRatio} and ${givenVar}=${givenValue}, find ${askVar}.`;
      correctAnswer = values[askIndex];
      options = generateOptions(correctAnswer, "ratio");
    }
  }
  return {
    questionText,
    correctAnswer,
    options,
    questionKey: `ratio_${questionText}`,
  };
};

export const generateQuestion = (
  topicId: string,
  difficulty: string,
  exclusions: string[] = [],
) => {
  if (!topicId || !difficulty) return;

  const diff = difficulty.toUpperCase();
  switch (topicId.toLowerCase()) {
    case TOPIC_ID.SQUARES:
      return uniqueQuestionGenerator(
        () => generateSquareQuestion(diff),
        exclusions,
      );
    case TOPIC_ID.CUBES:
      return uniqueQuestionGenerator(
        () => generateCubeQuestion(diff),
        exclusions,
      );
    case TOPIC_ID.ADDITION:
      return uniqueQuestionGenerator(
        () => generateAdditionQuestion(diff),
        exclusions,
      );
    case TOPIC_ID.SUBTRACTION:
      return uniqueQuestionGenerator(
        () => generateSubtractionQuestion(diff),
        exclusions,
      );
    case TOPIC_ID.MULTIPLICATION:
      return uniqueQuestionGenerator(
        () => generateMultiplicationQuestion(diff),
        exclusions,
      );
    case TOPIC_ID.DIVISION:
      return uniqueQuestionGenerator(
        () => generateDivisionQuestion(diff),
        exclusions,
      );
    case TOPIC_ID.SIMPLIFICATION:
      return uniqueQuestionGenerator(
        () => generateSimplificationQuestion(diff),
        exclusions,
      );
    case TOPIC_ID.PERCENTAGE:
      return uniqueQuestionGenerator(
        () => generatePercentageQuestion(diff),
        exclusions,
      );
    case TOPIC_ID.RATIO:
      return uniqueQuestionGenerator(
        () => generateRatioQuestion(diff),
        exclusions,
      );
    case TOPIC_ID.SQUARE_ROOTS:
      return uniqueQuestionGenerator(
        () => generateSquareRootQuestion(diff),
        exclusions,
      );
    case TOPIC_ID.CUBE_ROOTS:
      return uniqueQuestionGenerator(
        () => generateCubeRootQuestion(diff),
        exclusions,
      );
    default:
      throw new Error(`Invalid topicId: ${topicId}`);
  }
};
