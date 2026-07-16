const DIFFICULTY = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
  ALL: "ALL",
};

interface DifficultyRangeConfig {
  easyMin: number;
  easyMax: number;
  mediumMin: number;
  mediumMax: number;
  hardMin: number;
  hardMax: number;
}

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateOptions = (
  correctAnswer: number,
  type: "square" | "cube" | "multiply" | "general",
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
  const num = getRandomIntByDifficulty(difficulty, {
    easyMin: 5,
    easyMax: 12,
    mediumMin: 13,
    mediumMax: 29,
    hardMin: 31,
    hardMax: 49,
  });
  const correctAnswer = num * num;
  const options = generateOptions(correctAnswer, "square", num);

  return {
    questionText: `${num}²`,
    correctAnswer,
    options,
  };
};

const generateCubeQuestion = (difficulty: string) => {
  const num = getRandomIntByDifficulty(difficulty, {
    easyMin: 2,
    easyMax: 10,
    mediumMin: 11,
    mediumMax: 20,
    hardMin: 21,
    hardMax: 30,
  });
  const correctAnswer = num * num * num;
  const options = generateOptions(correctAnswer, "cube", num);
  return {
    questionText: `${num}³`,
    correctAnswer,
    options,
  };
};

export const generateQuestion = (topicId: string, difficulty: string) => {
  const diff = difficulty.toUpperCase();
  switch (topicId.toLowerCase()) {
    case "squares":
      return generateSquareQuestion(diff);
    case "cubes":
      return generateCubeQuestion(diff);
    default:
      return generateSquareQuestion(diff);
  }
};
