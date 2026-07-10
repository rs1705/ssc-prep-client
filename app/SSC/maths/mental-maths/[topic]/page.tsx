"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMentalMathsEngine } from "@/hooks/useMentalMathsEngine";

export default function MentalMathsPractice() {
    const { topic } = useParams() as { topic: string };
    const router = useRouter();

    const engine = useMentalMathsEngine(topic);
    const gameState = engine.state.status

    const inputRef = useRef<HTMLInputElement>(null);
    const [userInput, setUserInput] = useState<string>("");

    const handleDifficultyChange = (newDifficulty: "easy" | "medium" | "hard") => {
        engine.setConfig(engine.state.mode, newDifficulty, engine.state.timeLimit, engine.state.questionLimit)
    }

    const handleModeChange = (newMode: "timed" | "freestyle") => {
        engine.setConfig(newMode, engine.state.difficulty, engine.state.timeLimit, engine.state.questionLimit)

    }

    const handleTimerLimitChange = (newTimeLimit: number) => {
        engine.setConfig(engine.state.mode, engine.state.difficulty, newTimeLimit, engine.state.questionLimit)

    }

    const handleQuestionLimitChange = (newQuestionLimit: number) => {
        engine.setConfig(engine.state.mode, engine.state.difficulty, engine.state.timeLimit, newQuestionLimit)

    }

    const handleStartPractice = () => {
        engine.startSession();

    }

    const handleEnterSubmit = (userInput: string | "skip") => {
        if (userInput === "skip") {
            engine.submitUserAnswer("skip")
        } else {
            if (userInput.trim() !== "")
                engine.submitUserAnswer(Number(userInput))
        }
    }

    const handleNumClick = (numpadValue: string) => {
        if (numpadValue.toLowerCase() === "clear") {
            setUserInput("")
        } else if (numpadValue === "⌫")
            setUserInput(userInput.slice(0, userInput.length - 1))
        else {
            setUserInput(userInput + numpadValue)
        }
    }

    useEffect(() => {
        setUserInput("");
    }, [engine.state.currentQuestion]);
    return (
        <TopicPageLayout
            title={`${topic.toUpperCase()} PRACTICE`}
            description={`Speed test your calculations for ${topic}. Select difficulty and beat the clock!`}
        >
            <div className="max-w-md mx-auto w-full mt-4 flex flex-col items-center justify-center p-6 bg-card border border-border rounded-3xl shadow-sm select-none">

                {/* 1. LOBBY CONFIGURATION SCREEN */}
                {gameState === "idle" && (
                    <div className="w-full flex flex-col gap-6">
                        {/* Difficulty */}
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Select Difficulty</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {(["easy", "medium", "hard"] as const).map((d) => (
                                    <Button
                                        key={d}
                                        variant={d === engine.state.difficulty ? "default" : "outline"}
                                        onClick={() => handleDifficultyChange(d)}
                                        className="capitalize rounded-2xl h-11"
                                    >
                                        {d}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Practice Mode Toggle */}
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Practice Mode</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={engine.state.mode === "timed" ? "default" : "outline"}
                                    onClick={() => { handleModeChange("timed") }}
                                    className="rounded-2xl h-11"
                                >
                                    ⏱️ Timed
                                </Button>
                                <Button
                                    variant={engine.state.mode === "freestyle" ? "default" : "outline"}
                                    onClick={() => handleModeChange("freestyle")}
                                    className="rounded-2xl h-11"
                                >
                                    🥋 Freestyle
                                </Button>
                            </div>
                        </div>

                        {/* Mode Specifics (Default: Timed configs showing) */}
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Select Time Limit</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {engine.state.mode === "timed" ? [30, 60, 90].map((t) => (
                                    <Button
                                        key={t}
                                        variant={t === engine.state.timeLimit ? "default" : "outline"}
                                        onClick={() => { handleTimerLimitChange(t as number) }}
                                        className="rounded-2xl h-11"
                                    >
                                        {t}s
                                    </Button>
                                )) : [10, 20, 30].map((q) => (
                                    <Button
                                        key={q}
                                        variant={q === engine.state.questionLimit ? "default" : "outline"}
                                        onClick={() => { handleQuestionLimitChange(q as number) }}
                                        className="rounded-2xl h-11"
                                    >
                                        {q} Qs
                                    </Button>
                                ))

                                }
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 rounded-2xl font-semibold mt-4 text-sm"
                            onClick={handleStartPractice}
                        >
                            Practice
                        </Button>
                    </div>
                )}

                {/* 2. THREE-SECOND START COUNTDOWN */}
                {gameState === "countdown" && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-7xl font-extrabold animate-ping text-primary">
                            {engine.state.countdownTick}
                        </div>
                        <p className="text-muted-foreground mt-8 animate-pulse text-sm">
                            Get ready to calculate...
                        </p>
                    </div>
                )}

                {/* 3. ACTIVE PRACTICE BOARD */}
                {gameState === "active" && (
                    <div className="w-full flex flex-col gap-6">
                        {/* Header Stats Bar */}
                        <div className="flex items-center justify-between w-full pb-3 border-b border-border text-sm">
                            <span className="font-bold text-primary text-xl">
                                {engine.state.mode === "timed" ? `Time Remaining:${engine.state.timeRemaining}s` : "Freestyle Practice"}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-muted-foreground">Score: <strong className="text-foreground">{engine.state.score}</strong></span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-xs text-destructive hover:bg-destructive/10"
                                    onClick={engine.resetSession}
                                >
                                    Quit
                                </Button>
                            </div>
                        </div>

                        {/* Central Question Panel */}
                        <div className="flex flex-col items-center justify-center bg-muted/30 rounded-2xl py-8 px-4 border border-border/55">
                            <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">
                            </div>
                            <div className="text-4xl font-extrabold tracking-tight text-center">
                                {engine.state.currentQuestion?.questionText}
                            </div>
                        </div>

                        {/* Answer Input Bar */}
                        <form onSubmit={(e) => { e.preventDefault(); handleEnterSubmit(userInput) }} className="flex gap-2">
                            <Input
                                ref={inputRef}
                                type="text"
                                inputMode="none"
                                placeholder="Type answer..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ""))}
                                className={`
                                    h-11 sm:h-12 rounded-2xl text-center text-base sm:text-lg font-semibold border-2 transition-all duration-300 ease-in-out
                                    ${engine.state.currentAnswerStatus === "correct" ? "border-green-500 bg-green-500/5 shadow-[0_0_10px_rgba(34,197,94,0.15)] focus-visible:ring-green-500/30 focus-visible:ring-2 focus:border-green-500" : ""}
                                    ${engine.state.currentAnswerStatus === "wrong" ? "border-red-500 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.15)] focus-visible:ring-red-500/30 focus-visible:ring-2 focus:border-red-500" : ""}
                                    ${engine.state.currentAnswerStatus === "skipped" ? "border-amber-500 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.15)] focus-visible:ring-amber-500/30 focus-visible:ring-2 focus:border-amber-500" : ""}
                                    ${engine.state.currentAnswerStatus === "idle" ? "border-input focus-visible:ring-primary/20" : ""}
                                `}
                                autoFocus
                            />
                            <Button type="submit" className="h-11 sm:h-12 rounded-2xl px-4 sm:px-6 text-xs sm:text-sm font-semibold" onClick={() => handleEnterSubmit(userInput)}>
                                Enter
                            </Button>
                            <Button type="button" className="h-11 sm:h-12 rounded-2xl px-4 sm:px-6 text-xs sm:text-sm font-semibold" variant={"secondary"} onClick={() => handleEnterSubmit("skip")}>
                                Skip
                            </Button>
                        </form>

                        {/* Interactive Thumb Keypad (For smooth mobile typing) */}
                        <div className="grid grid-cols-3 gap-1.5 mt-2">
                            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", "⌫"].map((btn) => (
                                <Button
                                    key={btn}
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleNumClick(btn)}
                                    className={`h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-2xl ${
                                        btn === "Clear" || btn === "⌫" ? "text-muted-foreground text-[10px] sm:text-xs" : ""
                                    }`}
                                >
                                    {btn}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. PERFORMANCE RESULTS SCORECARD */}
                {gameState === "game_over" && (() => {
                    const correct = engine.state.correctAnswers;
                    const wrong = engine.state.wrongAnswers;
                    const skipped = engine.state.skippedAnswers;
                    const total = correct + wrong;
                    const accuracy = total > 0 ? Math.floor((correct / total) * 100) : 0;
                    const radius = 48;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (circumference * accuracy) / 100;

                    return (
                        <div className="w-full flex flex-col items-center text-center gap-6 py-4 animate-in fade-in duration-300">
                            <div className="text-5xl">🏆</div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Session Completed!</h2>
                                <p className="text-muted-foreground text-xs mt-2 font-medium">
                                    You answered <strong className="text-foreground">{correct}</strong> out of <strong className="text-foreground">{engine.state.attemptedQuestionsCount}</strong> questions correctly.
                                </p>
                                <p className={`text-sm font-bold mt-2 ${accuracy >= 90 ? "text-green-600 dark:text-green-400" :
                                    accuracy >= 75 ? "text-emerald-500 dark:text-emerald-400" :
                                        accuracy >= 50 ? "text-amber-500 dark:text-amber-400" : "text-red-500"
                                    }`}>
                                    {accuracy >= 90 && "Outstanding! You are a calculation wizard! 🧙‍♂️"}
                                    {accuracy >= 75 && accuracy < 90 && "Great job! Very impressive speed and accuracy! 🚀"}
                                    {accuracy >= 50 && accuracy < 75 && "Good effort! Solid practice session. 👍"}
                                    {accuracy < 50 && "Keep pushing! Consistency builds speed! 💪"}
                                </p>
                            </div>

                            {/* Centered Circular Accuracy Gauge */}
                            <div className="relative flex items-center justify-center w-36 h-36 my-4 animate-in zoom-in-75 duration-500">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="72"
                                        cy="72"
                                        r={radius}
                                        className="stroke-muted/30"
                                        strokeWidth="6"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="72"
                                        cy="72"
                                        r={radius}
                                        className={`transition-all duration-1000 ease-out ${accuracy >= 75 ? "stroke-green-500" :
                                            accuracy >= 50 ? "stroke-amber-500" : "stroke-red-500"
                                            }`}
                                        strokeWidth="6"
                                        fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black tracking-tight">{accuracy}%</span>
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">Accuracy</span>
                                </div>
                            </div>

                            {/* Metric Grid (3-column layout) */}
                            <div className="grid grid-cols-3 gap-2.5 w-full">
                                {/* Correct Answers */}
                                <div className="p-3.5 bg-muted/30 border border-border/80 rounded-2xl flex flex-col items-center justify-center min-h-[90px]">
                                    <span className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider mb-1">Correct</span>
                                    <span className="text-xl font-bold text-foreground">{correct}</span>
                                </div>

                                {/* Incorrect Answers */}
                                <div className="p-3.5 bg-muted/30 border border-border/80 rounded-2xl flex flex-col items-center justify-center min-h-[90px]">
                                    <span className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase tracking-wider mb-1">Wrong</span>
                                    <span className="text-xl font-bold text-foreground">{wrong}</span>
                                </div>

                                {/* Skipped Answers */}
                                <div className="p-3.5 bg-muted/30 border border-border/80 rounded-2xl flex flex-col items-center justify-center min-h-[90px]">
                                    <span className="text-[10px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider mb-1">Skipped</span>
                                    <span className="text-xl font-bold text-foreground">{skipped}</span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 w-full mt-4">
                                <Button onClick={engine.resetSession} className="flex-1 h-12 rounded-2xl font-semibold">
                                    Practice Again
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/SSC/maths/mental-maths")}
                                    className="flex-1 h-12 rounded-2xl font-semibold border-border/80"
                                >
                                    Back to Topics
                                </Button>
                            </div>
                        </div>
                    );
                })()}

            </div>
        </TopicPageLayout>
    );
}
