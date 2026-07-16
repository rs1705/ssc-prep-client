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
}

export const DIFFICULTY_CONFIGS: Record<string, DifficultyRangeConfig> = {
  squares: {
    easyMin: 5,
    easyMax: 12,
    mediumMin: 13,
    mediumMax: 29,
    hardMin: 31,
    hardMax: 49,
  },
  cubes: {
    easyMin: 2,
    easyMax: 10,
    mediumMin: 11,
    mediumMax: 20,
    hardMin: 21,
    hardMax: 30,
  },
  addition: {
    easyMin: 10,
    easyMax: 99,
    mediumMin: 100,
    mediumMax: 999,
    hardMin: 1000,
    hardMax: 9999,
  },
};

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

const generateOptions = (
  correctAnswer: number,
  type: "square" | "cube" | "multiply" | "addition",
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
  } else {
    generatedOptions = [
      correctAnswer,
      correctAnswer + 1,
      correctAnswer + 2,
      correctAnswer + 3,
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
  return getRandomInt(config.easyMin, config.hardMax);
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
  const num1 = getRandomIntByDifficulty(difficulty, DIFFICULTY_CONFIGS.addition);
  const num2 = getRandomIntByDifficulty(difficulty, DIFFICULTY_CONFIGS.addition);

  const correctAnswer = num1 + num2;
  const options = generateOptions(correctAnswer, "addition");
  return {
    questionText: `${num1} + ${num2}`,
    correctAnswer,
    options,
    questionKey: `add_${num1}_${num2}`,
  };
};

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
    default:
      return generateSquareQuestion(diff);
  }
};
