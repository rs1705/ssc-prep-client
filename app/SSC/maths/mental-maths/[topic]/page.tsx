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

    const handleTimerChange = (newTimeLimit: number) => {
        engine.setConfig(engine.state.mode, engine.state.difficulty, newTimeLimit, engine.state.questionLimit)

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
        setUserInput("")
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
                                {["easy", "medium", "hard"].map((d) => (
                                    <Button
                                        key={d}
                                        variant={d === engine.state.difficulty ? "default" : "outline"}
                                        onClick={() => handleDifficultyChange(d as any)}
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
                                        onClick={() => { handleTimerChange(t as number) }}
                                        className="rounded-2xl h-11"
                                    >
                                        {t}s
                                    </Button>
                                )) : [10, 20, 30].map((q) => (
                                    <Button
                                        key={q}
                                        variant={q === engine.state.timeLimit ? "default" : "outline"}
                                        onClick={() => { handleTimerChange(q as number) }}
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
                                    End
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
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Type answer..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ""))}
                                className="h-12 rounded-2xl text-center text-lg font-semibold border-2 border-input focus-visible:ring-primary/20"
                                autoFocus
                            />
                            <Button type="submit" className="h-12 rounded-2xl px-6 font-semibold" onClick={() => handleEnterSubmit(userInput)}>
                                Enter
                            </Button>
                            <Button type="button" className="h-12 rounded-2xl px-6 font-semibold" variant={"secondary"} onClick={() => handleEnterSubmit("skip")}>
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
                                    className={`h-12 text-base font-semibold rounded-2xl ${btn === "Clear" || btn === "⌫" ? "text-muted-foreground text-xs" : ""
                                        }`}
                                >
                                    {btn}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. PERFORMANCE RESULTS SCORECARD */}
                {gameState === "game_over" && (
                    <div className="w-full flex flex-col items-center text-center gap-6 py-4">
                        <div className="text-4xl">🏆</div>
                        <div>
                            <h2 className="text-xl font-bold">Session Completed!</h2>
                            <p className="text-muted-foreground text-xs mt-1">Here is how you performed:</p>
                        </div>

                        {/* Metric Grid */}
                        <div className="grid grid-cols-2 gap-3 w-full my-2">
                            <div className="p-4 bg-muted/40 border border-border rounded-2xl">
                                <div className="text-xs text-muted-foreground mb-1">Correct Answers</div>
                                <div className="text-2xl font-bold text-green-600">{engine.state.correctAnswers}</div>
                            </div>
                            <div className="p-4 bg-muted/40 border border-border rounded-2xl">
                                <div className="text-xs text-muted-foreground mb-1">Incorrect Answers</div>
                                <div className="text-2xl font-bold text-red-600">{engine.state.wrongAnswers}</div>
                            </div>
                            <div className="p-4 bg-muted/40 border border-border rounded-2xl">
                                <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                                <div className="text-2xl font-bold text-foreground">
                                    {Math.floor(engine.state.correctAnswers / (engine.state.correctAnswers + engine.state.wrongAnswers) * 100)}%
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            You answered <strong className="text-foreground">{engine.state.correctAnswers}</strong> out of <strong className="text-foreground">{engine.state.correctAnswers + engine.state.wrongAnswers}</strong> questions correctly.
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 w-full mt-4">
                            <Button onClick={engine.resetSession} className="flex-1 h-11 rounded-2xl font-semibold">
                                Practice Again
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push("/SSC/maths/mental-maths")}
                                className="flex-1 h-11 rounded-2xl font-semibold"
                            >
                                Back to Topics
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </TopicPageLayout>
    );
}
