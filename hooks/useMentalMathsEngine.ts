import { useEffect, useReducer } from "react";
import { generateQuestion } from "@/lib/mathGenerator";

export type GameStatus = "idle" | "countdown" | "active" | "game_over"
export type GameMode = "timed" | "freestyle";
export type Difficulty = "easy" | "medium" | "hard";

export interface GameState {
    status: GameStatus;
    mode: GameMode;
    difficulty: Difficulty;
    questionLimit: number | null;
    timeLimit: number | null;
    timeRemaining: number | null;
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    skippedAnswers: number;
    attemptedQuestionsCount: number;
    currentQuestion: { questionText: string; correctAnswer: number; options: number[] } | null;
    currentAnswerStatus: "correct" | "wrong" | "skipped" | "idle";
    countdownTick: number;
    questionIndex: number;
}

export type GameAction =
    | { type: "SET_CONFIG"; payload: { mode: GameMode; difficulty: Difficulty; timeLimit: number | null; questionLimit: number | null } }
    | { type: "START_COUNTDOWN" }
    | { type: "TICK_TIMER" }
    | { type: "SUBMIT_ANSWER"; payload: { isCorrect: boolean; isSkip?: boolean } }
    | { type: "NEXT_QUESTION"; payload: { nextQuestion: { questionText: string; correctAnswer: number; options: number[] } } }
    | { type: "END_GAME" }
    | { type: "RESET_TO_LOBBY" }

export const initialGameState: GameState = {
    status: "idle",
    difficulty: "medium",
    mode: "timed",
    questionLimit: 10,
    timeLimit: 60,
    timeRemaining: null,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    skippedAnswers: 0,
    attemptedQuestionsCount: 0,
    currentQuestion: null,
    currentAnswerStatus: "idle",
    countdownTick: 3,
    questionIndex: 0
}


export function gameReducer(state: GameState, action: GameAction): GameState {

    switch (action.type) {

        case "SET_CONFIG":
            return { ...state, mode: action.payload.mode, difficulty: action.payload.difficulty, timeLimit: action.payload.timeLimit, questionLimit: action.payload.questionLimit }

        case "START_COUNTDOWN":
            return {
                ...state,
                status: "countdown",
                countdownTick: 3,
                timeLimit: state.mode === "timed" ? state.timeLimit : null,
                timeRemaining: state.mode === "timed" ? state.timeLimit : null,
                questionLimit: state.mode === "freestyle" ? state.questionLimit : null
            }


        case "TICK_TIMER":
            if (state.status === "countdown") {
                if (state.countdownTick <= 1) {
                    return { ...state, status: "active", countdownTick: 0 }
                }
                return { ...state, countdownTick: state.countdownTick - 1 }
            }

            if (state.timeRemaining === null) {
                return state;
            }
            else if (state.timeRemaining <= 0) {

                return { ...state, status: "game_over" }
            }
            else {
                return { ...state, timeRemaining: state.timeRemaining - 1 }
            }

        case "SUBMIT_ANSWER":
            let newCorrect = state.correctAnswers;
            let newWrong = state.wrongAnswers;
            let newSkipped = state.skippedAnswers;
            let newStatus: "correct" | "wrong" | "skipped" = "wrong"
            let newCurrentAnswerStatus = state.currentAnswerStatus

            if (action.payload.isSkip) {
                newSkipped += 1;
                newStatus = "skipped"
                newCurrentAnswerStatus = "skipped"
            } else if (action.payload.isCorrect) {
                newCorrect += 1;
                newStatus = "correct"
                newCurrentAnswerStatus = "correct"
            } else {
                newWrong += 1;
                newStatus = "wrong"
                newCurrentAnswerStatus = "wrong"
            }

            const newattemptedQuestionsCount = state.attemptedQuestionsCount + 1

            const isGameOver = state.questionLimit !== null && newattemptedQuestionsCount >= state.questionLimit
            return {
                ...state,
                score: newCorrect,
                correctAnswers: newCorrect,
                wrongAnswers: newWrong,
                skippedAnswers: newSkipped,
                attemptedQuestionsCount: newattemptedQuestionsCount,
                status: isGameOver ? "game_over" : state.status,
                currentAnswerStatus: newCurrentAnswerStatus
            }

        case "NEXT_QUESTION":
            return {
                ...state,
                currentQuestion: action.payload.nextQuestion,
                currentAnswerStatus: "idle",
                questionIndex: state.questionIndex + 1
            }


        case "END_GAME":
            return { ...state, status: "game_over" }

        case "RESET_TO_LOBBY":
            return initialGameState;

        default: return state;
    }
}

export function useMentalMathsEngine(topic: string, isPaused: boolean = false) {
    const [state, dispatch] = useReducer(gameReducer, initialGameState)

    useEffect(() => {
        const needsTimer = !isPaused && (state.status === "countdown" || (state.status === "active" && state.mode === "timed"));
        if (!needsTimer) {
            return;
        }

        const timerId = setInterval(() => {
            dispatch({ type: "TICK_TIMER" })
        }, 1000);


        return () => clearInterval(timerId);


    }, [state.mode, state.status, isPaused]);




    const setConfig = (mode: GameMode, difficulty: Difficulty, timeLimit: number | null, questionLimit: number | null) => {
        dispatch({ type: "SET_CONFIG", payload: { mode, difficulty, timeLimit, questionLimit } })
    }

    const startSession = () => {
        const firstQuestion = generateQuestion(topic, state.difficulty);
        dispatch({ type: "NEXT_QUESTION", payload: { nextQuestion: firstQuestion } });
        dispatch({ type: "START_COUNTDOWN" });
    }


    const resetSession = () => {
        dispatch({ type: "RESET_TO_LOBBY" })
    }

    const submitUserAnswer = (userAnswer: number | "skip") => {
        if (state.status !== "active") return;
        if (state.currentQuestion === null) return;
        // Guard: Prevent double-submitting while the border is flashing!
        if (state.currentAnswerStatus !== "idle") return;

        let isSkip = userAnswer === "skip"
        let isCorrect = false;
        if (!isSkip) {
            isCorrect = state.currentQuestion.correctAnswer === userAnswer ? true : false
        }

        dispatch({ type: "SUBMIT_ANSWER", payload: { isCorrect: isCorrect, isSkip: isSkip } })

        setTimeout(() => {
            const newMathProblem = generateQuestion(topic, state.difficulty)
            dispatch({
                type: "NEXT_QUESTION",
                payload: { nextQuestion: newMathProblem }
            })
        }, 150) // 150ms visual flash delay
    }

    return {
        state,
        setConfig,
        startSession,
        resetSession,
        submitUserAnswer
    }
}