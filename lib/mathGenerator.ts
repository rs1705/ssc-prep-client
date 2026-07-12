const DIFFICULTY = {
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
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

const getRandomIntByDifficulty = (difficulty: string, config: DifficultyRangeConfig): number => {
    const rand = Math.random();
    const diff = difficulty.toUpperCase();

    switch (diff) {
        case DIFFICULTY.EASY:
            return getRandomInt(config.easyMin, config.easyMax);
        case DIFFICULTY.MEDIUM:
            if (rand < 0.80) return getRandomInt(config.mediumMin, config.mediumMax);
            else return getRandomInt(config.easyMin, config.easyMax);
        case DIFFICULTY.HARD:
            if (rand < 0.70) return getRandomInt(config.hardMin, config.hardMax);
            else if (rand < 0.90) return getRandomInt(config.mediumMin, config.mediumMax);
            else return getRandomInt(config.easyMin, config.easyMax);
        default:
            return getRandomInt(config.easyMin, config.easyMax);
    }
};

const generateSquareQuestion = (difficulty: string) => {
    const num = getRandomIntByDifficulty(
        difficulty,
        {
            easyMin: 8,
            easyMax: 15,
            mediumMin: 16,
            mediumMax: 30,
            hardMin: 31,
            hardMax: 50,
        }
    );
    const correctAnswer = num * num;

    // TODO: Implement options generator here! Currently returning simple mock options.
    const options = [correctAnswer, correctAnswer + 1, correctAnswer + 2, correctAnswer + 3];

    return {
        questionText: `${num}²`,
        correctAnswer,
        options,
    };
};

const generateCubeQuestion = (difficulty: string) => {
    const num = getRandomIntByDifficulty(
        difficulty,
        {
            easyMin: 3,
            easyMax: 10,
            mediumMin: 11,
            mediumMax: 20,
            hardMin: 21,
            hardMax: 25,
        }
    );
    const correctAnswer = num * num * num;

    // TODO: Implement options generator here! Currently returning simple mock options.
    const options = [correctAnswer, correctAnswer + 1, correctAnswer + 2, correctAnswer + 3];

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