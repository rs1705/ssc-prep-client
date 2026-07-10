const DIFFICULTY = {
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
}


interface RangeConfig {
    easyMin: number;
    easyMax: number;
    mediumMin: number;
    mediumMax: number;
    hardMin: number;
    hardMax: number;
}


const getWeightedNumber = (difficulty: string, config: RangeConfig): number => {

    const rand = Math.random();
    const diff = difficulty.toUpperCase()

    switch (diff) {
        case DIFFICULTY.EASY:
            return getRandomInt(config.easyMin, config.easyMax)
        case DIFFICULTY.MEDIUM:
            if (rand < 0.80) return getRandomInt(config.mediumMin, config.mediumMax)
            else return getRandomInt(config.easyMin, config.easyMax)
        case DIFFICULTY.HARD:
            if (rand < 0.70) return getRandomInt(config.hardMin, config.hardMax)
            else if (rand < 0.90) return getRandomInt(config.mediumMin, config.mediumMax)
            else return getRandomInt(config.easyMin, config.easyMax)
        default: return getRandomInt(config.easyMin, config.easyMax);
    }
}


const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


const squares = (difficulty: string) => {
    const num = getWeightedNumber(
        difficulty,
        {
            easyMin: 8,
            easyMax: 15,
            mediumMin: 16,
            mediumMax: 30,
            hardMin: 31,
            hardMax: 50,
        })
    return {
        questionText: `${num}²?`,
        correctAnswer: num * num
    }
}


const cubes = (difficulty: string) => {
    const num = getWeightedNumber(
        difficulty,
        {
            easyMin: 3,
            easyMax: 10,
            mediumMin: 11,
            mediumMax: 20,
            hardMin: 21,
            hardMax: 25,
        })
    return {
        questionText: `${num}³?`,
        correctAnswer: num * num * num
    }
}

export const generateQuestion = (topidId: string, difficulty: string) => {

    const diff = difficulty.toUpperCase();
    switch (topidId.toLowerCase()) {
        case "squares":
            return squares(diff)

        case "cubes":
            return cubes(diff)
        default:
            return squares(diff)
    }
}