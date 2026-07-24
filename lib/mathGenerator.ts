import { buildAST, evaluate, tokenize } from "./mathParser";

const DIFFICULTY = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
  ALL: "ALL",
};

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

const uniqueQuestionGenerator = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const generateOptions = (
  correctAnswer: number,
  type:
    | "square"
    | "cube"
    | "multiply"
    | "addition"
    | "subtraction"
    | "multiplication"
    | "division"
    | "simplification",
  baseNum?: number,
): number[] => {
  let generatedOptions: number[] = [];

  if (type === "square" && baseNum) {
    const offSets = [baseNum - 1, baseNum + 1, baseNum + 3];
    generatedOptions = [
      correctAnswer,
      offSets[0] * offSets[0],
      offSets[1] * offSets[1],
      offSets[2] * offSets[2],
    ];
  } else if (type === "cube" && baseNum) {
    const offSets = [baseNum - 1, baseNum + 1, baseNum + 3];
    generatedOptions = [
      correctAnswer,
      offSets[0] * offSets[0] * offSets[0],
      offSets[1] * offSets[1] * offSets[1],
      offSets[2] * offSets[2] * offSets[2],
    ];
  } else if (type === "multiply" && baseNum) {
    generatedOptions = [
      correctAnswer,
      baseNum - 10,
      baseNum + 10,
      baseNum + 20,
    ];
  } else if (type === "addition") {
    generatedOptions = [
      correctAnswer,
      correctAnswer - 10,
      correctAnswer + 10,
      correctAnswer + 30,
    ];
  } else if (type === "subtraction") {
    // 1. Off-by-10 error (very common in borrowing)
    const option2 =
      correctAnswer > 10 ? correctAnswer - 10 : correctAnswer + 20;
    const option3 = correctAnswer + 10;

    // 2. Off-by-1 or 2 error (common arithmetic slip)
    // We can use a small random offset to keep it unpredictable
    const smallOffset = Math.random() > 0.5 ? 1 : 2;
    const option4 =
      correctAnswer > smallOffset
        ? correctAnswer - smallOffset
        : correctAnswer + smallOffset;

    generatedOptions = [correctAnswer, option2, option3, option4];
  } else if (type === "multiplication") {
    generatedOptions = [
      correctAnswer,
      correctAnswer - 10,
      correctAnswer + 10,
      correctAnswer + 20,
    ];
  } else if (type === "division") {
    generatedOptions = [
      correctAnswer,
      correctAnswer - 10,
      correctAnswer + 10,
      correctAnswer + 20,
    ];
  } else if (type === "simplification") {
    generatedOptions = [
      Math.floor(correctAnswer),
      Math.floor(correctAnswer - 10),
      Math.floor(correctAnswer + 10),
      Math.floor(correctAnswer + 20),
    ];
  }

  return generatedOptions.sort(() => Math.random() - 0.5);
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
  let opsAllowed: string[] = ["+", "-", "*", "/"];
  let equation = "";
  if (difficulty === DIFFICULTY.EASY) {
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
  }

  const ast = buildAST(tokenize(equation));
  const answer = evaluate(ast);
  return {
    questionText: equation,
    correctAnswer: answer,
    options: generateOptions(answer, "simplification"),
    questionKey: `simp_${equation}`,
  };
};

const generatePercentageQuestion = (difficulty: string) => {};

const generateRatioQuestion = (difficulty: string) => {};

export const generateQuestion = (
  topicId: string,
  difficulty: string,
  exclusions: string[] = [],
) => {
  const diff = difficulty.toUpperCase();
  switch (topicId.toLowerCase()) {
    case "squares":
      return uniqueQuestionGenerator(
        () => generateSquareQuestion(diff),
        exclusions,
      );
    case "cubes":
      return uniqueQuestionGenerator(
        () => generateCubeQuestion(diff),
        exclusions,
      );
    case "addition":
      return uniqueQuestionGenerator(
        () => generateAdditionQuestion(diff),
        exclusions,
      );
    case "subtraction":
      return uniqueQuestionGenerator(
        () => generateSubtractionQuestion(diff),
        exclusions,
      );
    case "multiplication":
      return uniqueQuestionGenerator(
        () => generateMultiplicationQuestion(diff),
        exclusions,
      );
    case "division":
      return uniqueQuestionGenerator(
        () => generateDivisionQuestion(diff),
        exclusions,
      );
    case "simplification":
      return uniqueQuestionGenerator(
        () => generateSimplificationQuestion(diff),
        exclusions,
      );
    case "percentage":
      return uniqueQuestionGenerator(
        () => generatePercentageQuestion(diff),
        exclusions,
      );
    case "ratio":
      return uniqueQuestionGenerator(
        () => generateRatioQuestion(diff),
        exclusions,
      );
    default:
      throw new Error(`Invalid topicId: ${topicId}`);
  }
};
